const https = require('https');
const url = 'https://docs.google.com/uc?export=download&id=1Wln4GrxsR6XL-u1XZ8vynnIQJ6R3kyDZ';

function fetch(url) {
  https.get(url, (res) => {
    console.log("Status:", res.statusCode);
    console.log("Location:", res.headers.location);
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetch(res.headers.location);
    }
  });
}
fetch(url);
