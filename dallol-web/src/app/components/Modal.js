import React, { Component } from 'react';
import PropTypes from 'prop-types';
import customPropTypes from 'material-ui/utils/customPropTypes';
import { createStyleSheet } from 'jss-theme-reactor';
import Dialog from 'material-ui/Dialog';
import { homePath } from 'app/routes';

const stylesheet = createStyleSheet('Modal', (theme) => {
  return {
    dialogPaper: {
      display: 'block',
    },
  };
})

class Modal extends Component {
  constructor(props) {
    super(props);

    this.closeModal = this.closeModal.bind(this);
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
    prevLocation: PropTypes.object.isRequired,
  }

  static contextTypes = {
    styleManager: customPropTypes.muiRequired,
  }

  closeModal() {
    const { prevLocation, history } = this.props;
    const backLocation = prevLocation ? prevLocation.pathname : homePath;
    history.push(backLocation);
  }

  render() {
    const classes = this.context.styleManager.render(stylesheet);

    return (
      <Dialog open={true}
        onRequestClose={this.closeModal}
        paperClassName={classes.dialogPaper}>
        { this.props.children }
      </Dialog>
    );
  }

}

export default Modal;