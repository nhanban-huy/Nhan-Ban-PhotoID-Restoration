
import React from 'react';
import type { EditorMode, Language, PhotoIdOptions, RestorationOptions } from '../types';
import PhotoIdControls from './PhotoIdControls';
import RestorationControls from './RestorationControls';
import { GenerateIcon } from './icons';

interface ControlPanelProps {
  language: Language;
  T: any;
  editorMode: EditorMode;
  setEditorMode: (mode: EditorMode) => void;
  photoIdOptions: PhotoIdOptions;
  setPhotoIdOptions: React.Dispatch<React.SetStateAction<PhotoIdOptions>>;
  restorationOptions: RestorationOptions;
  setRestorationOptions: React.Dispatch<React.SetStateAction<RestorationOptions>>;
  onGenerate: () => void;
  isLoading: boolean;
  hasImage: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  language,
  T,
  editorMode,
  setEditorMode,
  photoIdOptions,
  setPhotoIdOptions,
  restorationOptions,
  setRestorationOptions,
  onGenerate,
  isLoading,
  hasImage,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setEditorMode('photoId')}
            className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
              editorMode === 'photoId'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            {T.photoId}
          </button>
          <button
            onClick={() => setEditorMode('restoration')}
            className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
              editorMode === 'restoration'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            {T.restoration}
          </button>
        </div>
      </div>

      {editorMode === 'photoId' ? (
        <PhotoIdControls
          options={photoIdOptions}
          setOptions={setPhotoIdOptions}
          T={T}
        />
      ) : (
        <RestorationControls
          options={restorationOptions}
          setOptions={setRestorationOptions}
          T={T}
        />
      )}

      <button
        onClick={onGenerate}
        disabled={isLoading || !hasImage}
        className="w-full flex justify-center items-center space-x-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <GenerateIcon className="w-5 h-5" />
        )}
        <span>{isLoading ? T.generating : T.generate}</span>
      </button>
    </div>
  );
};

export default ControlPanel;
