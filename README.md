<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=ffffff">
</p>

# hextract

## Description

hextract 🎨 ~ A modern, lightweight utility library for color extraction and accessibility calculations in web applications. Extract dominant colors from images and ensure your color combinations meet WCAG contrast guidelines.

Features

-   🖼️ Image color extraction - Automatically extract average colors from images
-   ⚖️ WCAG contrast calculation - Validate text/background combinations against accessibility standards
-   📦 Lightweight & tree-shakable - Import only what you need
-   🔄 React hooks friendly - Perfect for dynamic UI color adaptations
-   📝 Fully typed - Complete TypeScript definitions included

## Installation

```bash
npm install hextract
```

## Documentation

> **computeAverageColor**(`ref`): `Promise`\<`string`\>

Extracts the average color from an image and returns it as a hex string.
This can be used to create dynamic color schemes based on image content.

### Parameters

### ref

`HTMLImageElement`

HTML Image Element reference to extract color from

### Returns

`Promise`\<`string`\>

A Promise that resolves to a hex color string (e.g. "#ff5733")

### Example

```ts
// In a React component:
import { computeAverageColor } from "@mantra-coding/hextract";
import { useEffect, useState, useRef } from "react";

const ImageColorExtractor = () => {
    const imgRef = useRef(null);
    const [bgColor, setBgColor] = useState("#ffffff");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (imgRef.current) {
            // Extract the average color once the image is available
            setIsLoading(true);
            computeAverageColor(imgRef.current)
                .then((color) => {
                    setBgColor(color);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Failed to extract color:", error);
                    setIsLoading(false);
                });
        }
    }, [imgRef.current?.src]);

    return (
        <div
            style={{
                transition: "background-color 0.5s ease",
                backgroundColor: bgColor,
                padding: "20px",
                borderRadius: "8px"
            }}
        >
            {isLoading && <p>Extracting dominant color...</p>}
            <img
                ref={imgRef}
                src="/path/to/your/image.jpg"
                alt="Color source image"
                style={{ maxWidth: "100%" }}
            />
            <p
                style={{
                    color: "#ffffff",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.7)"
                }}
            >
                The average color of this image is: {bgColor}
            </p>
        </div>
    );
};
```

---

> **contrast**(`rgb1`, `rgb2`): `number`

Defined in: index.tsx:51

Calculates the contrast ratio between two colors according to WCAG 2.0 guidelines.
This can be used to determine if text will be readable against a background color.

### Parameters

### rgb1

`number`[]

RGB color array for the first color [r, g, b] (values 0-255)

### rgb2

`number`[]

RGB color array for the second color [r, g, b] (values 0-255)

### Returns

`number`

A numeric contrast ratio. WCAG recommends:

-   4.5:1 for normal text
-   3:1 for large text
-   7:1 for enhanced contrast

## Example

```ts
// In a React component:
import { contrast } from "@mantra-coding/hextract";

const MyComponent = () => {
    // Check if text color has enough contrast with background
    const textColor = [0, 0, 0]; // Black
    const backgroundColor = [255, 255, 255]; // White

    const contrastRatio = contrast(textColor, backgroundColor);
    const isAccessible = contrastRatio >= 4.5; // WCAG AA standard for normal text

    return (
        <div style={{ backgroundColor: `rgb(${backgroundColor.join(",")})` }}>
            <p
                style={{
                    color: `rgb(${textColor.join(",")})`,
                    // Apply a warning style if contrast is insufficient
                    outline: isAccessible ? "none" : "2px solid red"
                }}
            >
                Text content (Contrast ratio: {contrastRatio.toFixed(2)})
            </p>
        </div>
    );
};
```

## React Integration

### Basic Usage

```tsx
import React, { useEffect, useState, useRef } from "react";
import { computeAverageColor, contrast } from "hextract";

const ImageColorExtractor: React.FC = () => {
    const imgRef = useRef<HTMLImageElement>(null);
    const [bgColor, setBgColor] = useState("#ffffff");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (imgRef.current) {
            setIsLoading(true);
            computeAverageColor(imgRef.current)
                .then((color) => {
                    setBgColor(color);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error("Failed to extract color:", error);
                    setIsLoading(false);
                });
        }
    }, []);

    return (
        <div
            style={{
                transition: "background-color 0.5s ease",
                backgroundColor: bgColor,
                padding: "20px",
                borderRadius: "8px"
            }}
        >
            {isLoading && <p>Extracting dominant color...</p>}
            <img
                ref={imgRef}
                src="/path/to/your/image.jpg"
                alt="Color source image"
                style={{ maxWidth: "100%" }}
            />
            <p
                style={{
                    color: "#ffffff",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.7)"
                }}
            >
                The average color of this image is: {bgColor}
            </p>
        </div>
    );
};
```
