
import React from 'react';

interface PadelIconProps {
  size?: number;
  className?: string;
}

const PadelIcon: React.FC<PadelIconProps> = ({ size = 80, className = "text-current" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g className={className}>
      {/* Left Racket */}
      <circle cx="30" cy="30" r="16" stroke="currentColor" strokeWidth="3" fill="none"/>
      <circle cx="30" cy="30" r="2" fill="currentColor"/>
      <circle cx="25" cy="25" r="2" fill="currentColor"/>
      <circle cx="35" cy="25" r="2" fill="currentColor"/>
      <circle cx="25" cy="35" r="2" fill="currentColor"/>
      <circle cx="35" cy="35" r="2" fill="currentColor"/>
      <circle cx="30" cy="20" r="2" fill="currentColor"/>
      <circle cx="30" cy="40" r="2" fill="currentColor"/>
      <rect x="28" y="43" width="4" height="18" fill="currentColor" rx="2"/>
      
      {/* Right Racket */}
      <circle cx="70" cy="30" r="16" stroke="currentColor" strokeWidth="3" fill="none"/>
      <circle cx="70" cy="30" r="2" fill="currentColor"/>
      <circle cx="65" cy="25" r="2" fill="currentColor"/>
      <circle cx="75" cy="25" r="2" fill="currentColor"/>
      <circle cx="65" cy="35" r="2" fill="currentColor"/>
      <circle cx="75" cy="35" r="2" fill="currentColor"/>
      <circle cx="70" cy="20" r="2" fill="currentColor"/>
      <circle cx="70" cy="40" r="2" fill="currentColor"/>
      <rect x="68" y="43" width="4" height="18" fill="currentColor" rx="2"/>
    </g>
  </svg>
);

export default PadelIcon;
