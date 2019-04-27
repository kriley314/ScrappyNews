/* Note Taker (18.2.6)
 * front-end
 * ==================== */

// Loads results onto the page
function getResults() {
  // Empty any results currently on the page
  $( "#scrape-results" ).empty();

  // Do a fresh scrape to the NPR site..
  $.getJSON( "/scrape", function( data ) {
    // For each article...
    for ( var i = 0; i < data.length; i++ ) {
      // ...populate #results with a p-tag that includes the article's title and info followed by a link for the article
      // itself.  Side note:  Saving for later.. I have the deleteX span here.  It doesn't belong here - the scrape entries
      // are for "show".  After they have saved ones, THOSE can be deleted.
      $( "#scrape-results" ).append("<p class='data-entry' data-id=" + data[ i ]._id + "><span class='dataTitle' data-id=" +
        data[ i ]._id + ">" + data[ i ].title + "&nbsp&nbsp&nbsp<a href=" + data[ i ].link + "target='_blank'>Article Link</a>" +
        "&nbsp&nbsp&nbsp<button class='save-article button is-info is-small' data-id='" + data[ i ]._id + "'>" +
        "Save Article</button></p>" );
        

//      $( "#scrape-results" ).append("<p class='data-entry' data-id=" + data[ i ]._id + "><span class='dataTitle' data-id=" +
//        data[ i ]._id + ">" + data[ i ].title + "       " + "</span><span class=delete>X</span></p>" + "\r\n" +
//        "<a href=" + data[ i ].link + "target='_blank'>Article Link</a>" );
    }
  });
}

// Runs the getResults function as soon as the script is executed
getResults();

// When the #clear-all button is pressed
$( "#clear-all" ).on( "click", function() {
  // Make an AJAX GET request to delete the notes from the db
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "/clearall",
    // On a successful call, clear the #results section
    success: function( response ) {
      $( "#results" ).empty();
    }
  });
});


// When user clicks the delete button for an article
$( document ).on( "click", ".delete", function() {
  // Save the p tag that encloses the button
  var selected = $( this ).parent();
console.log( "Trying to delete.." + selected );
  // Make an AJAX GET request to delete the specific article
  // this uses the data-id of the p-tag, which is linked to the specific aticle
  $.ajax({
    type: "POST",
    url: "/delete/" + selected.attr( "data-id" ),

    // On successful call
    success: function( response ) {
      // Remove the p-tag from the DOM
      selected.remove();
      getResults();
    }
  });
});

// When user click's on note title, show the note, and allow for updates
$( document ).on( "click", ".dataTitle", function() {
  // Grab the element
  var selected = $( this );
  // Make an ajax call to find the note
  // This uses the data-id of the p-tag, which is linked to the specific note
  $.ajax({
    type: "GET",
    url: "/find/" + selected.attr( "data-id" ),
    success: function( data ) {
      // Fill the inputs with the data that the ajax call collected
      $( "#note" ).val( data.note );
      $( "#title" ).val( data.title );
      // Make the #action-button an update button, so user can
      // Update the note s/he chooses
      $( "#action-button" ).html( "<button id='updater' data-id='" + data._id + "'>Update</button>" );
    }
  });
});

// When user click's update button, update the specific note
$( document ).on( "click", "#updater", function() {
  // Save the selected element
  var selected = $( this );
  // Make an AJAX POST request
  // This uses the data-id of the update button,
  // which is linked to the specific note title
  // that the user clicked before
  $.ajax({
    type: "POST",
    url: "/update/" + selected.attr( "data-id" ),
    dataType: "json",
    data: {
      title: $( "#title" ).val(),
      note: $( "#note" ).val()
    },
    // On successful call
    success: function( data ) {
      // Clear the inputs
      $( "#note" ).val( "" );
      $( "#title" ).val( "" );
      // Revert action button to submit
      $( "#action-button" ).html( "<button id='make-new'>Submit</button>" );
      // Grab the results from the db again, to populate the DOM
      getResults();
    }
  });
});
