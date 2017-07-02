import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import classnames from 'classnames';

const stylesheet = createStyleSheet('BigAvatar', {
  avatar: {
    width: '80px',
    height: '80px',
  }
})

function BigAvatar(props) { 
  const { className: classNameProp } = props;
  return <Avatar className={classnames(classNameProp, props.classes.avatar)} src={props.thumbUrl} />
}

BigAvatar.propTypes = {
  thumbUrl: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(stylesheet)(BigAvatar);