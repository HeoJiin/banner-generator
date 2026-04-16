import React from 'react';
import Label from './Label';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function TextInput({ label, value, onChange, placeholder }: TextInputProps) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2.5 py-1.5 text-caption border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-accent-focus"
      />
    </div>
  );
}
