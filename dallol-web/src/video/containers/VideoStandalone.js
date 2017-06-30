import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Video from 'video/containers/Video';

class VideoStandalone extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  }

  render() {
    return (
      <Video id={this.props.id} />
    );
  }

}

export default VideoStandalone;