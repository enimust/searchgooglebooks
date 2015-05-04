/*
Filename: gbooks.js
Author: Eni Mustafaraj
Date: April 14, 2015
Purpose: Show how to implement AM1 with Meteor.

For this app to run, you should first add the package http in the 
server console with "meteor add http".
*/

if (Meteor.isClient) {
  // we set these variables to their initial values
  Session.setDefault("totalResults", 0);
  Session.setDefault("queryPhrase", "");
  Session.setDefault("resultsList", []);
  Session.setDefault("waiting", false);
  
  Template.body.helpers({
    total: function(){
      return Session.get("totalResults");
    },

    phrase: function(){
      return Session.get("queryPhrase");
    },
    
    allResults: function(){
      return Session.get("resultsList");
    },
    
    imgUrl: function(){
      // we'll need to have an if/else here to check first that the
      // thumbnail field is present
      return this.volumeInfo.imageLinks.thumbnail;
  },
    
    waitingForResults: function(){
      return Session.get("waiting");
    }
    
  });
  
  Template.body.events({
    
    'submit form': function(event){
      // read user input
      var searchPhrase = event.target.queryPhrase.value;
      
      // update the session variables for new search term
      Session.set("queryPhrase", searchPhrase);
      Session.set("totalResults", 0);
      Session.set("resultsList", []);
      Session.set("waiting", true);
      
      // process the results from the server in the callback function
      Meteor.call('callGoogleBooks', searchPhrase, function(error, result){
        Session.set("totalResults", result.totalItems);
        Session.set("resultsList", result.items);
        Session.set("waiting", false);
        event.target.queryPhrase.value = "";
      });
      
      return false; // prevent the form reload
    },
  });
}


if (Meteor.isServer) {

  var googleURL = "https://www.googleapis.com/books/v1/volumes?q=";
  
  Meteor.methods({
    
    callGoogleBooks: function(searchPhrase){
          console.log("looking for :", searchPhrase)
          var fullURL = googleURL + encodeURIComponent(searchPhrase) + "&maxResults=40";
          console.log(fullURL);
          var response = HTTP.call("GET", fullURL);
          // When testing, uncomment the line below to see ther results from the server
          //console.log("got response:", response);
          return response.data;
    }
    
  });
}
