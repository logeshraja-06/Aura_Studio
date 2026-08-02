import React from 'react';

export function InstagramIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

export function LinkedinIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  );
}

export function FacebookIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  );
}

export function VimeoIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M22.4 7.16c-.09 1.95-1.46 4.63-4.11 8.04-2.73 3.52-5.04 5.28-6.93 5.28-1.18 0-2.18-.54-3.01-1.63-.83-1.08-1.66-3.25-2.48-6.5-.83-3.15-1.54-4.73-2.13-4.73-.13 0-.58.27-1.35.81L1 6.84c.83-.73 1.66-1.46 2.49-2.19 1.13-1 1.98-1.52 2.55-1.56 1.34-.09 2.16.82 2.46 2.73.34 2.13.58 3.86.72 5.18.28 2.21.68 3.32 1.2 3.32.4 0 .99-.64 1.77-1.91.78-1.28 1.2-2.22 1.26-2.83.12-1.13-.33-1.7-1.34-1.7-.47 0-.96.11-1.48.33 1-.3 1.95-.9 2.85-1.8 1.19-1.2 2.05-1.8 2.58-1.8.84 0 1.27.57 1.29 1.71z" />
    </svg>
  );
}
