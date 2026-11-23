import { useState, useEffect, type FormEvent } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export function ContactModal({ open, onClose }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please complete your name, email address, and message before submitting.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setMessage('');
    setError('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#0b1020] p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 id="contact-modal-title" className="font-display text-xl font-bold text-white">
              Contact NovaSpace
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Send educational inquiries, telemetry feedback, or collaboration notes.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close contact dialog"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-cyan-400" aria-hidden="true" />
            <h4 className="mt-4 font-display text-lg font-semibold text-white">
              Inquiry Recorded
            </h4>
            <p className="mt-2 text-sm text-slate-300">
              Thank you, {name}. Your message has been queued for the NovaSpace outreach team.
            </p>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="mt-6 inline-flex min-h-[40px] items-center justify-center rounded-lg bg-cyan-400 px-5 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-300 cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-rose-400/35 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-200"
              >
                {error}
              </p>
            )}

            <div>
              <label htmlFor="contact-name" className="block text-xs font-medium text-slate-300">
                Full Name
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-xs font-medium text-slate-300">
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ada@observatory.org"
                className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-medium text-slate-300">
                Message
              </label>
              <textarea
                id="contact-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your question or feedback..."
                className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="min-h-[40px] rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[40px] rounded-lg bg-cyan-400 px-5 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-300 cursor-pointer"
              >
                Send Message
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
