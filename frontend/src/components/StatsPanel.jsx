import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import FirebaseService from '../services/firebaseService';

const StatsPanel = memo(({ habits }) => {
  const { currentUser } = useAuth();
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to get Monday and Sunday of current week
  const getWeekRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sunday) to 6 (Saturday)
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday, go back 6 days
    
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysToMonday);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    return {
      week_start: monday.toISOString().split('T')[0],
      week_end: sunday.toISOString().split('T')[0]
    };
  };

  // Memoized calculations to avoid unnecessary recalculations
  const statsData = useMemo(() => {
    const weekRange = getWeekRange();
    
    if (!habits || habits.length === 0) {
      return {
        habits: [],
        summary: {
          total_habits: 0,
          average_completion: 0,
          ...weekRange
        }
      };
    }

    const totalCompletion = habits.reduce((sum, h) => sum + (h.week_completion || 0), 0);
    const averageCompletion = Math.round(totalCompletion / habits.length);

    return {
      habits: habits.map(habit => ({
        id: habit.id,
        name: habit.name,
        color: habit.color,
        target_frequency: habit.target_frequency || 7,
        completed_days: habit.week_checks || 0,
        completion_percentage: habit.week_completion || 0
      })),
      summary: {
        total_habits: habits.length,
        average_completion: averageCompletion,
        successful_habits: habits.filter(h => (h.week_completion || 0) >= 80).length,
        ...weekRange
      }
    };
  }, [habits]);

  // Optimized fetch with error handling
  const fetchStats = useCallback(async () => {
    if (!currentUser) {
      setWeeklyStats(statsData);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await FirebaseService.getStats(currentUser.id);
      
      if (data.success) {
        // Transform Firebase response to expected format
        const weekRange = getWeekRange();
        const transformedStats = {
          habits: statsData.habits, // Use local habits data for detailed stats
          summary: {
            total_habits: data.data.total_habits || 0,
            average_completion: data.data.average_completion || 0,
            successful_habits: statsData.summary.successful_habits || 0,
            current_streak: data.data.current_streak || 0,
            best_streak: data.data.best_streak || 0,
            ...weekRange
          }
        };
        setWeeklyStats(transformedStats);
      } else {
        throw new Error(data.error || 'Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Unable to load statistics');
      setWeeklyStats(statsData); // Fallback to local data
    } finally {
      setLoading(false);
    }
  }, [statsData, currentUser]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Memoized motivational message
  const motivationalMessage = useMemo(() => {
    if (!weeklyStats || !weeklyStats.summary) return null;
    
    const { average_completion, total_habits } = weeklyStats.summary;
    
    if (total_habits === 0) {
      return {
        type: 'empty',
        title: 'Start your journey!',
        message: 'Create your first habit to start tracking progress.'
      };
    }
    
    if (average_completion >= 90) {
      return {
        type: 'excellent',
        title: 'Excellent!',
        message: 'You are a habit champion! Keep it up!'
      };
    } else if (average_completion >= 80) {
      return {
        type: 'success',
        title: 'Fantastic!',
        message: 'You are maintaining your habits wonderfully!'
      };
    } else if (average_completion >= 60) {
      return {
        type: 'good',
        title: 'Great progress!',
        message: 'Keep going to reach your goals!'
      };
    } else if (average_completion >= 30) {
      return {
        type: 'moderate',
        title: 'Good start!',
        message: 'You are building your routines. Small steps lead to big results!'
      };
    } else {
      return {
        type: 'encourage',
        title: 'Don\'t give up!',
        message: 'Every day is a new opportunity. Focus on one habit at a time!'
      };
    }
  }, [weeklyStats]);

  if (loading) {
    return (
      <div className="stats-loading">
        <div className="spinner large"></div>
        <p>Loading statistics...</p>
      </div>
    );
  }

  if (error && !weeklyStats) {
    return (
      <div className="stats-error">
        <h3>Loading error</h3>
        <p>{error}</p>
        <button onClick={fetchStats} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  // Safety check for weeklyStats structure
  if (!weeklyStats || !weeklyStats.summary || !weeklyStats.habits) {
    return (
      <div className="stats-loading">
        <div className="spinner large"></div>
        <p>Loading statistics...</p>
      </div>
    );
  }

  const { habits: habitStats, summary } = weeklyStats;

  return (
    <div className="stats-panel">
      <header className="stats-header">
        <h2>
          Weekly Statistics
        </h2>
        <p className="date-range" aria-label={`Period from ${new Date(summary.week_start).toLocaleDateString('en-US')} to ${new Date(summary.week_end).toLocaleDateString('en-US')}`}>
          {new Date(summary.week_start).toLocaleDateString('en-US')} - {' '}
          {new Date(summary.week_end).toLocaleDateString('en-US')}
        </p>
      </header>

      <div className="summary-cards">
        <div className="summary-card habits-count">
          <div className="card-content">
            <h3>{summary.total_habits}</h3>
            <p>Active Habits</p>
          </div>
        </div>

        <div className="summary-card average-completion">
          <div className="card-content">
            <h3>{summary.average_completion}%</h3>
            <p>Average Completion</p>
          </div>
        </div>

        <div className="summary-card successful-habits">
          <div className="card-content">
            <h3>{summary.successful_habits || 0}</h3>
            <p>Goals Achieved</p>
          </div>
        </div>
      </div>

      <section className="habits-stats">
        <h3>Habit Details</h3>
        <div className="stats-list">
          {habitStats.length === 0 ? (
            <div className="empty-stats">
              <div className="empty-icon"></div>
              <p>No habits to track</p>
              <p>Create your first habit to see statistics!</p>
            </div>
          ) : (
            habitStats
              .sort((a, b) => b.completion_percentage - a.completion_percentage) // Sort by performance
              .map(habit => (
                <article key={habit.id} className="stat-item">
                  <header className="stat-header">
                    <div className="stat-info">
                      <div className="stat-color-indicator" style={{ backgroundColor: habit.color }}></div>
                      <span className="stat-name">{habit.name}</span>
                    </div>
                    <span 
                      className={`stat-percentage ${
                        habit.completion_percentage >= 80 ? 'high' : 
                        habit.completion_percentage >= 50 ? 'medium' : 'low'
                      }`}
                      aria-label={`Completion ${habit.completion_percentage}%`}
                    >
                      {habit.completion_percentage}%
                    </span>
                  </header>
                  <div className="stat-progress">
                    <div 
                      className="stat-bar" 
                      style={{ 
                        width: `${Math.min(100, Math.max(0, habit.completion_percentage))}%`,
                        backgroundColor: habit.color 
                      }}
                      role="progressbar"
                      aria-valuenow={habit.completion_percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Progress ${habit.name}: ${habit.completion_percentage}%`}
                    />
                  </div>
                  <div className="stat-details">
                    <span>
                      {habit.completed_days}/{habit.target_frequency} days completed
                    </span>
                    <span className="frequency-info">
                      (target: {habit.target_frequency === 7 ? 'daily' : `${habit.target_frequency}x/week`})
                    </span>
                  </div>
                </article>
              ))
          )}
        </div>
      </section>

      {motivationalMessage && (
        <aside className={`motivational-message ${motivationalMessage.type}`}>
          <div className="message-content">
            <div className="message-text">
              <h4>{motivationalMessage.title}</h4>
              <p>{motivationalMessage.message}</p>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
});

StatsPanel.displayName = 'StatsPanel';

export default StatsPanel;
