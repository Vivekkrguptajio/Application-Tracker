import { useEffect } from 'react';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`toast-base ${type === 'error' ? 'toast-error' : 'toast-success'}`}>
      {message}
    </div>
  );
}
