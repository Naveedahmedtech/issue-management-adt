import  { ReactNode } from 'react'

const CommonSpace = ({ children }: { children: ReactNode }) => {
    return (
        <div className="mb-20 md:mb-0">{children}</div>
    )
}

export default CommonSpace
