'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Image,
  Text,
  View,
  ListView,
  TouchableHighlight,
  AlertIOS,
  VibrationIOS,
} = React;

var API_KEY = '7waqfqbprs7pajbz28mqf6vz';
var API_URL = 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json';
var PAGE_SIZE = 25;
var PARAMS = '?apikey=' + API_KEY + '&page_limit=' + PAGE_SIZE;
var REQUEST_URL = API_URL + PARAMS;

var MOCKED_MOVIES_DATA = [
  {title: 'Title', year: '2015', posters: {thumbnail: 'http://i.imgur.com/UePbdph.jpg'}},
];

var MovieList = React.createClass({
  getInitialState: function(){
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
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
          loaded: true,
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
  },

  renderLoadingView: function(){
    return (
      <View style={styles.container}>
        <Text>
          Loading movies...
        </Text>
      </View>
    );
  },

  renderMovie: function(movie){
    return (
      <TouchableHighlight
        onPress={this.selectMovie.bind(this, movie)}
        style={styles.container}
      >
        <View style={styles.container}>
          <Image
            style={styles.thumbnail}
            source={{uri: movie.posters.thumbnail}}
          />
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.year}>{movie.year}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  },

  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    var movies = this.state.movies;
    return <ListView
      dataSource={this.state.dataSource}
      renderRow={this.renderMovie}
      style={styles.listView}
    />;
  }
});

var styles = StyleSheet.create({
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
});

AppRegistry.registerComponent('MovieList', () => MovieList);

module.exports = MovieList;
