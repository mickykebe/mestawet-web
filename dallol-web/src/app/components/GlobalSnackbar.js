import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import Slide from 'material-ui/transitions/Slide';

class GlobalSnackbar extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = { show: false };
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
  }

  handleSnackbarClose() {
    this.setState({
      show: false,
    });
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.show !== this.props.show)
    this.setState({
      show: nextProps.show
    });
  }

  render() {
    return <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={this.state.show}
      autoHideDuration={6e3}
      message={<span id='message-id'>{this.props.message}</span>}
      transition={<Slide direction='up' />}
      action={[
        <IconButton
          key='close'
          aria-label='Close'
          color='inherit'
          onClick={this.handleSnackbarClose}>
          <Icon>clear</Icon>
        </IconButton>
      ]} />
  }
}

export default GlobalSnackbar;