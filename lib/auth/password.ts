import bcrypt from 'bcryptjs';

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Get admin password hash from environment or database
 * For single admin, we can use env variable or check database
 */
export async function getAdminPasswordHash(): Promise<string | null> {
  // First, try environment variable (simplest for single admin)
  if (process.env.ADMIN_PASSWORD_HASH) {
    return process.env.ADMIN_PASSWORD_HASH;
  }

  // If not in env, check database for single admin user
  try {
    const connectDB = (await import('@/lib/db/mongodb')).default;
    await connectDB();
    const User = (await import('@/lib/models/User')).default;
    
    const admin = await User.findOne();
    return admin?.password || null;
  } catch {
    return null;
  }
}

/**
 * Initialize admin user if it doesn't exist
 * This will be called on first setup
 */
export async function initializeAdmin(password: string): Promise<void> {
  const connectDB = (await import('@/lib/db/mongodb')).default;
  await connectDB();
  const User = (await import('@/lib/models/User')).default;

  const existingAdmin = await User.findOne();
  
  if (!existingAdmin) {
    const hashedPassword = await hashPassword(password);
    await User.create({ password: hashedPassword });
  }
}
