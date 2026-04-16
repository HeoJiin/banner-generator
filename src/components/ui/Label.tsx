import React from 'react';

export default function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-field-label font-semibold text-content-tertiary mb-2">{children}</label>;
}
