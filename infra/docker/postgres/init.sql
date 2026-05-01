-- HostPanel Pro - Database Initialization
-- This script runs on first container startup

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set default configuration
ALTER SYSTEM SET timezone = 'UTC';

-- Create a health check function
CREATE OR REPLACE FUNCTION hostpanel_health() RETURNS boolean AS $$
BEGIN
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Log initialization
DO $$
BEGIN
  RAISE NOTICE 'HostPanel Pro database initialized successfully';
END $$;