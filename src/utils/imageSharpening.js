import * as tf from '@tensorflow/tfjs';

export const sharpenImage = async (imageSrc, level) => {
    const image = document.createElement('img');
    image.src = imageSrc;

    image.onload = async () => {
        const tensor = tf.browser.fromPixels(image);
        const kernel = getKernel(level);
        const sharpened = tf.conv2d(tensor.expandDims(0), kernel, [1, 1], 'same');
        const canvas = document.createElement('canvas');
        await tf.browser.toPixels(sharpened.squeeze(), canvas);
        document.body.appendChild(canvas);
    };
};

const getKernel = (level) => {
    switch (level) {
        case 'low':
            return tf.tensor2d([[0, -1, 0], [-1, 5, -1], [0, -1, 0]], [3, 3, 1, 1]);
        case 'medium':
            return tf.tensor2d([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]], [3, 3, 1, 1]);
        case 'high':
            return tf.tensor2d([[-1, -2, -1], [-2, 13, -2], [-1, -2, -1]], [3, 3, 1, 1]);
        default:
            return tf.tensor2d([[0, -1, 0], [-1, 5, -1], [0, -1, 0]], [3, 3, 1, 1]);
    }
};