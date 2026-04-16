'use client';

import React from 'react';
import { PRESET_COLORS } from '@/types/banner';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  compact?: boolean;
}

export default function ColorPicker({ label, value, onChange, compact = false }: ColorPickerProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded-sm cursor-pointer"
          aria-label="색상 선택"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) onChange(e.target.value);
          }}
          className="w-20 px-2 py-1 text-caption font-mono border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-accent-focus"
          placeholder="#000000"
          maxLength={7}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-field-label font-semibold text-content-tertiary mb-2">{label}</label>
      )}

      {/* Preset Colors */}
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`w-7 h-7 rounded-full border-2 transition-all duration-150 active:scale-90 ${
              value === color
                ? 'border-accent-border scale-110 ring-2 ring-accent-border-subtle shadow-sm'
                : 'border-border hover:border-border-strong hover:scale-105'
            }`}
            style={{ backgroundColor: color }}
            aria-label={`색상 ${color} 선택`}
          />
        ))}
      </div>

      {/* Custom Color */}
      <div className="flex items-center gap-2 mt-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-sm cursor-pointer"
          aria-label="커스텀 색상 선택"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) onChange(e.target.value);
          }}
          className="w-24 px-2 py-1.5 text-body font-mono border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-accent-focus"
          placeholder="#000000"
          maxLength={7}
        />
      </div>
    </div>
  );
}
