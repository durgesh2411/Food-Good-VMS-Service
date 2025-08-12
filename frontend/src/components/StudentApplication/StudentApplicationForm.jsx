import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, User, Home, GraduationCap, IndianRupee, Phone, Mail, Calendar, MapPin, Heart } from "lucide-react";
import { backendUrl } from "../../lib/constant.js";
import { useNavigate } from "react-router-dom";

const StudentApplicationForm = ({ isOpen = true, onClose = () => {} }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    gender: '',
    category: '',
    religion: '',
    
    // Contact Information
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Educational Background
    tenthBoard: '',
    tenthYear: '',
    tenthPercentage: '',
    twelfthBoard: '',
    twelfthYear: '',
    twelfthPercentage: '',
    twelfthSubjects: '',
    previousNEETAttempts: '',
    previousNEETScore: '',
    
    // Family & Economic Background
    fatherOccupation: '',
    motherOccupation: '',
    familyIncome: '',
    numberOfSiblings: '',
    economicCategory: '',
    
    // Motivation & Goals
    whyNEET: '',
    careerGoals: '',
    challenges: '',
    howDidYouKnow: '',
    
    // Documents
    profilePhoto: null,
    tenthMarksheet: null,
    twelfthMarksheet: null,
    incomeProof: null,
    casteProof: null,
    aadhaarCard: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.fullName && formData.fatherName && formData.dateOfBirth && 
               formData.gender && formData.category;
      case 2:
        return formData.email && formData.phone && formData.address && 
               formData.city && formData.state && formData.pincode;
      case 3:
        return formData.tenthBoard && formData.tenthYear && formData.tenthPercentage &&
               formData.twelfthBoard && formData.twelfthYear && formData.twelfthPercentage;
      case 4:
        return formData.fatherOccupation && formData.familyIncome && formData.economicCategory;
      case 5:
        return formData.whyNEET && formData.careerGoals;
      case 6:
        return formData.profilePhoto && formData.tenthMarksheet && formData.twelfthMarksheet &&
               formData.incomeProof && formData.aadhaarCard;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(6)) {
      alert('Please fill all required fields and upload necessary documents.');
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData = new FormData();
      
      // Add all form data
      Object.keys(formData).forEach(key => {
        if (formData[key] instanceof File) {
          submissionData.append(key, formData[key]);
        } else if (formData[key]) {
          submissionData.append(key, formData[key]);
        }
      });

      const response = await fetch(`${backendUrl}/api/student-application`, {
        method: 'POST',
        body: submissionData,
        credentials: 'include'
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form after 3 seconds
        setTimeout(() => {
          if (window.location.pathname === '/apply-neet') {
            navigate('/');
          } else {
            onClose();
          }
          setFormData({});
          setCurrentStep(1);
          setSubmitStatus(null);
        }, 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    }
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  if (submitStatus === 'success') {
    return (
      <div className={window.location.pathname === '/apply-neet' 
        ? "min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4" 
        : "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      }>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-lg p-8 text-center max-w-md mx-auto"
        >
          <div className="text-green-500 text-6xl mb-4">
            <Heart className="mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Application Submitted Successfully!</h3>
          <p className="text-gray-600 mb-4">
            Thank you for applying to Lift for Upliftment NEET Preparation Program. 
            Our team will review your application and contact you within 7 working days.
          </p>
          <p className="text-sm text-gray-500">
            Application ID: LFU-{Date.now()}
          </p>
        </motion.div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Contact Details', icon: Phone },
    { number: 3, title: 'Education', icon: GraduationCap },
    { number: 4, title: 'Family Background', icon: Home },
    { number: 5, title: 'Motivation', icon: Heart },
    { number: 6, title: 'Documents', icon: FileText }
  ];

  return (
    <div className={window.location.pathname === '/apply-neet' 
      ? "min-h-screen bg-gray-50 py-8 px-4" 
      : "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    }>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={window.location.pathname === '/apply-neet'
          ? "bg-white rounded-lg shadow-2xl w-full max-w-4xl mx-auto overflow-hidden"
          : "bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] overflow-hidden"
        }
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">NEET Preparation Application</h2>
              <p className="text-blue-100">Lift for Upliftment - Free Coaching Program</p>
            </div>
            <button 
              onClick={() => {
                if (window.location.pathname === '/apply-neet') {
                  navigate('/');
                } else {
                  onClose();
                }
              }}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex justify-between mt-6">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                  ${currentStep >= step.number ? 'bg-white text-indigo-600' : 'bg-indigo-500 text-white'}`}>
                  {currentStep > step.number ? '✔' : step.number}
                </div>
                <span className="text-xs mt-1 text-center">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto h-[calc(90vh-200px)]">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <User className="mr-2" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Father's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => handleInputChange('fatherName', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter father's name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mother's Name
                  </label>
                  <input
                    type="text"
                    value={formData.motherName}
                    onChange={(e) => handleInputChange('motherName', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter mother's name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="general">General</option>
                    <option value="obc">OBC</option>
                    <option value="sc">SC</option>
                    <option value="st">ST (Tribal)</option>
                    <option value="ews">EWS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Religion
                  </label>
                  <input
                    type="text"
                    value={formData.religion}
                    onChange={(e) => handleInputChange('religion', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter religion"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Phone className="mr-2" /> Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter 10-digit mobile number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alternate Number
                  </label>
                  <input
                    type="tel"
                    value={formData.alternatePhone}
                    onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Alternate contact number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select State</option>
                    <option value="maharashtra">Maharashtra</option>
                    <option value="karnataka">Karnataka</option>
                    <option value="andhra pradesh">Andhra Pradesh</option>
                    <option value="telangana">Telangana</option>
                    <option value="gujarat">Gujarat</option>
                    <option value="madhya pradesh">Madhya Pradesh</option>
                    <option value="rajasthan">Rajasthan</option>
                    <option value="uttar pradesh">Uttar Pradesh</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter PIN code"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complete Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Enter complete address with landmarks"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Educational Background */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <GraduationCap className="mr-2" /> Educational Background
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <h4 className="text-lg font-medium text-gray-700 mb-3">Class 10th Details</h4>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Board <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.tenthBoard}
                    onChange={(e) => handleInputChange('tenthBoard', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., CBSE, ICSE, State Board"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year of Passing <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.tenthYear}
                    onChange={(e) => handleInputChange('tenthYear', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2022"
                    min="2018"
                    max="2025"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Percentage <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.tenthPercentage}
                    onChange={(e) => handleInputChange('tenthPercentage', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter percentage"
                    min="0"
                    max="100"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="md:col-span-2 mt-6">
                  <h4 className="text-lg font-medium text-gray-700 mb-3">Class 12th Details</h4>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Board <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.twelfthBoard}
                    onChange={(e) => handleInputChange('twelfthBoard', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., CBSE, ICSE, State Board"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year of Passing <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.twelfthYear}
                    onChange={(e) => handleInputChange('twelfthYear', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2024"
                    min="2020"
                    max="2025"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Percentage <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.twelfthPercentage}
                    onChange={(e) => handleInputChange('twelfthPercentage', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter percentage"
                    min="0"
                    max="100"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjects (PCB) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.twelfthSubjects}
                    onChange={(e) => handleInputChange('twelfthSubjects', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Physics, Chemistry, Biology, Mathematics"
                    required
                  />
                </div>
                
                <div className="md:col-span-2 mt-6">
                  <h4 className="text-lg font-medium text-gray-700 mb-3">NEET Attempt History</h4>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Previous NEET Attempts
                  </label>
                  <select
                    value={formData.previousNEETAttempts}
                    onChange={(e) => handleInputChange('previousNEETAttempts', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="0">First Time Appearing</option>
                    <option value="1">1 Attempt</option>
                    <option value="2">2 Attempts</option>
                    <option value="3">3 or More Attempts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Best NEET Score (if any)
                  </label>
                  <input
                    type="number"
                    value={formData.previousNEETScore}
                    onChange={(e) => handleInputChange('previousNEETScore', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter score out of 720"
                    min="0"
                    max="720"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Family & Economic Background */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Home className="mr-2" /> Family & Economic Background
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Father's Occupation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fatherOccupation}
                    onChange={(e) => handleInputChange('fatherOccupation', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Farmer, Daily Wage Worker, etc."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mother's Occupation
                  </label>
                  <input
                    type="text"
                    value={formData.motherOccupation}
                    onChange={(e) => handleInputChange('motherOccupation', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Housewife, Worker, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Family Income <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.familyIncome}
                    onChange={(e) => handleInputChange('familyIncome', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Income Range</option>
                    <option value="below-1-lakh">Below ₹1 Lakh</option>
                    <option value="1-2-lakh">₹1-2 Lakh</option>
                    <option value="2-3-lakh">₹2-3 Lakh</option>
                    <option value="above-3-lakh">Above ₹3 Lakh (Need special consideration)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Siblings
                  </label>
                  <input
                    type="number"
                    value={formData.numberOfSiblings}
                    onChange={(e) => handleInputChange('numberOfSiblings', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter number of siblings"
                    min="0"
                    max="10"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Economic Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.economicCategory}
                    onChange={(e) => handleInputChange('economicCategory', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Economic Category</option>
                    <option value="bpl">Below Poverty Line (BPL)</option>
                    <option value="ews">Economically Weaker Section (EWS)</option>
                    <option value="tribal">Tribal Community</option>
                    <option value="minority">Minority Community</option>
                    <option value="other">Other (Please specify in challenges section)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Motivation & Goals */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Heart className="mr-2" /> Motivation & Goals
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you want to pursue NEET/Medical Career? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.whyNEET}
                    onChange={(e) => handleInputChange('whyNEET', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="Explain your motivation and passion for medical career..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Career Goals & Dreams <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.careerGoals}
                    onChange={(e) => handleInputChange('careerGoals', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    placeholder="What are your long-term career goals? Which medical field interests you?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Challenges You Face
                  </label>
                  <textarea
                    value={formData.challenges}
                    onChange={(e) => handleInputChange('challenges', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="What challenges do you face in pursuing NEET preparation? (Financial, accessibility, etc.)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How did you know about Lift for Upliftment?
                  </label>
                  <select
                    value={formData.howDidYouKnow}
                    onChange={(e) => handleInputChange('howDidYouKnow', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Source</option>
                    <option value="social-media">Social Media</option>
                    <option value="friend-family">Friend/Family Reference</option>
                    <option value="school">School/Teacher</option>
                    <option value="newspaper">Newspaper/Advertisement</option>
                    <option value="website">Website/Google Search</option>
                    <option value="community">Community Program</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Document Upload */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="mr-2" /> Required Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'profilePhoto', label: 'Profile Photo', required: true },
                  { key: 'tenthMarksheet', label: '10th Marksheet', required: true },
                  { key: 'twelfthMarksheet', label: '12th Marksheet', required: true },
                  { key: 'incomeProof', label: 'Income Certificate', required: true },
                  { key: 'casteProof', label: 'Caste Certificate (if applicable)', required: false },
                  { key: 'aadhaarCard', label: 'Aadhaar Card', required: true }
                ].map((doc) => (
                  <div key={doc.key} className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {doc.label} {doc.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(doc.key, e.target.files[0])}
                      className="w-full p-2 text-sm text-gray-500"
                      accept=".pdf,.jpg,.jpeg,.png"
                      required={doc.required}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Accepted formats: PDF, JPG, PNG (Max 5MB)
                    </p>
                    {formData[doc.key] && (
                      <p className="text-xs text-green-600 mt-1">
                        ✔ {formData[doc.key].name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg mt-6">
                <h4 className="font-semibold text-blue-800 mb-2">Important Note:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• All documents should be clear and readable</li>
                  <li>• Income certificate should be issued by competent authority</li>
                  <li>• Make sure all information matches across documents</li>
                  <li>• Original documents will be verified during interview</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Step {currentStep} of 6
          </div>
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
            )}
            {currentStep < 6 ? (
              <button
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
                className={`px-6 py-2 rounded-lg text-white font-medium
                  ${validateStep(currentStep) 
                    ? 'bg-indigo-600 hover:bg-indigo-700' 
                    : 'bg-gray-400 cursor-not-allowed'}`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !validateStep(6)}
                className={`px-6 py-2 rounded-lg text-white font-medium
                  ${!isSubmitting && validateStep(6)
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-gray-400 cursor-not-allowed'}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentApplicationForm;
