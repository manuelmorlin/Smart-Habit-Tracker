-- ====================================
-- GUEST/DEMO USER SEED DATA
-- Smart Habit Tracker
-- ====================================
-- 
-- This script creates a guest user for recruiters and visitors
-- to test the application without registration.
--
-- Credentials:
--   Email: guest@demo.com
--   Password: GuestDemo2025!
--
-- Password hash generated with: password_hash('GuestDemo2025!', PASSWORD_DEFAULT)
-- ====================================

USE smart_habit_tracker;

-- ====================================
-- CLEANUP (if guest user exists)
-- ====================================

-- Delete existing guest user data (cascade will handle habits and checks)
DELETE FROM users WHERE email = 'guest@demo.com';

-- ====================================
-- CREATE GUEST USER
-- ====================================

INSERT INTO users (name, email, password_hash, bio, goals, created_at) VALUES
(
    'Guest User',
    'guest@demo.com',
    '$2y$12$Wy6ZGFqbY8DYWTEDvLz/n.xWeANbdTzlhK7/B8FgrUxANamux/80q',
    'Welcome! This is a demo account to explore Smart Habit Tracker. Feel free to test all features - your changes will be periodically reset.',
    'Experience the full potential of habit tracking: create habits, track progress, and build consistency!',
    DATE_SUB(NOW(), INTERVAL 30 DAY)
);

-- Get the guest user ID
SET @guest_id = LAST_INSERT_ID();

-- ====================================
-- CREATE DEMO HABITS
-- ====================================

INSERT INTO habits (user_id, name, description, color, icon, target_frequency, created_at) VALUES
-- Habit 1: Morning Exercise
(@guest_id, 'Morning Exercise', 'Start the day with 20 minutes of exercise to boost energy and focus', '#10b981', 'fitness', 5, DATE_SUB(NOW(), INTERVAL 21 DAY)),

-- Habit 2: Read 30 Minutes
(@guest_id, 'Read 30 Minutes', 'Daily reading to expand knowledge and improve focus', '#6366f1', 'book', 7, DATE_SUB(NOW(), INTERVAL 21 DAY)),

-- Habit 3: Drink 8 Glasses of Water
(@guest_id, 'Drink Water', 'Stay hydrated with at least 8 glasses of water daily', '#3b82f6', 'water', 7, DATE_SUB(NOW(), INTERVAL 18 DAY)),

-- Habit 4: Meditation
(@guest_id, 'Meditation', '10 minutes of mindfulness meditation for mental clarity', '#8b5cf6', 'meditation', 5, DATE_SUB(NOW(), INTERVAL 14 DAY)),

-- Habit 5: Learn Something New
(@guest_id, 'Learn Something New', 'Spend 15 minutes learning a new skill or language', '#f59e0b', 'education', 4, DATE_SUB(NOW(), INTERVAL 10 DAY));

-- ====================================
-- GET HABIT IDs
-- ====================================

SET @habit_exercise = (SELECT id FROM habits WHERE user_id = @guest_id AND name = 'Morning Exercise' LIMIT 1);
SET @habit_reading = (SELECT id FROM habits WHERE user_id = @guest_id AND name = 'Read 30 Minutes' LIMIT 1);
SET @habit_water = (SELECT id FROM habits WHERE user_id = @guest_id AND name = 'Drink Water' LIMIT 1);
SET @habit_meditation = (SELECT id FROM habits WHERE user_id = @guest_id AND name = 'Meditation' LIMIT 1);
SET @habit_learn = (SELECT id FROM habits WHERE user_id = @guest_id AND name = 'Learn Something New' LIMIT 1);

-- ====================================
-- CREATE HABIT COMPLETION HISTORY
-- ====================================

-- Morning Exercise (target: 5/week) - Good performer ~80%
INSERT INTO habit_checks (habit_id, check_date, completed) VALUES
-- Week 3 (oldest)
(@habit_exercise, DATE_SUB(CURDATE(), INTERVAL 20 DAY), TRUE),
(@habit_exercise, DATE_SUB(CURDATE(), INTERVAL 19 DAY), TRUE),
(@habit_exercise, DATE_SUB(CURDATE(), INTERVAL 17 DAY), TRUE),
(@habit_exercise, DATE_SUB(CURDATE(), INTERVAL 16 DAY), TRUE),
-- Week 2
(@habit_exercise, DATE_SUB(CURDATE(), INTERVAL 13 DAY), TRUE),
(@habit_exercise, DATE_SUB(CURDATE(), INTERVAL 12 DAY), TRUE),
(@habit_exercise, DATE_SUB(CURDATE(), INTERVAL 10 DAY), TRUE),
(@habit_exercise, DATE_SUB(CURDATE(), INTERVAL 9 DAY), TRUE),
(@habit_exercise, DATE_SUB(CURDATE(), INTERVAL 8 DAY), TRUE),
-- Current week
(@habit_exercise, DATE_SUB(CURDATE(), INTERVAL 6 DAY), TRUE),
(@habit_exercise, DATE_SUB(CURDATE(), INTERVAL 5 DAY), TRUE),
(@habit_exercise, DATE_SUB(CURDATE(), INTERVAL 3 DAY), TRUE),
(@habit_exercise, DATE_SUB(CURDATE(), INTERVAL 1 DAY), TRUE);

