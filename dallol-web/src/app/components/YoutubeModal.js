import React, { Component } from 'react';
import customPropTypes from 'material-ui/utils/customPropTypes';
import { createStyleSheet } from 'jss-theme-reactor';
import Dialog from 'material-ui/Dialog';
import Youtube from 'react-youtube';

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

class YoutubeModal extends Component {
    static contextTypes = {
        styleManager: customPropTypes.muiRequired,
    }
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.onEntered = this.onEntered.bind(this);
    }

    onEntered() {
        this.setState({
            videoId: this.props.videoId,
        });
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
                onEntered={this.onEntered}
                paperClassName={classes.dialogPaper}
                >
                    { this.state && this.state.videoId &&
                        <div className={classes.videoWrapper}>
                            <Youtube
                                videoId={this.state.videoId}
                                opts={playerOpts}
                                className={classes.youtubeElem}
                                />
                        </div>   
                    }
            </Dialog>
        );
    }
}

export default YoutubeModal;