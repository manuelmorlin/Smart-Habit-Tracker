import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { auth } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import FirebaseService from '../services/firebaseService';

// Create authentication context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get additional user data from Firestore
          const profileResult = await FirebaseService.getUserProfile(firebaseUser.uid);
          
          const userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: profileResult.success ? profileResult.user.name : firebaseUser.displayName || '',
            bio: profileResult.success ? profileResult.user.bio : '',
            goals: profileResult.success ? profileResult.user.goals : '',
            createdAt: profileResult.success ? profileResult.user.createdAt : null
          };
          
          setCurrentUser(userData);
          localStorage.setItem('smartHabitUser', JSON.stringify(userData));
        } else {
          setCurrentUser(null);
          localStorage.removeItem('smartHabitUser');
          localStorage.removeItem('smartHabitToken');
        }
      } catch (err) {
        console.error('Error in auth state change:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get additional user data from Firestore
      const profileResult = await FirebaseService.getUserProfile(firebaseUser.uid);
      
      const userData = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: profileResult.success ? profileResult.user.name : firebaseUser.displayName || '',
        bio: profileResult.success ? profileResult.user.bio : '',
        goals: profileResult.success ? profileResult.user.goals : ''
      };
      
      setCurrentUser(userData);
      localStorage.setItem('smartHabitUser', JSON.stringify(userData));
      
      return { success: true };
    } catch (err) {
      console.error('Error during login:', err);
      let errorMsg = 'An error occurred during login. Please try again later.';
      
      // Handle Firebase auth errors
      switch (err.code) {
        case 'auth/user-not-found':
          errorMsg = 'No account found with this email. Please register first.';
          break;
        case 'auth/wrong-password':
          errorMsg = 'Incorrect password. Check your credentials and try again.';
          break;
        case 'auth/invalid-email':
          errorMsg = 'Please enter a valid email address.';
          break;
        case 'auth/too-many-requests':
          errorMsg = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/invalid-credential':
          errorMsg = 'Invalid credentials. Please check your email and password.';
          break;
      }
      
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Registration function
  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // Basic validation
      if (!name || name.length < 2) {
        setError('Name must contain at least 2 characters');
        return { success: false, message: 'Name must contain at least 2 characters' };
      }
      
      if (!email || !email.includes('@') || !email.includes('.')) {
        setError('Please enter a valid email address');
        return { success: false, message: 'Please enter a valid email address' };
      }
      
      if (!password || password.length < 6) {
        setError('Password must contain at least 6 characters');
        return { success: false, message: 'Password must contain at least 6 characters' };
      }
      
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update display name in Firebase Auth
      await updateProfile(firebaseUser, { displayName: name });
      
      // Create user profile in Firestore
      await FirebaseService.createUserProfile(firebaseUser.uid, {
        name,
        email,
        bio: '',
        goals: ''
      });
      
      const userData = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: name,
        bio: '',
        goals: ''
      };
      
      setCurrentUser(userData);
      localStorage.setItem('smartHabitUser', JSON.stringify(userData));
      
      return { success: true };
    } catch (err) {
      console.error('Error during registration:', err);
      let errorMsg = 'An error occurred during registration. Please try again later.';
      
      // Handle Firebase auth errors
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMsg = 'An account with this email already exists.';
          break;
        case 'auth/invalid-email':
          errorMsg = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          errorMsg = 'Password is too weak. Please use at least 6 characters.';
          break;
      }
      
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to update user profile
  const updateUserProfile = useCallback(async (updatedData) => {
    setError(null);
    try {
      if (!currentUser) {
        throw new Error('No user logged in');
      }
      
      // Update profile in Firestore
      const result = await FirebaseService.updateUserProfile(currentUser.id, updatedData);
      
      if (result.success) {
        const updatedUser = {
          ...currentUser,
          ...updatedData
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('smartHabitUser', JSON.stringify(updatedUser));
        
        // Update display name in Firebase Auth if name changed
        if (updatedData.name && auth.currentUser) {
          await updateProfile(auth.currentUser, { displayName: updatedData.name });
        }
        
        return { success: true };
      } else {
        setError(result.error || 'Profile update failed');
        return { success: false, message: result.error || 'Profile update failed' };
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorMsg = 'An error occurred while updating the profile.';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  }, [currentUser]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      localStorage.removeItem('smartHabitUser');
      localStorage.removeItem('smartHabitToken');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile: updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
