import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../Components/componentUsers/Navbar'; 
import Footer from '../../Components/componentUsers/Footer'; 

export default function LayoutUser() {
  return (
    <div 
      className="d-flex flex-column min-vh-100"
      style={{ backgroundColor: '#f8f9fa' }}
    >
      <Navbar />

      <main 
        className="flex-grow-1"
        style={{ 
          minHeight: 'calc(100vh - 200px)' 
        }}
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
