import React, { useRef, useCallback } from 'react';
import { downloadImage, createPrintSheet, createHighResPrintImage } from '../services/imageService';
import type { PhotoIdOptions, EditorMode } from '../types';
import { UploadIcon, DownloadIcon, PrintIcon, XCircleIcon } from './icons';

interface ImageWorkspaceProps {
  T: any;
  originalImage: string | null;
  setOriginalImage: (image: string | null) => void;
  processedImage: string | null;
  setProcessedImage: (image: string | null) => void;
  isLoading: boolean;
  error: string | null;
  photoIdOptions: PhotoIdOptions;
  editorMode: EditorMode;
}

const ImageBox: React.FC<{ title: string; image: string | null; isLoading?: boolean, children?: React.ReactNode }> = ({ title, image, isLoading, children }) => (
  <div className="w-full">
    <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
    <div className="relative w-full aspect-square bg-gray-200 rounded-lg shadow-inner flex items-center justify-center overflow-hidden">
      {image ? (
        <img src={image} alt={title} className="w-full h-full object-contain" />
      ) : (
        children
      )}
       {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-indigo-600 font-medium">Đang xử lý...</p>
        </div>
      )}
    </div>
  </div>
);

const ImageWorkspace: React.FC<ImageWorkspaceProps> = ({
  T,
  originalImage,
  setOriginalImage,
  processedImage,
  setProcessedImage,
  isLoading,
  error,
  photoIdOptions,
  editorMode,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      downloadImage(processedImage, 'processed-image.png');
    }
  };

  const handlePrintSheetDownload = async () => {
    if (processedImage) {
      try {
        const sheet = await createPrintSheet(processedImage, photoIdOptions.size, photoIdOptions.paper);
        downloadImage(sheet, `print-sheet-${photoIdOptions.paper}.jpeg`);
      } catch(e) {
        console.error("Failed to create print sheet:", e);
      }
    }
  };
  
  const handleHighResDownload = async () => {
    if (processedImage) {
      try {
        const highResImage = await createHighResPrintImage(processedImage);
        downloadImage(highResImage, 'restored-image-A4-print.jpeg');
      } catch(e) {
        console.error("Failed to create high-res print image:", e);
      }
    }
  };

  const handleRemoveImage = () => {
      setOriginalImage(null);
      setProcessedImage(null);
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
      {!originalImage ? (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm font-medium text-gray-600">{T.uploadImage}</p>
          <p className="text-xs text-gray-500">{T.uploadPrompt}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageBox title={T.original} image={originalImage}>
            <button onClick={handleRemoveImage} className="absolute top-2 right-2 p-1 bg-white rounded-full text-gray-500 hover:text-red-500 hover:bg-gray-100">
                <XCircleIcon className="w-6 h-6"/>
            </button>
          </ImageBox>
          <ImageBox title={T.processed} image={processedImage} isLoading={isLoading}>
            {!processedImage && !isLoading && (
              <div className="text-center text-gray-500">
                <p>{T.processed} {T.language === 'vi' ? 'sẽ hiện ở đây' : 'will appear here'}</p>
              </div>
            )}
          </ImageBox>
        </div>
      )}

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {processedImage && (
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
          <button
            onClick={handleDownload}
            className="flex-1 flex justify-center items-center space-x-2 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            <DownloadIcon className="w-5 h-5"/>
            <span>{T.download} (PNG)</span>
          </button>
          {editorMode === 'photoId' ? (
             <button
              onClick={handlePrintSheetDownload}
              className="flex-1 flex justify-center items-center space-x-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PrintIcon className="w-5 h-5"/>
              <span>{T.downloadPrintSheet} ({photoIdOptions.paper})</span>
            </button>
          ) : (
            <button
              onClick={handleHighResDownload}
              className="flex-1 flex justify-center items-center space-x-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PrintIcon className="w-5 h-5"/>
              <span>{T.downloadForPrint}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageWorkspace;
