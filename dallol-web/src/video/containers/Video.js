import React, { Component } from 'react';
import PropTypes from 'prop-types';
import customPropTypes from 'material-ui/utils/customPropTypes';
import { createStyleSheet } from 'jss-theme-reactor';
import Youtube from 'react-youtube';
import { connect } from 'react-redux';
import { fetchVideoIfNeeded } from 'video/actions';

const playerOpts = {
        playerVars: {
            autoplay: 1,
        }
    };

const stylesheet = createStyleSheet('Video', (theme) => {
    return {
        videoWrapper: {
            position: 'relative',
            paddingBottom: '56.25%',
            paddingTop: '25px',
            height: '0',
            '& > span > iframe': {
                position: 'absolute',
                display: 'block',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%'
            }
        }
    };
});

class VideoModal extends Component {
    static contextTypes = {
        styleManager: customPropTypes.muiRequired,
    }
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
        const { id, videos } = this.props;
        const classes = this.context.styleManager.render(stylesheet);

        return (
          <div className={classes.videoWrapper}>
            {
              videos &&
              (
                (
                  videos.youtubeVideos && videos.youtubeVideos[id] &&
                  <Youtube
                    videoId={videos.youtubeVideos[id].videoId}
                    opts={playerOpts}
                    className={classes.youtubeElem}
                    />
                )
              )
            }
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(VideoModal);