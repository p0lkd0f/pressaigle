'use client';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = '', size = 48 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Eagle SVG - Transparent background */}
      <path
        d="M50 10C30 10 15 25 15 45C15 55 20 63 28 68C25 70 23 73 23 76C23 80 26 83 30 83C32 83 34 82 35 81C37 82 39 83 41 83C45 83 48 80 48 76C48 73 46 70 43 68C51 63 56 55 56 45C56 25 70 10 50 10Z"
        fill="currentColor"
        className="text-primary-600"
      />
      <path
        d="M35 50C35 52 37 54 40 54C42 54 44 52 44 50C44 48 42 46 40 46C37 46 35 48 35 50Z"
        fill="currentColor"
        className="text-primary-800"
      />
      <path
        d="M56 50C56 52 58 54 60 54C62 54 64 52 64 50C64 48 62 46 60 46C58 46 56 48 56 50Z"
        fill="currentColor"
        className="text-primary-800"
      />
      <path
        d="M40 60C40 62 42 64 45 64C47 64 49 62 49 60C49 58 47 56 45 56C42 56 40 58 40 60Z"
        fill="currentColor"
        className="text-primary-700"
      />
      <path
        d="M30 75L35 80L40 75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-primary-600"
      />
      <path
        d="M60 75L65 80L70 75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="text-primary-600"
      />
    </svg>
  );
}

