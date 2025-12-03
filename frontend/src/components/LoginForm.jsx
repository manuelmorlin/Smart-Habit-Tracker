import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Demo account credentials
const DEMO_CREDENTIALS = {
  email: 'guest@demo.com',
  password: 'GuestDemo2025!'
};

const LoginForm = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGuestLogin, setIsGuestLogin] = useState(false);
  
  const { login, error } = useAuth();
  
  // Update error message when context error changes
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);
  
  // Optimized: unified input handling
  const handleInputChange = useCallback((field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Removed: if (errorMessage) setErrorMessage(''); - error messages remain visible
  }, []);
  
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    
    try {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        setErrorMessage(result.message || 'Login failed. Check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
      setIsGuestLogin(false);
    }
  }, [login, formData.email, formData.password]);

  // Handle guest/demo login
  const handleGuestLogin = useCallback(() => {
    setIsGuestLogin(true);
    setErrorMessage('');
    setFormData({
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password
    });
  }, []);

  // Auto-submit when guest credentials are filled
  useEffect(() => {
    if (isGuestLogin && formData.email === DEMO_CREDENTIALS.email && formData.password === DEMO_CREDENTIALS.password) {
      const submitForm = async () => {
        setIsSubmitting(true);
        try {
          const result = await login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
          if (!result.success) {
            setErrorMessage(result.message || 'Demo login failed. Please try again.');
          }
        } catch (error) {
          console.error('Error during guest login:', error);
          setErrorMessage('An error occurred. Please try again later.');
        } finally {
          setIsSubmitting(false);
          setIsGuestLogin(false);
        }
      };
      submitForm();
    }
  }, [isGuestLogin, formData, login]);
  
  return (
    <div className="auth-form-container">
      <h2 className="auth-title">Sign In</h2>
      <p className="auth-subtitle">Welcome back! Sign in to continue tracking your habits</p>
      
      {errorMessage && (
        <div className="auth-error-message">
          {errorMessage}
        </div>
      )}
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            required
            placeholder="Your email"
            className={errorMessage && errorMessage.toLowerCase().includes('email') ? 'error' : ''}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange('password')}
            required
            placeholder="Your password"
            className={errorMessage && errorMessage.toLowerCase().includes('password') ? 'error' : ''}
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting && !isGuestLogin ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button 
          type="button" 
          className="auth-guest-button"
          onClick={handleGuestLogin}
          disabled={isSubmitting}
        >
          {isSubmitting && isGuestLogin ? (
            <>
              <span className="guest-spinner"></span>
              Entering demo...
            </>
          ) : (
            <>
              <span className="guest-icon">👤</span>
              Try Demo Account
            </>
          )}
        </button>
      </form>
      
      <div className="auth-switch">
        <p>Don't have an account yet?</p>
        <button 
          className="auth-switch-button" 
          onClick={onSwitchToRegister}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
