
import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50 overflow-hidden">
      <Navigation />
      <main className="pt-20 animate-fade-in relative z-10">
        {children}
      </main>
      
      {/* Modern decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* Animated blobs */}
        <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-subtle"></div>
        <div className="absolute bottom-0 right-0 w-[50rem] h-[50rem] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-1/2 left-1/3 w-[30rem] h-[30rem] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float-delayed"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.015] pointer-events-none"></div>
        
        {/* Accent lines */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-200 to-transparent opacity-30"></div>
      </div>
    </div>
  );
};

export default Layout;
