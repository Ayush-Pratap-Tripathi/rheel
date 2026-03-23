import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Home = () => {
    const [vehiclesData, setVehiclesData] = useState({ bike: null, car: null, bus: null });
    const [expanded, setExpanded] = useState({ bike: false, car: false, bus: false });
    const [loadingType, setLoadingType] = useState(null);

    const handleCardClick = async (type) => {
        if (expanded[type]) {
            setExpanded(prev => ({ ...prev, [type]: false }));
            return;
        }
        
        setExpanded(prev => ({ ...prev, [type]: true }));
        
        if (vehiclesData[type] === null) {
            setLoadingType(type);
            try {
                const { data } = await axios.get(`/api/vehicles?type=${type}`);
                setVehiclesData(prev => ({ ...prev, [type]: data }));
            } catch (error) {
                console.error('Error fetching count:', error);
            }
            setLoadingType(null);
        }
    };

    return (
        <div className="home-container">
            <nav className="navbar">
                <div className="logo">Rheel</div>
                <div className="nav-links">
                    <Link to="/login" className="nav-link">Login</Link>
                    <Link to="/register" className="btn-primary">Register</Link>
                </div>
            </nav>
            
            <motion.header 
                className="hero"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1>Welcome to Rheel</h1>
                <p>The ultimate marketplace for renting premium vehicles on demand. Whether you need a quick bike ride, a luxury car for the weekend, or a bus for your entire team.</p>
                <div className="hero-buttons">
                    <Link to="/register" className="btn-large">Get Started Today</Link>
                    <Link to="/login" className="btn-outline">Sign In</Link>
                </div>
            </motion.header>

            <motion.section 
                className="services-section"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2>What Rheel Offers</h2>
                <div className="services-grid">
                    <motion.div className="service-card" layout onClick={() => handleCardClick('bike')} style={{cursor: 'pointer'}}>
                        <motion.h3 layout>🏍️ Bike Rentals</motion.h3>
                        <motion.p layout>Zip through the city traffic with top-of-the-line bikes available from local owners near you. Track requests and approvals directly.</motion.p>
                        <AnimatePresence>
                            {expanded.bike && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{overflow: 'hidden'}}>
                                    <hr style={{borderColor: 'rgba(255,255,255,0.1)', margin: '15px 0'}}/>
                                    {loadingType === 'bike' ? <p style={{color: '#888'}}>Pulling inventory...</p> : (
                                        <>
                                            <p style={{color: '#ff8a00', fontWeight: 'bold', fontSize: '16px', marginBottom: '10px'}}>{vehiclesData.bike.length} bikes currently listed:</p>
                                            <div style={{maxHeight: '150px', overflowY: 'auto', paddingRight: '5px', marginBottom: '15px'}}>
                                                {vehiclesData.bike.map(v => (
                                                    <div key={v._id} style={{background: '#111', padding: '10px', borderRadius: '6px', marginBottom: '8px', border: '1px solid #222', textAlign: 'left'}}>
                                                        <h4 style={{margin: '0 0 4px', fontSize: '15px', color: '#fff'}}>{v.name}</h4>
                                                        <p style={{margin: 0, fontSize: '12px', color: '#888'}}>Speed: {v.topSpeed} km/h • {v.details?.substring(0, 30) || 'Standard ride'}...</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <p style={{fontSize: '14px', color: '#ccc'}}>Please <Link to="/login" style={{color: '#e52e71', textDecoration: 'underline'}} onClick={e=>e.stopPropagation()}>Login</Link> to reserve.</p>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div className="service-card" layout onClick={() => handleCardClick('car')} style={{cursor: 'pointer'}}>
                        <motion.h3 layout>🚗 Car Rentals</motion.h3>
                        <motion.p layout>From economic hatchbacks to premium sedans, pick the perfect car for your personal journeys and unlock owner contact immediately.</motion.p>
                        <AnimatePresence>
                            {expanded.car && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{overflow: 'hidden'}}>
                                    <hr style={{borderColor: 'rgba(255,255,255,0.1)', margin: '15px 0'}}/>
                                    {loadingType === 'car' ? <p style={{color: '#888'}}>Pulling inventory...</p> : (
                                        <>
                                            <p style={{color: '#ff8a00', fontWeight: 'bold', fontSize: '16px', marginBottom: '10px'}}>{vehiclesData.car.length} cars currently listed:</p>
                                            <div style={{maxHeight: '150px', overflowY: 'auto', paddingRight: '5px', marginBottom: '15px'}}>
                                                {vehiclesData.car.map(v => (
                                                    <div key={v._id} style={{background: '#111', padding: '10px', borderRadius: '6px', marginBottom: '8px', border: '1px solid #222', textAlign: 'left'}}>
                                                        <h4 style={{margin: '0 0 4px', fontSize: '15px', color: '#fff'}}>{v.name}</h4>
                                                        <p style={{margin: 0, fontSize: '12px', color: '#888'}}>Seats: {v.compatiblePassengers} • {v.details?.substring(0, 30) || 'Standard ride'}...</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <p style={{fontSize: '14px', color: '#ccc'}}>Please <Link to="/login" style={{color: '#e52e71', textDecoration: 'underline'}} onClick={e=>e.stopPropagation()}>Login</Link> to reserve.</p>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div className="service-card" layout onClick={() => handleCardClick('bus')} style={{cursor: 'pointer'}}>
                        <motion.h3 layout>🚌 Bus Rentals</motion.h3>
                        <motion.p layout>Need to transport a large group? Book spacious, well-maintained buses instantly for major events and group travel tours.</motion.p>
                        <AnimatePresence>
                            {expanded.bus && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{overflow: 'hidden'}}>
                                    <hr style={{borderColor: 'rgba(255,255,255,0.1)', margin: '15px 0'}}/>
                                    {loadingType === 'bus' ? <p style={{color: '#888'}}>Pulling inventory...</p> : (
                                        <>
                                            <p style={{color: '#ff8a00', fontWeight: 'bold', fontSize: '16px', marginBottom: '10px'}}>{vehiclesData.bus.length} buses currently listed:</p>
                                            <div style={{maxHeight: '150px', overflowY: 'auto', paddingRight: '5px', marginBottom: '15px'}}>
                                                {vehiclesData.bus.map(v => (
                                                    <div key={v._id} style={{background: '#111', padding: '10px', borderRadius: '6px', marginBottom: '8px', border: '1px solid #222', textAlign: 'left'}}>
                                                        <h4 style={{margin: '0 0 4px', fontSize: '15px', color: '#fff'}}>{v.name}</h4>
                                                        <p style={{margin: 0, fontSize: '12px', color: '#888'}}>Capacity: {v.compatiblePassengers} • {v.details?.substring(0, 30) || 'Standard ride'}...</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <p style={{fontSize: '14px', color: '#ccc'}}>Please <Link to="/login" style={{color: '#e52e71', textDecoration: 'underline'}} onClick={e=>e.stopPropagation()}>Login</Link> to reserve.</p>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </motion.section>

            <motion.section 
                className="how-it-works"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2>How It Works</h2>
                <div className="steps">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h4>Create an Account</h4>
                        <p>Register as a standard User looking for rides, or enlist as an Owner to add your inventory.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h4>Explore or List</h4>
                        <p>Users browse localized rides with advanced filters, while Owners list their vehicles.</p>
                    </div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h4>Hit the Road</h4>
                        <p>Owners approve the incoming bid requests, contact hands are connected securely, and the journey begins!</p>
                    </div>
                </div>
            </motion.section>

            <footer className="footer">
                <p>© 2026 Rheel Platform. Crafted for scalable deployment and secure user-owner integrations.</p>
            </footer>
            
            <style>{`
                .home-container { min-height: 100vh; background: #0d0d0d; display: flex; flex-direction: column; overflow-x: hidden; color: #fff; font-family: 'Inter', sans-serif; }
                .navbar { display: flex; justify-content: space-between; padding: 20px 5vw; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .logo { font-size: 28px; font-weight: 900; background: linear-gradient(90deg, #ff8a00, #e52e71); -webkit-background-clip: text; color: transparent; letter-spacing: -1px; }
                .nav-links { display: flex; align-items: center; gap: 20px; }
                .nav-link { color: #a0a0a0; text-decoration: none; font-weight: 500; transition: color 0.3s; }
                .nav-link:hover { color: #fff; }
                .btn-primary { background: linear-gradient(90deg, #ff8a00, #e52e71); padding: 10px 24px; border-radius: 25px; color: #fff; text-decoration: none; font-weight: 600; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 15px rgba(229, 46, 113, 0.4); }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(229, 46, 113, 0.6); }
                
                .hero { text-align: center; padding: 100px 20px 80px; max-width: 800px; margin: 0 auto; }
                .hero h1 { font-size: clamp(40px, 8vw, 75px); margin-bottom: 20px; line-height: 1.1; letter-spacing: -2px; font-weight: 800; }
                .hero p { font-size: clamp(16px, 2vw, 20px); color: #a0a0a0; margin-bottom: 40px; line-height: 1.6; }
                .hero-buttons { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
                
                .btn-large { background: #fff; color: #000 !important; padding: 16px 40px; border-radius: 30px; font-size: 16px; font-weight: 600; text-decoration: none; transition: transform 0.2s; }
                .btn-large:hover { transform: translateY(-3px); }
                .btn-outline { border: 2px solid rgba(255,255,255,0.2); color: #fff; padding: 14px 40px; border-radius: 30px; font-size: 16px; font-weight: 600; text-decoration: none; transition: background 0.2s, border-color 0.2s; }
                .btn-outline:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.4); }

                .services-section, .how-it-works { padding: 80px 5vw; max-width: 1200px; margin: 0 auto; width: 100%; box-sizing: border-box; }
                .services-section h2, .how-it-works h2 { text-align: center; font-size: clamp(28px, 5vw, 40px); margin-bottom: 50px; font-weight: 700; letter-spacing: -1px; }
                
                .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
                .service-card { background: #151515; padding: 40px 30px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); transition: transform 0.3s; }
                .service-card:hover { transform: translateY(-10px); background: #1a1a1a; border-color: rgba(255,255,255,0.1); }
                .service-card h3 { font-size: 24px; margin-bottom: 15px; font-weight: 600; }
                .service-card p { color: #888; line-height: 1.6; }

                .steps { display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; }
                .step { flex: 1; min-width: 250px; max-width: 300px; text-align: center; padding: 20px; }
                .step-number { width: 60px; height: 60px; background: linear-gradient(90deg, #ff8a00, #e52e71); border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 24px; font-weight: bold; margin: 0 auto 20px; color: white; }
                .step h4 { font-size: 20px; margin-bottom: 15px; font-weight: 600; }
                .step p { color: #888; line-height: 1.6; }

                .footer { text-align: center; padding: 40px 20px; color: #444; border-top: 1px solid rgba(255,255,255,0.05); margin-top: 40px; font-size: 14px; }
            `}</style>
        </div>
    );
};

export default Home;
