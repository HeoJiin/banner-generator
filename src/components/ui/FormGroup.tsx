'use client';

import React from 'react';

interface FormGroupProps {
  children: React.ReactNode;
}

/** FormField 여러 개가 나란히 배치될 때의 간격 (12px) */
export default function FormGroup({ children }: FormGroupProps) {
  return <div className="space-y-3">{children}</div>;
}
