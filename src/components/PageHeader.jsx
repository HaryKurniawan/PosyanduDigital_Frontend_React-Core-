import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

/**
 * PageHeader Component
 * Reusable header for pages without navbar
 * Layout: [Back Arrow] - [Title (center)] - [Right element optional]
 * 
 * @param {string} title - Page title (centered)
 * @param {function} onBack - Custom back handler (optional, defaults to navigate(-1))
 * @param {string} backTo - Specific route to navigate to (optional)
 * @param {React.ReactNode} rightElement - Optional element on the right side
 * @param {boolean} showBack - Whether to show back button (default: true)
 */
const PageHeader = ({
    title,
    onBack,
    backTo,
    rightElement,
    showBack = true
}) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else if (backTo) {
            navigate(backTo);
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
            <div className="flex items-center justify-between h-14 px-4">
                {/* Left - Back Button */}
                <div className="w-10 flex justify-start">
                    {showBack && (
                        <button
                            onClick={handleBack}
                            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Kembali"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-700" />
                        </button>
                    )}
                </div>

                {/* Center - Title */}
                <h1 className="flex-1 text-center font-semibold text-gray-800 truncate px-2">
                    {title}
                </h1>

                {/* Right - Optional Element */}
                <div className="w-10 flex justify-end">
                    {rightElement}
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
