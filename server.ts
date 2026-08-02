import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API proxy route for HLS streams and video segments
  app.get("/api/proxy", async (req, res) => {
    try {
      const targetUrl = req.query.url as string;
      if (!targetUrl) {
        return res.status(400).json({ error: "Missing url parameter" });
      }

      const decodedUrl = decodeURIComponent(targetUrl);
      const response = await fetch(decodedUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Referer": "https://vidsrc.stream/",
          "Origin": "https://vidsrc.stream",
        },
      });

      if (!response.ok) {
        return res.status(response.status).send(`Proxy fetch failed: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type") || "";
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "*");

      if (contentType.includes("mpegurl") || contentType.includes("vnd.apple.mpegurl") || decodedUrl.includes(".m3u8")) {
        let text = await response.text();
        const parsedBaseUrl = new URL(decodedUrl);

        // Rewrite playlist lines
        const lines = text.split("\n");
        const rewrittenLines = lines.map(line => {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) {
            if (trimmed.includes('URI="')) {
              return trimmed.replace(/URI="([^"]+)"/, (match, uri) => {
                let absoluteUri = uri;
                if (!uri.startsWith("http://") && !uri.startsWith("https://")) {
                  absoluteUri = new URL(uri, parsedBaseUrl).toString();
                }
                return `URI="/api/proxy?url=${encodeURIComponent(absoluteUri)}"`;
              });
            }
            return line;
          }

          let absoluteSegmentUrl = trimmed;
          if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
            absoluteSegmentUrl = new URL(trimmed, parsedBaseUrl).toString();
          }
          return `/api/proxy?url=${encodeURIComponent(absoluteSegmentUrl)}`;
        });

        res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
        return res.send(rewrittenLines.join("\n"));
      } else {
        res.setHeader("Content-Type", contentType);
        const arrayBuffer = await response.arrayBuffer();
        return res.send(Buffer.from(arrayBuffer));
      }
    } catch (err: any) {
      console.error("Proxy error:", err);
      return res.status(500).json({ error: err.message || "Proxy error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
