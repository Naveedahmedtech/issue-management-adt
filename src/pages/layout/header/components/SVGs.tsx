// MoonIcon with animation class added
export const MoonIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-moon text-text h-6 w-6 animate-moon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    )
}



export const SunIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-sun text-text h-6 w-6 animate-sun" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M3 12h2M12 3v2M21 12h2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
    )
}


export const MenuIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 menu-animate" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path className="line1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16" />
            <path className="line2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h16" />
            {/* Updated this line to be shorter */}
            <path className="line3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h8" />
        </svg>
    );
}





export const CrossIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover-effect" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
};



export default MoonIcon;
