import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="glass-nav">
      <div className="logo">
        <h2 className="neon-text" style={{ margin: 0 }}>Street<span className="highlight-text">Dog</span></h2>
      </div>
      <div className="nav-links">
        <Link to="/" style={{ color: 'var(--text-primary)', textDecoration: 'none', marginRight: '2rem', fontWeight: '500' }}>Home</Link>
        <Link to="/dogs" style={{ color: 'var(--text-primary)', textDecoration: 'none', marginRight: '2rem', fontWeight: '500' }}>Our Dogs</Link>
        <Link to="/add-dog" style={{ color: 'var(--text-primary)', textDecoration: 'none', marginRight: '2rem', fontWeight: '500' }}>Add Dog</Link>
        <Link to="/login" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500' }}>Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
