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
                height: '100%',
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
        this.state = { modalIsOpen: false }
        this.closeModal = this.closeModal.bind(this);
        this.onEntered = this.onEntered.bind(this);
    }

    onEntered() {
        this.setState({
            videoId: this.props.videoId,
        });
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        });
        this.props.onDialogClose();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.videoId){
            this.setState({
                modalIsOpen: true,
            });
        }
    }


    render() {
        const classes = this.context.styleManager.render(stylesheet);
        return (
            <Dialog
                open={this.state.modalIsOpen}
                onRequestClose={this.closeModal}
                onEntered={this.onEntered}
                >
                    <div className={classes.videoWrapper}>
                        <Youtube
                            videoId={this.state.videoId}
                            opts={playerOpts}
                            className={classes.youtubeElem}
                            />
                    </div>
            </Dialog>
        );
    }
}

export default YoutubeModal;