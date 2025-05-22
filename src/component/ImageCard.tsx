import { useState, useEffect } from 'react';
import { FaHeart, FaTrash } from 'react-icons/fa';
import axiosInstance from '../utils/auth/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

interface ImageCardProps {
  imageUrl: string;
  initialLikes: number;
  initiallyLiked: boolean;
  imageId: string;
  owned: boolean,
}

export default function ImageCard({ imageUrl, initialLikes, initiallyLiked, imageId, owned }: ImageCardProps) {
  const { isAuthenticated, setAuthenticated } = useAuth();

  const [liked, setLiked] = useState(initiallyLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [hearts, setHearts] = useState<number[]>([]);

  const toggleLike = async () => {
    if (loading || !isAuthenticated) return;

    setLoading(true);

    try {
      const endpoint = liked ? `/images/${imageId}/unlike` : `/images/${imageId}/like`;
      await axiosInstance.post(endpoint);

      setLiked(!liked);
      setLikes(prev => liked ? prev - 1 : prev + 1);
      setAnimating(true);
      setHearts(prev => [...prev, Date.now()]);
      setTimeout(() => setAnimating(false), 300);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setAuthenticated(false);
        toast.error("Votre session a expiré. Veuillez vous reconnecter.");
      } else {
        console.error('Erreur lors du like/dislike :', error);
        toast.error("Impossible de liker l'image.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleDelted = async () =>{

    try{
      await axiosInstance.delete(`/images/${imageId}`);
      toast.success("Image supprimée avec succès.");
      window.location.reload();
    } catch (error: any) {
      console.error('Erreur lors de la suppression de l\'image :', error);
      toast.error("Impossible de supprimer l'image.");
    }
  }

  useEffect(() => {
    if (hearts.length > 0) {
      const timeout = setTimeout(() => {
        setHearts(prev => prev.slice(1));
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [hearts]);

  return (
    <div className={`relative w-full max-w-sm p-4 border border-gray-200 rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 transition duration-300 hover:scale-105 hover:shadow-md ${animating ? 'shadow-lg scale-105' : ''}`}>
      <div className="w-full h-64 overflow-hidden rounded-md">
        <img src={imageUrl} alt="Image" className="w-full object-cover rounded-md" />
      </div>
  
      {/* Conteneur absolu + flex */}
      <div className="absolute bottom-2 right-2 flex items-center space-x-2">
        {/* --- Plus d'absolute ici : juste du padding, flex, etc. --- */}
        <button
          onClick={toggleLike}
          disabled={loading || !isAuthenticated}
          className={`px-3 py-2 flex items-center gap-1 rounded-full shadow transition-transform ${
            isAuthenticated
              ? 'bg-white dark:bg-gray-700 hover:scale-110'
              : 'bg-gray-200 dark:bg-gray-600 cursor-not-allowed'
          }`}
        >
          <FaHeart className={`w-5 h-5 ${liked ? 'text-red-600' : 'text-gray-400'}`} />
          <span className="text-sm text-gray-700 dark:text-gray-300">{likes}</span>
        </button>
  
        {owned && (
          <button
            onClick={toggleDelted}
            className="px-3 py-2 flex items-center gap-1 rounded-full shadow transition-transform bg-white dark:bg-gray-700 hover:scale-110"
          >
            <FaTrash className="w-5 h-5 text-red-600" />
          </button>
        )}
      </div>
  
      {hearts.map((id) => (
        <FaHeart
          key={id}
          className="absolute bottom-10 right-5 text-red-500 animate-bounce opacity-70 w-4 h-4"
          style={{ animation: `float-up 1s ease-out forwards`, transform: `translateY(-${Math.random() * 20}px)` }}
        />
      ))}
  
      <style>{`
        @keyframes float-up {
          0% { opacity: 0.7; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-40px); }
        }
      `}</style>
    </div>
  );
}
