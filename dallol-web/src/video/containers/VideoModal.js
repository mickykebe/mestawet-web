import React, { Component } from 'react';
import customPropTypes from 'material-ui/utils/customPropTypes';
import { createStyleSheet } from 'jss-theme-reactor';
import Dialog from 'material-ui/Dialog';
import Youtube from 'react-youtube';
import { connect } from 'react-redux';
import { fetchVideo } from 'video/actions';

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
        this.setVideo = this.setVideo.bind(this);
    }

    setVideo(video) {
        this.setState({
            video,
        });
    }

    componentDidMount() {
        const { id, video, fetchVideo } = this.props;
        if(!video){
            fetchVideo(id);
        }
    }

    closeModal() {
        const backLocation = this.props.referrer ? this.props.referrer : '/';
        this.props.history.push(backLocation);
    }


    render() {
        const classes = this.context.styleManager.render(stylesheet);
        return (
            <Dialog
                open={true}
                onRequestClose={this.closeModal}
                paperClassName={classes.dialogPaper}
                >
                    { this.props && this.props.video &&
                        <div className={classes.videoWrapper}>
                            <Youtube
                                videoId={this.props.video.videoId}
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
  const { id } = ownProps;
  const video = state.videos.youtubeVideos[ownProps.id];

  return { id, video };
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchVideo: (id) => dispatch(fetchVideo(id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoModal);