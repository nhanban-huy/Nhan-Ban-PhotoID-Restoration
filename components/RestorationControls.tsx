import React from 'react';
import type { RestorationOptions } from '../types';

interface RestorationControlsProps {
  options: RestorationOptions;
  setOptions: React.Dispatch<React.SetStateAction<RestorationOptions>>;
  T: any;
}

const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-3 pt-4 border-t first:border-t-0 first:pt-0">
        <h3 className="text-md font-semibold text-gray-700">{title}</h3>
        {children}
    </div>
);

const Radio: React.FC<{ label: string; name: string; value: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, name, value, checked, onChange }) => (
    <label className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50">
        <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
        <span className="text-sm text-gray-700">{label}</span>
    </label>
);

const Checkbox: React.FC<{ label: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, checked, onChange }) => (
    <label className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50">
        <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
        <span className="text-sm text-gray-700">{label}</span>
    </label>
);

const RestorationControls: React.FC<RestorationControlsProps> = ({ options, setOptions, T }) => {
  const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions(prev => ({ ...prev, mode: e.target.value as RestorationOptions['mode'] }));
  };

  const handleAdvancedChange = (key: keyof RestorationOptions['advanced'], value: boolean) => {
    setOptions(prev => ({
      ...prev,
      advanced: {
        ...prev.advanced,
        [key]: value,
      }
    }));
  };

  const modes: { key: RestorationOptions['mode']; label: string }[] = [
    { key: 'restore_colorize', label: T.restoreColorize },
    { key: 'high_quality', label: T.highQualityRestore },
    { key: 'reconstruct', label: T.reconstructDamaged },
    { key: 'remove_yellow', label: T.removeYellowing },
    { key: 'sharpen', label: T.sharpen },
    { key: 'enhance_details', label: T.enhanceDetails },
  ];

  const advancedOptions: { key: keyof RestorationOptions['advanced']; label: string }[] = [
    { key: 'detailedHair', label: T.detailedHair },
    { key: 'restoreClothing', label: T.restoreClothing },
    { key: 'clarifyBackground', label: T.clarifyBackground },
    { key: 'keepFace', label: T.keepFace },
  ];

  return (
    <div className="space-y-4">
      <Section title={T.restorationMode}>
        <div className="space-y-1">
          {modes.map(({ key, label }) => (
            <Radio
              key={key}
              label={label}
              name="restorationMode"
              value={key}
              checked={options.mode === key}
              onChange={handleModeChange}
            />
          ))}
        </div>
      </Section>
      <Section title={T.advancedOptions}>
        <div className="space-y-1">
            {advancedOptions.map(({ key, label }) => (
                 <Checkbox
                    key={key}
                    label={label}
                    checked={options.advanced[key]}
                    onChange={(e) => handleAdvancedChange(key, e.target.checked)}
                />
            ))}
        </div>
      </Section>
      <Section title={T.customRequest}>
        <textarea
            value={options.customPrompt}
            onChange={(e) => setOptions(prev => ({...prev, customPrompt: e.target.value}))}
            placeholder={T.customRequestPlaceholder}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        />
      </Section>
    </div>
  );
};

export default RestorationControls;
