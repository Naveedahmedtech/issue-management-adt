import { AiOutlineHome } from 'react-icons/ai'; // A home icon for navigation
import { BiErrorAlt } from 'react-icons/bi'; // A warning/error icon
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-backgroundShade1">
            <div className="text-center">
                {/* Error Icon */}
                <div className="flex justify-center mb-4">
                    <BiErrorAlt className="text-text text-6xl md:text-8xl" />
                </div>

                {/* 404 Number */}
                <p className="text-text text-3xl md:text-8xl font-bold mb-2 md:mb-4">404</p>

                {/* Page Not Found Heading */}
                <h1 className="text-3xl md:text-6xl font-semibold text-text mb-2 md:mb-4">
                    Page Not Found
                </h1>

                {/* Description */}
                <p className="text-text text-sm md:text-xl mb-8">
                    We can't find the page you're looking for.
                </p>

                {/* Go Home Button */}
                <Link
                    to="/"
                    className="inline-flex items-center px-4 py-2 border border-text bg-text text-base font-medium rounded-md text-background hover:bg-transparent hover:text-text transition-all duration-300"
                >
                    <AiOutlineHome className="mr-2 -ml-1 h-5 w-5" />
                    Go Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
