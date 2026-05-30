import * as React from 'react';
import { cva } from 'class-variance-authority';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export const transformVariants = (direction) => ({
  hidden: {
    x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
    y: direction === 'top' ? '-100%' : direction === 'bottom' ? '100%' : 0,
    scale: direction === 'z' ? 0 : 1,
    opacity: 0,
  },
  visible: {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
  },
});

export const GRADIENT_COLORS = {
  blue: [
    { color: 'rgb(180, 176, 254)', start: '0%' },
    { color: 'rgb(54, 50, 133)', start: '22.92%' },
    { color: 'rgb(17, 13, 91)', start: '42.71%' },
    { color: 'rgb(5, 3, 39)', start: '88.54%' },
  ],
  green: [
    { color: '#116A67', start: '0%' },
    { color: '#0E5856', start: '22.92%' },
    { color: '#0B4745', start: '42.71%' },
    { color: '#062726', start: '88.54%' },
  ],
  rust: [
    { color: '#d4654a', start: '0%' },
    { color: '#7d2f24', start: '28%' },
    { color: '#1a1f2e', start: '70%' },
    { color: '#0a0d14', start: '100%' },
  ],
};

const GRADIENT_SIZES = {
  default: { width: '70%', height: '55%' },
  sm: { width: '50%', height: '35%' },
  lg: { width: '85%', height: '70%' },
};

const GRADIENT_POSITIONS = {
  top: { x: '50%', y: '-10%' },
  center: { x: '50%', y: '50%' },
  bottom: { x: '50%', y: '110%' },
};

const transitionConfig = { ease: [0.25, 0.1, 0.25, 1], duration: 0.5 };

const heroVariants = cva('relative min-h-svh w-full overflow-hidden', {
  variants: {
    layout: {
      default: 'flex flex-col items-center justify-center text-center',
      colLeft: 'flex flex-col justify-center items-start',
    },
  },
  defaultVariants: {
    layout: 'default',
  },
});

export function Hero({ children, className, layout, ...props }) {
  return (
    <section className={cn(heroVariants({ layout }), className)} {...props}>
      {children}
    </section>
  );
}

export function BgGradient({
  gradientSize = 'default',
  gradientPosition = 'top',
  gradientColors = 'green',
  className,
  ...props
}) {
  const colors = Array.isArray(gradientColors) ? gradientColors : GRADIENT_COLORS[gradientColors];
  const size = typeof gradientSize === 'string' ? GRADIENT_SIZES[gradientSize] : gradientSize;
  const position = typeof gradientPosition === 'string' ? GRADIENT_POSITIONS[gradientPosition] : gradientPosition;
  const gradientString = colors.map(({ color, start }) => `${color} ${start}`).join(', ');
  const dominantColor = colors[colors.length - 1].color;

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 size-full select-none', className)}
      style={{
        background: dominantColor,
        backgroundImage: `radial-gradient(${size.width} ${size.height} at ${position.x} ${position.y}, ${gradientString})`,
        ...props.style,
      }}
      {...props}
    />
  );
}

function Word({ word, transition = transitionConfig, direction = 'bottom' }) {
  return (
    <span className="inline-block text-nowrap align-top">
      {word.split('').map((char, index) => (
        <span key={index} className="inline-block">
          <motion.span className="inline-block" variants={transformVariants(direction)} transition={transition}>
            {char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function TextStagger({
  text,
  stagger = 0.045,
  transition,
  direction,
  className,
  as: Component = 'span',
  ...props
}) {
  const MotionComp = motion.create(Component);
  const words = text.split(' ');

  return (
    <MotionComp
      transition={{ staggerChildren: stagger }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn('relative', className)}
      {...props}
    >
      {words.map((word, index) => (
        <React.Fragment key={index}>
          <Word transition={transition} direction={direction} word={word} />
          {index < words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </MotionComp>
  );
}

export const AnimatedContainer = React.forwardRef(
  ({ children, className, transformDirection = 'bottom', ...props }, ref) => (
    <motion.div
      className={cn('relative z-10', className)}
      ref={ref}
      variants={transformVariants(transformDirection)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, ...props.viewport }}
      transition={{ duration: 0.55, ease: 'easeOut', delay: 0.25, ...props.transition }}
      {...props}
    >
      {children}
    </motion.div>
  )
);

AnimatedContainer.displayName = 'AnimatedContainer';
