import type { FC } from 'react';
import Image from 'next/image';

export const Logo: FC<{ src: string; alt: string }> = ({ src, alt }) => {
  return (
    <Image
      className="max-h-10 w-5"
      src={src}
      alt={alt}
      width={30}
      height={30}
    />
  );
};
