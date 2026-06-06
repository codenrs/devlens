import React from 'react';

export function PlaceholderPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="devlens-placeholder">
      <div className="devlens-placeholder-title">{title}</div>
      <p>{description}</p>
    </div>
  );
}
