// pages/guests/LayoutGuest.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../../Components/componentGuests/NavBar';
import Footer from '../../Components/componentGuests/Footer';

export default function LayoutGuest() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
