import React from 'react';
import { InputProps } from '../../types/Common';

const Input: React.FC<InputProps> = ({
  label,
  error,
  required = false,
  type = 'text',
  placeholder,
  value = '',
  name,
  onChange,
  className = '',
  icon,
  step,
  min,
  max,
}) => {
  const inputClasses = `
    block w-full ${icon ? 'pl-10' : 'px-3'} py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
    focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
    ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
    ${className}
  `.trim();

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          step={step}
          min={min}
          max={max}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'error-message' : undefined}
        />
      </div>
      {error && (
        <p id="error-message" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;