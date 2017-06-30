import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import classnames from 'classnames';

const stylesheet = createStyleSheet('PageShell', {
  'parent': {
    position: 'relative',
  },
  thumbWrap: {
    minHeight: '400px',
    overflow: 'hidden',
    position: 'relative',
    paddingBottom: '0 !important',
  },
  thumb: {
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
  '@media (min-width: 600px)': {
    'content': {
      position: 'absolute',
    },
    'contentOffset': {
      top: '300px',
      left: '50%',
      webkitTransform: 'translate(-50%, 0)',
      transform: 'translate(-50%, 0)',
      width: '100%'
    },
  },
  '@media (max-width: 600px)': {
    'thumbWrap': {
      minHeight: 'auto',
      maxHeight: '300px',
    },
    'thumb': {
      position: 'static',
    },
  },
});

function PageShell(props) {
  const { classes, thumbUrl, children } = props;
  const contentClass = thumbUrl ? classnames(classes.content, classes.contentOffset) : classes.content;

  return (
    <div>
      <Grid container justify='center' className={classes.parent}>
        <Grid item xs={12} className={classes.thumbWrap}>
          {
            thumbUrl &&
            <img className={classes.thumb} src={thumbUrl} alt=''/>
          }
        </Grid>
        <Grid item xs={12} sm={8} className={contentClass}>
          <Paper className={classes.contentPaper}>
            { children }
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

PageShell.propTypes = {
  classes: PropTypes.object.isRequired,
  thumbUrl: PropTypes.string,
  children: PropTypes.node,
}

export default withStyles(stylesheet)(PageShell);