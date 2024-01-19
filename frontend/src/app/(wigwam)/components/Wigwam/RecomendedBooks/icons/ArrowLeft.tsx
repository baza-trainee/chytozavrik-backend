import React, { FC } from 'react';
import styles from './Arrows.module.scss';

const ArrowLeft: FC = () => (
  <div className={styles.arrow_container}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      className={styles.arrow_svg}
    >
      <mask
        id="mask0_7800_51439"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="36"
        height="36"
      >
        <rect width="36" height="36" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_7800_51439)">
        <path
          d="M22.6877 31.6496L10.0502 19.0496C9.9002 18.8996 9.79395 18.7371 9.73145 18.5621C9.66895 18.3871 9.6377 18.1996 9.6377 17.9996C9.6377 17.7996 9.66895 17.6121 9.73145 17.4371C9.79395 17.2621 9.9002 17.0996 10.0502 16.9496L22.6877 4.31211C23.0377 3.96211 23.4752 3.78711 24.0002 3.78711C24.5252 3.78711 24.9752 3.97461 25.3502 4.34961C25.7252 4.72461 25.9127 5.16211 25.9127 5.66211C25.9127 6.16211 25.7252 6.59961 25.3502 6.97461L14.3252 17.9996L25.3502 29.0246C25.7002 29.3746 25.8752 29.8059 25.8752 30.3184C25.8752 30.8309 25.6877 31.2746 25.3127 31.6496C24.9377 32.0246 24.5002 32.2121 24.0002 32.2121C23.5002 32.2121 23.0627 32.0246 22.6877 31.6496Z"
          fill="#1E1E1E"
        />
      </g>
    </svg>
  </div>
);

export default ArrowLeft;
