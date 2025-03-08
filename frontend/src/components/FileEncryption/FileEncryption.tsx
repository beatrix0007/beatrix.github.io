import React, { useState } from 'react';
import { Box, Button, TextField, CircularProgress, Typography, Alert } from '@mui/material';
import { encryptFile, decryptFile } from '../../services/encryption';

const FileEncryption: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleEncrypt = async () => {
    if (!file || !password) return;
    setProcessing(true);
    setError('');

    try {
      const encryptedBlob = await encryptFile(file, password);
      const url = URL.createObjectURL(encryptedBlob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name}.encrypted`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Encryption failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDecrypt = async () => {
    if (!file || !password) return;
    setProcessing(true);
    setError('');

    try {
      const decryptedBlob = await decryptFile(file, password);
      const url = URL.createObjectURL(decryptedBlob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace('.encrypted', '');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Decryption failed. Please check your password.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        File Encryption
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <input
        accept="*/*"
        type="file"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="file-input"
      />
      
      <Box sx={{ my: 2 }}>
        <label htmlFor="file-input">
          <Button variant="contained" component="span">
            Select File
          </Button>
        </label>
        {file && (
          <Typography sx={{ mt: 1 }}>
            Selected: {file.name}
          </Typography>
        )}
      </Box>

      <TextField
        fullWidth
        type="password"
        label="Encryption Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ my: 2 }}
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleEncrypt}
          disabled={!file || !password || processing}
        >
          {processing ? <CircularProgress size={24} /> : 'Encrypt'}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleDecrypt}
          disabled={!file || !password || processing}
        >
          {processing ? <CircularProgress size={24} /> : 'Decrypt'}
        </Button>
      </Box>
    </Box>
  );
};

export default FileEncryption;