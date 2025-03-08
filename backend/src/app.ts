import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { imageEnhancementRouter } from './routes/imageEnhancement';
import { encryptionRouter } from './routes/encryption';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { auth } from './middleware/auth';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(auth);

// File upload configuration
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Routes
app.use('/api/enhance', upload.single('image'), imageEnhancementRouter);
app.use('/api/encrypt', upload.single('file'), encryptionRouter);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;