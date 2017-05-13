import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    CardHeader,
 } from 'material-ui/Card';
import DallolCard from 'app/components/DallolCard';
import DallolCardMedia from 'app/components/DallolCardMedia';
import DallolCardTitle from 'app/components/DallolCardTitle';
import DallolCardDescription from 'app/components/DallolCardDescription';
import Avatar from 'material-ui/Avatar';
import moment from 'moment';
import { slug } from 'app/utils';

class ArticleCard extends Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        source: PropTypes.object.isRequired,
    }

    /*handleClick(e) {
        if(window.getSelection().toString().length === 0){
            window.open(this.props.article.url, '_blank');
        }
    }*/

    render() {
        const { _id: id, thumbnailUrl, title, description, date } = this.props.article;
        const { thumbnailUrl: srcThumbUrl, title: srcTitle } = this.props.source;

        return (
            <Link to={{
                pathname: `/article/${id}/${slug(title)}`,
            }} target="_blank">
                <DallolCard>
                    <CardHeader
                        title={srcTitle}
                        subheader={moment(date).fromNow()}
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
            </Link>
        );
    }
}

export default ArticleCard;