-- Reading (target: 7/week) - Excellent performer ~90%
INSERT INTO habit_checks (habit_id, check_date, completed) VALUES
-- Week 3
(@habit_reading, DATE_SUB(CURDATE(), INTERVAL 20 DAY), TRUE),
(@habit_reading, DATE_SUB(CURDATE(), INTERVAL 19 DAY), TRUE),
(@habit_reading, DATE_SUB(CURDATE(), INTERVAL 18 DAY), TRUE),
(@habit_reading, DATE_SUB(CURDATE(), INTERVAL 17 DAY), TRUE),
(@habit_reading, DATE_SUB(CURDATE(), INTERVAL 16 DAY), TRUE),
(@habit_reading, DATE_SUB(CURDATE(), INTERVAL 15 DAY), TRUE),
-- Week 2
(@habit_reading, DATE_SUB(CURDATE(), INTERVAL 13 DAY), TRUE),
(@habit_reading, DATE_SUB(CURDATE(), INTERVAL 12 DAY), TRUE),
(@habit_reading, DATE_SUB(CURDATE(), INTERVAL 11 DAY), TRUE),
(@habit_reading, DATE_SUB(CURDATE(), INTERVAL 10 DAY), TRUE),
(@habit_reading, DATE_SUB(CURDATE(), INTERVAL 9 DAY), TRUE),
(@habit_reading, DATE_SUB(CURDATE(), INTERVAL 8 DAY), TRUE),
(@habit_reading, DATE_SUB(CURDATE(), INTERVAL 7 DAY), TRUE),
-- Current week
(@habit_reading, DATE_SUB(CURDATE(), INTERVAL 6 DAY), TRUE),
(@habit_reading, DATE_SUB(CURDATE(), INTERVAL 5 DAY), TRUE),
(@habit_reading, DATE_SUB(CURDATE(), INTERVAL 4 DAY), TRUE),
(@habit_reading, DATE_SUB(CURDATE(), INTERVAL 3 DAY), TRUE),
(@habit_reading, DATE_SUB(CURDATE(), INTERVAL 2 DAY), TRUE),
(@habit_reading, DATE_SUB(CURDATE(), INTERVAL 1 DAY), TRUE);

-- Drink Water (target: 7/week) - Good performer ~75%
INSERT INTO habit_checks (habit_id, check_date, completed) VALUES
-- Week 2
(@habit_water, DATE_SUB(CURDATE(), INTERVAL 13 DAY), TRUE),
(@habit_water, DATE_SUB(CURDATE(), INTERVAL 12 DAY), TRUE),
(@habit_water, DATE_SUB(CURDATE(), INTERVAL 11 DAY), TRUE),
(@habit_water, DATE_SUB(CURDATE(), INTERVAL 9 DAY), TRUE),
(@habit_water, DATE_SUB(CURDATE(), INTERVAL 8 DAY), TRUE),
-- Current week
(@habit_water, DATE_SUB(CURDATE(), INTERVAL 6 DAY), TRUE),
(@habit_water, DATE_SUB(CURDATE(), INTERVAL 5 DAY), TRUE),
(@habit_water, DATE_SUB(CURDATE(), INTERVAL 4 DAY), TRUE),
(@habit_water, DATE_SUB(CURDATE(), INTERVAL 2 DAY), TRUE),
(@habit_water, DATE_SUB(CURDATE(), INTERVAL 1 DAY), TRUE);

-- Meditation (target: 5/week) - Moderate performer ~60%
INSERT INTO habit_checks (habit_id, check_date, completed) VALUES
-- Week 2
(@habit_meditation, DATE_SUB(CURDATE(), INTERVAL 12 DAY), TRUE),
(@habit_meditation, DATE_SUB(CURDATE(), INTERVAL 10 DAY), TRUE),
(@habit_meditation, DATE_SUB(CURDATE(), INTERVAL 8 DAY), TRUE),
-- Current week
(@habit_meditation, DATE_SUB(CURDATE(), INTERVAL 5 DAY), TRUE),
(@habit_meditation, DATE_SUB(CURDATE(), INTERVAL 3 DAY), TRUE),
(@habit_meditation, DATE_SUB(CURDATE(), INTERVAL 1 DAY), TRUE);

-- Learn Something New (target: 4/week) - Needs improvement ~50%
INSERT INTO habit_checks (habit_id, check_date, completed) VALUES
-- Week 1 only (newer habit)
(@habit_learn, DATE_SUB(CURDATE(), INTERVAL 6 DAY), TRUE),
(@habit_learn, DATE_SUB(CURDATE(), INTERVAL 4 DAY), TRUE),
(@habit_learn, DATE_SUB(CURDATE(), INTERVAL 2 DAY), TRUE);

-- ====================================
-- VERIFICATION QUERY
-- ====================================

-- Uncomment to verify the data:
-- SELECT 
--     u.name, u.email,
--     h.name as habit_name,
--     h.target_frequency,
--     COUNT(hc.id) as total_checks
-- FROM users u
-- JOIN habits h ON u.id = h.user_id
-- LEFT JOIN habit_checks hc ON h.id = hc.habit_id
-- WHERE u.email = 'guest@demo.com'
-- GROUP BY u.id, h.id;

-- ====================================
-- SUCCESS MESSAGE
-- ====================================

SELECT 'Guest user created successfully!' as status,
       'Email: guest@demo.com' as email,
       'Password: GuestDemo2025!' as password;
