import React, { Component } from 'react';
import customPropTypes from 'material-ui/utils/customPropTypes';
import { createStyleSheet } from 'jss-theme-reactor';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Layout from 'material-ui/Layout';
import logo from '../img/mestawet-logo.png';

const stylesheet = createStyleSheet('Nav', (theme) => {
    return {
        appBar: {
            backgroundColor: '#fff',
        },
        logo: {
            maxHeight: '60px',
            maxWidth: '60px',
        },
    };
});

class Nav extends Component {
    static contextTypes = {
        styleManager: customPropTypes.muiRequired,
    }
    render() {
        const classes = this.context.styleManager.render(stylesheet);

        return (
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <Layout container justify="center">
                        <Layout item sm={12} lg={8}>
                            <img className={classes.logo} src={logo} alt="Dallol logo" />
                        </Layout>
                    </Layout>
                </Toolbar>
            </AppBar>
        );
    }
}

export default Nav;