/**
 * ChatWave 3.0 - Server Configuration
 */
module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'chatwave_super_secret_jwt_key_2026',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000,
  RATE_LIMIT_MAX: 500,
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://dxraqfnywfivgohyrwey.supabase.co',
  SUPABASE_KEY: process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4cmFxZm55d2ZpdmdvaHlyd2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MjI0MjAsImV4cCI6MjEwMTA5ODQyMH0.9DRWDYhJW625yGzcupMGN4mBi1msuJJ2dz5m8R5Ju-o'
};
