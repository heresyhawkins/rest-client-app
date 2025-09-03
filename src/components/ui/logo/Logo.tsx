import type {FC} from "react";

export const Logo: FC<{src: string, alt: string}> = ({src, alt}) => {
    return <img className="max-h-10 w-5" src={src} alt={alt}/>
};

