import React, { Component } from 'react';
import customPropTypes from 'material-ui/utils/customPropTypes';
import { createStyleSheet } from 'jss-theme-reactor';
import { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography'

const stylesheet = createStyleSheet('DallolCardTitle', (theme) => {
    return {
        header: {
            paddingTop: '0',
        },
        text: {
            fontSize: '1.2rem',
        },
    };
});

class DallolCardTitle extends Component {
    static contextTypes = {
        styleManager: customPropTypes.muiRequired,
    }

    render() {
        const classes = this.context.styleManager.render(stylesheet);

        return (
            <CardContent className={classes.header}>
                <Typography className={classes.text}>
                    { this.props.children }
                </Typography>
            </CardContent>
        );
    }
}

export default DallolCardTitle;