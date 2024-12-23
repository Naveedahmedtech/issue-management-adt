import { useState, useEffect } from 'react';
import { AiOutlineCloud, AiOutlineReload } from 'react-icons/ai'; // Import necessary icons

const NetworkStatus = ({ children }: any) => {
    const [isOnline, setIsOnline] = useState(window.navigator.onLine);

    useEffect(() => {
        const setOnline = () => setIsOnline(true);
        const setOffline = () => setIsOnline(false);

        window.addEventListener('online', setOnline);
        window.addEventListener('offline', setOffline);

        return () => {
            window.removeEventListener('online', setOnline);
            window.removeEventListener('offline', setOffline);
        };
    }, []);

    if (!isOnline) {
        return (
            <div className="flex items-center justify-center h-screen max-h-screen overflow-hidden bg-background">
                <div className="text-center p-6 mx-auto">
                    <div className="flex justify-center">
                        <AiOutlineCloud className="text-8xl text-danger" />
                    </div>
                    <h1 className="text-4xl font-semibold text-text mt-4">You are Offline</h1>
                    <p className="text-xl text-text mb-6">Please check your internet connection.</p>
                    <button onClick={() => window.location.reload()}
                        className="inline-flex items-center bg-primary text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200 ease-in-out">
                        <AiOutlineReload className="mr-2" />
                        Reload
                    </button>
                </div>
            </div>
        );
    }

    return children ;
};

export default NetworkStatus;
