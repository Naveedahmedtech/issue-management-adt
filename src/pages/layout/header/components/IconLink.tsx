import React from 'react';
import { Link } from 'react-router-dom';
import { IIconLink } from '../../../../types/types';

interface IconLinkProps extends IIconLink {
    isActive: boolean;
    onClick: () => void;
}

const IconLink: React.FC<IconLinkProps> = ({ url, Icon, text, className, isActive, onClick }) => {

    const handleClick = () => {
        if (window.innerWidth < 640) { 
            onClick();
        }
    };

    return (
        <Link
            to={url}
            onClick={handleClick} 
            className={`flex items-center space-x-2 px-2 rounded-lg transition-all duration-300 text-text ${className} ${isActive ? 'bg-backgroundShade2 text-text' : 'text-text hover:bg-backgroundShade2'}`}
        >
            {Icon && <Icon className="text-2xl" />}
            <span>{text}</span>
        </Link>
    );
};

export default IconLink;
