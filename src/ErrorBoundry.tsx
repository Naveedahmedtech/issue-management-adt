import React, { ReactNode } from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

interface ErrorBoundaryProps {
    children?: ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
    const error = useRouteError();

    if (error) {
        if (isRouteErrorResponse(error)) {
            return (
                <div className="p-6 bg-red-100 text-red-700 rounded-lg">
                    <h1 className="text-2xl font-bold">Oops!</h1>
                    <p className="mt-2">{error.status} - {error.statusText}</p>
                    {error.data && <p className="mt-2">{error.data}</p>}
                    <button
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
                        onClick={() => window.location.reload()}
                    >
                        Reload
                    </button>
                </div>
            );
        } else if (error instanceof Error) {
            return (
                <div className="p-6 bg-red-100 text-red-700 rounded-lg">
                    <h1 className="text-2xl font-bold">An error occurred</h1>
                    <p className="mt-2">{error.message}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
                        onClick={() => window.location.reload()}
                    >
                        Reload
                    </button>
                </div>
            );
        }
    }

    return <>{children}</>;
};

export default ErrorBoundary;
