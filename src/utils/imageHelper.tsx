import ImageCompressor from 'react-native-compressor';
import ImageCropPicker from 'react-native-image-crop-picker';
// latest changes
import { Image } from 'react-native';
import { PhotoQuality } from 'react-native-image-picker';

export const MAX_IMAGE_SIZE_KB = 30;
export const QUALITY_STEPS: PhotoQuality[] = [0.8, 0.6, 0.4, 0.3]; // Decreasing quality steps
export const MAX_DIMENSION_REDUCTION_STEPS = 3; // How many times we'll reduce dimensions
export const MIN_DIMENSION = 400; // Minimum width/height in pixels

export type CompressionResult = {
  uri: string;
  base64?: string;
  sizeKB: number;
};

/**
 * Gets image dimensions
 */
export async function getImageDimensions(
  uri: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      error => reject(error),
    );
  });
}

/**
 * Calculates approximate size of base64 string in KB
 */
export function getBase64SizeKB(base64: string): number {
  // Base64 uses 4 characters for every 3 bytes
  return (base64.length * 3) / (4 * 1024);
}

interface Asset {
  uri?: string; // Allow undefined to match react-native-image-picker's Asset type
}

// Main function to compress image to max 30KB
export async function compressImageToMax30KB(
  asset: Asset,
): Promise<CompressionResult> {
  if (!asset.uri) {
    throw new Error('No image URI provided');
  }

  // Get original dimensions
  const originalDimensions = await getImageDimensions(asset.uri);
  let currentWidth = originalDimensions.width;
  let currentHeight = originalDimensions.height;

  // Option 1: If cropping is needed, open cropper once
  let processedUri = asset.uri;
  const needsCropping = false; // Set to true if cropping UI is desired
  if (needsCropping) {
    const cropResult = await ImageCropPicker.openCropper({
      path: asset.uri,
      width: currentWidth,
      height: currentHeight,
      compressImageQuality: 1.0, // High quality for cropping
      cropping: true, // Enable cropping UI
      mediaType: 'photo',
      includeBase64: true,
    });

    processedUri = cropResult.path;
  }

  // Try different quality levels
  for (const quality of QUALITY_STEPS) {
    // Try with current dimensions

    const result = await tryCompression(
      processedUri,
      quality,
      currentWidth,
      currentHeight,
    );
    if (result.sizeKB <= MAX_IMAGE_SIZE_KB) {
      return result;
    }

    // Reduce dimensions if still too large
    currentWidth = Math.max(MIN_DIMENSION, Math.floor(currentWidth * 0.7));
    currentHeight = Math.max(MIN_DIMENSION, Math.floor(currentHeight * 0.7));

    const reducedResult = await tryCompression(
      processedUri,
      quality,
      currentWidth,
      currentHeight,
    );
    if (reducedResult.sizeKB <= MAX_IMAGE_SIZE_KB) {
      return reducedResult;
    }
  }

  // Fallback to smallest possible

  return await tryCompression(
    processedUri,
    QUALITY_STEPS[QUALITY_STEPS.length - 1],
    MIN_DIMENSION,
    MIN_DIMENSION,
  );
}

// Compression function using react-native-compressor
async function tryCompression(
  uri: string,
  quality: number,
  width: number,
  height: number,
): Promise<CompressionResult> {
  try {
    const compressedUri = await ImageCompressor.Image.compress(uri, {
      compressionMethod: 'auto',
      quality: quality,
      maxWidth: width,
      maxHeight: height,
      output: 'jpg', // Use JPEG for consistency
    });

    const base64 = await convertToBase64(compressedUri);
    return {
      uri: compressedUri,
      base64: `data:image/jpeg;base64,${base64}`,
      sizeKB: getBase64SizeKB(base64),
    };
  } catch (error) {
    console.error('Compression error:', error);
    throw new Error('Compression failed');
  }
}

// Utility to convert image to base64 using Fetch API
async function convertToBase64(uri: string): Promise<string> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          resolve(base64String);
        } else {
          reject(new Error('Failed to convert to base64'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Base64 conversion error:', error);
    throw new Error('Base64 conversion failed');
  }
}
