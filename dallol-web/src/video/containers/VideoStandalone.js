import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStyleSheet, withStyles } from 'material-ui/styles';
import Video from 'video/components/Video';
import PageShell from 'app/components/PageShell';
import BigAvatar from 'app/components/BigAvatar';
import Typography from 'material-ui/Typography';
import Icon from 'material-ui/Icon';
import moment from 'moment';

const stylesheet = createStyleSheet('VideoStandalone', {
  srcThumb: {
    margin: '10px auto 30px',
  },
  date: {
    padding: '10px 0',
  },
  dateIcon: {
    fontSize: '17px',
    verticalAlign: 'text-bottom',
    paddingRight: '5px',
  },
  description: {
    padding: '20px 16px',
  },
  title: {
    paddingTop: '30px',
  },
});

class VideoStandalone extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    video: PropTypes.object,
  }

  render() {
    const { video, srcThumbnailUrl, classes } = this.props;
    const { title, date, description } = video;

    return (
      <article>
        <PageShell sidePadding={false}>
          <header>
            <BigAvatar className={classes.srcThumb} thumbUrl={srcThumbnailUrl} />
            <Video video={video} />
            <Typography className={classes.title} type='headline' component='h1'>
              { title }
            </Typography>
            <Typography className={classes.date} type='caption'>
              <Icon className={classes.dateIcon}>access_time</Icon>
              <time className="op-published" dateTime={date}>{moment(date).fromNow()}</time>
            </Typography>
          </header>
          <Typography type='body1' component='p' className={classes.description}>
            { description }
          </Typography>
        </PageShell>
      </article>
    );
  }

}

const mapStateToProps = (state, ownProps) => {
  const source = state.sources[ownProps.video.source];
  return { 
    srcTitle: source.title,
    srcThumbnailUrl: source.thumbnailUrl,
  };
}

export default connect(mapStateToProps)(withStyles(stylesheet)(VideoStandalone));