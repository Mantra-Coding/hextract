<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=ffffff">
  <img src="https://img.shields.io/npm/v/hextract">
  <img src="https://img.shields.io/npm/dm/hextract">
  <img src="https://img.shields.io/bundlephobia/minzip/hextract">
</p>

# hextract 🎨

A modern, lightweight utility library for color extraction and accessibility calculations in web applications. Extract dominant colors from images and ensure your color combinations meet WCAG contrast guidelines.

## ✨ Features

-   🖼️ **Image color extraction** - Extract average colors from images, URLs, or File objects
-   ⚖️ **WCAG contrast calculation** - Validate text/background combinations against accessibility standards
-   📦 **Lightweight & tree-shakable** - Import only what you need (~2KB gzipped)
-   🌐 **Framework-agnostic** - Works with React, Vue, Angular, Svelte, or vanilla JS
-   📝 **Fully typed** - Complete TypeScript definitions included
-   🔄 **Multiple input types** - Support for HTMLImageElement, URLs, and File objects

## 📦 Installation

```bash
npm install hextract
```

```bash
yarn add hextract
```

```bash
pnpm add hextract
```

## 🚀 Quick Start

```ts
import { computeAverageColor, contrast } from "hextract";

// Extract color from image
const color = await computeAverageColor("/path/to/image.jpg");
console.log(color); // "#ff5733"

// Check contrast ratio
const ratio = contrast([0, 0, 0], [255, 255, 255]);
console.log(ratio); // 21 (excellent contrast)
```

## 📚 API Reference

### `computeAverageColor(imageSource)`

Extracts the average color from an image and returns it as a hex string.

**Parameters**:

-   `imageSource` : `HTMLImageElement | string | File` - Image element, URL, or File object

**Returns**: `Promise<string>` - Hex color string (e.g., "#ff5733")

**Examples**:

```ts
// From image element
const imgElement = document.querySelector("img");
const color = await computeAverageColor(imgElement);

// From URL
const color = await computeAverageColor("/path/to/image.jpg");

// From File object (file input)
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
const color = await computeAverageColor(file);
```

### `contrast(rgb1, rgb2)`

Calculates the contrast ratio between two colors according to WCAG 2.0 guidelines.

**Parameters**:

-   `rgb1` : `number[]` - RGB array for first color [r, g, b] (0-255)
-   `rgb2` : `number[]` - RGB array for second color [r, g, b] (0-255)

**Returns**: `number` - Contrast ratio

**WCAG Guidelines**

-   **4.5:1** - Minimum for normal text (AA)
-   **3:1** - Minimum for large text (AA)
-   **7:1** - Enhanced contrast (AAA)

**Example**:

```ts
const textColor = [0, 0, 0]; // Black
const bgColor = [255, 255, 255]; // White
const ratio = contrast(textColor, bgColor); // 21

const isAccessible = ratio >= 4.5; // true
```

## 🔧 Framework Integration

```tsx
import React, { useEffect, useState, useRef } from "react";
import { computeAverageColor, contrast } from "hextract";

const ImageColorExtractor: React.FC = () => {
    const imgRef = useRef<HTMLImageElement>(null);
    const [bgColor, setBgColor] = useState("#ffffff");
    const [isLoading, setIsLoading] = useState(false);

    const extractColor = async () => {
        if (!imgRef.current) return;

        setIsLoading(true);
        try {
            const color = await computeAverageColor(imgRef.current);
            setBgColor(color);
        } catch (error) {
            console.error("Failed to extract color:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: bgColor, padding: "20px" }}>
            <img
                ref={imgRef}
                src="/your-image.jpg"
                alt="Color source"
                onLoad={extractColor}
            />
            {isLoading && <p>Extracting color...</p>}
            <p>Extracted color: {bgColor}</p>
        </div>
    );
};
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT © [Mantra Coding](https://github.com/Mantra-Coding)

See [LICENSE](LICENSE)

## 🔗 Links

-   [GitHub Repository](https://github.com/Mantra-Coding/hextract)
-   [npm Package](https://www.npmjs.com/package/hextract)
-   [Issues](https://github.com/Mantra-Coding/hextract/issues)
-   [Changelog](CHANGELOG.md)
