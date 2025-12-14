import React from 'react';

/**
 * SlidingTabs Component
 * Reusable tabs with smooth sliding indicator effect
 * 
 * @param {Array} tabs - Array of tab objects: { id: string, label: string, icon?: ReactNode }
 * @param {string} activeTab - Currently active tab id
 * @param {function} onTabChange - Callback when tab changes: (tabId) => void
 */
const SlidingTabs = ({ tabs, activeTab, onTabChange }) => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    const tabCount = tabs.length;

    return (
        <div className="bg-gray-50 rounded-xl p-1 border border-gray-100 relative mb-4">
            {/* Sliding Indicator */}
            <div
                className="absolute top-1 bottom-1 bg-pink-500 rounded-lg shadow-sm transition-all duration-300 ease-out"
                style={{
                    width: `calc((100% - 8px) / ${tabCount})`,
                    left: `calc((100% - 8px) / ${tabCount} * ${activeIndex} + 4px)`
                }}
            />

            {/* Tab Buttons */}
            <div
                className="relative z-10 grid gap-0"
                style={{ gridTemplateColumns: `repeat(${tabCount}, 1fr)` }}
            >
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-medium text-xs transition-colors duration-200 ${activeTab === tab.id ? 'text-white' : 'text-gray-500'
                            }`}
                    >
                        {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SlidingTabs;
