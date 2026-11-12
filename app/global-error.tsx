'use client';

// The last fallback, used if the whole site's layout fails. It has to bring its
// own page and styles, and shows no error details.
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: '100dvh', display: 'grid', placeItems: 'center', background: '#f5f5f5', color: '#1a1a1a', fontFamily: '-apple-system, sans-serif', textAlign: 'center', padding: 20 }}>
        <main>
          <h1 style={{ fontSize: 24, margin: '0 0 12px' }}>Something went wrong</h1>
          <p style={{ margin: '0 0 24px', color: '#333' }}>Please try again in a moment.</p>
          <button type="button" onClick={reset} style={{ height: 48, padding: '0 24px', border: 0, borderRadius: 12, background: '#1568d4', color: '#fff', fontSize: 16, cursor: 'pointer' }}>Try again</button>
        </main>
      </body>
    </html>
  );
}
