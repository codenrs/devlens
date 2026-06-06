import React from 'react';

export function ConsoleMessage({
  message,
  compact = false,
}: {
  message: string;
  compact?: boolean;
}) {
  return (
    <pre
      className={
        compact
          ? 'devlens-console-message devlens-console-message-compact'
          : 'devlens-console-message'
      }
    >
      {message}
    </pre>
  );
}
