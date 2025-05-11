import React from 'react';
import { Navbar as BsNavbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <BsNavbar bg="dark" variant="dark" expand="lg" className="navbar">
            <Container fluid>
                <BsNavbar.Brand href="/">School Vaccination Portal</BsNavbar.Brand>
                <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BsNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <NavDropdown
                            title={
                                <>
                                    <FaUserCircle className="me-2" />
                                    {user?.name || user?.username}
                                </>
                            }
                            id="basic-nav-dropdown"
                            align="end"
                        >
                            <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </BsNavbar.Collapse>
            </Container>
        </BsNavbar>
    );
};

export default Navbar;