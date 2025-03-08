import Redis from 'ioredis';

export class ProgressService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'redis',
      port: 6379,
    });
  }

  async setProgress(taskId: string, progress: number): Promise<void> {
    await this.redis.set(`progress:${taskId}`, progress.toString());
    await this.redis.expire(`progress:${taskId}`, 3600); // Expire after 1 hour
  }

  async getProgress(taskId: string): Promise<number> {
    const progress = await this.redis.get(`progress:${taskId}`);
    return progress ? parseInt(progress) : 0;
  }
}

export default new ProgressService();