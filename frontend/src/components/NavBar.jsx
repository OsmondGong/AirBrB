import React from 'react';
import PropTypes from 'prop-types';
import { Nav, Container, Navbar, NavDropdown } from 'react-bootstrap'
import { Link, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function NavBar ({ token, setIsTokenEmpty, setEmail }) {
  const submitLogOut = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5005/user/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        console.log(res.statusText);
      } else {
        localStorage.setItem('curToken', '');
        setIsTokenEmpty(true);
        <Navigate to="/"/>
      }
    } catch (error) {
      console.log(error);
    }
  }
  const isToken = (token === '');
  return (<>
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
      <Navbar.Brand as={Link} to="/">AirBrb</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#features">Features</Nav.Link>
        </Nav>
        <Nav>
          <NavDropdown title="Menu" id="collasible-nav-dropdown">
            {isToken ? (<NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>) : <></>}
            {isToken ? (<NavDropdown.Item as={Link} to="/register">Register</NavDropdown.Item>) : <></>}
            {!isToken ? (<NavDropdown.Item onClick={submitLogOut}>Logout</NavDropdown.Item>) : <></>}
            <NavDropdown.Divider />
            <NavDropdown.Item as={Link} to="/alllistings">All Listings</NavDropdown.Item>
            {!isToken ? (<NavDropdown.Item as={Link} to="/yourlistings">Your Listings</NavDropdown.Item>) : <></>}
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
      </Container>
    </Navbar>
  </>);
}

NavBar.propTypes = {
  token: PropTypes.string,
  setIsTokenEmpty: PropTypes.func,
  setEmail: PropTypes.func
}

export default NavBar;
