// Firebase Realtime Database service for habit-related operations
import { db } from '../config/firebase';
import {
  ref,
  get,
  set,
  push,
  update,
  remove,
  query,
  orderByChild
} from 'firebase/database';

class FirebaseService {
  // ==================== HABITS ====================

  // Get all habits for a user
  static async getHabits(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const habitsRef = ref(db, `users/${userId}/habits`);
      const snapshot = await get(habitsRef);

      const habits = [];
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      if (snapshot.exists()) {
        const habitsData = snapshot.val();
        
        for (const [habitId, habitData] of Object.entries(habitsData)) {
          // Get checks for this habit
          let totalChecks = 0;
          let weekChecks = 0;
          let todayCompleted = false;

          if (habitData.checks) {
            for (const checkData of Object.values(habitData.checks)) {
              if (checkData.completed) {
                totalChecks++;
                const checkDate = checkData.date;
                if (checkDate === today) {
                  todayCompleted = true;
                }
                if (new Date(checkDate) >= weekAgo) {
                  weekChecks++;
                }
              }
            }
          }

          const targetFrequency = habitData.targetFrequency || 7;
          const weekCompletion = targetFrequency > 0 
            ? Math.round((weekChecks / targetFrequency) * 100) 
            : 0;

          habits.push({
            id: habitId,
            name: habitData.name,
            description: habitData.description || '',
            color: habitData.color || '#007bff',
            icon: habitData.icon || '📋',
            targetFrequency: targetFrequency,
            isActive: habitData.isActive !== false,
            createdAt: habitData.createdAt,
            total_checks: totalChecks,
            week_checks: weekChecks,
            today_completed: todayCompleted,
            week_completion: weekCompletion,
            target_frequency: targetFrequency
          });
        }
      }

      // Sort by createdAt descending
      habits.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      return { success: true, data: habits };
    } catch (error) {
      console.error('Error fetching habits:', error);
      throw error;
    }
  }

  // Create a new habit
  static async createHabit(userId, habitData) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const habitsRef = ref(db, `users/${userId}/habits`);
      const newHabitRef = push(habitsRef);
      
      const newHabit = {
        name: habitData.name,
        description: habitData.description || '',
        color: habitData.color || '#007bff',
        icon: habitData.icon || '📋',
        targetFrequency: habitData.target_frequency || 7,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await set(newHabitRef, newHabit);

      return {
        success: true,
        data: {
          id: newHabitRef.key,
          ...newHabit,
          total_checks: 0,
          week_checks: 0,
          today_completed: false,
          week_completion: 0,
          target_frequency: newHabit.targetFrequency
        }
      };
    } catch (error) {
      console.error('Error creating habit:', error);
      throw error;
    }
  }

  // Toggle habit completion for a specific date
  static async toggleHabit(userId, habitId, date = null) {
    if (!userId || !habitId) {
      throw new Error('User ID and Habit ID are required');
    }

    try {
      const checkDate = date || new Date().toISOString().split('T')[0];
      const checksRef = ref(db, `users/${userId}/habits/${habitId}/checks`);
      const snapshot = await get(checksRef);

      let completed;
      let existingCheckId = null;

      // Find existing check for this date
      if (snapshot.exists()) {
        const checks = snapshot.val();
        for (const [checkId, checkData] of Object.entries(checks)) {
          if (checkData.date === checkDate) {
            existingCheckId = checkId;
            break;
          }
        }
      }

      if (!existingCheckId) {
        // Create new check
        const newCheckRef = push(checksRef);
        await set(newCheckRef, {
          date: checkDate,
          completed: true,
          createdAt: Date.now()
        });
        completed = true;
      } else {
        // Toggle existing check
        const checkRef = ref(db, `users/${userId}/habits/${habitId}/checks/${existingCheckId}`);
        const checkSnapshot = await get(checkRef);
        const currentCompleted = checkSnapshot.val().completed;
        await update(checkRef, { completed: !currentCompleted });
        completed = !currentCompleted;
      }

      return {
        success: true,
        data: {
          habit_id: habitId,
          date: checkDate,
          completed
        }
      };
    } catch (error) {
      console.error('Error toggling habit:', error);
      throw error;
    }
  }

  // Get habit statistics
  static async getStats(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const habitsRef = ref(db, `users/${userId}/habits`);
      const snapshot = await get(habitsRef);

      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);

      let totalHabits = 0;
      let totalChecks = 0;
      let weekChecks = 0;
      let monthChecks = 0;
      let todayChecks = 0;
      let currentStreak = 0;
      let bestStreak = 0;

      const dailyCompletions = {};

      if (snapshot.exists()) {
        const habitsData = snapshot.val();
        totalHabits = Object.keys(habitsData).length;

        for (const habitData of Object.values(habitsData)) {
          if (habitData.checks) {
            for (const checkData of Object.values(habitData.checks)) {
              if (checkData.completed) {
                totalChecks++;
                const checkDate = checkData.date;
                
                if (checkDate === today) {
                  todayChecks++;
                }
                if (new Date(checkDate) >= weekAgo) {
                  weekChecks++;
                }
                if (new Date(checkDate) >= monthAgo) {
                  monthChecks++;
                }

                if (!dailyCompletions[checkDate]) {
                  dailyCompletions[checkDate] = 0;
                }
                dailyCompletions[checkDate]++;
              }
            }
          }
        }
      }

      // Calculate streaks
      let tempStreak = 0;
      let checkingDate = new Date();
      
      for (let i = 0; i < 365; i++) {
        const dateStr = checkingDate.toISOString().split('T')[0];
        if (dailyCompletions[dateStr] && dailyCompletions[dateStr] > 0) {
          tempStreak++;
          if (tempStreak > bestStreak) bestStreak = tempStreak;
        } else if (i > 0) {
          break;
        }
        checkingDate.setDate(checkingDate.getDate() - 1);
      }
      currentStreak = tempStreak;

      return {
        success: true,
        data: {
          total_habits: totalHabits,
          total_checks: totalChecks,
          week_checks: weekChecks,
          month_checks: monthChecks,
          today_checks: todayChecks,
          current_streak: currentStreak,
          best_streak: bestStreak,
          average_completion: totalHabits > 0 
            ? Math.round((weekChecks / (totalHabits * 7)) * 100) 
            : 0
        }
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }

  // Update a habit
  static async updateHabit(userId, habitId, habitData) {
    if (!userId || !habitId) {
      throw new Error('User ID and Habit ID are required');
    }

    try {
      const habitRef = ref(db, `users/${userId}/habits/${habitId}`);
      
      const updateData = {
        updatedAt: Date.now()
      };

      if (habitData.name !== undefined) updateData.name = habitData.name;
      if (habitData.description !== undefined) updateData.description = habitData.description;
      if (habitData.color !== undefined) updateData.color = habitData.color;
      if (habitData.icon !== undefined) updateData.icon = habitData.icon;
      if (habitData.target_frequency !== undefined) updateData.targetFrequency = habitData.target_frequency;

      await update(habitRef, updateData);

      return {
        success: true,
        data: { id: habitId, ...habitData }
      };
    } catch (error) {
      console.error('Error updating habit:', error);
      throw error;
    }
  }

  // Delete a habit
  static async deleteHabit(userId, habitId) {
    if (!userId || !habitId) {
      throw new Error('User ID and Habit ID are required');
    }

    try {
      const habitRef = ref(db, `users/${userId}/habits/${habitId}`);
      await remove(habitRef);

      return { success: true };
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  }

  // Reset all progress for a user (delete all checks but keep habits)
  static async resetProgress(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const habitsRef = ref(db, `users/${userId}/habits`);
      const snapshot = await get(habitsRef);

      if (snapshot.exists()) {
        const updates = {};
        const habitsData = snapshot.val();
        
        for (const habitId of Object.keys(habitsData)) {
          updates[`${habitId}/checks`] = null;
        }

        await update(habitsRef, updates);
      }

      return { success: true };
    } catch (error) {
      console.error('Error resetting progress:', error);
      throw error;
    }
  }

  // Delete all habits for a user
  static async deleteAllHabits(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const habitsRef = ref(db, `users/${userId}/habits`);
      await remove(habitsRef);

      return { success: true };
    } catch (error) {
      console.error('Error deleting all habits:', error);
      throw error;
    }
  }

  // ==================== USER PROFILE ====================

  // Get user profile
  static async getUserProfile(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const userRef = ref(db, `users/${userId}/profile`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        return { success: false, error: 'User not found' };
      }

      return {
        success: true,
        user: {
          id: userId,
          ...snapshot.val()
        }
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateUserProfile(userId, profileData) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const userRef = ref(db, `users/${userId}/profile`);
      
      const updateData = {
        updatedAt: Date.now()
      };

      if (profileData.name !== undefined) updateData.name = profileData.name;
      if (profileData.bio !== undefined) updateData.bio = profileData.bio;
      if (profileData.goals !== undefined) updateData.goals = profileData.goals;

      await update(userRef, updateData);

      const snapshot = await get(userRef);

      return {
        success: true,
        user: {
          id: userId,
          ...snapshot.val()
        }
      };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Create user profile (called after Firebase Auth registration)
  static async createUserProfile(userId, userData) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const userRef = ref(db, `users/${userId}/profile`);
      
      const profileData = {
        name: userData.name || '',
        email: userData.email || '',
        bio: userData.bio || '',
        goals: userData.goals || '',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await set(userRef, profileData);

      return {
        success: true,
        user: {
          id: userId,
          ...profileData
        }
      };
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }
}

export default FirebaseService;
