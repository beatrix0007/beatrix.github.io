import { ImageEnhancementService } from '../../services/imageEnhancement';
import fs from 'fs/promises';
import path from 'path';

describe('ImageEnhancementService', () => {
  let service: ImageEnhancementService;
  let testImageBuffer: Buffer;

  beforeAll(async () => {
    service = new ImageEnhancementService();
    testImageBuffer = await fs.readFile(
      path.join(__dirname, '../fixtures/test-image.jpg')
    );
  });

  it('should enhance image with default options', async () => {
    const result = await service.enhance(testImageBuffer, {
      sharpness: 50,
      brightness: 50,
      contrast: 50,
      denoise: 0,
    });

    expect(result).toBeInstanceOf(Buffer);
  });

  // Add more test cases
});