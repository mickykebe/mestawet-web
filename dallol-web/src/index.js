import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {teal} from 'material-ui/styles/colors';
import createMuiTheme from 'material-ui/styles/theme';
import createPalette from 'material-ui/styles/palette';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const palette = createPalette({
  primary: teal,
  accent: teal,
});

const theme = createMuiTheme({ palette });

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById('root')
);
