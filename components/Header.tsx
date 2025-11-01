
import React from 'react';

const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const Header: React.FC = () => {
    return (
        <header className="bg-slate-900/70 backdrop-blur-sm p-4 sticky top-0 z-10 shadow-lg shadow-slate-950/20">
            <div className="container mx-auto flex items-center">
                <ChartBarIcon />
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    Sales <span className="text-cyan-400">Forecaster</span> Pro
                </h1>
            </div>
        </header>
    );
};

export default Header;
