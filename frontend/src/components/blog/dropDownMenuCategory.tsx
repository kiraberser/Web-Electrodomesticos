'use client'

import { useState, useRef, useEffect } from 'react';

interface Option {
    id: string | number;
    label: string;
    value: string;
}

interface DropDownParams {
    options: Option[];
    onSelect: (option: Option) => void;
}

const dropDownMenuCategory = ({ options, onSelect }: DropDownParams) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  

  // Cierra el menú cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
<div className="dropdown-container relative" ref={dropdownRef}>
      <button 
        className="dropdown-button cursor-pointer bg-white px-4 py-3 rounded-lg border border-gray-300 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm flex items-center justify-between w-full transition-all duration-200"
        onClick={toggleDropdown}
      >
        <span className={`font-medium ${selectedOption ? 'text-gray-800' : 'text-gray-500'}`}>
          {selectedOption ? selectedOption.label : 'Seleccionar opción'}
        </span>
        <span className={`ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180 transform' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      
      {isOpen && (
        <div className="dropdown-menu absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden transform transition-all duration-200 ease-out origin-top scale-100 opacity-100 max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <div
              key={option.id}
              className={`dropdown-item px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 ${
                selectedOption && selectedOption.id === option.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              } ${index !== 0 ? 'border-t border-gray-100' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default dropDownMenuCategory;