import React from 'react';

/**
 * MobileContainer Component
 * Simple wrapper for consistent page layout (full width, white bg)
 */
const MobileContainer = ({ children, className = '' }) => {
    return (
        <div className={`min-h-screen bg-white ${className}`}>
            {children}
        </div>
    );
};

export default MobileContainer;
