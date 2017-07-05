import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import customPropTypes from 'material-ui/utils/customPropTypes';
import { createStyleSheet } from 'jss-theme-reactor';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import { homePath } from 'app/routes';

const stylesheet = createStyleSheet('Nav', (theme) => {
    return {
        appBar: {
          backgroundColor: '#fff'
        },
        toolbar: {
          position: 'relative',
          height: '64px',
        },
        logo: {
          maxHeight: '60px',
          maxWidth: '60px',
        },
        logoWrap: {
          position: 'absolute',
          left: '50%',
          top: '23px',
          bottom: '0',
          webkitTransform: 'translate(-50%, -50%)',
          transform: 'translate(-50%, -50%)',
        },
    };
});

class Nav extends Component {
    static contextTypes = {
        styleManager: customPropTypes.muiRequired,
    }

    constructor(props) {
      super(props);

      this.onBackClick = this.onBackClick.bind(this);
    }

    onBackClick() {
      this.props.history.push(homePath);
    }

    render() {
        const classes = this.context.styleManager.render(stylesheet);

        return (
            <AppBar className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                  {
                    this.props.location.pathname !== homePath &&
                    <IconButton onClick={this.onBackClick} aria-label="Back">
                      <Icon>arrow_back</Icon>
                    </IconButton>
                  }
                  <Link className={classes.logoWrap} to="/">
                      <img className={classes.logo} src={process.env.PUBLIC_URL + '/img/logo.png'} alt="Mestawet logo" />
                  </Link>
                </Toolbar>
            </AppBar>
        );
    }
}

export default Nav;