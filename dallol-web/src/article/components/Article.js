import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Article extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string,
    textContent: PropTypes.string.isRequired,
    date: PropTypes.string,
    url: PropTypes.string,
    srcTitle: PropTypes.string,
    srcThumbnailUrl: PropTypes.string,
  }

  render() {
    
  }
}

return Article;