import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserCircle, LogOut, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => { logout(); navigate('/login'); };

    if (!user) return null;

    const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

    return (
        <nav className="navbar-auth">
            <div className="nav-left">
                <Link to="/" className="logo">Rheel</Link>
                <span className="welcome-msg">Welcome, {user.name}</span>
            </div>

            <div className="nav-center">
                {user.role === 'user' && (
                    <>
                        <Link to="/vehicles" className={isActive('/vehicles')}>Home</Link>
                        <Link to="/user" className={isActive('/user')}>My Rent History</Link>
                    </>
                )}

                {user.role === 'owner' && (
                    <>
                        <Link to="/owner" className={isActive('/owner')}>My Vehicles</Link>
                        <Link to="/owner/renters" className={isActive('/owner/renters')}>My Renters</Link>
                    </>
                )}

                {user.role === 'admin' && (
                    <>
                        <Link to="/admin/rents" className={isActive('/admin/rents') || location.pathname === '/admin' ? "nav-link active" : "nav-link"}>Show Rents</Link>
                        <Link to="/admin/users" className={isActive('/admin/users')}>Show Users</Link>
                        <Link to="/admin/owners" className={isActive('/admin/owners')}>Show Owners</Link>
                        <Link to="/admin/vehicles" className={isActive('/admin/vehicles')}>Show Vehicles</Link>
                    </>
                )}
            </div>

            <div className="nav-right" ref={dropdownRef}>
                <div className="profile-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    <UserCircle size={28} />
                    <span>Profile</span>
                </div>

                <AnimatePresence>
                    {dropdownOpen && (
                        <motion.div
                            className="dropdown-menu"
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            {user.role === 'admin' && (
                                <div className="dropdown-actions">
                                    <button onClick={() => { navigate('/admin/add-user'); setDropdownOpen(false); }}><PlusCircle size={16} /> Add User</button>
                                    <button onClick={() => { navigate('/admin/add-owner'); setDropdownOpen(false); }}><PlusCircle size={16} /> Add Owner</button>
                                    <button onClick={() => { navigate('/admin/add-vehicle'); setDropdownOpen(false); }}><PlusCircle size={16} /> Add Vehicle</button>
                                    <hr />
                                </div>
                            )}
                            <button onClick={handleLogout} className="logout-btn"><LogOut size={16} /> Logout</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
                .navbar-auth { display: flex; justify-content: space-between; align-items: center; padding: 15px 40px; background: #111; border-bottom: 1px solid #333; position: sticky; top: 0; z-index: 100; font-family: 'Inter', sans-serif;}
                .nav-left { display: flex; align-items: baseline; gap: 20px; }
                .logo { font-size: 24px; font-weight: 800; background: linear-gradient(90deg, #ff8a00, #e52e71); -webkit-background-clip: text; color: transparent; text-decoration: none; }
                .welcome-msg { color: #aaa; font-size: 14px; font-weight: 500; }
                .nav-center { display: flex; gap: 25px; }
                .nav-link { color: #fff; text-decoration: none; font-size: 15px; font-weight: 500; transition: color 0.3s; padding: 5px 10px; border-radius: 8px; }
                .nav-link:hover, .nav-link.active { color: #ff8a00; background: #222; }
                .nav-right { position: relative; }
                .profile-trigger { display: flex; align-items: center; gap: 8px; cursor: pointer; color: #fff; transition: color 0.3s; padding: 5px 10px; border-radius: 8px; }
                .profile-trigger:hover { color: #ff8a00; background: #222; }
                .dropdown-menu { position: absolute; top: calc(100% + 10px); right: 0; background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 10px; min-width: 200px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); display: flex; flex-direction: column; gap: 5px; }
                .dropdown-menu button { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 15px; background: transparent; border: none; color: #eee; cursor: pointer; text-align: left; border-radius: 8px; transition: background 0.2s; font-family: 'Inter', sans-serif; font-size: 14px;}
                .dropdown-menu button:hover { background: #333; }
                .dropdown-menu hr { border-color: #333; margin: 5px 0; }
                .logout-btn { color: #ff4d4d !important; font-weight: 600; }
                .logout-btn:hover { background: rgba(255, 77, 77, 0.1) !important; }
            `}</style>
        </nav>
    );
};

export default Navbar;