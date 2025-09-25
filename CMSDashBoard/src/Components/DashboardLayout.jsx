// components/DashboardLayout.js
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from '../Pages/Dashboard';
import Hotels from '../Pages/Hotels';
import Rooms from '../Pages/Rooms';
import Bookings from '../Pages/Bookings';
import Coupons from '../Pages/Coupons';
import Media from '../Pages/Media';
import Users from '../Pages/Users';

const DashboardLayout = () => {
  const { isAuthenticated, user } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'hotels': return <Hotels />;
      case 'rooms': return <Rooms />;
      case 'bookings': return <Bookings />;
      case 'coupons': return <Coupons />;
      case 'media': return <Media />;
      case 'users': return user?.role === 'admin' ? <Users /> : <Dashboard />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;