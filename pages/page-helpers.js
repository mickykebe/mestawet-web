import React from 'react';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import createPalette from 'material-ui/styles/palette';
import { lightGreen } from 'material-ui/styles/colors';
import { renderToString } from 'react-dom/server';
import App from '../dallol-web/src/app/App';

const { getBuiltCssFileName, getBuiltJsFileName } = require('../utils');

function renderFullPage(htmlHeaders, html, css) {
  return Promise.all([getBuiltJsFileName(), getBuiltCssFileName()])
    .then(fileNames =>
      `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            ${htmlHeaders}
            <meta property="fb:pages" content="1917136798554815" />
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <link rel="apple-touch-icon" sizes="57x57" href="/favicon/apple-icon-57x57.png">
            <link rel="apple-touch-icon" sizes="60x60" href="/favicon/apple-icon-60x60.png">
            <link rel="apple-touch-icon" sizes="72x72" href="/favicon/apple-icon-72x72.png">
            <link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-icon-76x76.png">
            <link rel="apple-touch-icon" sizes="114x114" href="/favicon/apple-icon-114x114.png">
            <link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-icon-120x120.png">
            <link rel="apple-touch-icon" sizes="144x144" href="/favicon/apple-icon-144x144.png">
            <link rel="apple-touch-icon" sizes="152x152" href="/favicon/apple-icon-152x152.png">
            <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-icon-180x180.png">
            <link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-icon-192x192.png">
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">
            <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png">
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png">
            <link rel="manifest" href="/manifest.json">
            <meta name="msapplication-TileColor" content="#ffffff">
            <meta name="msapplication-TileImage" content="/favicon//ms-icon-144x144.png">
            <meta name="theme-color" content="#689f38">
            <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500" rel="stylesheet">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/6.0.0/normalize.min.css">
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
            <script src="https://cdn.polyfill.io/v2/polyfill.min.js" async defer="defer"></script>
            <title>Mestawet - Ethiopian news and videos</title>
            <!--<link href="/static/css/${fileNames[1]}" rel="stylesheet">-->
          </head>
          <body>
            <div id="root">${html}</div>
            <style id="jss-server-side">${css}</style>
            <script type="text/javascript" src="/static/js/${fileNames[0]}"></script>
            <script>window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)},ga.l=+new Date,ga("create","UA-99619740-1","auto"),ga("send","pageview")</script>
            <script async src="https://www.google-analytics.com/analytics.js"></script>
          </body>
        </html>
      `);
}

function pageHtml(htmlHeaders, location, store) {
  function createStyleManager() {
    return MuiThemeProvider.createDefaultContext({
      theme: createMuiTheme({
        palette: createPalette({
          primary: lightGreen,
          accent: lightGreen,
        }),
      }),
    });
  }
  const { styleManager, theme } = createStyleManager();

  const html = renderToString(
    <MuiThemeProvider styleManager={styleManager} theme={theme}>
      <Provider store={store}>
        <StaticRouter location={location} context={{}}>
          <App />
        </StaticRouter>
      </Provider>
    </MuiThemeProvider>
  );

  const css = styleManager.sheetsToString();
  return renderFullPage(htmlHeaders, html, css);
}

module.exports = pageHtml;
