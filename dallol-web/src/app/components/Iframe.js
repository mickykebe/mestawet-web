import React, { Component } from 'react';
import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from 'material-ui/utils/customPropTypes';
import PropTypes from 'prop-types';

const stylesheet = createStyleSheet('IFrame', theme => ({
  'iframe': {
    width: '100%',
    height: '100vh',
  }
}));

class Iframe extends Component {
  static contextTypes = {
    styleManager: customPropTypes.muiRequired,
  }

  static propTypes = {
    src: PropTypes.string.isRequired,
    title: PropTypes.string,
  }

  render() {
    const classes = this.context.styleManager.render(stylesheet);
    const { src, title } = this.props;

    return (
      <iframe className={classes.iframe} src={src} title={title} sandbox="allow-forms allow-same-origin allow-scripts"></iframe>
    );
  }
}

export default Iframe;