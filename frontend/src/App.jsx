import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import FirebaseService from './services/firebaseService';
import { seedDemoData } from './utils/seedDemoData';
import './styles/App.css';
import './styles/Auth.css';
import './styles/UserProfile.css';
import ConfirmDialog from './components/ConfirmDialog';

// Esponi seedDemoData globalmente per la console
window.seedDemoData = seedDemoData;

function App() {
  const { currentUser, logout } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [deletingOne, setDeletingOne] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, type: null });
  const [pendingHabit, setPendingHabit] = useState(null); // for single delete
  const { addToast } = useToast();

  // Memoized fetch function - depends only on user ID to avoid refetch on profile updates
  const fetchHabits = useCallback(async () => {
    if (!currentUser) {
      setHabits([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await FirebaseService.getHabits(currentUser.id);
      
      if (data.success) {
        setHabits(data.data);
      } else {
        console.error('Failed to fetch habits:', data.error);
        setHabits([]);
      }
    } catch (error) {
      console.error('Error fetching habits:', error);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  // Optimized with useCallback to prevent re-renders
  const toggleHabit = useCallback(async (habitId) => {
    if (!currentUser) return;

    try {
      // Optimistically update the UI
      setHabits(prevHabits => 
        prevHabits.map(habit => {
          if (habit.id !== habitId) return habit;
          
          // Calculate new values
          const willBeCompleted = !habit.today_completed;
          const newWeekChecks = willBeCompleted 
            ? habit.week_checks + 1
            : Math.max(0, habit.week_checks - 1);
          
          const newTotalChecks = willBeCompleted
            ? habit.total_checks + 1
            : Math.max(0, habit.total_checks - 1);
          
          // Calculate percentage dynamically
          const newWeekCompletion = habit.target_frequency > 0 
            ? Math.round((newWeekChecks / habit.target_frequency) * 100)
            : 0;
          
          return {
            ...habit,
            today_completed: willBeCompleted,
            week_checks: newWeekChecks,
            week_completion: Math.min(100, newWeekCompletion),
            total_checks: newTotalChecks
          };
        })
      );

      // Call the API
      await FirebaseService.toggleHabit(currentUser.id, habitId);
      
      // Optionally refresh habits from server
      // fetchHabits();
      
    } catch (error) {
      console.error('Error toggling habit:', error);
      // Revert optimistic update on error
      fetchHabits();
    }
  }, [currentUser, fetchHabits]);

  const addHabit = useCallback(async (habitData) => {
    if (!currentUser) return;

    try {
      const data = await FirebaseService.createHabit(currentUser.id, habitData);
      
      if (data.success) {
        // Add the new habit to the state
        setHabits(prevHabits => [...prevHabits, {
          ...data.data,
          week_checks: 0,
          week_completion: 0,
          today_completed: false,
          total_checks: 0
        }]);
        addToast('Habit created', { type: 'success' });
      } else {
        console.error('Failed to create habit:', data.error);
        addToast('Failed to create habit', { type: 'error' });
      }
    } catch (error) {
      console.error('Error creating habit:', error);
      addToast('Error while creating', { type: 'error' });
    }
  }, [currentUser]);

  // Function to update a habit
  const updateHabit = useCallback(async (habitId, habitData) => {
    if (!currentUser) return;
    
    try {
      const data = await FirebaseService.updateHabit(currentUser.id, habitId, habitData);
      
      if (data.success && data.habit) {
        // Update local state with the updated habit
        setHabits(prevHabits => 
          prevHabits.map(habit => 
            habit.id === habitId ? { ...habit, ...data.habit } : habit
          )
        );
        addToast('Habit updated', { type: 'success' });
      } else {
        console.error('Failed to update habit:', data.error);
        addToast('Failed to update habit', { type: 'error' });
        throw new Error(data.error || 'Failed to update habit');
      }
    } catch (error) {
      console.error('Error updating habit:', error);
      addToast('Error while updating', { type: 'error' });
      throw error;
    }
  }, [currentUser, addToast]);

  // Function to delete a habit
  const doDeleteHabit = useCallback(async () => {
    if (!currentUser || !pendingHabit) return;
    try {
      setDeletingOne(true);
      await FirebaseService.deleteHabit(currentUser.id, pendingHabit.id);
      setHabits(prev => prev.filter(h => h.id !== pendingHabit.id));
      addToast(`Habit "${pendingHabit.name ?? ''}" deleted`, { type: 'success' });
    } catch (error) {
      console.error('Error deleting habit:', error);
      addToast('Failed to delete habit. Try again.', { type: 'error' });
      fetchHabits();
    } finally {
      setDeletingOne(false);
      setPendingHabit(null);
      setConfirm({ open: false, type: null });
    }
  }, [currentUser, pendingHabit, fetchHabits, addToast]);

  // Open confirm for single delete
  const deleteHabit = useCallback((habitId) => {
    const habit = habits.find(h => h.id === habitId);
    setPendingHabit(habit ? { id: habit.id, name: habit.name } : { id: habitId });
    setConfirm({ open: true, type: 'delete' });
  }, [habits]);

  // Function to reset all progress (useful for demo)
  const doResetAllProgress = useCallback(async () => {
    if (!currentUser) return;
    try {
      setResetting(true);
      setHabits(prev => prev.map(h => ({
        ...h,
        today_completed: false,
        week_checks: 0,
        week_completion: 0
      })));
      await FirebaseService.resetProgress(currentUser.id);
      await fetchHabits();
      addToast('Progress reset successfully', { type: 'success' });
    } catch (error) {
      console.error('Error resetting progress:', error);
      addToast('Error resetting progress', { type: 'error' });
      fetchHabits();
    } finally {
      setResetting(false);
      setConfirm({ open: false, type: null });
    }
  }, [currentUser, fetchHabits, addToast]);

  const resetAllProgress = useCallback(() => {
    setConfirm({ open: true, type: 'reset' });
  }, []);

  // Function to delete all habits
  const doDeleteAllHabits = useCallback(async () => {
    if (!currentUser) return;
    try {
      setDeletingAll(true);
      setHabits([]);
      await FirebaseService.deleteAllHabits(currentUser.id);
      await fetchHabits();
      addToast('All habits have been deleted', { type: 'success' });
    } catch (error) {
      console.error('Error deleting all habits:', error);
      addToast('Deletion failed. Try again.', { type: 'error' });
      fetchHabits();
    } finally {
      setDeletingAll(false);
      setConfirm({ open: false, type: null });
    }
  }, [currentUser, fetchHabits, addToast]);

  const deleteAllHabits = useCallback(() => {
    setConfirm({ open: true, type: 'deleteAll' });
  }, []);

  // Logout confirmation and action
  const doLogout = useCallback(() => {
    logout();
    addToast('Logged out', { type: 'success' });
    setConfirm({ open: false, type: null });
  }, [logout, addToast]);

  const requestLogout = useCallback(() => {
    setConfirm({ open: true, type: 'logout' });
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  // Memoized loading component
  const loadingComponent = useMemo(() => (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading habits...</p>
    </div>
  ), []);

  if (loading) {
    return loadingComponent;
  }

  return (
    <div className="App">
      <Dashboard 
        habits={habits}
        onToggleHabit={toggleHabit}
        onAddHabit={addHabit}
        onUpdateHabit={updateHabit}
        onDeleteHabit={deleteHabit}
        onResetProgress={resetAllProgress}
        onDeleteAllHabits={deleteAllHabits}
        onLogout={requestLogout}
        isResetting={resetting}
        isDeletingAll={deletingAll}
      />
      <ConfirmDialog
        open={confirm.open}
        title={
          confirm.type === 'reset' ? 'Reset progress' :
          confirm.type === 'deleteAll' ? 'Delete all habits' :
          confirm.type === 'delete' ? 'Delete habit' :
          'Confirm logout'
        }
        message={
          confirm.type === 'reset'
            ? 'Are you sure you want to reset progress for all habits? This does not delete habits and cannot be undone.'
            : confirm.type === 'deleteAll'
              ? 'Are you sure you want to delete ALL habits? This action is irreversible.'
              : confirm.type === 'delete'
                ? `Permanently delete habit \"${pendingHabit?.name ?? ''}\"?`
                : 'Do you want to log out?'
        }
        confirmLabel={
          confirm.type === 'reset' ? 'Reset' :
          confirm.type === 'deleteAll' ? 'Delete all' :
          confirm.type === 'delete' ? 'Delete' :
          'Logout'
        }
        cancelLabel="Cancel"
        onConfirm={
          confirm.type === 'reset' ? doResetAllProgress :
          confirm.type === 'deleteAll' ? doDeleteAllHabits :
          confirm.type === 'delete' ? doDeleteHabit :
          doLogout
        }
        onCancel={() => setConfirm({ open: false, type: null })}
        loading={confirm.type === 'reset' ? resetting : confirm.type === 'deleteAll' ? deletingAll : confirm.type === 'delete' ? deletingOne : false}
      />
    </div>
  );
}

// Main App wrapper with authentication provider
function AppWithAuth() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </ToastProvider>
  );
}

// Component that handles authentication
function AuthenticatedApp() {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return currentUser ? <App /> : <AuthPage />;
}

export default AppWithAuth;
