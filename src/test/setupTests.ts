import '@testing-library/jest-dom';

jest.mock('framer-motion', () => {
  const React = require('react');

  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    motion: {
      div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
        React.createElement('div', props, children),
    },
  };
});
