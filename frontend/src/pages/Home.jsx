import React, { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { FaCompass } from 'react-icons/fa';
import Login from './Login';
import Registration from './Registration';

const Navbar = ({ onLoginClick, onRegistrationClick }) => (
    <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
                <div className="flex items-center">
                    <div className="flex items-center space-x-1">
                        <span className="text-2xl font-bold text-gray-800">Career</span>
                        <span className="text-2xl font-bold text-gray-800">C</span>
                        <FaCompass className="w-5 h-5 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-800">mpass</span>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onLoginClick}
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                        Login
                    </button>
                    <button
                        onClick={onRegistrationClick}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    </nav>
);

const HeroSection = () => (
    <div className="relative overflow-hidden bg-gray-100">
        <div className="absolute inset-0">
            <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80"
                alt="Map with waypoints and direction"
                className="w-full h-full object-cover opacity-30"
            />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
                >
                    Track Your Job Applications
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
                >
                    Stay organized and informed throughout your job search journey with CareerCompass
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8"
                >
                    <div className="rounded-md shadow">
                        <Link
                            to="/register"
                            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                        >
                            Get Started
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    </div>
);

const FeatureCard = ({ icon, title, description }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300"
    >
        <div className="text-4xl text-blue-600 mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </motion.div>
);

const Home = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

    const handleLoginClick = () => {
        setIsLoginOpen(true);
    };

    const handleCloseLogin = () => {
        setIsLoginOpen(false);
    };

    const handleRegistrationClick = () => {
        setIsRegistrationOpen(true);
    };

    const handleCloseRegistration = () => {
        setIsRegistrationOpen(false);
    };

    return (
        <>
            {
                isLoginOpen && (
                    <Login onClose={handleCloseLogin} />
                )
            }
            {
                isRegistrationOpen && (
                    <Registration onClose={handleCloseRegistration} />
                )
            }
            <div className="min-h-screen bg-gray-100">
                <Navbar 
                onLoginClick={handleLoginClick} 
                onRegistrationClick={handleRegistrationClick} 
            />
                <HeroSection />

                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-lg shadow-md p-6 mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is CareerCompass?</h2>
                            <p className="text-gray-600 mb-8">
                                CareerCompass is your personal job application tracker designed to help you manage and organize your job search journey. Easily track all your applications across different platforms like LinkedIn, Monster, Naukri.com, and more.
                            </p>

                            <h3 className="text-xl font-semibold text-gray-800 mb-8">Key Features</h3>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                <FeatureCard
                                    icon="🎯"
                                    title="Application Tracking"
                                    description="Track all your job applications in one place with detailed status updates"
                                />
                                <FeatureCard
                                    icon="🔗"
                                    title="Link Management"
                                    description="Save and organize job post links for easy access and reference"
                                />
                                <FeatureCard
                                    icon="📊"
                                    title="Progress Tracking"
                                    description="Monitor your application progress with visual timelines and status updates"
                                />
                                <FeatureCard
                                    icon="📝"
                                    title="Notes & Reminders"
                                    description="Keep important notes and set reminders for follow-ups and interviews"
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-6">How It Works</h3>
                            <ol className="list-decimal list-inside text-gray-600 space-y-4">
                                <li>Add job applications with links to the original postings</li>
                                <li>Track application status from application to interview</li>
                                <li>Set reminders for follow-ups and interviews</li>
                                <li>Keep notes on each application for better organization</li>
                            </ol>
                        </div>
                    </div>
                </main>

                <div className="bg-gray-50 py-12">
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Ready to Get Started?</h3>
                            <p className="text-gray-600 mb-8">Join thousands of job seekers who have successfully organized their job search with CareerCompass</p>
                            <div className="flex justify-center">
                                <button
                                    onClick={handleRegistrationClick}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Start Tracking Your Applications
                                    <ChevronRightIcon className="ml-2 h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;