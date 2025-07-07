import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Upload, 
  Camera, 
  User, 
  Mail, 
  AtSign, 
  Check, 
  X,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { useAppStore } from '../../store/appStore';
import toast from 'react-hot-toast';

interface SignupPageProps {
  onBack: () => void;
  walletAddress: string | null;
}

interface FormData {
  username: string;
  displayName: string;
  email: string;
  profilePicture: string | null;
}

interface ValidationErrors {
  username?: string;
  displayName?: string;
  email?: string;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onBack, walletAddress }) => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    displayName: '',
    email: '',
    profilePicture: null,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setCurrentUser, setAuthenticated } = useAppStore();

  const validateField = (field: keyof FormData, value: string): string | undefined => {
    switch (field) {
      case 'username':
        if (!value.trim()) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (value.length > 20) return 'Username must be less than 20 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
        return undefined;
      
      case 'displayName':
        if (!value.trim()) return 'Display name is required';
        if (value.length < 2) return 'Display name must be at least 2 characters';
        if (value.length > 50) return 'Display name must be less than 50 characters';
        return undefined;
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return undefined;
      
      default:
        return undefined;
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (field in errors) {
      setErrors(prev => ({ ...prev, [field as keyof ValidationErrors]: undefined }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    const error = validateField(field, formData[field] as string);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploadingImage(true);
    
    try {
      // Simulate image upload and processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create object URL for preview
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, profilePicture: imageUrl }));
      toast.success('Profile picture uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const removeProfilePicture = () => {
    if (formData.profilePicture) {
      URL.revokeObjectURL(formData.profilePicture);
      setFormData(prev => ({ ...prev, profilePicture: null }));
    }
  };

  const validateStep = (step: number): boolean => {
    const stepErrors: ValidationErrors = {};
    
    if (step === 1) {
      stepErrors.username = validateField('username', formData.username);
      stepErrors.displayName = validateField('displayName', formData.displayName);
      stepErrors.email = validateField('email', formData.email);
    }
    
    setErrors(stepErrors);
    return !Object.values(stepErrors).some(error => error);
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(1)) return;
    
    setIsLoading(true);
    
    try {
      // Simulate account creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create user object
      const newUser = {
        id: Date.now().toString(),
        username: formData.username,
        displayName: formData.displayName,
        avatar: formData.profilePicture || `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`,
        followerCount: 0,
        followingCount: 0,
        subscriberCount: 0,
        tier: 'bronze' as const,
        isLiveStreaming: false,
        walletAddress,
      };
      
      setCurrentUser(newUser);
      setAuthenticated(true);
      toast.success('Welcome to FLUX! Your account has been created successfully.');
    } catch (error) {
      toast.error('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepProgress = () => (currentStep / 2) * 100;

  const isStepValid = (step: number) => {
    if (step === 1) {
      return formData.username && formData.displayName && formData.email && 
             !errors.username && !errors.displayName && !errors.email;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-flux-bg-primary relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-flux-primary/20 via-transparent to-flux-accent-purple/20" />
        
        {/* Animated Background Shapes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 bg-flux-primary/10 rounded-full blur-xl"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6"
        >
          <div className="flex items-center justify-between max-w-md mx-auto">
            <Button variant="ghost" onClick={onBack} className="text-flux-text-primary">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div className="text-2xl font-bold bg-flux-gradient bg-clip-text text-transparent">
              FLUX
            </div>
            <div className="w-16" /> {/* Spacer */}
          </div>
        </motion.header>

        {/* Progress Bar */}
        <div className="px-6 mb-8">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-flux-text-secondary text-sm">Step {currentStep} of 2</span>
              <span className="text-flux-text-secondary text-sm">{Math.round(getStepProgress())}%</span>
            </div>
            <div className="w-full bg-flux-bg-tertiary rounded-full h-2">
              <motion.div
                className="bg-flux-gradient h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getStepProgress()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-16 h-16 bg-flux-gradient rounded-2xl flex items-center justify-center mx-auto mb-4"
                    >
                      <User className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-flux-text-primary mb-2">
                      Create Your Profile
                    </h1>
                    <p className="text-flux-text-secondary">
                      Complete your profile details for your wallet-secured account
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Username */}
                    <div>
                      <label className="block text-sm font-medium text-flux-text-primary mb-2">
                        Username *
                      </label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-flux-text-secondary" />
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => handleInputChange('username', e.target.value.toLowerCase())}
                          onBlur={() => handleBlur('username')}
                          placeholder="your_username"
                          className={`w-full pl-10 pr-4 py-3 bg-flux-bg-secondary text-flux-text-primary rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                            errors.username 
                              ? 'ring-2 ring-flux-accent-red' 
                              : 'focus:ring-flux-primary'
                          }`}
                          maxLength={20}
                        />
                        {formData.username && !errors.username && (
                          <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-flux-accent-green" />
                        )}
                      </div>
                      {errors.username && (
                        <p className="text-flux-accent-red text-sm mt-1">{errors.username}</p>
                      )}
                      <p className="text-flux-text-secondary text-xs mt-1">
                        This will be your unique identifier on FLUX
                      </p>
                    </div>

                    {/* Display Name */}
                    <div>
                      <label className="block text-sm font-medium text-flux-text-primary mb-2">
                        Display Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-flux-text-secondary" />
                        <input
                          type="text"
                          value={formData.displayName}
                          onChange={(e) => handleInputChange('displayName', e.target.value)}
                          onBlur={() => handleBlur('displayName')}
                          placeholder="Your Display Name"
                          className={`w-full pl-10 pr-4 py-3 bg-flux-bg-secondary text-flux-text-primary rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                            errors.displayName 
                              ? 'ring-2 ring-flux-accent-red' 
                              : 'focus:ring-flux-primary'
                          }`}
                          maxLength={50}
                        />
                        {formData.displayName && !errors.displayName && (
                          <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-flux-accent-green" />
                        )}
                      </div>
                      {errors.displayName && (
                        <p className="text-flux-accent-red text-sm mt-1">{errors.displayName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-flux-text-primary mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-flux-text-secondary" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          onBlur={() => handleBlur('email')}
                          placeholder="your@email.com"
                          className={`w-full pl-10 pr-4 py-3 bg-flux-bg-secondary text-flux-text-primary rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                            errors.email 
                              ? 'ring-2 ring-flux-accent-red' 
                              : 'focus:ring-flux-primary'
                          }`}
                        />
                        {formData.email && !errors.email && (
                          <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-flux-accent-green" />
                        )}
                      </div>
                      {errors.email && (
                        <p className="text-flux-accent-red text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleNextStep}
                    disabled={!isStepValid(1)}
                    className="w-full bg-flux-gradient hover:opacity-90 text-white py-3 text-lg font-semibold"
                  >
                    Continue
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Profile Picture */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-16 h-16 bg-flux-gradient rounded-2xl flex items-center justify-center mx-auto mb-4"
                    >
                      <Sparkles className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-flux-text-primary mb-2">
                      Add Your Photo
                    </h1>
                    <p className="text-flux-text-secondary">
                      Help others recognize you with a profile picture
                    </p>
                  </div>

                  {/* Profile Picture Upload */}
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-32 h-32 mx-auto mb-6">
                        {formData.profilePicture ? (
                          <div className="relative">
                            <Avatar
                              src={formData.profilePicture}
                              alt={formData.displayName}
                              size="xl"
                              className="w-32 h-32"
                            />
                            <button
                              onClick={removeProfilePicture}
                              className="absolute -top-2 -right-2 w-8 h-8 bg-flux-accent-red rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-32 h-32 bg-flux-bg-secondary rounded-full flex items-center justify-center border-2 border-dashed border-flux-bg-tertiary">
                            {isUploadingImage ? (
                              <Loader2 className="w-8 h-8 text-flux-text-secondary animate-spin" />
                            ) : (
                              <Camera className="w-8 h-8 text-flux-text-secondary" />
                            )}
                          </div>
                        )}
                      </div>
                      
                      {!isUploadingImage && (
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          variant="secondary"
                          className="mb-4"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {formData.profilePicture ? 'Change Photo' : 'Upload Photo'}
                        </Button>
                      )}
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                    
                    <p className="text-flux-text-secondary text-sm">
                      JPG, PNG or GIF. Max size 5MB.
                    </p>
                  </div>

                  {/* Account Summary */}
                  <div className="bg-flux-bg-secondary rounded-xl p-6 space-y-3">
                    <h3 className="text-lg font-semibold text-flux-text-primary mb-4">
                      Account Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-flux-text-secondary">Username:</span>
                        <span className="text-flux-text-primary">@{formData.username}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-flux-text-secondary">Display Name:</span>
                        <span className="text-flux-text-primary">{formData.displayName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-flux-text-secondary">Email:</span>
                        <span className="text-flux-text-primary">{formData.email}</span>
                      </div>
                      {walletAddress && (
                        <div className="flex justify-between">
                          <span className="text-flux-text-secondary">Wallet:</span>
                          <span className="text-flux-text-primary font-mono text-sm">
                            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={handlePrevStep}
                      variant="secondary"
                      className="flex-1 py-3"
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      isLoading={isLoading}
                      className="flex-1 bg-flux-gradient hover:opacity-90 text-white py-3 font-semibold"
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </div>

                  <p className="text-center text-flux-text-secondary text-sm">
                    By creating an account, you agree to our{' '}
                    <button className="text-flux-primary hover:underline">Terms of Service</button>
                    {' '}and{' '}
                    <button className="text-flux-primary hover:underline">Privacy Policy</button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};