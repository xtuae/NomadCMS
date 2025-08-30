import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center bg-gray-900">
      <svg
        width="80"
        height="80"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="white"
      >
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" opacity="0.5" />
        <circle cx="12" cy="12" r="10" stroke="#de6076" strokeWidth="2" fill="none" strokeDasharray="20 140">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 12 12"
            to="360 12 12"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};

export default LoadingSpinner;
