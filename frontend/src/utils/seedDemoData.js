// Script per popolare i dati demo
// Eseguire dalla console del browser quando loggati come demo user

import { db } from '../config/firebase';
import { ref, set } from 'firebase/database';

export async function seedDemoData(userId) {
  if (!userId) {
    console.error('User ID richiesto');
    return;
  }

  const now = Date.now();
  const today = new Date().toISOString().split('T')[0];
  
  // Date per i check (ultimi 7 giorni)
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }

  const demoData = {
    profile: {
      name: 'Demo User',
      email: 'demo@example.com',
      bio: 'Demo user for testing the Smart Habit Tracker application',
      goals: 'Build healthy habits and maintain consistency in daily routines',
      createdAt: now,
      updatedAt: now
    },
    habits: {
      habit1: {
        name: 'Drink Water',
        description: 'Drink at least 8 glasses of water daily to stay hydrated',
        color: '#00a8ff',
        icon: '💧',
        targetFrequency: 7,
        isActive: true,
        createdAt: now - 600000,
        updatedAt: now,
        checks: {
          check1: { date: dates[0], completed: true, createdAt: now },
          check2: { date: dates[1], completed: true, createdAt: now },
          check3: { date: dates[2], completed: true, createdAt: now },
          check4: { date: dates[3], completed: true, createdAt: now },
          check5: { date: dates[5], completed: true, createdAt: now }
        }
      },
      habit2: {
        name: 'Reading',
        description: 'Read at least 10 minutes daily to stimulate the mind',
        color: '#fbc531',
        icon: '📚',
        targetFrequency: 7,
        isActive: true,
        createdAt: now - 500000,
        updatedAt: now,
        checks: {
          check1: { date: dates[0], completed: true, createdAt: now },
          check2: { date: dates[1], completed: true, createdAt: now },
          check3: { date: dates[3], completed: true, createdAt: now }
        }
      },
      habit3: {
        name: 'Stretching',
        description: 'Do morning stretching to improve flexibility',
        color: '#44bd32',
        icon: '🤸‍♂️',
        targetFrequency: 6,
        isActive: true,
        createdAt: now - 400000,
        updatedAt: now,
        checks: {
          check1: { date: dates[0], completed: true, createdAt: now },
          check2: { date: dates[2], completed: true, createdAt: now },
          check3: { date: dates[4], completed: true, createdAt: now },
          check4: { date: dates[6], completed: true, createdAt: now }
        }
      },
      habit4: {
        name: 'Meditation',
        description: 'Practice 5 minutes of meditation to reduce stress',
        color: '#9c88ff',
        icon: '🧘‍♀️',
        targetFrequency: 5,
        isActive: true,
        createdAt: now - 300000,
        updatedAt: now,
        checks: {
          check1: { date: dates[1], completed: true, createdAt: now },
          check2: { date: dates[3], completed: true, createdAt: now },
          check3: { date: dates[5], completed: true, createdAt: now }
        }
      },
      habit5: {
        name: 'Walking',
        description: '20-minute walk to stay active',
        color: '#fd7e14',
        icon: '🚶‍♂️',
        targetFrequency: 5,
        isActive: true,
        createdAt: now - 200000,
        updatedAt: now,
        checks: {
          check1: { date: dates[0], completed: true, createdAt: now },
          check2: { date: dates[2], completed: true, createdAt: now }
        }
      },
      habit6: {
        name: 'Regular Sleep',
        description: 'Go to bed by 11:00 PM for optimal rest',
        color: '#6f42c1',
        icon: '😴',
        targetFrequency: 7,
        isActive: true,
        createdAt: now - 100000,
        updatedAt: now,
        checks: {
          check1: { date: dates[0], completed: true, createdAt: now },
          check2: { date: dates[1], completed: true, createdAt: now },
          check3: { date: dates[2], completed: true, createdAt: now },
          check4: { date: dates[3], completed: true, createdAt: now },
          check5: { date: dates[4], completed: true, createdAt: now },
          check6: { date: dates[5], completed: true, createdAt: now }
        }
      }
    }
  };

  try {
    const userRef = ref(db, `users/${userId}`);
    await set(userRef, demoData);
    console.log('✅ Demo data created successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error creating demo data:', error);
    return false;
  }
}

// Esporta per uso globale nella console
window.seedDemoData = seedDemoData;
