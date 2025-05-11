import React from 'react';
import { Navbar as BsNavbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <BsNavbar bg="dark" variant="dark" expand="lg">
            <Container fluid>
                <BsNavbar.Brand href="/">School Vaccination Portal</BsNavbar.Brand>
                <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BsNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {user && (
                            <NavDropdown title={user.name || user.username} id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </BsNavbar.Collapse>
            </Container>
        </BsNavbar>
    );
};

export default Navbar;