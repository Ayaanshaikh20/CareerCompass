import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Registration = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        personal: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            location: '',
            password: '',
        },
        education: {
            degree: '',
            institution: '',
            graduationYear: '',
            percentage: '',
        },
        experience: {
            company: '',
            role: '',
            years: '',
            currentJob: false,
        },
        resume: null,
    });

    const steps = [
        {
            title: 'Personal Information',
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            value={formData.personal.firstName}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                personal: {
                                    ...prev.personal,
                                    firstName: e.target.value
                                }
                            }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            value={formData.personal.lastName}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                personal: {
                                    ...prev.personal,
                                    lastName: e.target.value
                                }
                            }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.personal.email}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                personal: {
                                    ...prev.personal,
                                    email: e.target.value
                                }
                            }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            value={formData.personal.phone}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                personal: {
                                    ...prev.personal,
                                    phone: e.target.value
                                }
                            }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            value={formData.personal.location}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                personal: {
                                    ...prev.personal,
                                    location: e.target.value
                                }
                            }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="col-span-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={formData.personal.password}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                personal: {
                                    ...prev.personal,
                                    password: e.target.value
                                }
                            }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            minLength="6"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                            Must be at least 6 characters long
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Education',
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
                            Degree
                        </label>
                        <input
                            type="text"
                            id="degree"
                            value={formData.education.degree}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                education: {
                                    ...prev.education,
                                    degree: e.target.value
                                }
                            }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
                            Institution
                        </label>
                        <input
                            type="text"
                            id="institution"
                            value={formData.education.institution}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                education: {
                                    ...prev.education,
                                    institution: e.target.value
                                }
                            }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
                            Graduation Year
                        </label>
                        <input
                            type="number"
                            id="graduationYear"
                            value={formData.education.graduationYear}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                education: {
                                    ...prev.education,
                                    graduationYear: e.target.value
                                }
                            }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="percentage" className="block text-sm font-medium text-gray-700 mb-1">
                            Percentage
                        </label>
                        <input
                            type="number"
                            id="percentage"
                            value={formData.education.percentage}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                education: {
                                    ...prev.education,
                                    percentage: e.target.value
                                }
                            }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>
            ),
        },
        {
            title: 'Experience',
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                            Company
                        </label>
                        <input
                            type="text"
                            id="company"
                            value={formData.experience.company}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                experience: {
                                    ...prev.experience,
                                    company: e.target.value
                                }
                            }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <input
                            type="text"
                            id="role"
                            value={formData.experience.role}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                experience: {
                                    ...prev.experience,
                                    role: e.target.value
                                }
                            }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="years" className="block text-sm font-medium text-gray-700 mb-1">
                            Years of Experience
                        </label>
                        <input
                            type="number"
                            id="years"
                            value={formData.experience.years}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                experience: {
                                    ...prev.experience,
                                    years: e.target.value
                                }
                            }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="currentJob"
                            checked={formData.experience.currentJob}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                experience: {
                                    ...prev.experience,
                                    currentJob: e.target.checked
                                }
                            }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="currentJob" className="ml-2 block text-sm text-gray-700">
                            Currently Working Here
                        </label>
                    </div>
                </div>
            ),
        },
        {
            title: 'Resume Upload',
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                            Upload Resume
                        </label>
                        <input
                            type="file"
                            id="resume"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                resume: e.target.files[0]
                            }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="col-span-2 text-sm text-gray-500">
                        Supported formats: PDF, DOC, DOCX (Max size: 5MB)
                    </div>
                </div>
            ),
        },
    ];

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your registration logic here
        console.log('Registration data:', formData);
        onClose();
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[500px] flex flex-col p-6"
            >
                <div className="flex-1 overflow-y-auto">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Register</h2>
                        <p className="text-gray-500">Step {currentStep} of {steps.length}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {steps[currentStep - 1].content}
                    </form>
                </div>

                <div className="flex justify-between mt-6">
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={handleBack}
                            className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
                        >
                            Back
                        </button>
                    )}
                    {currentStep < steps.length ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-200"
                        >
                            Register
                        </button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Registration;
