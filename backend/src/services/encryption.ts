import crypto from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(crypto.scrypt);

export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly saltLength = 16;
  private readonly ivLength = 12;
  private readonly authTagLength = 16;

  async generateKey(password: string, salt: Buffer): Promise<Buffer> {
    return (await scrypt(password, salt, this.keyLength)) as Buffer;
  }

  async encrypt(data: Buffer, password: string): Promise<Buffer> {
    try {
      // Generate salt and derive key
      const salt = crypto.randomBytes(this.saltLength);
      const key = await this.generateKey(password, salt);

      // Generate IV
      const iv = crypto.randomBytes(this.ivLength);

      // Create cipher
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);

      // Encrypt data
      const encryptedData = Buffer.concat([
        cipher.update(data),
        cipher.final(),
      ]);

      // Get auth tag
      const authTag = cipher.getAuthTag();

      // Combine all components
      return Buffer.concat([
        salt,
        iv,
        authTag,
        encryptedData,
      ]);
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Encryption failed');
    }
  }

  async decrypt(encryptedData: Buffer, password: string): Promise<Buffer> {
    try {
      // Extract components
      const salt = encryptedData.slice(0, this.saltLength);
      const iv = encryptedData.slice(
        this.saltLength,
        this.saltLength + this.ivLength
      );
      const authTag = encryptedData.slice(
        this.saltLength + this.ivLength,
        this.saltLength + this.ivLength + this.authTagLength
      );
      const data = encryptedData.slice(
        this.saltLength + this.ivLength + this.authTagLength
      );

      // Derive key
      const key = await this.generateKey(password, salt);

      // Create decipher
      const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
      decipher.setAuthTag(authTag);

      // Decrypt data
      return Buffer.concat([
        decipher.update(data),
        decipher.final(),
      ]);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Decryption failed');
    }
  }
}

export default new EncryptionService();