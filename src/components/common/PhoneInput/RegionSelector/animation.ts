import { HTMLMotionProps } from 'framer-motion';

export const dropdownListAnimation: HTMLMotionProps<'div'> = {
  initial: { opacity: 0, y: '110%' },
  animate: { opacity: 1, y: '100%' },
  exit: { opacity: 0, y: '110%' },
  transition: { duration: 0.2 },
};
