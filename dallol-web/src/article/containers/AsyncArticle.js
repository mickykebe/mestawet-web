import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchArticle } from 'article/actions';
import Article from 'article/components/Article';

class AsyncArticle extends Component {
  constructor(props) {
    super(props);

    this.redirectIfNecessary = this.redirectIfNecessary.bind(this);
  }

  redirectIfNecessary(article) {
    if(!article.textContent) {
      window.open(article.url, '_self');
    }
  }
  componentDidMount() {
    const { id, article, fetchArticle } = this.props;
    if(!article) {
      fetchArticle(id);
    }
    else {
      this.redirectIfNecessary(article);
      this.setState({
        article,
      });
    }
  }

  componentDidUpdate() {
    const { article } = this.props;
    if(article) {
      this.redirectIfNecessary(article);
      this.setState({
        article,
      });
    }
  }

  render() {
    const {article} = this.state;
    if (!article || !article.textContent) {
      return null;
    }
    const { thumbnailUrl:srcThumbnailUrl, title:srcTitle } = article;
    return (<Article 
      thubmbnailUrl={article.thubmbnailUrl}
      title={article.title}
      url={article.url}
      textContent={article.textContent}
      date={article.date}
      srcTitle={srcTitle}
      srcThumbnailUrl={srcThumbnailUrl}
     />);
  }

}

const mapStateToProps = (state, ownProps) => {
    const id = ownProps.match.params.id;
    const article = state.articles[id];
    const { sources } = state;

    return {id, article, sources};
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchArticle: (id) => dispatch(fetchArticle(id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AsyncArticle);