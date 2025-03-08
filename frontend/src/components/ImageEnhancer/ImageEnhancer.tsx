import React, { useState } from 'react';
import { Box, Button, CircularProgress, Slider, Typography } from '@mui/material';
import { ProcessingOptions } from '../../types';

const ImageEnhancer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [options, setOptions] = useState<ProcessingOptions>({
    sharpness: 50,
    brightness: 50,
    contrast: 50,
    denoise: 0,
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnhance = async () => {
    if (!selectedFile) return;

    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('options', JSON.stringify(options));

      const response = await fetch('/api/enhance', {
        method: 'POST',
        body: formData,
      });

      const result = await response.blob();
      setPreview(URL.createObjectURL(result));
    } catch (error) {
      console.error('Enhancement failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Image Enhancement
      </Typography>

      <input
        accept="image/*"
        type="file"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="image-input"
      />
      
      <Box sx={{ my: 2 }}>
        <label htmlFor="image-input">
          <Button variant="contained" component="span">
            Select Image
          </Button>
        </label>
      </Box>

      {preview && (
        <Box sx={{ my: 2 }}>
          <img 
            src={preview} 
            alt="Preview" 
            style={{ maxWidth: '100%', maxHeight: '400px' }} 
          />
        </Box>
      )}

      <Box sx={{ my: 3 }}>
        <Typography gutterBottom>Sharpness</Typography>
        <Slider
          value={options.sharpness}
          onChange={(_, value) => setOptions(prev => ({ ...prev, sharpness: value as number }))}
        />

        <Typography gutterBottom>Brightness</Typography>
        <Slider
          value={options.brightness}
          onChange={(_, value) => setOptions(prev => ({ ...prev, brightness: value as number }))}
        />

        <Typography gutterBottom>Contrast</Typography>
        <Slider
          value={options.contrast}
          onChange={(_, value) => setOptions(prev => ({ ...prev, contrast: value as number }))}
        />

        <Typography gutterBottom>Denoise</Typography>
        <Slider
          value={options.denoise}
          onChange={(_, value) => setOptions(prev => ({ ...prev, denoise: value as number }))}
        />
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleEnhance}
        disabled={!selectedFile || processing}
      >
        {processing ? <CircularProgress size={24} /> : 'Enhance Image'}
      </Button>
    </Box>
  );
};

export default ImageEnhancer;