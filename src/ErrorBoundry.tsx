import React, { ReactNode } from "react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

interface ErrorBoundaryProps {
    children?: ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
    const error = useRouteError();

    if (error) {
        const handleReload = () => {
            window.location.reload();
        };

        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="max-w-md w-full bg-backgroundShade1 shadow-md rounded-lg p-8 text-center">
                    <h1 className="text-3xl font-bold text-red-600">{isRouteErrorResponse(error) ? "Oops!" : "Something Went Wrong"}</h1>
                    {isRouteErrorResponse(error) ? (
                        <>
                            <p className="mt-4 text-lg">
                                {error.status} - {error.statusText}
                            </p>
                            {error.data && (
                                <p className="mt-2 text-sm">{error.data}</p>
                            )}
                        </>
                    ) : error instanceof Error ? (
                        <p className="mt-4 text-lg">{error.message}</p>
                    ) : null}

                    <button
                        onClick={handleReload}
                        className="mt-6 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ErrorBoundary;
