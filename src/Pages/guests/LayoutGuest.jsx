import React from "react";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import Footer from "../../Components/componentGuests/Footer";
import NavBar from "../../Components/componentGuests/NavBar";
export default function LayoutGuest() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <NavBar />

      <Container
        fluid
        className="flex-grow-1 my-4 px-3"
        style={{ maxWidth: "1200px" }}
      >
        <Outlet />
      </Container>

      <Footer/>
    </div>
  );
}
