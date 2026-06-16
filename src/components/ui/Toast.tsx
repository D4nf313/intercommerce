import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const colors = {
  success: { background: '#22c55e', border: '#16a34a' },
  error:   { background: '#ef4444', border: '#dc2626' },
};

const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        padding: '12px 20px',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '14px',
        fontWeight: 500,
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        background: colors[type].background,
        border: `1px solid ${colors[type].border}`,
        maxWidth: '320px',
        wordBreak: 'break-word',
      }}
    >
      {message}
    </div>
  );
};

export default Toast;
