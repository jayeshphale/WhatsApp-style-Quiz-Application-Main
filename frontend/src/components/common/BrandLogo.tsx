import React, { useState } from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'auto';
}

const OFFICIAL_LOGO_URL = 'https://skillbytesai.com/logo.png';

const sizeClasses = {
  xs: 'h-6 w-auto',
  sm: 'h-8 w-auto',
  md: 'h-10 w-auto',
  lg: 'h-12 w-auto',
  xl: 'h-16 w-auto',
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'auto'
}) => {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className={`inline-flex items-center gap-1.5 font-extrabold tracking-tight ${className}`}>
        <span className="bg-gradient-to-r from-[#1A6C96] to-[#58BDF2] text-transparent bg-clip-text">
          SkillBytes
        </span>
        <span className="text-[#F9E276] font-bold">AI</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
      <img
        src={OFFICIAL_LOGO_URL}
        alt="SkillBytes AI Logo"
        referrerPolicy="no-referrer"
        onError={() => setImageError(true)}
        className={`${sizeClasses[size]} object-contain max-w-full transition-all`}
      />
    </div>
  );
};
