import React, { useState } from 'react';
import { encryptFile, decryptFile } from '../utils/fileEncryption';

const FileEncryption = () => {
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleEncrypt = () => {
        if (file && password) {
            encryptFile(file, password);
        }
    };

    const handleDecrypt = () => {
        if (file && password) {
            decryptFile(file, password);
        }
    };

    return (
        <div className="container">
            <h1>File Encryption</h1>
            <input type="file" onChange={handleFileChange} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleEncrypt}>Encrypt File</button>
            <button onClick={handleDecrypt}>Decrypt File</button>
        </div>
    );
};

export default FileEncryption;