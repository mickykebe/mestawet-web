import React, { Component } from 'react';
import { CardMedia } from 'material-ui/Card';


class DallolCardMedia extends Component {
    render() {
        const {classMainThumb} = this.props;
        return (
            <CardMedia className={classMainThumb}>
                {this.props.children}
            </CardMedia>
        )
    }
}

export default DallolCardMedia;