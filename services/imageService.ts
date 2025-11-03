import { PHOTO_SIZES_CM, PAPER_SIZES_MM, DPI } from '../constants';
import type { PaperSize, PhotoIdSize } from '../types';

// Helper to convert inches to pixels
const inToPx = (inches: number): number => inches * DPI;

// Helper to convert mm to inches
const mmToIn = (mm: number): number => mm / 25.4;

// Helper to convert cm to inches
const cmToIn = (cm: number): number => mmToIn(cm * 10);

export const downloadImage = (base64Image: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = base64Image;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const createPrintSheet = async (
  base64Image: string,
  photoSize: PhotoIdSize,
  paperSize: PaperSize
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const paper = PAPER_SIZES_MM[paperSize];
    const photo = PHOTO_SIZES_CM[photoSize];

    const paperWidthPx = inToPx(mmToIn(paper.w));
    const paperHeightPx = inToPx(mmToIn(paper.h));
    const photoWidthPx = inToPx(cmToIn(photo.w));
    const photoHeightPx = inToPx(cmToIn(photo.h));

    const canvas = document.createElement('canvas');
    canvas.width = paperWidthPx;
    canvas.height = paperHeightPx;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return reject('Could not get canvas context');
    }

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, paperWidthPx, paperHeightPx);
    
    const img = new Image();
    img.onload = () => {
      const gap = inToPx(0.1); // 0.1 inch gap
      const cols = Math.floor((paperWidthPx + gap) / (photoWidthPx + gap));
      const rows = Math.floor((paperHeightPx + gap) / (photoHeightPx + gap));

      const totalGridWidth = cols * (photoWidthPx + gap) - gap;
      const totalGridHeight = rows * (photoHeightPx + gap) - gap;
      
      const startX = (paperWidthPx - totalGridWidth) / 2;
      const startY = (paperHeightPx - totalGridHeight) / 2;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const drawX = startX + x * (photoWidthPx + gap);
          const drawY = startY + y * (photoHeightPx + gap);
          ctx.drawImage(img, drawX, drawY, photoWidthPx, photoHeightPx);
        }
      }
      resolve(canvas.toDataURL('image/jpeg', 1.0));
    };
    img.onerror = () => {
      reject('Failed to load image for canvas');
    };
    img.src = base64Image;
  });
};

export const createHighResPrintImage = async (
  base64Image: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // A4 @ 300 DPI (210mm x 297mm)
    const paperWidthPx = Math.round(8.27 * DPI); // approx 2480
    const paperHeightPx = Math.round(11.69 * DPI); // approx 3508

    const canvas = document.createElement('canvas');
    canvas.width = paperWidthPx;
    canvas.height = paperHeightPx;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return reject('Could not get canvas context');
    }

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, paperWidthPx, paperHeightPx);
    
    const img = new Image();
    img.onload = () => {
      const imgAspectRatio = img.width / img.height;
      const canvasAspectRatio = paperWidthPx / paperHeightPx;

      let drawWidth, drawHeight;

      // Fit image within canvas while maintaining aspect ratio
      if (imgAspectRatio > canvasAspectRatio) {
        // Image is wider than canvas, fit to width
        drawWidth = paperWidthPx;
        drawHeight = paperWidthPx / imgAspectRatio;
      } else {
        // Image is taller or same aspect as canvas, fit to height
        drawHeight = paperHeightPx;
        drawWidth = paperHeightPx * imgAspectRatio;
      }

      const drawX = (paperWidthPx - drawWidth) / 2;
      const drawY = (paperHeightPx - drawHeight) / 2;
      
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      
      resolve(canvas.toDataURL('image/jpeg', 1.0));
    };
    img.onerror = () => {
      reject('Failed to load image for canvas');
    };
    img.src = base64Image;
  });
};
