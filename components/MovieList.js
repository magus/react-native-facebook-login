'use strict';

var {
  StyleSheet,
  Image,
  Text,
  View,
  ListView,
  ScrollView,
  ActivityIndicatorIOS,
  AlertIOS,
  VibrationIOS,
} = React;

var MovieCell = require('./MovieCell.js');
var MovieView = require('./MovieView.js');

var FBLogin = require('./facebook/FBLogin');


var API_KEY = '7waqfqbprs7pajbz28mqf6vz';
var API_URL = 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json';
var PAGE_SIZE = 25;
var PARAMS = '?apikey=' + API_KEY + '&page_limit=' + PAGE_SIZE;
var REQUEST_URL = API_URL + PARAMS;


var MovieList = React.createClass({
  getInitialState: function(){
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  },

  fetchData: function() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(
            responseData.movies
          ),
        });
      })
      .done();
  },

  componentDidMount: function() {
    this.fetchData();
  },

  selectMovie: function(movie: Object) {
    console.log(movie.title, "was clicked");
    VibrationIOS.vibrate();

    this.props.navigator.push({
      title: movie.title,
      component: MovieView,
      passProps: {
        movie: movie,
      },
    });
  },

  renderLoadingView: function(){
    return (
      <View style={styles.loadingMoviesContainer}>
        <Text style={styles.loadingMovies}>Loading movies...</Text>
        <ActivityIndicatorIOS size={"large"} />
      </View>
    );
  },

  renderMovie: function(movie){
    return (
      <MovieCell
        movie={movie}
        onPress={this.selectMovie.bind(this, movie)} />
    );
  },

  render: function() {
    if (this.state.dataSource.getRowCount() === 0) {
      return this.renderLoadingView();
    }

    return (
      <View style={styles.container}>
        <ListView
          style={styles.listView}
          dataSource={this.state.dataSource}
          renderRow={this.renderMovie}
          automaticallyAdjustContentInsets={false}
        />
        <FBLogin style={styles.FBLoginButton} />
    </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    marginTop: 64,
    flex: 1,
  },
  FBLoginButton: {
    position: 'absolute',
    margin: 5,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    height: 25,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  listView: {
    backgroundColor: '#fafafa',
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  loadingMoviesContainer: {
    marginTop: 64,

    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingMovies: {
    marginBottom: 10,
  },
});

module.exports = MovieList;
