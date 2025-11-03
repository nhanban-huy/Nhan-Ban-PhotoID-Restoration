import React, { useState, useCallback } from 'react';
import type { EditorMode, Language, PhotoIdOptions, RestorationOptions } from './types';
import { translations } from './constants';
import { generateEditedImage } from './services/geminiService';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import ImageWorkspace from './components/ImageWorkspace';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('vi');
  const [editorMode, setEditorMode] = useState<EditorMode>('photoId');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [photoIdOptions, setPhotoIdOptions] = useState<PhotoIdOptions>({
    size: '3x4',
    paper: 'A4',
    attire: 'white_shirt',
    customAttire: '',
    faceAndHair: {
      auto: true,
      hairStyle: 'keep',
      skinSmoothing: false,
      freckleRemoval: false,
      keepFace: true,
    },
    background: {
      color: 'light_blue',
      customColor: '#ffffff',
    },
  });

  const [restorationOptions, setRestorationOptions] = useState<RestorationOptions>({
    mode: 'restore_colorize',
    advanced: {
      detailedHair: false,
      restoreClothing: false,
      clarifyBackground: false,
      keepFace: true,
    },
    customPrompt: '',
  });

  const handleGenerate = useCallback(async () => {
    if (!originalImage) {
      setError(translations[language].errorNoImage);
      return;
    }
    setIsLoading(true);
    setError(null);
    setProcessedImage(null);

    try {
      const result = await generateEditedImage(
        originalImage,
        editorMode === 'photoId' ? photoIdOptions : restorationOptions,
        editorMode,
        language
      );
      setProcessedImage(`data:image/png;base64,${result}`);
    } catch (e) {
      console.error(e);
      setError(
        e instanceof Error
          ? e.message
          : translations[language].errorProcessing
      );
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, editorMode, photoIdOptions, restorationOptions, language]);

  const T = translations[language];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Header
        language={language}
        setLanguage={setLanguage}
        title={T.appTitle}
      />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 xl:col-span-3">
              <ControlPanel
                language={language}
                T={T}
                editorMode={editorMode}
                setEditorMode={setEditorMode}
                photoIdOptions={photoIdOptions}
                setPhotoIdOptions={setPhotoIdOptions}
                restorationOptions={restorationOptions}
                setRestorationOptions={setRestorationOptions}
                onGenerate={handleGenerate}
                isLoading={isLoading}
                hasImage={!!originalImage}
              />
            </div>
            <div className="lg:col-span-8 xl:col-span-9">
              <ImageWorkspace
                T={T}
                originalImage={originalImage}
                setOriginalImage={setOriginalImage}
                processedImage={processedImage}
                setProcessedImage={setProcessedImage}
                isLoading={isLoading}
                error={error}
                photoIdOptions={photoIdOptions}
                editorMode={editorMode}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
