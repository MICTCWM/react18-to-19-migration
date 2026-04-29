import { createContext } from 'react';

const ThemeContext = createContext({
  foreground: '#000',
  background: '#fff',
});

export default ThemeContext;
