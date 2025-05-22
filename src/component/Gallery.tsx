import React, { useState, useEffect } from 'react'
import { FaHeart, FaTimes } from 'react-icons/fa'
import axiosInstance from '../utils/auth/axiosInstance'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

export interface ImageData {
  id: string
  data_url: string
  like_count: number
  initiallyLiked: boolean
}

interface GalleryProps {
  images: ImageData[]
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const { isAuthenticated, setAuthenticated } = useAuth()
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null)

  const columns: ImageData[][] = Array.from({ length: 4 }, () => [])
  images.forEach((img, i) => columns[i % 4].push(img))

  return (
    <>
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {columns.map((col, ci) => (
          <div key={ci} className="grid gap-4">
            {col.map((img) => (
              <div key={img.id} className="rounded-lg shadow overflow-hidden">
                <div
                  className="
                    relative
                    transition-transform duration-300
                    hover:scale-105 hover:-translate-y-1
                    cursor-pointer
                  "
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img.data_url}
                    alt={`Image ${img.id}`}
                    className="w-full h-auto object-cover"
                  />

                  <LikeButton
                    imageId={img.id}
                    initialLikes={img.like_count}
                    initiallyLiked={img.initiallyLiked}
                    isAuthenticated={isAuthenticated}
                    setAuthenticated={setAuthenticated}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative bg-transparent p-4 max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-white text-2xl hover:text-gray-200 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <FaTimes />
            </button>
            <img
              src={selectedImage.data_url}
              alt={`Image ${selectedImage.id}`}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </>
  )
}

interface LikeButtonProps {
  imageId: string
  initialLikes: number
  initiallyLiked: boolean
  isAuthenticated: boolean
  setAuthenticated: (b: boolean) => void
}

const LikeButton: React.FC<LikeButtonProps> = ({
  imageId,
  initialLikes,
  initiallyLiked,
  isAuthenticated,
  setAuthenticated,
}) => {
  const [liked, setLiked] = useState(initiallyLiked)
  const [likes, setLikes] = useState(initialLikes)
  const [loading, setLoading] = useState(false)

  const [hearts, setHearts] = useState<number[]>([])

  useEffect(() => {
    if (!hearts.length) return
    const timeout = setTimeout(() => {
      setHearts((prev) => prev.slice(1))
    }, 1000)
    return () => clearTimeout(timeout)
  }, [hearts])

  const toggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isAuthenticated || loading) return

    setLoading(true)
    try {
      const ep = liked ? `/images/${imageId}/unlike` : `/images/${imageId}/like`
      await axiosInstance.post(ep)

      setLiked(!liked)
      setLikes((l) => (liked ? l - 1 : l + 1))

      setHearts((prev) => [...prev, Date.now()])
    } catch (err: any) {
      if (err.response?.status === 401) {
        setAuthenticated(false)
        toast.error("Session expirée, reconnecte-toi.")
      } else {
        console.error(err)
        toast.error("Impossible de mettre à jour le like.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={toggleLike}
        disabled={!isAuthenticated || loading}
        className={`
          absolute bottom-2 right-2 flex items-center gap-1 p-1
          transition-transform duration-200 hover:scale-110 focus:outline-none
          ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <FaHeart
          className={`w-5 h-5 ${liked ? "text-red-600" : "text-gray-400"}`}
        />
        <span className="text-sm text-white drop-shadow">{likes}</span>
      </button>

      {hearts.map((id) => (
        <FaHeart
          key={id}
          className="absolute bottom-0.5 right-6 text-red-500 opacity-60 w30 h-10"
          style={{
            animation: `float-up 1s ease-out forwards`,
            transform: `translateY(-${20 + Math.random() * 20}px)`,
          }}
        />
      ))}

      <style>{`
        @keyframes float-up {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0.1; transform: translateY(-40px); }
        }
      `}</style>
    </>
  )
}

export default Gallery
