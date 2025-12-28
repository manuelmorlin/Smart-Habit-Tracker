import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, loading = false }) {
  const handleBackdrop = useCallback((e) => {
    if (e.target === e.currentTarget && !loading) onCancel?.();
  }, [onCancel, loading]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape' && !loading) onCancel?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel, loading]);

  if (!open) return null;

  return createPortal(
    <div className="confirm-overlay" role="dialog" aria-modal="true" onClick={handleBackdrop}>
      <div className="confirm-modal" role="document">
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="cancel-btn" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
          <button className={`confirm-btn ${loading ? 'loading' : ''}`} onClick={onConfirm} disabled={loading}>
            {loading ? 'Please wait…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
