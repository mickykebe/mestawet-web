import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { lightGreen } from 'material-ui/styles/colors';
import createMuiTheme from 'material-ui/styles/theme';
import createPalette from 'material-ui/styles/palette';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const palette = createPalette({
  primary: lightGreen,
  accent: lightGreen,
});

const theme = createMuiTheme({ palette });

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById('root')
);
