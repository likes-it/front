import { useEffect, useState } from 'react';
import axiosInstance from '../utils/auth/axiosInstance';
import ImageCard from '../component/ImageCard';
import { Spinner } from 'flowbite-react';

interface ImageData {
  id: string;
  data_url: string;
  like_count: number;
}

interface LandingPageProps {
  imageAddedKey?: number;
}

export default function LandingPage({ imageAddedKey }: LandingPageProps) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/images');
      setImages(res.data);
    } catch (err) {
      console.error('Erreur lors de la récupération des images :', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [imageAddedKey]); // 🔁 re-fetch à chaque ajout

  return (
    <section className="dark:bg-gray-900 min-h-screen">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Gallery Photo 🤑
        </h1>
        {loading ? (
          <div className="mt-8 flex justify-center">
            <Spinner size="xl" />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img) => (
              <ImageCard
                key={img.id}
                imageId={img.id}
                imageUrl={img.data_url}
                initialLikes={img.like_count}
                initiallyLiked={false}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
