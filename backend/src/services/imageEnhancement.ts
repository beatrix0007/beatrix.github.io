import sharp from 'sharp';
import { ProcessingOptions } from '../types';

export class ImageEnhancementService {
  async enhance(
    inputBuffer: Buffer,
    options: ProcessingOptions
  ): Promise<Buffer> {
    try {
      let image = sharp(inputBuffer);

      // Apply enhancement options
      if (options.sharpness > 0) {
        image = image.sharpen(
          options.sharpness / 25,
          0.5,
          options.sharpness / 50
        );
      }

      if (options.brightness !== 50) {
        const brightness = (options.brightness - 50) / 50;
        image = image.modulate({
          brightness: 1 + brightness,
        });
      }

      if (options.contrast !== 50) {
        const contrast = (options.contrast - 50) / 25;
        image = image.contrast(contrast);
      }

      if (options.denoise > 0) {
        image = image.removeNoise({
          sigma: options.denoise / 10,
        });
      }

      // Process and return enhanced image
      return await image
        .webp({ quality: 90 })
        .toBuffer();
    } catch (error) {
      console.error('Image enhancement failed:', error);
      throw new Error('Image enhancement failed');
    }
  }
}

export default new ImageEnhancementService();