import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';

export default function Navbar() {
    const { isLoggedIn, setIsLoggedIn, userName, setUserName, logout } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        const authTokenFromSession = sessionStorage.getItem('auth-token');
        const nameFromSession = sessionStorage.getItem('name');

        if (authTokenFromSession) {
            if (isLoggedIn && nameFromSession) {
                setUserName(nameFromSession);
            } else {
                logout();
                setIsLoggedIn(false);
            }
        }
    }, [isLoggedIn, logout, setIsLoggedIn, setUserName]);

    const handleLogout = () => {
        logout();
        navigate('/app');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light" id='navbar_container'>
            <a className="navbar-brand" href="/home.html">GiftLink</a>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" href="/home.html">Home</a>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/app">Gifts</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/app/search">Search</Link>
                    </li>
                    {isLoggedIn ? (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/app/profile">Welcome, {userName || 'User'}</Link>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link login-btn" onClick={handleLogout}>Logout</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link login-btn" to="/app/login">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link register-btn" to="/app/register">Register</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}
