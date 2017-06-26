import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from 'material-ui/utils/customPropTypes';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Avatar from 'material-ui/Avatar';
import moment from 'moment';
import Icon from 'material-ui/Icon';

const stylesheet = createStyleSheet('Article', theme => ({
  'parent': {
    position: 'relative',
  },
  'thumbWrap': {
    minHeight: '400px',
    overflow: 'hidden',
    position: 'relative',
    paddingBottom: '0 !important',
  },
  'thumb': {
    display: 'block',
    width: '100%',
    position: 'absolute',
    top: '0',
    bottom: '0',
    margin: 'auto',
  },
  'content': {
    paddingTop: '0 !important',
  },
  'contentPaper': {
    padding: '16px',
    textAlign: 'center',
  },
  'srcThumb': {
    margin: '10px auto 30px',
    width: '80px',
    height: '80px',
  },
  'date': {
    padding: '10px 0',
  },
  'dateIcon': {
    fontSize: '17px',
    verticalAlign: 'text-bottom',
    paddingRight: '5px',
  },
  'textContent': {
    textAlign: 'justify',
  },
  '@media (min-width: 600px)': {
    'content': {
      position: 'absolute',
      top: '350px',
    },
  },
  '@media (max-width: 600px)': {
    'thumbWrap': {
      minHeight: 'auto',
    },
    'thumb': {
      position: 'static',
    },
  },
}));

class Article extends Component {
  static contextTypes = {
    styleManager: customPropTypes.muiRequired,
  };

  static propTypes = {
    title: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string,
    textContent: PropTypes.string.isRequired,
    date: PropTypes.string,
    url: PropTypes.string,
    srcTitle: PropTypes.string,
    srcThumbnailUrl: PropTypes.string,
  }

  render() {
    const classes = this.context.styleManager.render(stylesheet);
    const { title, thumbnailUrl, textContent, date, srcThumbnailUrl, srcTitle } = this.props;

    return (
      <div>
        <Grid container justify='center' className={classes.parent}>
          <Grid item xs={12} className={classes.thumbWrap}>
            {
              thumbnailUrl &&
              <img className={classes.thumb} src={thumbnailUrl} alt='' />
            }
          </Grid>
          <Grid item xs={12} sm={8} className={classes.content}>
            <Paper className={classes.contentPaper}>
              <div>
                <Avatar className={classes.srcThumb} src={srcThumbnailUrl} alt={srcTitle} />
                <Typography type='headline' component='h3'>
                  { title }
                </Typography>
                <Typography className={classes.date} type='caption'>
                  <Icon className={classes.dateIcon}>access_time</Icon>
                  {moment(date).fromNow()}
                </Typography>
              </div>
              <Typography type='body1' component='p' className={classes.textContent} dangerouslySetInnerHTML={{ __html: textContent }} />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Article;