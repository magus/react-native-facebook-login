'use strict';

var React = require('react-native');
var {
  Image,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicatorIOS,
} = React;

var MovieView = React.createClass({
  propTypes: {
    movie: React.PropTypes.object.isRequired,
  },

  getInitialState: function(){
    return {
      imdb: "",
      poster: "",
    };
  },

  getIMDBIDOMDB: function(yearAdjust){
    var _this = this;
    var movie = this.props.movie;
    var title = encodeURIComponent(movie.title);
    var yearAdjust = yearAdjust ? yearAdjust : 0;
    var year = (parseInt(movie.year)+yearAdjust).toString();

    return fetch(`http://www.omdbapi.com/?type=movie&s=${title}&y=${year}`)
      .then((response) => response.json())
      .then((responseData) => {
        if (_this.isMounted()){
          var resultsKey = "Search";
          if (responseData.hasOwnProperty(resultsKey)) {
            // Call other APIs with IMDB id
            var imdbID = responseData[resultsKey][0].imdbID;
            this.getPoster(imdbID);
            this.getIMDB(imdbID);
          } else {
            // Search all movie results within 3 years
            if (yearAdjust < 3) {
              // Search forwards then backwards
              yearAdjust = yearAdjust <= 0 ? yearAdjust + 1 : yearAdjust * -1;
              // Call self with new yearAdjust
              _this.getIMDBIDOMDB(yearAdjust);
            }
          }
        }
      });
  },

  getIMDB: function(imdbID){
    var _this = this;
    var IMDB_API = `http://app.imdb.com/title/maindetails?tconst=${imdbID}`;
    console.log(IMDB_API);

    return fetch(IMDB_API)
      .then((response) => response.json())
      .then((responseData) => {
        if (_this.isMounted()){
          _this.setState({ imdb : responseData });
        }
      });
  },

  getPoster: function(imdbID){
    var _this = this;
    var OMDB_API = `http://www.omdbapi.com/?i=${imdbID}&plot=short&r=json`;
    console.log(OMDB_API);

    return fetch(OMDB_API)
      .then((response) => response.json())
      .then((responseData) => {
        if (_this.isMounted()){
          _this.setState({ poster : responseData.Poster });
        }
      });
  },

  componentDidMount: function () {
    this.request = this.getIMDBIDOMDB();
  },

  render: function() {
    var movie = this.props.movie;
    var poster = this.state.poster;
    var imdb = this.state.imdb;
    var imdbRating = imdb ? imdb.data.rating : "N/A";

    var posterImage = poster ?
      <Image
        source={{uri: poster}}
        style={styles.detailsImage}
      />
      : <View style={styles.detailsImage}>
        <ActivityIndicatorIOS size={"large"} />
      </View>;

    return (
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.mainSection}>
          { posterImage }
          <View style={styles.rightPane}>
            <Text style={styles.movieTitle}>{this.props.movie.title}</Text>
            <Text>{this.props.movie.year}</Text>
            <View style={styles.mpaaWrapper}>
              <Text style={styles.mpaaText}>
                {this.props.movie.mpaa_rating}
              </Text>
            </View>
            <Text>{this.props.movie.ratings}</Text>
            <Text>{imdbRating}</Text>
          </View>
        </View>
        <View style={styles.separator} />
        <Text>
          {this.props.movie.synopsis}
        </Text>
        <View style={styles.separator} />
        <Text>{this.props.movie.abridged_cast}</Text>
      </ScrollView>
    );
  },
});

var styles = StyleSheet.create({
  contentContainer: {
    padding: 10,
  },
  rightPane: {
    justifyContent: 'space-between',
    flex: 1,
  },
  movieTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  rating: {
    marginTop: 10,
  },
  ratingTitle: {
    fontSize: 14,
  },
  ratingValue: {
    fontSize: 28,
    fontWeight: '500',
  },
  mpaaWrapper: {
    alignSelf: 'flex-start',
    borderColor: 'black',
    borderWidth: 1,
    paddingHorizontal: 3,
    marginVertical: 5,
  },
  mpaaText: {
    fontFamily: 'Palatino',
    fontSize: 13,
    fontWeight: '500',
  },
  mainSection: {
    flexDirection: 'row',
  },
  detailsImage: {
    width: 134,
    height: 200,
    backgroundColor: '#eaeaea',
    marginRight: 10,

    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  separator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1 / PixelRatio.get(),
    marginVertical: 10,
  },
  castTitle: {
    fontWeight: '500',
    marginBottom: 3,
  },
  castActor: {
    marginLeft: 2,
  },
});

module.exports = MovieView;
