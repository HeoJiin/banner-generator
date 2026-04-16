'use client';

import React from 'react';

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  defaultValue?: string;
  multiline?: boolean;
}

export default function FormField({ label, value, onChange, placeholder, defaultValue, multiline }: FormFieldProps) {
  const handleFocus = () => {
    if (defaultValue && value === defaultValue) onChange('');
  };
  const handleBlur = () => {
    if (defaultValue && value === '') onChange(defaultValue);
  };

  return (
    <div>
      <label className="block text-field-label font-semibold text-content-tertiary mb-2">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          rows={2}
          className="w-full px-3 py-2 text-body-lg border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent-focus resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-body-lg border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent-focus"
        />
      )}
    </div>
  );
}
