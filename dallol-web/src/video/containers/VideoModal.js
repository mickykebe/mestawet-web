import React, { Component } from 'react';
import customPropTypes from 'material-ui/utils/customPropTypes';
import { createStyleSheet } from 'jss-theme-reactor';
import Dialog from 'material-ui/Dialog';
import Youtube from 'react-youtube';
import { connect } from 'react-redux';
import { fetchVideoIfNeeded } from 'video/actions';

const playerOpts = {
        playerVars: {
            autoplay: 1,
        }
    };

const stylesheet = createStyleSheet('YoutubeModal', (theme) => {
    return {
        dialogPaper: {
            display: 'block',
        },
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
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        this.props.fetchVideoIfNeeded(this.props.id);
    }

    componentDidUpdate() {
        this.props.fetchVideoIfNeeded(this.props.id);
    }

    closeModal() {
        const backLocation = this.props.prevLocation ? this.props.prevLocation.pathname : '/';
        this.props.history.push(backLocation);
    }

    render() {
        const classes = this.context.styleManager.render(stylesheet);
        const video = this.props.videos && this.props.videos.youtubeVideos
            && this.props.videos.youtubeVideos[this.props.id];
        

        return (
            <Dialog
                open={true}
                onRequestClose={this.closeModal}
                paperClassName={classes.dialogPaper}
                >
                    { video &&
                        <div className={classes.videoWrapper}>
                            <Youtube
                                videoId={video.videoId}
                                opts={playerOpts}
                                className={classes.youtubeElem}
                                />
                        </div>   
                    }
            </Dialog>
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