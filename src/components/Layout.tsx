import React from 'react';
import { Link, Outlet } from 'react-router-dom';

function Layout() {
    return (
      <div id='layout'>
        <nav id="navbar">
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="detail/1">Plant Detail</Link></li>
          </ul>
        </nav>
        <Outlet />
      </div>
    );
}

export default Layout;