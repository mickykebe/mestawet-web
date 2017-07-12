import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import BigAvatar from 'app/components/BigAvatar';
import moment from 'moment';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import PageShell from 'app/components/PageShell';

const stylesheet = createStyleSheet('Article', {
  'srcThumb': {
    margin: '10px auto 30px',
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
  actions: {
    padding: '10px',
  },
});

class Article extends Component {

  constructor(props) {
    super(props);

    this.openExternally = this.openExternally.bind(this);
  }

  openExternally() {
    window.open(this.props.url);
  }

  static propTypes = {
    id: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string,
    textContent: PropTypes.string.isRequired,
    date: PropTypes.string,
    url: PropTypes.string,
    srcTitle: PropTypes.string,
    srcThumbnailUrl: PropTypes.string,
  }

  render() {
    const { classes, title, thumbnailUrl, textContent, date, srcThumbnailUrl } = this.props;

    return (
      <PageShell thumbUrl={thumbnailUrl}>
        <article>
          <header>
            <BigAvatar className={classes.srcThumb} thumbUrl={srcThumbnailUrl} />
            <Typography type='headline' component='h3'>
              { title }
            </Typography>
            <Typography className={classes.date} type='caption'>
              <Icon className={classes.dateIcon}>access_time</Icon>
              {moment(date).fromNow()}
            </Typography>
            <div>
              <IconButton aria-label="open external" onClick={this.openExternally}>
                <Icon>open_in_new</Icon>
              </IconButton>
            </div>
          </header>
          <Typography type='body1' component='p' className={classes.textContent} dangerouslySetInnerHTML={{ __html: textContent }} />
        </article>
      </PageShell>
    );
  }
}

export default withStyles(stylesheet)(Article);