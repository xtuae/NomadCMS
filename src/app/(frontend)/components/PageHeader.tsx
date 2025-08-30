import Image from 'next/image';
import React from 'react';

interface PageHeaderProps {
  title: string;
  backgroundImage: string | null;
  subheadline?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, backgroundImage, subheadline }) => {
  return (
    <div
      className="relative h-[40vh] bg-cover bg-center flex items-center justify-center text-white text-center px-4"
      style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 max-w-4xl">
        <h1 className="text-5xl font-bold leading-tight tracking-tight">{title}</h1>
        {subheadline && <p className="mt-2 text-xl text-gray-200">{subheadline}</p>}
      </div>
    </div>
  );
};

export default PageHeader;
