import React from 'react';

// lucide-react doesn't ship a TikTok icon
const TikTokIcon = ({ size = 20, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-6.16 11.61 6.85 6.85 0 0 0 11.69-4.84V8.27a8.16 8.16 0 0 0 4.77 1.52V6.36a4.85 4.85 0 0 1-1.07-.07Z" />
  </svg>
);

export default TikTokIcon;
