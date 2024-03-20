import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from 'react-bootstrap/NavDropdown';

export default function Navigation() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">CronoControl</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Validar solicitud</Nav.Link>
            <Nav.Link href="/turnoCrud">Agregar Turno</Nav.Link>

            <NavDropdown title="Más opciones" id="basic-nav-dropdown">
              <NavDropdown.Item href="/agregarUsuario">Agregar Administrador</NavDropdown.Item>
              <NavDropdown.Item href="/agregarEmpleado">
                Agregar Empleado
              </NavDropdown.Item>
              <NavDropdown.Item href="/agregarSede">
                Agregar Sede
              </NavDropdown.Item>
              <NavDropdown.Item href="/agregarArea">
                Agregar Área
              </NavDropdown.Item>
              <NavDropdown.Item href="/agregarContrato">
                Agregar Contrato
              </NavDropdown.Item>
              <NavDropdown.Item href="/agregarHorario">
                Agregar Horario
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

