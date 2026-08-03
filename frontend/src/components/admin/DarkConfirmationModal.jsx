import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

export default function DarkConfirmationModal({
  isOpen,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this record? This action cannot be undone.',
  confirmText = 'Delete Record',
  cancelText = 'Keep Record',
  onConfirm,
  onCancel,
  isDanger = true,
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto select-none"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-md w-full bg-[#121212] rounded-3xl border border-gold/30 shadow-2xl overflow-hidden p-6 sm:p-8"
        >
          {/* Top Border Glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rust via-gold to-rust" />

          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 text-cream hover:bg-white/20 transition-colors flex items-center justify-center border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-rust/20 border border-rust/40 text-rust flex items-center justify-center mx-auto mb-4">
            {isDanger ? (
              <Trash2 className="w-7 h-7 text-rust" />
            ) : (
              <AlertTriangle className="w-7 h-7 text-gold" />
            )}
          </div>

          {/* Content */}
          <div className="text-center">
            <h3 className="text-2xl font-serif font-bold text-cream mb-2">
              {title}
            </h3>
            <p className="text-xs text-cream/70 font-sans leading-relaxed mb-6">
              {message}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 rounded-xl bg-white/10 text-cream text-xs font-montserrat font-bold uppercase tracking-wider hover:bg-white/20 transition-colors border border-white/10"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rust to-rust-dark text-cream text-xs font-montserrat font-bold uppercase tracking-wider shadow-rust-glow-shadow hover:opacity-90 transition-opacity border border-rust/40"
              >
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
