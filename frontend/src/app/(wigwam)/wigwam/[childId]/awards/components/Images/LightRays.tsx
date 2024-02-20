'use client';

import React from 'react';
import { useMedia } from '@/hooks';

const LightRays = ({ className }: { className: string }) => {
  const { deviceType } = useMedia();

  return (
    <div className={className}>
      {deviceType === 'mobile' && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="360"
          height="800"
          viewBox="0 0 360 800"
          fill="none"
        >
          <g opacity="0.05">
            <path d="M176.114 800L742 208.203V0H634.188L176.114 800Z" fill="white" />
            <path d="M176.114 800L470.906 0H250.594L176.114 800Z" fill="white" />
            <path d="M176.114 800L-130.266 0H87.3125L176.114 800Z" fill="white" />
            <path d="M176.114 800L-383 208.203V0H-293.547L176.114 800Z" fill="white" />
            <path d="M176.114 800L-383 610.938V413.672L176.114 800Z" fill="white" />
            <path d="M176.114 800L742 610.938V413.672L176.114 800Z" fill="white" />
          </g>
        </svg>
      )}
      {deviceType === 'tablet' && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="768"
          height="1024"
          viewBox="0 0 768 1024"
          fill="none"
        >
          <g opacity="0.05">
            <path d="M379.666 1024L1104 266.5V0H966L379.666 1024Z" fill="white" />
            <path d="M379.666 1024L757 0H475L379.666 1024Z" fill="white" />
            <path d="M379.666 1024L-12.5 0H266L379.666 1024Z" fill="white" />
            <path d="M379.666 1024L-336 266.5V0H-221.5L379.666 1024Z" fill="white" />
            <path d="M379.666 1024L-336 782V529.5L379.666 1024Z" fill="white" />
            <path d="M379.666 1024L1104 782V529.5L379.666 1024Z" fill="white" />
          </g>
        </svg>
      )}

      {deviceType === 'laptop' && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="768"
          height="1024"
          viewBox="0 0 768 1024"
          fill="none"
        >
          <g opacity="0.05">
            <path d="M379.666 1024L1104 266.5V0H966L379.666 1024Z" fill="white" />
            <path d="M379.666 1024L757 0H475L379.666 1024Z" fill="white" />
            <path d="M379.666 1024L-12.5 0H266L379.666 1024Z" fill="white" />
            <path d="M379.666 1024L-336 266.5V0H-221.5L379.666 1024Z" fill="white" />
            <path d="M379.666 1024L-336 782V529.5L379.666 1024Z" fill="white" />
            <path d="M379.666 1024L1104 782V529.5L379.666 1024Z" fill="white" />
          </g>
        </svg>
      )}
      {deviceType === 'desktop' && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1440"
          height="1024"
          viewBox="0 0 1440 1024"
          fill="none"
        >
          <g opacity="0.05">
            <path d="M715.666 1024L1440 266.5V0H1302L715.666 1024Z" fill="white" />
            <path d="M715.666 1024L1093 0H811L715.666 1024Z" fill="white" />
            <path d="M715.666 1024L323.5 0H602L715.666 1024Z" fill="white" />
            <path d="M715.666 1024L0 266.5V0H114.5L715.666 1024Z" fill="white" />
            <path d="M715.666 1024L0 782V529.5L715.666 1024Z" fill="white" />
            <path d="M715.666 1024L1440 782V529.5L715.666 1024Z" fill="white" />
          </g>
        </svg>
      )}
    </div>
  );
};

export default LightRays;
