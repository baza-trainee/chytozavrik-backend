import styles from './Avatar.module.scss';

const Avatar1 = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="165"
    height="177"
    viewBox="0 0 165 177"
    fill="none"
  >
    <g filter="url(#filter0_d_6452_82907)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M67.143 12.5388C93.5462 -5.58992 132.965 12.5388 148.191 33.6423C139.381 67.0557 148.191 83.7626 155.544 107.501C151.159 132.527 133.805 151.75 112.299 161.142C82.1194 167.297 63.7895 165.467 45.3624 155.622C26.9892 145.806 24.339 118.814 19.5211 96.9523C6.35691 72.3316 8.11901 57.5864 19.5207 38.3613C32.4877 16.4969 43.4894 10.8055 67.143 12.5388Z"
        fill="#D7D7D7"
      />
      <mask
        id="mask0_6452_82907"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="12"
        y="20"
        width="142"
        height="142"
      >
        <ellipse cx="82.5592" cy="90.798" rx="70.4762" ry="70.3448" fill="#7791FA" />
      </mask>
      <g xmlns="http://www.w3.org/2000/svg" mask="url(#mask0_6452_82907)">
        <ellipse cx="83.1012" cy="127.594" rx="50.4176" ry="58.4403" fill="#3EB560" />
        <path
          d="M64.5273 134.284C76.1263 134.284 85.5292 125.761 85.5292 115.247C85.5292 104.734 76.1263 96.2109 64.5273 96.2109C52.9283 96.2109 43.5254 104.734 43.5254 115.247C43.5254 125.761 52.9283 134.284 64.5273 134.284Z"
          fill="#FDFDFD"
        />
        <path
          d="M64.5259 124.328C69.2805 124.328 73.1349 120.481 73.1349 115.735C73.1349 110.99 69.2805 107.143 64.5259 107.143C59.7713 107.143 55.917 110.99 55.917 115.735C55.917 120.481 59.7713 124.328 64.5259 124.328Z"
          fill="#1E1E1E"
        />
        <path
          d="M57.1543 115.735C57.1543 115.735 60.1143 115.303 60.4721 114.534C60.4721 114.534 61.3829 117.045 61.5455 117.24C61.5455 117.24 58.8349 119.556 58.2494 119.307C57.6639 119.058 57.1543 115.735 57.1543 115.735Z"
          fill="#FDFDFD"
        />
        <path
          d="M101.392 134.284C112.991 134.284 122.393 125.761 122.393 115.247C122.393 104.734 112.991 96.2109 101.392 96.2109C89.7925 96.2109 80.3896 104.734 80.3896 115.247C80.3896 125.761 89.7925 134.284 101.392 134.284Z"
          fill="#FDFDFD"
        />
        <path
          d="M101.39 124.328C106.145 124.328 109.999 120.481 109.999 115.735C109.999 110.99 106.145 107.143 101.39 107.143C96.6356 107.143 92.7812 110.99 92.7812 115.735C92.7812 120.481 96.6356 124.328 101.39 124.328Z"
          fill="#1E1E1E"
        />
        <path
          d="M94.0186 115.735C94.0186 115.735 96.9786 115.303 97.3364 114.534C97.3364 114.534 98.2471 117.045 98.4098 117.24C98.4098 117.24 95.6991 119.556 95.1136 119.307C94.5281 119.058 94.0186 115.735 94.0186 115.735Z"
          fill="#FDFDFD"
        />
      </g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        className={styles['avatar-stroke']}
        d="M68.9046 11.66C95.3078 -6.46872 157.039 21.6239 148.19 44.1945C140.262 64.4187 148.19 82.8842 155.543 107.502C151.158 132.528 133.804 151.751 112.299 161.143C81.2379 165.54 63.7892 165.467 45.3621 155.623C26.9889 145.807 24.3386 122.332 19.5207 100.47C14.6025 78.1535 -0.690744 60.9014 19.5203 38.3622C32.4873 16.4978 45.251 9.92666 68.9046 11.66Z"
        stroke="#FDFDFD"
        strokeWidth="10"
      />
    </g>
    <defs xmlns="http://www.w3.org/2000/svg">
      <filter
        id="filter0_d_6452_82907"
        x="0.341797"
        y="0.853516"
        width="164.33"
        height="176.082"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6452_82907" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_6452_82907"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export default Avatar1;
