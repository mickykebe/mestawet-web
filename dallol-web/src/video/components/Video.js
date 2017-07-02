import React, { Component } from 'react';
import PropTypes from 'prop-types';
import customPropTypes from 'material-ui/utils/customPropTypes';
import { createStyleSheet } from 'jss-theme-reactor';
import Youtube from 'react-youtube';

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
      video: PropTypes.object,
    }

    render() {
        const { video } = this.props;
        const classes = this.context.styleManager.render(stylesheet);

        return (
          <div className={classes.videoWrapper}>
            { 
              video.kind === 'youtubeVideo' &&
              <Youtube
                videoId={video.videoId}
                opts={playerOpts}
                className={classes.youtubeElem}
                />
            }
          </div>
        );
    }
}

export default VideoModal;