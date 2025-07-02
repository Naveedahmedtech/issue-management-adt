import React from "react";

interface TabsProps {
    tabs: { id: string; label: string }[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="flex flex-wrap justify-center sm:justify-start mb-6">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`relative sm:px-6 px-3 py-3 opacity-90 font-medium transition-all rounded-t-lg text-sm sm:text-base ${
                        activeTab === tab.id
                            ? "bg-hover text-text"
                            : "bg-transparent text-textDark"
                    }`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                    {activeTab === tab.id && (
                        <span className="absolute left-0 bottom-[-2px] w-full h-1 bg-backgroundShade1 rounded-t-lg" />
                    )}
                </button>
            ))}
        </div>
    );
};

export default Tabs;
