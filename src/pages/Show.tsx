import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShowDetails, getShowDetails } from '../lib/tmdb';
import { saveToContinueWatching } from '../lib/storage';
import { Loader2 } from 'lucide-react';
import MediaDetailModal from '../components/MediaDetailModal';

export default function Show() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [show, setShow] = useState<ShowDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShow = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getShowDetails(id);
        setShow(data);
        saveToContinueWatching(data);
      } catch (err) {
        setError('Failed to load show details.');
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="container mx-auto px-4 py-24 text-center min-h-screen bg-[#0a0a0a]">
        <div className="text-red-400 mb-4 font-bold">{error || 'Show not found'}</div>
        <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-all">
          Go back
        </button>
      </div>
    );
  }

  return (
    <MediaDetailModal 
      item={show}
      type="show"
      onClose={() => navigate(-1)}
    />
  );
}
