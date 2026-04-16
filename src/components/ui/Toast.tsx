'use client';

import React, { useEffect, useState, useCallback } from 'react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'info' | 'error' | 'undo';
  onUndo?: () => void;
  duration?: number;
}

let addToastFn: ((msg: Omit<ToastMessage, 'id'>) => void) | null = null;

/** 어디서든 toast를 띄울 수 있는 글로벌 함수 */
export function showToast(msg: Omit<ToastMessage, 'id'>) {
  addToastFn?.(msg);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((msg: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { ...msg, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    addToastFn = addToast;
    return () => { addToastFn = null; };
  }, [addToast]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => removeToast(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const duration = toast.duration ?? 3000;

  useEffect(() => {
    const fadeTimer = setTimeout(() => setLeaving(true), duration - 300);
    const removeTimer = setTimeout(onDismiss, duration);
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); };
  }, [duration, onDismiss]);

  const bgColor = toast.type === 'error'
    ? 'bg-destructive'
    : toast.type === 'undo'
      ? 'bg-foreground'
      : 'bg-foreground';

  return (
    <div className={`${bgColor} text-content-inverse px-4 py-2.5 rounded-md shadow-lg text-body font-medium flex items-center gap-3 pointer-events-auto transition-all duration-300 ${leaving ? 'opacity-0 translate-y-2' : 'animate-fade-in'}`}>
      <span>{toast.text}</span>
      {toast.type === 'undo' && toast.onUndo && (
        <button
          onClick={() => { toast.onUndo?.(); onDismiss(); }}
          className="text-primary-200 hover:text-primary-50 font-semibold transition-colors"
        >
          되돌리기
        </button>
      )}
    </div>
  );
}
