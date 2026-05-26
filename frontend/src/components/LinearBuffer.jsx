import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

/**
 * MUI buffer progress bar — runs while `active`, completes when `active` becomes false.
 */
export default function LinearBuffer({ active, label }) {
  const [progress, setProgress] = React.useState(0);
  const [buffer, setBuffer] = React.useState(10);

  React.useEffect(() => {
    if (!active) {
      setProgress(100);
      const t = setTimeout(() => {
        setProgress(0);
        setBuffer(10);
      }, 400);
      return () => clearTimeout(t);
    }

    setProgress(8);
    setBuffer(18);

    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 92 ? prev : prev + 1));
      setBuffer((buf) => {
        if (buf >= 98) return buf;
        const next = buf + 1 + Math.random() * 10;
        return next > 100 ? 100 : next;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [active]);

  if (!active && progress === 0) return null;

  return (
    <Box sx={{ width: '100%' }}>
      {label && (
        <p className="text-sm text-slate mb-2" style={{ margin: '0 0 8px 0' }}>
          {label}
        </p>
      )}
      <LinearProgress
        variant="buffer"
        value={active ? progress : 100}
        valueBuffer={buffer}
        aria-label="Loading"
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: '#ebe6dc',
          '& .MuiLinearProgress-bar1Buffer': { backgroundColor: '#1a1f2e' },
          '& .MuiLinearProgress-bar2Buffer': { backgroundColor: '#b84a32' },
          '& .MuiLinearProgress-dashed': { display: 'none' },
        }}
      />
    </Box>
  );
}
