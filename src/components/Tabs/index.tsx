import React from "react";

interface TabsProps {
    tabs: { id: string; label: string }[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="flex justify-center sm:justify-start space-x-4 mb-6 overflow-hidden">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`relative px-6 py-3 font-medium transition-all rounded-t-lg ${
                        activeTab === tab.id
                            ? "bg-backgroundShade1 text-primary"
                            : "bg-transparent text-textHover hover:text-primary"
                    }`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                    {activeTab === tab.id && (
                        <span className="absolute left-0 bottom-[-2px] w-full h-1 bg-primary rounded-t-lg" />
                    )}
                </button>
            ))}
        </div>
    );
};

export default Tabs;
