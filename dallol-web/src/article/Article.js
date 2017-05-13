import { Component } from 'react';
import { getArticle } from './api';

class Article extends Component {
    componentDidMount() {
        const id = this.props.match.params.id;
        console.log(this.props);
        getArticle(id)
            .then((article) => {
                console.log(article);
                window.open(article.url, '_self');
            });
    }

    render() {
        return null;
    }
}

export default Article;