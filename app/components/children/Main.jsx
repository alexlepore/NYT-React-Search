// React
var React = require("react");

// Here we include all of the sub-components
var Query = require("./Query.jsx");
var Search = require("./Search.jsx");
var Saved = require("./Saved.jsx");

// Helper for making API calls
var helpers = require("../utils/helpers.js");

// Create the Main Component
var Main = React.createClass({

  // Here we set a generic state
  getInitialState: function() {
    return {
      apiResults: [],
      mongoResults: [],
      searchTerms: ["","",""]
    };
  },

  // These functions allow children to update the parent.
  _setSearchFeilds: function(topic, start, end) {
    this.setState({ searchTerms: [topic, start, end] });
  },

  // Allow child to update Mongo data array
  _resetMongoResults: function(newData){
    this.setState({ mongoResults: newData} );
  },

  // After the Main renders, collect the saved articles from the API endpoint
  componentDidMount: function() {

    // Hit the Mongo API to get saved articles
    helpers.apiGet().then(function(query){
      this.setState({mongoResults: query.data});
    }.bind(this));

    // console.log('API Results')
    // console.log(this.state.apiResults)

    // console.log('')
    // console.log('Mongo Results')
    // console.log(this.state.mongoResults)
  },


  // If the component changes (i.e. if a search is entered)...
  componentDidUpdate: function(prevProps, prevState) {

    // Only hit the API once; i.e. if the prev state does not equal the current
    if(this.state.searchTerms != prevState.searchTerms){
      // Run the query for the address
      helpers.articleQuery(this.state.searchTerms[0], this.state.searchTerms[1], this.state.searchTerms[2]).then(function(data) {
        //console.log(data);
        this.setState({ apiResults: data });
      }.bind(this));
    }

  },


  // Here we render the function
  render: function() {
    return (

      <div className="container" style={ {backgroundColor: "grey", borderStyle: "solid", borderWidth: "2px"} }>

        <div className="page-header">
          <h1 className="text-center"><img style={ {width: "70%"} } src="img/font.svg" alt="The New York Times"/></h1>
          <h2 className="text-center" style={ {marginTop: "-2px"} }><b><i>React Search</i></b></h2>
          <h4 className="text-center">A NYT Times search application, with save and delete functionality.</h4>
        </div>

        <Query _setSearchFeilds={this._setSearchFeilds} />
        <Search apiResults={this.state.apiResults} _resetMongoResults={this._resetMongoResults} />
        <Saved mongoResults={this.state.mongoResults} _resetMongoResults={this._resetMongoResults} />

      </div>

    );
  }
});

// Export the component back for use in other files
module.exports = Main;
