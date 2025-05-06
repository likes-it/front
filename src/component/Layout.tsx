import React from 'react';
import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import UploadImageModal from './UploadImageCard';

interface ChildProps {
  imageAddedKey?: number;
}

interface LayoutProps {
  children: React.ReactElement<ChildProps> | React.ReactElement<ChildProps>[];
}

export default function Layout({ children }: LayoutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageAddedKey, setImageAddedKey] = useState(Date.now());

  const handleImageAdded = () => {
    setIsModalOpen(false);
    setImageAddedKey(Date.now());
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onAddImage={() => setIsModalOpen(true)} />
      <main className="flex-grow p-4">
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { imageAddedKey })
            : child
        )}
        <UploadImageModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onImageAdded={handleImageAdded} />
      </main>
      <Footer />
    </div>
  );
}
