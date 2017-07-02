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
    paddingTop: '16px',
    paddingBottom: '16px',
    textAlign: 'center',
  },
  fullPaperPadding: {
    padding: '16px',
  },
  '@media (min-width: 600px)': {
    'content': {
      position: 'absolute',
      width: '100%'
    },
    'contentOffset': {
      top: '300px',
      left: '50%',
      webkitTransform: 'translate(-50%, 0)',
      transform: 'translate(-50%, 0)',
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
  const { classes, thumbUrl, sidePadding = true, children } = props;
  const contentClass = thumbUrl ? classnames(classes.content, classes.contentOffset) : classes.content;
  const paperClass = sidePadding ? classnames(classes.contentPaper, classes.fullPaperPadding) : classes.contentPaper;

  return (
    <div>
      <Grid container justify='center' className={classes.parent}>
        <Grid item xs={12} className={classes.thumbWrap}>
          {
            thumbUrl &&
            <img className={classes.thumb} src={thumbUrl} alt=''/>
          }
        </Grid>
        <Grid item xs={12} sm={9} className={contentClass}>
          <Paper className={paperClass}>
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