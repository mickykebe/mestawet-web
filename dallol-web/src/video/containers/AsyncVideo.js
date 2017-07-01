import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchVideoIfNeeded } from 'video/actions';
import { getVideoFromStoreVideos } from 'video/utils';

class AsyncVideo extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  }

  componentDidMount() {
    this.props.fetchVideoIfNeeded(this.props.id);
  }

  componentDidUpdate() {
    this.props.fetchVideoIfNeeded(this.props.id);
  }

  render() {
    const { id, videos, children } = this.props;
    const child = React.Children.only(children);
    const video = getVideoFromStoreVideos(id, videos);

    return  (
      video !== undefined && 
      React.cloneElement(child, { video: video })
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { videos } = state;
  return { videos };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchVideoIfNeeded: (id) => dispatch(fetchVideoIfNeeded(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AsyncVideo);