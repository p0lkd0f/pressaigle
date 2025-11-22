'use client';

interface EagleLogoProps {
  className?: string;
  size?: number;
  color?: string;
}

export default function EagleLogo({ className = '', size = 48, color = '#7a5d91' }: EagleLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Transparent Eagle SVG - Simplified version */}
      <path
        d="M50 15C35 15 23 27 23 42C23 50 27 57 33 61C31 63 29 65 29 68C29 71 31 73 34 73C35 73 36 72 37 71C38 72 39 73 40 73C43 73 45 71 45 68C45 65 43 63 41 61C47 57 51 50 51 42C51 27 65 15 50 15Z"
        fill={color}
        opacity="0.9"
      />
      <circle cx="38" cy="45" r="3" fill={color} />
      <circle cx="62" cy="45" r="3" fill={color} />
      <path
        d="M35 55L40 60L45 55M55 55L60 60L65 55"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}

