import React from 'react';
import { CustomArrowProps } from 'react-slick';
import Image from 'next/image';

const NextArrow: React.FC<CustomArrowProps> = ({ className, style, onClick }) => (
  <div className={className} style={{ ...style }} onClick={onClick}>
    <Image
      src="/images/monsters/wigwam-next.svg"
      quality={100}
      alt="наступний"
      width={61}
      height={64}
    />
  </div>
);

export default NextArrow;
