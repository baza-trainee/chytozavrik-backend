import React, { FC } from 'react';

interface CatImageProps {
  width: number;
  height: number;
  viewBox: string;
  className?: string;
  alt: string;
}

const CatImage: FC<CatImageProps> = ({ width, height, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" {...props}>
    <path
      d="M13.6238 58.4712C-12.2183 68.0791 13.6238 79.012 38.4717 81.3315"
      stroke="#9B90C5"
      strokeWidth="5.30084"
      strokeLinecap="round"
    />
    <path
      d="M42.8986 78.7L47.9467 77.7285"
      stroke="#9B90C5"
      strokeWidth="3.31303"
      strokeLinecap="round"
    />
    <path
      d="M46.5172 81.4562L50.2781 81.1032"
      stroke="#9B90C5"
      strokeWidth="3.31303"
      strokeLinecap="round"
    />
    <path
      d="M45.5089 84.8648L49.2835 84.7178"
      stroke="#9B90C5"
      strokeWidth="3.31303"
      strokeLinecap="round"
    />
    <path
      d="M42.6647 85.5225L45.9375 87.4087"
      stroke="#9B90C5"
      strokeWidth="3.31303"
      strokeLinecap="round"
    />
    <path
      d="M38.662 79.0934L41.5949 76.7129"
      stroke="#9B90C5"
      strokeWidth="3.31303"
      strokeLinecap="round"
    />
    <path
      d="M47.9622 83.0499C47.1356 89.2422 44.3165 87.8787 40.69 87.3889C37.0635 86.8991 34.4396 84.1624 34.8294 81.2762C35.2192 78.39 38.475 76.4473 42.1016 76.9371C45.7281 77.4269 48.6315 78.0363 47.9622 83.0499Z"
      fill="#9B90C5"
    />
    <path
      d="M126.599 58.4716C152.441 68.0796 126.599 79.0125 101.751 81.332"
      stroke="#9B90C5"
      strokeWidth="5.30084"
      strokeLinecap="round"
    />
    <path
      d="M97.3245 78.7005L92.2764 77.729"
      stroke="#9B90C5"
      strokeWidth="3.31303"
      strokeLinecap="round"
    />
    <path
      d="M93.7059 81.4567L89.945 81.1037"
      stroke="#9B90C5"
      strokeWidth="3.31303"
      strokeLinecap="round"
    />
    <path
      d="M94.7142 84.8648L90.9397 84.7178"
      stroke="#9B90C5"
      strokeWidth="3.31303"
      strokeLinecap="round"
    />
    <path
      d="M97.5584 85.5229L94.2857 87.4092"
      stroke="#9B90C5"
      strokeWidth="3.31303"
      strokeLinecap="round"
    />
    <path
      d="M101.561 79.0934L98.6282 76.7129"
      stroke="#9B90C5"
      strokeWidth="3.31303"
      strokeLinecap="round"
    />
    <path
      d="M92.2609 83.0504C93.0875 89.2427 95.9066 87.8792 99.5331 87.3894C103.16 86.8996 105.784 84.1628 105.394 81.2767C105.004 78.3905 101.748 76.4478 98.1216 76.9376C94.495 77.4274 91.5917 78.0368 92.2609 83.0504Z"
      fill="#9B90C5"
    />
    <path
      d="M10.4312 60.1472C10.4312 27.212 37.1304 0.512695 70.0656 0.512695C103.001 0.512695 129.7 27.212 129.7 60.1472V67.978C129.7 71.704 126.68 74.7245 122.954 74.7245H17.1777C13.4517 74.7245 10.4312 71.704 10.4312 67.978V60.1472Z"
      fill="#9B90C5"
    />
    <path
      d="M46.2117 7.80716C36.6016 -0.0303932 19.2822 -8.22119 26.8858 21.7161L46.2117 7.80716Z"
      fill="#9B90C5"
    />
    <path
      d="M93.9192 7.80716C103.529 -0.0303932 120.849 -8.22119 113.245 21.7161L93.9192 7.80716Z"
      fill="#9B90C5"
    />
    <path
      d="M82.6307 50.8706H57.4149C56.3943 50.8706 55.6279 51.7622 55.9018 52.7454C56.9201 56.4001 60.2039 64.1227 69.7741 64.1227C79.2888 64.1227 82.9257 56.4891 84.1262 52.8092C84.4518 51.811 83.6806 50.8706 82.6307 50.8706Z"
      fill="#1E1E1E"
    />
    <path d="M63.8812 56.1714L60.7891 50.8706H66.0899L63.8812 56.1714Z" fill="#FDFDFD" />
    <circle cx="54.1632" cy="33.6427" r="9.27647" fill="#FDFDFD" />
    <circle cx="85.9679" cy="33.6427" r="9.27647" fill="#FDFDFD" />
    <circle cx="54.1632" cy="33.6427" r="6.62605" fill="#1E1E1E" />
    <circle cx="85.9683" cy="33.6427" r="6.62605" fill="#1E1E1E" />
    <rect
      width="2.65042"
      height="2.65042"
      transform="matrix(0.866818 0.498625 -0.501376 0.86523 56.8135 30.3301)"
      fill="#FDFDFD"
    />
    <rect
      width="2.65042"
      height="2.65042"
      transform="matrix(0.866818 0.498625 -0.501376 0.86523 88.6187 30.3301)"
      fill="#FDFDFD"
    />
  </svg>
);

export default CatImage;
