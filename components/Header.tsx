
import React from 'react';
import type { Language } from '../types';
import { GlobeIcon } from './icons';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, title }) => {
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'vi' : 'en');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
          {title}
        </h1>
        <button
          onClick={toggleLanguage}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          aria-label="Change language"
        >
          <GlobeIcon className="w-5 h-5" />
          <span className="text-sm uppercase">{language === 'en' ? 'VI' : 'EN'}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
