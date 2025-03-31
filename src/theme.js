// import { createContext, useContext, useState } from 'react';
// import { ThemeProvider as StyledProvider } from 'styled-components';

// const themes = {
//   dark: {
//     body: '#1a1a2e',
//     text: '#ffffff',
//     primary: '#00ff88',
//     cardBg: 'rgba(255, 255, 255, 0.1)',
//     toggleBg: 'transparent',
//     messageBg: 'rgba(0, 0, 0, 0.3)',
//     aiMessageBg: 'rgba(0, 255, 136, 0.1)',
//     userMessageBg: 'rgba(255, 255, 255, 0.1)',
//     inputBg: 'rgba(255, 255, 255, 0.05)',
//     buttonText: '#1a1a2e'
//   },
//   light: {
//     body: '#f0f2f5',
//     text: '#1a1a2e',
//     primary: '#007bff',
//     cardBg: '#ffffff',
//     toggleBg: '#ffffff',
//     messageBg: 'rgba(0, 0, 0, 0.05)',
//     aiMessageBg: 'rgba(0, 123, 255, 0.1)',
//     userMessageBg: 'rgba(0, 0, 0, 0.05)',
//     inputBg: '#ffffff',
//     buttonText: '#ffffff'
//   }
// };

// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   const [themeName, setThemeName] = useState('dark');
  
//   const toggleTheme = () => {
//     setThemeName(prev => prev === 'dark' ? 'light' : 'dark');
//   };

//   return (
//     <ThemeContext.Provider value={{ themeName, toggleTheme }}>
//       <StyledProvider theme={themes[themeName]}>
//         {children}
//       </StyledProvider>
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => useContext(ThemeContext);