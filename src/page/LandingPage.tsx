import { useEffect, useState } from 'react';
import axiosInstance from '../utils/auth/axiosInstance';
import Gallery from '../component/Gallery';
import { Spinner } from 'flowbite-react';

interface ImageData {
  id: string;
  data_url: string;
  like_count: number;
}

interface LikedData {
  id: string;
  image_id: string;
  user_id: string;
  liked: boolean;
}

interface LandingPageProps {
  imageAddedKey?: number;
}

export default function LandingPage({ imageAddedKey }: LandingPageProps) {
  const [images, setImages] = useState<(ImageData & { initiallyLiked: boolean })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const imgRes = await axiosInstance.get<ImageData[]>('/images');
      const allImages = imgRes.data;
  
      let likedIds = new Set<string>();
      try {
        const likeRes = await axiosInstance.get<LikedData[]>('/images/likes/mine');
        likedIds = new Set(
          likeRes.data
            .filter((l) => l.liked)
            .map((l) => l.image_id)
        );
      } catch (err: any) {
        if (err.response?.status !== 401) {
          console.error('Erreur inattendue lors du fetch des likes :', err);
        }
      }
  
      const merged = allImages.map((img) => ({
        ...img,
        initiallyLiked: likedIds.has(img.id),
      }));
  
      setImages(merged);
    } catch (err) {
      console.error('Erreur lors de la récupération des images :', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [imageAddedKey]);

  
  return (
    <section className="dark:bg-gray-900 min-h-screen">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Gallery TOPHO 🤔
        </h1>
        {loading ? (
          <div className="mt-8 flex justify-center">
            <Spinner size="xl" />
          </div>
        ) : (
          <Gallery images={images} />
        )}
      </div>
    </section>
  );
}
