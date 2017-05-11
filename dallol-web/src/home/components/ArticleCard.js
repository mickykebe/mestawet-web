import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    CardHeader,
 } from 'material-ui/Card';
import DallolCard from 'app/components/DallolCard';
import DallolCardMedia from 'app/components/DallolCardMedia';
import DallolCardTitle from 'app/components/DallolCardTitle';
import DallolCardDescription from 'app/components/DallolCardDescription';
import Avatar from 'material-ui/Avatar';

class ArticleCard extends Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        source: PropTypes.object.isRequired,
    }
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        if(window.getSelection().toString().length === 0){
            window.open(this.props.article.url, '_blank');
        }
    }

    render() {
        const { thumbnailUrl, title, description, when } = this.props.article;
        const { thumbnailUrl: srcThumbUrl, title: srcTitle } = this.props.source;
        
        return (
            <DallolCard onClick={this.handleClick}>
                <CardHeader
                    title={srcTitle}
                    subheader={when}
                    avatar={srcThumbUrl && <Avatar src={srcThumbUrl} />}
                    />
                <DallolCardTitle>
                    { title }
                </DallolCardTitle>
                {
                    thumbnailUrl && 
                    <DallolCardMedia>
                        <img src={thumbnailUrl} alt="article" />
                    </DallolCardMedia>
                }
                { description &&
                    <DallolCardDescription>
                        { description }
                    </DallolCardDescription>
                }
            </DallolCard>
        );
    }
}

export default ArticleCard;