import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    FaHome,
    FaUsers,
    FaSyringe,
    FaClipboardList,
    FaNotesMedical
} from 'react-icons/fa';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/', icon: FaHome, label: 'Dashboard' },
        { path: '/students', icon: FaUsers, label: 'Students' },
        { path: '/drives', icon: FaSyringe, label: 'Vaccination Drives' },
        { path: '/vaccinate', icon: FaNotesMedical, label: 'Record Vaccination' },
        { path: '/reports', icon: FaClipboardList, label: 'Reports' },
    ];

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="sidebar">
            <ul>
                {menuItems.map((item) => (
                    <li key={item.path}>
                        <NavLink
                            to={item.path}
                            className={isActive(item.path) ? 'active' : ''}
                        >
                            <item.icon className="sidebar-icon" />
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;