import React, { useState, useRef, useEffect } from 'react';
import type { PhotoIdOptions } from '../types';

interface PhotoIdControlsProps {
  options: PhotoIdOptions;
  setOptions: React.Dispatch<React.SetStateAction<PhotoIdOptions>>;
  T: any;
}

const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-3 pt-4 border-t first:border-t-0 first:pt-0">
        <h3 className="text-md font-semibold text-gray-700">{title}</h3>
        {children}
    </div>
);

const Select: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }> = ({ label, value, onChange, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <select value={value} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm">
            {children}
        </select>
    </div>
);

const Checkbox: React.FC<{ label: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, disabled?: boolean }> = ({ label, checked, onChange, disabled=false }) => (
    <label className="flex items-center space-x-2">
        <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
        <span className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>{label}</span>
    </label>
);

const presetColors = ['#e0f2fe', '#ffffff', '#f3f4f6', '#d1d5db', '#9ca3af', '#bfdbfe', '#a5b4fc', '#dbeafe'];

const PhotoIdControls: React.FC<PhotoIdControlsProps> = ({ options, setOptions, T }) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setIsColorPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionChange = <K extends keyof PhotoIdOptions>(key: K, value: PhotoIdOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleNestedChange = <K1 extends keyof PhotoIdOptions, K2 extends keyof PhotoIdOptions[K1]>(key1: K1, key2: K2, value: PhotoIdOptions[K1][K2]) => {
    setOptions(prev => ({
      ...prev,
      [key1]: {
        ...prev[key1],
        [key2]: value
      }
    }));
  };

  return (
    <div className="space-y-4">
      <Section title={T.photoSize}>
        <div className="grid grid-cols-2 gap-2">
            {(['2x3', '3x4', '4x6', '5x5'] as const).map(size => (
                <button key={size} onClick={() => handleOptionChange('size', size)} className={`px-2 py-1.5 text-sm border rounded-md ${options.size === size ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'border-gray-300 hover:bg-gray-100'}`}>{size}</button>
            ))}
        </div>
      </Section>
      <Section title={T.paperSize}>
        <div className="grid grid-cols-3 gap-2">
            {(['A6', 'A5', 'A4'] as const).map(size => (
                <button key={size} onClick={() => handleOptionChange('paper', size)} className={`px-2 py-1.5 text-sm border rounded-md ${options.paper === size ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'border-gray-300 hover:bg-gray-100'}`}>{size}</button>
            ))}
        </div>
      </Section>

      <Section title={T.attire}>
        <Select label={T.attire} value={options.attire} onChange={e => handleOptionChange('attire', e.target.value as PhotoIdOptions['attire'])}>
          <option value="white_shirt">{T.whiteShirt}</option>
          <option value="ao_dai">{T.aoDai}</option>
          <option value="vest_tie">{T.vestTie}</option>
          <option value="vest_bowtie">{T.vestBowtie}</option>
          <option value="custom">{T.custom}</option>
        </Select>
        {options.attire === 'custom' && (
          <input type="text" placeholder={T.customAttirePrompt} value={options.customAttire} onChange={e => handleOptionChange('customAttire', e.target.value)} className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
        )}
      </Section>
      
      <Section title={T.faceAndHair}>
        <div className="space-y-2">
          <Checkbox label={T.autoEnhance} checked={options.faceAndHair.auto} onChange={e => handleNestedChange('faceAndHair', 'auto', e.target.checked)} />
          <div className="pl-6 space-y-2">
            <Select label={T.hairStyle} value={options.faceAndHair.hairStyle} onChange={e => handleNestedChange('faceAndHair', 'hairStyle', e.target.value as PhotoIdOptions['faceAndHair']['hairStyle'])} >
              <option value="keep">{T.hairKeep}</option>
              <option value="long_front">{T.hairLongFront}</option>
              <option value="long_back">{T.hairLongBack}</option>
              <option value="short">{T.hairShort}</option>
            </Select>
            <Checkbox label={T.skinSmoothing} checked={options.faceAndHair.skinSmoothing} onChange={e => handleNestedChange('faceAndHair', 'skinSmoothing', e.target.checked)} disabled={options.faceAndHair.auto} />
            <Checkbox label={T.freckleRemoval} checked={options.faceAndHair.freckleRemoval} onChange={e => handleNestedChange('faceAndHair', 'freckleRemoval', e.target.checked)} disabled={options.faceAndHair.auto} />
            <Checkbox label={T.keepFace} checked={options.faceAndHair.keepFace} onChange={e => handleNestedChange('faceAndHair', 'keepFace', e.target.checked)} disabled={options.faceAndHair.auto} />
          </div>
        </div>
      </Section>

      <Section title={T.background}>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleNestedChange('background', 'color', 'light_blue')}
            className={`w-10 h-10 rounded-full bg-[#e0f2fe] border-2 transition-all ${options.background.color === 'light_blue' ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-300'}`}
            aria-label={T.lightBlue}
          ></button>
          <button
            onClick={() => handleNestedChange('background', 'color', 'white')}
            className={`w-10 h-10 rounded-full bg-white border-2 transition-all ${options.background.color === 'white' ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-300'}`}
            aria-label={T.white}
          ></button>
          <div className="relative" ref={colorPickerRef}>
            <button
              onClick={() => {
                handleNestedChange('background', 'color', 'custom');
                setIsColorPickerOpen(prev => !prev);
              }}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${options.background.color === 'custom' ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-300'}`}
              style={{ backgroundColor: options.background.customColor }}
              aria-label={T.customColor}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-black/20">
                <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
              </svg>
            </button>

            {isColorPickerOpen && (
              <div className="absolute z-10 top-full mt-2 w-[240px] p-4 bg-white rounded-lg shadow-xl border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">{T.customColor}</label>
                <div className="grid grid-cols-6 gap-2 mb-3">
                  {presetColors.map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        handleNestedChange('background', 'customColor', color);
                        handleNestedChange('background', 'color', 'custom');
                      }}
                      className={`w-8 h-8 rounded-full border border-gray-200 transition-transform transform hover:scale-110 ${options.background.customColor === color && options.background.color === 'custom' ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`}
                      style={{ backgroundColor: color }}
                      aria-label={`Color ${color}`}
                    />
                  ))}
                </div>
                <div className="relative border border-gray-200 rounded-md overflow-hidden">
                   <input
                     type="color"
                     value={options.background.customColor}
                     onChange={e => {
                       handleNestedChange('background', 'customColor', e.target.value);
                       handleNestedChange('background', 'color', 'custom');
                     }}
                     className="w-full h-10 p-0 border-none appearance-none cursor-pointer"
                   />
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default PhotoIdControls;