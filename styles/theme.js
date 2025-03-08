import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF1233', // Twilio Red
    },
    secondary: {
      main: '#000D25', // Ink
    },
    background: {
      default: '#FFFFFF', // White
    },
    accent: {
      red300: '#FD7685',
      red400: '#F83D53',
      red500: '#DB132A',
      red600: '#B10F23',
      red850: '#430B12',
      red900: '#1D0508',
      blue200: '#3ACEFA',
      blue500: '#1866EE',
      blue850: '#081F47',
      blue900: '#000D25', // Ink
      grey50: '#F3F4F7',
      grey100: '#DDE0E6',
      grey600: '#4D5777',
      grey850: '#191F36',
    },
  },
  typography: {
    fontFamily: 'Twilio Sans, Arial, sans-serif',
  },
});

export default theme;