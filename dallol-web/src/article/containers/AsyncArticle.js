import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchArticle } from 'article/actions';
import Article from 'article/components/Article';
import Iframe from 'app/components/Iframe';

class AsyncArticle extends Component {
  constructor(props) {
    super(props);

    this.redirectIfNecessary = this.redirectIfNecessary.bind(this);
    this.onBackClick = this.onBackClick.bind(this);
  }

  redirectIfNecessary(source, article) {
    if(!article.textContent && !source.embedPages) {
      const { prevLocation, history } = this.props;
      if (prevLocation) {
        window.open(article.url);
        history.push(prevLocation.pathname);
      }
      else {
        window.open(article.url, '_self');
      }
    }
  }
  componentWillMount() {
    const { id, article, sources, fetchArticle } = this.props;
    if(!article) {
      fetchArticle(id);
    }
    else {
      this.redirectIfNecessary(sources[article.source], article)
    }
  }

  componentWillUpdate(nextProps) {
    const { article, sources } = nextProps;

    if(!article) {
      fetchArticle(this.props.id);
    }
    else if(article && article !== this.props.article) {
      this.redirectIfNecessary(sources[article.source], article);
    }
  }

  onBackClick() {
    const { prevLocation, history } = this.props;
    history.push(prevLocation ? prevLocation.pathname : '/');
  }

  render() {
    const { article, sources } = this.props;
    if (!article) {
      return null;
    }
    const source = sources[article.source];
    if(!article.textContent) {
      if(source.embedPages){
        return (<Iframe src={article.url} title={article.title} />);
      }
      else {
        return null;
      }
    }
    const { thumbnailUrl: srcThumbnailUrl, title: srcTitle } = source;
    return (
      <Article 
      thumbnailUrl={article.thumbnailUrl}
      title={article.title}
      url={article.url}
      textContent={article.textContent}
      date={article.date}
      srcTitle={srcTitle}
      srcThumbnailUrl={srcThumbnailUrl}
      onBackClick={this.onBackClick}
     />
     );
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