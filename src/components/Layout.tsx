
import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-apple-lightgray overflow-hidden">
      <Navigation />
      <main className="pt-20 animate-fade-in relative z-10">
        {children}
      </main>
      
      {/* Apple-inspired decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Subtle gradient blobs */}
        <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse-subtle"></div>
        <div className="absolute bottom-0 right-0 w-[50rem] h-[50rem] bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float"></div>
        <div className="absolute top-1/2 left-1/3 w-[30rem] h-[30rem] bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float-delayed"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.015] pointer-events-none"></div>
        
        {/* Subtle accent lines */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-100 to-transparent opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-100 to-transparent opacity-30"></div>
      </div>
    </div>
  );
};

export default Layout;
