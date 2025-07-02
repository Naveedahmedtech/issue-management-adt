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
            className={`flex items-center space-x-2 px-2 rounded-lg transition-all duration-300 text-textDark ${className} ${isActive ? 'bg-backgroundShade2 text-textDark' : 'text-textDark hover:bg-hover'} text-base`}
        >
            {Icon && <Icon className="text-base" />}
            <span>{text}</span>
        </Link>
    );
};

export default IconLink;
