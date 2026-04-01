import React from 'react';
import { Sidebar } from 'lucide-react';

const DefaultLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block">
        {/* Assumes Sidebar is mounted via Route hierarchy, but we can just use Outlet here */}
      </div>
      
      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col flex-1 min-h-screen">
        <main className="flex-1 p-6 md:p-8 w-full max-w-6xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;
