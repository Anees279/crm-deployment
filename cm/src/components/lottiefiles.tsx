import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react'; // Import Lottie component
import { Box } from '@mui/material';

const LottieAnimation: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed', // Sticks to viewport
        top: 0,
        left: 0,
        width: '100vw',  // Full viewport width
        height: '100vh', // Full viewport height
        zIndex: -1,  // Behind all other content
        overflow: 'hidden', // Ensure no scrolling issues
        backgroundColor: 'black',  // Set blue background
      }}
    >
      {/* Lottie animation component */}
      <DotLottieReact
        src="https://lottie.host/18fca671-5c20-4e1f-9c58-492c70632567/tiBpFb7nEs.lottie"
        loop
        autoplay
        style={{
          width: '100vw',  // Ensure the animation takes full viewport width
          height: '100vh', // Ensure the animation takes full viewport height
          objectFit: 'cover',  // Maintain aspect ratio, covering the area
        }}
      />
    </Box>
  );
};

export default LottieAnimation;
