import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET!;
  private readonly JWT_EXPIRY = '24h';

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(userId: string, email: string): string {
    return jwt.sign(
      { id: userId, email },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRY }
    );
  }

  async register(email: string, password: string): Promise<User> {
    const hashedPassword = await this.hashPassword(password);
    // Implement user creation in database
    return {} as User; // Replace with actual implementation
  }

  async login(email: string, password: string): Promise<string | null> {
    // Implement user login logic
    // Return JWT token if successful, null if failed
    return null; // Replace with actual implementation
  }
}

export default new AuthService();