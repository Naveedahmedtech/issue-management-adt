import React from 'react'
import { ITextProps } from '../types/types'

const Text: React.FC<ITextProps> = ({ children, className, onClick }) => {
    return (
        <p className={`text-primary ${className}`} onClick={onClick}>{children}</p>
    )
}

export default Text
