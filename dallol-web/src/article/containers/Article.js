import { Component } from 'react';
import { connect } from 'react-redux';
import { fetchArticle } from 'article/actions';

class Article extends Component {
    componentDidMount() {
        const { id, article, fetchArticle } = this.props;
        if(!article) {
            fetchArticle(id);
        }
    }

    componentDidUpdate() {
        const { article } = this.props;
        if(article) {
            window.open(article.url, '_self');
        }
    }

    render() {
        return null;
    }

}

const mapStateToProps = (state, ownProps) => {
    const id = ownProps.match.params.id;
    const article = state.articles[id];

    return {id, article};
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchArticle: (id) => dispatch(fetchArticle(id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Article);