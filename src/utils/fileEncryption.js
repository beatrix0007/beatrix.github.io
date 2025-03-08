import CryptoJS from 'crypto-js';

export const encryptFile = (file, password) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const encrypted = CryptoJS.AES.encrypt(e.target.result, password).toString();
        downloadFile(encrypted, `${file.name}.encrypted`);
    };
    reader.readAsText(file);
};

export const decryptFile = (file, password) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const decrypted = CryptoJS.AES.decrypt(e.target.result, password).toString(CryptoJS.enc.Utf8);
        downloadFile(decrypted, file.name.replace('.encrypted', ''));
    };
    reader.readAsText(file);
};

const downloadFile = (data, fileName) => {
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};