import React, { Component } from 'react';
import customPropTypes from 'material-ui/utils/customPropTypes';
import { createStyleSheet } from 'jss-theme-reactor';
import { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography'

const stylesheet = createStyleSheet('DallolCardDescription', (theme) => {
    return {
        text: {
            fontSize: '0.9rem',
            color: 'gray',
            lineHeight: '1.8em'
        },
    };
});

class DallolCardDescription extends Component {
    static contextTypes = {
        styleManager: customPropTypes.muiRequired,
    }

    render() {
        const classes = this.context.styleManager.render(stylesheet);

        return (
            <CardContent>
                <Typography className={classes.text}>
                    { this.props.children }
                </Typography>
            </CardContent>
        );
    }
}

export default DallolCardDescription;