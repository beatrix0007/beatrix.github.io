import React, { useState } from 'react';
import { sharpenImage } from '../utils/imageSharpening';

const ImageSharpening = () => {
    const [image, setImage] = useState(null);
    const [sharpnessLevel, setSharpnessLevel] = useState('medium');

    const handleImageChange = (e) => {
        setImage(URL.createObjectURL(e.target.files[0]));
    };

    const handleSharpen = () => {
        if (image) {
            sharpenImage(image, sharpnessLevel);
        }
    };

    return (
        <div className="container">
            <h1>Image Sharpening</h1>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <select value={sharpnessLevel} onChange={(e) => setSharpnessLevel(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <button onClick={handleSharpen}>Sharpen Image</button>
            {image && <img src={image} alt="Selected" style={{ width: '100%', marginTop: '20px' }} />}
        </div>
    );
};

export default ImageSharpening;