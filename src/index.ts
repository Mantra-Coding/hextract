const RED = 0.2126;
const GREEN = 0.7152;
const BLUE = 0.0722;
const GAMMA = 2.4;

function luminance(r: number, g: number, b: number): number {
    const a = [r, g, b].map((v) => {
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
 * ```typescript
 * import { contrast } from 'hextract';
 *
 * const textColor = [0, 0, 0]; // Black
 * const backgroundColor = [255, 255, 255]; // White
 * const contrastRatio = contrast(textColor, backgroundColor);
 * const isAccessible = contrastRatio >= 4.5; // WCAG AA standard
 * ```
 */
export function contrast(rgb1: number[], rgb2: number[]): number {
    const lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
    const lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

const componentToHex = (c: number): string => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
};

const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
};

/**
 * Extracts the average color from an image and returns it as a hex string.
 * This function works in browser environments and requires DOM access.
 *
 * @param imageSource - Can be an HTMLImageElement, image URL string, or File object
 * @returns A Promise that resolves to a hex color string (e.g. "#ff5733")
 *
 * @example
 * ```typescript
 * import { computeAverageColor } from 'hextract';
 *
 * // From image element
 * const imgElement = document.querySelector('img');
 * const color = await computeAverageColor(imgElement);
 *
 * // From URL
 * const color = await computeAverageColor('/path/to/image.jpg');
 *
 * // From File object
 * const fileInput = document.querySelector('input[type="file"]');
 * const file = fileInput.files[0];
 * const color = await computeAverageColor(file);
 * ```
 */
export const computeAverageColor = async (
    imageSource: HTMLImageElement | string | File
): Promise<string> => {
    if (typeof window === "undefined" || typeof document === "undefined") {
        throw new Error(
            "[hextract] computeAverageColor requires a browser environment with DOM access"
        );
    }

    const canvas = document.createElement("canvas");
    canvas.style.display = "none";
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("[hextract] Could not get 2d context");
    }

    const img = new Image();

    // Handle different input types
    if (imageSource instanceof HTMLImageElement) {
        img.src = imageSource.src;
        img.crossOrigin = imageSource.crossOrigin;
    } else if (typeof imageSource === "string") {
        img.src = imageSource;
        img.crossOrigin = "anonymous";
    } else if (imageSource instanceof File) {
        img.src = URL.createObjectURL(imageSource);
    } else {
        throw new Error("[hextract] Invalid image source type");
    }

    return new Promise((resolve, reject) => {
        img.onload = () => {
            try {
                // Set canvas size to match the image
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // Get image data from the canvas
                const imageData = ctx.getImageData(
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

                // Clean up object URL if created
                if (imageSource instanceof File) {
                    URL.revokeObjectURL(img.src);
                }
            } catch (error) {
                reject(
                    new Error(
                        `[hextract] Failed to process image: ${
                            (error as DOMException).message
                        }`
                    )
                );
            }
        };

        img.onerror = () => {
            reject(new Error("[hextract] Failed to load image"));
        };
    });
};

/**
 * Converts RGB values to hex color string
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns Hex color string (e.g. "#ff5733")
 */
export function rgbToHexString(r: number, g: number, b: number): string {
    return rgbToHex(r, g, b);
}

/**
 * Converts hex color string to RGB array
 * @param hex - Hex color string (e.g. "#ff5733" or "ff5733")
 * @returns RGB array [r, g, b] with values 0-255
 */
export function hexToRgb(hex: string): number[] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        throw new Error(`[hextract] Invalid hex color: ${hex}`);
    }
    return [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ];
}
