import React from 'react';

interface HeaderProps {
    isAdminView: boolean;
    isAuthenticated: boolean;
    setIsAdminView: (isAdmin: boolean) => void;
    onAdminClick: () => void;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAdminView, isAuthenticated, setIsAdminView, onAdminClick, onLogout }) => {
    const handleButtonClick = () => {
        if (isAdminView && isAuthenticated) {
            // Logout and go to user view
            onLogout();
            setIsAdminView(false);
        } else if (isAdminView && !isAuthenticated) {
            // Go back to user view without auth
            setIsAdminView(false);
        } else {
            // Try to access admin view
            onAdminClick();
        }
    };

    const getButtonText = () => {
        if (isAdminView && isAuthenticated) {
            return 'Logout';
        } else if (isAdminView && !isAuthenticated) {
            return 'User View';
        } else {
            return 'Admin / Staff Login';
        }
    };

    return (
        <header className="py-4 px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    <span className="text-gray-500">Reserve</span>Ease
                </h1>
                <button
                    onClick={handleButtonClick}
                    className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                    {getButtonText()}
                </button>
            </div>
        </header>
    );
};

export default Header;
