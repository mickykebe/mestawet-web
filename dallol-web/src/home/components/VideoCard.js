import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import customPropTypes from 'material-ui/utils/customPropTypes';
import { createStyleSheet } from 'jss-theme-reactor';
import {
    CardHeader,
 } from 'material-ui/Card';
import DallolCard from 'app/components/DallolCard';
import DallolCardMedia from 'app/components/DallolCardMedia';
import Avatar from 'material-ui/Avatar';
import DallolCardTitle from 'app/components/DallolCardTitle';
import moment from 'moment';

const stylesheet = createStyleSheet('YoutubeCard', (theme) => {
    return {
        videoCard: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        cardMedia: {
            flexGrow: '1',
        },
        playIcon: {
            fontSize: '2.5rem',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            color: theme.palette.primary[800],
        }
    };
})

class VideoCard extends React.Component {
    static contextTypes = {
        styleManager: customPropTypes.muiRequired,
    }
    static propTypes = {
        video: PropTypes.object.isRequired,
        source: PropTypes.object.isRequired,
    }

    render() {
        const classes = this.context.styleManager.render(stylesheet);
        const { _id: id, thumbnailUrl, title, date } = this.props.video;
        const { thumbnailUrl:srcThumbUrl, title:srcTitle } = this.props.source;

        return (
            <Link to={{
                pathname: `/video/${id}`,
                state: { modal: true },
            }}>
                <DallolCard className={classes.videoCard}>
                    <CardHeader
                        title={srcTitle}
                        subheader={moment(date).fromNow()}
                        avatar={srcThumbUrl && <Avatar src={srcThumbUrl} />}
                        />
                    <DallolCardTitle>
                        { title }
                    </DallolCardTitle>
                    {
                        thumbnailUrl &&
                        <DallolCardMedia className={classes.cardMedia}>
                            <img src={thumbnailUrl} alt="video" />
                            <i className={`material-icons ${classes.playIcon}`}>play_circle_filled</i>
                        </DallolCardMedia>
                    }
                </DallolCard>
            </Link>
        );
    }
}

export default VideoCard;