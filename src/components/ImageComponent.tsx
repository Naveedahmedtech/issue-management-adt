import React, { useEffect, useState } from 'react';
import userImage from '../assets/images/user/user.png'; 


interface ImageComponentProps {
    src: string | null;  
    alt: string;      
    fallback?: string;  
    className?: string;  
}

const ImageComponent: React.FC<ImageComponentProps> = ({ src, alt, fallback, className }) => {
    const [imgSrc, setImgSrc] = useState<string | null | undefined>(src);  

    useEffect(() => {
        if (fallback && !imgSrc || !imgSrc == undefined) {
            setImgSrc(fallback)
        }
        if (!imgSrc || imgSrc === undefined) {
            setImgSrc(userImage)
        }
    }, [imgSrc])


    const handleError = () => {
        if (fallback) {
            setImgSrc(fallback);  
        } else {
            setImgSrc(userImage)
        }
    };

    return (
        <img
            src={imgSrc || fallback}  
            alt={alt}
            onError={handleError}     
            className={className}     
            loading='lazy'
        />
    );
};

export default ImageComponent;
