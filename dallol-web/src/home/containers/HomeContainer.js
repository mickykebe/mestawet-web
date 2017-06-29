import { connect } from 'react-redux';
import { fetchHomeNextPosts } from 'home/actions';
import Home from 'home/components/Home';
import { flatFilter, sortByDate } from 'app/utils';

const mapStateToProps = (state) => {
  const { videos, articles, sources } = state;
  const { hasMore, youtubeVideos: youtubeVideoIds, articles: articleIds } = state.home;
  
  const flatYoutubeVideos = flatFilter(videos.youtubeVideos, youtubeVideoIds);
  const flatArticles = flatFilter(articles, articleIds);
  const posts = sortByDate([...flatYoutubeVideos, ...flatArticles]);
  
  return {
    sources,
    posts,
    hasMore,
    fetchError: state.ui.fetchError,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadMore: () => dispatch(fetchHomeNextPosts()),
  }
}

const HomeContainer = connect(
  mapStateToProps, 
  mapDispatchToProps
)(Home);

export default HomeContainer;