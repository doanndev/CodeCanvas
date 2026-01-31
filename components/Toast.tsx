import React from 'react';

type ToastItem = {
  id: number;
  message: string;
  type?: 'success' | 'error' | 'info';
};

const Toast: React.FC<{ toasts: ToastItem[]; onRemove: (id: number) => void }> = ({ toasts, onRemove }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`max-w-sm w-full px-4 py-3 rounded-lg shadow-lg flex items-start gap-3 text-sm text-white transition-transform transform hover:scale-[1.01] ${
            t.type === 'success' ? 'bg-emerald-500' : t.type === 'error' ? 'bg-rose-500' : 'bg-slate-700'
          }`}
          role="status"
        >
          <div className="flex-1">
            <div className="font-medium">{t.type === 'success' ? 'Success' : t.type === 'error' ? 'Error' : 'Info'}</div>
            <div className="mt-1 text-sm font-normal opacity-95">{t.message}</div>
          </div>
          <button
            onClick={() => onRemove(t.id)}
            className="opacity-90 hover:opacity-100 p-1 rounded-md"
            aria-label="Close notification"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M6 6l8 8M14 6l-8 8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
