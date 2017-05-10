import React, { Component } from 'react';
import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from 'material-ui/utils/customPropTypes';
import Card from 'material-ui/Card';
import DallolCardMedia from './DallolCardMedia';

const stylesheet = createStyleSheet('DallolCard', (theme) => {
    return {
        dallolCard: {
            transition: 'box-shadow 0.3s',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            '&:hover': {
                cursor: 'pointer',
                boxShadow: '0 1px 35px rgba(0, 0, 0, 0.1)',
            },
            '&:hover $mainThumb > img': {
                transform: 'scale(1.1)',
                'opacity': '0.8',
            },
        },
        mainThumb: {
            width: '100%',
            background: '#000',
            overflow: 'hidden',
            '& > img': {
                display: 'block',
                width: '100%',
                height: '100%',
                '-webkit-transition': 'transform 0.3s',
                'transition': 'transform 0.3s',
            },
        },
    }
});

class DallolCard extends Component {
    static contextTypes = {
        styleManager: customPropTypes.muiRequired,
    }

    render() {
        const classes = this.context.styleManager.render(stylesheet);
        const clonedChildren = React.Children.map(this.props.children, (child) => {
            if(child && child.type === DallolCardMedia) {
                return React.cloneElement(child, {
                    classMainThumb:  classes.mainThumb,
                });
            }
            return child;
        });
        
        return (
            <Card className={`${classes.dallolCard} ${this.props.className}`} onClick={this.props.onClick}>
                { clonedChildren }
            </Card>
        );
    }

}

export default DallolCard;