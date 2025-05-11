import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-light text-center text-lg-start mt-auto">
            <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                © {new Date().getFullYear()} School Vaccination Portal. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;