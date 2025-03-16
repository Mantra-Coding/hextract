const RED = 0.2126;
const GREEN = 0.7152;
const BLUE = 0.0722;

const GAMMA = 2.4;

function luminance(r: number, g: number, b: number) {
    let a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, GAMMA);
    });
    return a[0] * RED + a[1] * GREEN + a[2] * BLUE;
}

/**
 * Calculates the contrast ratio between two colors according to WCAG 2.0 guidelines.
 * This can be used to determine if text will be readable against a background color.
 *
 * @param rgb1 - RGB color array for the first color [r, g, b] (values 0-255)
 * @param rgb2 - RGB color array for the second color [r, g, b] (values 0-255)
 * @returns A numeric contrast ratio. WCAG recommends:
 *   - 4.5:1 for normal text
 *   - 3:1 for large text
 *   - 7:1 for enhanced contrast
 *
 * @example
 * // In a React component:
 * import { contrast } from '@mantra-coding/hextract';
 *
 * const MyComponent = () => {
 *   // Check if text color has enough contrast with background
 *   const textColor = [0, 0, 0]; // Black
 *   const backgroundColor = [255, 255, 255]; // White
 *
 *   const contrastRatio = contrast(textColor, backgroundColor);
 *   const isAccessible = contrastRatio >= 4.5; // WCAG AA standard for normal text
 *
 *   return (
 *     <div style={{ backgroundColor: `rgb(${backgroundColor.join(',')})` }}>
 *       <p style={{
 *         color: `rgb(${textColor.join(',')})`,
 *         // Apply a warning style if contrast is insufficient
 *         outline: isAccessible ? 'none' : '2px solid red'
 *       }}>
 *         Text content (Contrast ratio: {contrastRatio.toFixed(2)})
 *       </p>
 *     </div>
 *   );
 * };
 */
export function contrast(rgb1: number[], rgb2: number[]) {
    let lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
    let lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
    let brightest = Math.max(lum1, lum2);
    let darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

const componentToHex = (c: number): string => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
};

// Convert RGB values to a hex color string
const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
};

/**
 * Extracts the average color from an image and returns it as a hex string.
 * This can be used to create dynamic color schemes based on image content.
 *
 * @param ref - HTML Image Element reference to extract color from
 * @returns A Promise that resolves to a hex color string (e.g. "#ff5733")
 *
 * @example
 * // In a React component:
 * import { computeAverageColor } from '@mantra-coding/hextract';
 * import { useEffect, useState, useRef } from 'react';
 *
 * const ImageColorExtractor = () => {
 *   const imgRef = useRef(null);
 *   const [bgColor, setBgColor] = useState('#ffffff');
 *   const [isLoading, setIsLoading] = useState(true);
 *
 *   useEffect(() => {
 *     if (imgRef.current) {
 *       // Extract the average color once the image is available
 *       setIsLoading(true);
 *       computeAverageColor(imgRef.current)
 *         .then(color => {
 *           setBgColor(color);
 *           setIsLoading(false);
 *         })
 *         .catch(error => {
 *           console.error('Failed to extract color:', error);
 *           setIsLoading(false);
 *         });
 *     }
 *   }, [imgRef.current?.src]);
 *
 *   return (
 *     <div style={{
 *       transition: 'background-color 0.5s ease',
 *       backgroundColor: bgColor,
 *       padding: '20px',
 *       borderRadius: '8px'
 *     }}>
 *       {isLoading && <p>Extracting dominant color...</p>}
 *       <img
 *         ref={imgRef}
 *         src="/path/to/your/image.jpg"
 *         alt="Color source image"
 *         style={{ maxWidth: '100%' }}
 *       />
 *       <p style={{
 *         color: '#ffffff',
 *         textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
 *       }}>
 *         The average color of this image is: {bgColor}
 *       </p>
 *     </div>
 *   );
 * };
 */
export const computeAverageColor = async (
    ref: HTMLImageElement
): Promise<string> => {
    let canvas = document.createElement("canvas");
    canvas.style.display = "none";

    const img = new Image();
    img.src = ref.src;
    return new Promise((resolve, reject) => {
        img.onload = () => {
            if (!canvas)
                reject(new Error("[hextract] Could not create canvas"));
            const ctx = canvas.getContext("2d");
            if (!ctx) reject(new Error("[hextract] Could not get 2d context"));

            // Set canvas size to match the image
            canvas.width = img.width;
            canvas.height = img.height;
            ctx!.drawImage(img, 0, 0);

            // Get image data from the canvas
            const imageData = ctx!.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );
            let r = 0,
                g = 0,
                b = 0;
            const count = imageData.data.length / 4;

            // Sum up all color components
            for (let i = 0; i < imageData.data.length; i += 4) {
                r += imageData.data[i];
                g += imageData.data[i + 1];
                b += imageData.data[i + 2];
            }

            // Compute the average
            r = Math.floor(r / count);
            g = Math.floor(g / count);
            b = Math.floor(b / count);

            const hexColor = rgbToHex(r, g, b);
            resolve(hexColor);
        };
    });
};
