import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(phoneNumber, password);
            toast.success('Logged in successfully');
            if (data.role === 'admin') navigate('/admin');
            else if (data.role === 'owner') navigate('/owner');
            else navigate('/vehicles');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="auth-container">
            <Link to="/" className="back-btn">← Back to Home</Link>
            <motion.div 
                className="auth-box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h2>Welcome Back</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button type="submit" className="btn-primary w-full mt-4">Login</button>
                </form>
                <p className="mt-4 text-center">Don't have an account? <Link to="/register" style={{color: '#e52e71'}}>Register</Link></p>
            </motion.div>
            
            <style>{`
                .auth-container { position: relative; min-height: 100vh; display: flex; justify-content: center; align-items: center; background: #0d0d0d; }
                .back-btn { position: absolute; top: 40px; left: 5vw; color: #a0a0a0; text-decoration: none; font-weight: 500; font-family: 'Inter', sans-serif; font-size: 16px; transition: color 0.2s; }
                .back-btn:hover { color: #fff; }
                .auth-box { background: #1a1a1a; padding: 40px; border-radius: 20px; width: 100%; max-width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                .auth-box h2 { margin-bottom: 30px; text-align: center; }
                input { width: 100%; padding: 15px; margin-bottom: 15px; border-radius: 10px; border: 1px solid #333; background: #222; color: #fff; font-family: 'Inter', sans-serif; }
                input:focus { outline: none; border-color: #e52e71; }
                .w-full { width: 100%; }
                .mt-4 { margin-top: 20px; }
                .text-center { text-align: center; }
                .btn-primary { background: linear-gradient(90deg, #ff8a00, #e52e71); padding: 15px; border-radius: 10px; color: white; border: none; font-size: 16px; cursor: pointer; font-weight: 600; transition: transform 0.2s; }
                .btn-primary:active { transform: scale(0.98); }
            `}</style>
        </div>
    );
};

export default Login;
