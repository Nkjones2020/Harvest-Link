-- Modify users table to support multiple roles
-- For simplicity, we'll keep the 'role' column as the primary role 
-- and add a 'roles' text array column to store all roles.

ALTER TABLE users ADD COLUMN roles TEXT[] DEFAULT '{farmer}';

-- Update existing users to have their current role in the roles array
UPDATE users SET roles = ARRAY[role];

-- Add 'buyer' to the roles array for anyone who wants to be both
-- (This will be done via the app logic, but here we prepare the schema)
