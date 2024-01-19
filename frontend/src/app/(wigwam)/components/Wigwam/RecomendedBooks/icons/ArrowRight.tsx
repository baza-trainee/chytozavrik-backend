import React, { FC } from 'react';
import styles from './Arrows.module.scss';

const ArrowRight: FC = () => (
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
        id="mask0_7800_51399"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="36"
        height="36"
      >
        <rect width="36" height="36" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_7800_51399)">
        <path
          className={styles.arrow_path}
          d="M13.3123 31.6496L25.9498 19.0496C26.0998 18.8996 26.2061 18.7371 26.2686 18.5621C26.3311 18.3871 26.3623 18.1996 26.3623 17.9996C26.3623 17.7996 26.3311 17.6121 26.2686 17.4371C26.2061 17.2621 26.0998 17.0996 25.9498 16.9496L13.3123 4.31211C12.9623 3.96211 12.5248 3.78711 11.9998 3.78711C11.4748 3.78711 11.0248 3.97461 10.6498 4.34961C10.2748 4.72461 10.0873 5.16211 10.0873 5.66211C10.0873 6.16211 10.2748 6.59961 10.6498 6.97461L21.6748 17.9996L10.6498 29.0246C10.2998 29.3746 10.1248 29.8059 10.1248 30.3184C10.1248 30.8309 10.3123 31.2746 10.6873 31.6496C11.0623 32.0246 11.4998 32.2121 11.9998 32.2121C12.4998 32.2121 12.9373 32.0246 13.3123 31.6496Z"
          fill="#1E1E1E"
        />
      </g>
    </svg>
  </div>
);

export default ArrowRight;
