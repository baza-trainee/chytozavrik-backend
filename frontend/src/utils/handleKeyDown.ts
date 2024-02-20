import React from 'react';

export const handleKeyDown = (event: React.KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault();
  }
};
