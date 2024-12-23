import React from 'react';

interface StatCardProps {
    title: string;
    value: number;
    color: string; // For dynamic color coding
    progress?: number; // Optional progress percentage
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color, progress }) => {
    return (
        <div className="p-4 rounded-md shadow-md bg-backgroundShade1 text-text">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <div className="text-2xl font-bold" style={{ color }}>
                {value}
            </div>
            {progress !== undefined && (
                <div className="w-full bg-border rounded h-2 mt-2 overflow-hidden">
                    <div
                        className="h-full"
                        style={{
                            width: `${progress}%`,
                            backgroundColor: color,
                            transition: 'width 0.3s ease',
                        }}
                    ></div>
                </div>
            )}
        </div>
    );
};

export default StatCard;
