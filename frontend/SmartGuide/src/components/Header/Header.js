import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Navbar, Nav, Button } from 'react-bootstrap';
import './Header.css';

const Header = () => {
    const { isAuthenticated, logout } = useAuth();
    const [shrink, setShrink] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const navbarRef = useRef(null);

    const handleScroll = () => {
        if (window.scrollY > 50) {
            setShrink(true);
        } else {
            setShrink(false);
        }
    };

    const handleLinkClick = () => {
        if (window.innerWidth < 992 && navbarRef.current) {
            const navbarCollapse = navbarRef.current.querySelector('.collapse');
            if (navbarCollapse) {
                navbarCollapse.classList.remove('show');
                setIsOpen(false);
            }
        }
    };

    const handleToggle = () => {
        if (navbarRef.current) {
            const navbarCollapse = navbarRef.current.querySelector('.collapse');
            if (navbarCollapse) {
                navbarCollapse.classList.toggle('show');
                setIsOpen(!isOpen);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <Navbar ref={navbarRef} variant="dark" expand="lg" className={`header ${shrink ? 'shrink' : ''}`}>
        <div className="container-fluid">
            <Navbar.Brand as={Link} to="/home" className="navbar-brand">SmartGuide</Navbar.Brand>
            <Navbar.Toggle className='navbar-toggler' aria-controls="basic-navbar-nav" onClick={handleToggle} />
            <Navbar.Collapse id="basic-navbar-nav">
            
            {/* Move Nav outside of Navbar.Collapse for full visibility */}
            <Nav className="ms-auto" >
                <Nav.Link as={Link} to="/home" onClick={handleLinkClick}>Home</Nav.Link>
                <Nav.Link as={Link} to="/about" onClick={handleLinkClick}>About</Nav.Link>
                <Nav.Link as={Link} to="/services" onClick={handleLinkClick}>Services</Nav.Link>
                <Nav.Link as={Link} to="/courses" onClick={handleLinkClick}>Courses</Nav.Link>
                {isAuthenticated ? (
                    <>
                        <Nav.Link as={Link} to="/dashboard" onClick={handleLinkClick}>Dashboard</Nav.Link>
                        <Button onClick={logout} variant="outline-light" className="logout-btn">Logout</Button>
                    </>
                ) : (
                    <>
                        <Nav.Link as={Link} to="/login" onClick={handleLinkClick}>Login</Nav.Link>
                        <Nav.Link as={Link} to="/signup" onClick={handleLinkClick}>Sign Up</Nav.Link>
                    </>
                )}
            </Nav>
          </Navbar.Collapse>
        </div>
    </Navbar>

    // <Navbar bg="dark" variant="dark" expand="lg" className={`header ${shrink ? 'shrink' : ''}`}>
    //         <div className="container-fluid">
    //             <Navbar.Brand as={Link} to="/home" className="brand">TutorPro</Navbar.Brand>
    //             <Navbar.Toggle aria-controls="basic-navbar-nav" />
    //             <Navbar.Collapse id="basic-navbar-nav">
    //                 <Nav className="ml-auto">
    //                     <Nav.Link as={Link} to="/home">Home</Nav.Link>
    //                     <Nav.Link as={Link} to="/about">About</Nav.Link>
    //                     <Nav.Link as={Link} to="/services">Services</Nav.Link>
    //                     <Nav.Link as={Link} to="/calculator">Calculator</Nav.Link>
    //                     <Nav.Link as={Link} to="/resource">Resources</Nav.Link>
    //                     <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
    //                     {isAuthenticated ? (
    //                         <>
    //                             <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
    //                             <Button onClick={logout} variant="outline-light" className="logout-btn">Logout</Button>
    //                         </>
    //                     ) : (
    //                         <>
    //                             <Nav.Link as={Link} to="/login">Login</Nav.Link>
    //                             <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
    //                         </>
    //                     )}
    //                 </Nav>
    //             </Navbar.Collapse>
    //         </div>
    //     </Navbar>
     );
};

export default Header;
