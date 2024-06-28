import React from 'react';
import { NavLink } from 'react-router-dom';

// Define the Navigation component
const NavBar = () => (

    <nav className="w-full fixed" style={{ height: '50px'}}>
        <ul className="nav-links">
            <li><NavLink reloadDocument to="/" className={({ isActive }) => isActive ? 'nav-item-active' : ''}>Main</NavLink></li>
            {/*<li><NavLink to="/charts" className={({ isActive }) => isActive ? 'nav-item-active' : ''}>Charts</NavLink></li>*/}

            <li><NavLink to="/design" className={({ isActive }) => isActive ? 'nav-item-active' : ''}>DbtFlow</NavLink></li>
            {/*<li><NavLink to="/about" className={({ isActive }) => isActive ? 'nav-item-active' : ''}>About</NavLink></li>*/}
        </ul>
    </nav>
);

export default NavBar;
