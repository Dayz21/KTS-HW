import '@testing-library/jest-dom';

const mockDomRect = {
  x: 0,
  y: 0,
  width: 100,
  height: 20,
  top: 0,
  right: 100,
  bottom: 20,
  left: 0,
  toJSON: () => ({}),
};

Element.prototype.getClientRects = function getClientRects() {
  return {
    length: 1,
    item: () => mockDomRect,
    [Symbol.iterator]: function* iterator() {
      yield mockDomRect;
    },
  };
};

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
