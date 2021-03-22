/*
     External JavaScript file, to go along with My Movie List index.html page.
     The goal of this website is to use TMDb's(The movie Database) API within Jquery.
     The user is prompted to enter the name or ID of a movie within the TMDb.
     They can then add to their favorites list,
     clear their list, display the list, or continue searching to add more movies.
	 Written by Ryan Mendoza
	 Written on 03/18/2021
	 Languages: HTML, CSS, Javascript, and Jquery
	 Resources: PowerPoint slides and textbook for chapters 9, 10, and 11 as well as Monday, March 15th's in class video.
*/
// Creating all of the settings variables that will be needed.
var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.themoviedb.org/3/search/movie?include_adult=false&page=1&query=hobbit&language=en-US&api_key= ",
    "method": "GET",
    "headers": {},
    "data": "{}"
}
// API key that was used to access the data on TMDb.
var APIKEY = "ab1967a0da5f6afaa6f6dd136ed1459a";
// List of favorite movies that the user selects.
var Movies = [];
// ID for the movies that are searched for and added to the list of favorite movies.
var id = 0;
// Main script for the program to work.
App = {
    /*
    searchMovie function will give functionality to the 'Search' button.
    It will search for the movie with the use of the API key I acquired through TMDb.
    Following the search, it will use the results it received to display all of the gathered movie titles,
    release dates, TMDb ID's, the movie posters(or an error sign if N/A), and a brief description of the movie.
    */
    searchMovie: async () => {
        // If statement that will begin the search as long as something is entered into the search bar.
        if($('#Search').val()!="")
        {
            //uses the settings variables to grab the link and begin the search.
            settings.url = "https://api.themoviedb.org/3/search/movie?include_adult=false&page=1&query=" + $('#Search').val() + "&language=en-US&api_key=" + APIKEY
            //retrieves and sends the data without messing with the display of the page.
            $.ajax(settings).done(function (response) {
                //Creates the table.
                $('Table').html(" ")
                //Appends the table caption.
                $('Table').append('<table><caption></caption>')
                //For each movie this will display the following things.
                $.each(response.results, function (index, result) {
                    //Turns table style red.
                    $('#Table').append('<tr><td style="color:red;">')
                    //Appends all of the gathered movies titles, release dates, TMDb ID's, movie posters, or error images.
                    $('#Table').append('Title: '+result.title + " " + '<br>Release Date: ' + result.release_date +
                    '<br>TMDb ID: ' + result.id + '<br>' + '' +
                        '<img src="http://image.tmdb.org/t/p/w92'+result.poster_path+'" onerror=\'this.src="none.jpg"\' ><br>')
                    //Appends all of the gathered movies overviews.
                    $('#Table').append('<br>' + result.overview + '<br>')
                    //Appends the Add Movie To List button to each gathered movie.
                    $('#Table').append('<input type="button" value="Add Movie To List" onclick="App.AddItem('+result.id+');">')
                    $('#table').append('<hr>')
                    })
                //This ends the table rows.
                $('#table').append('</td></tr>')
                });
            }
        },
    //clearPage function. This will simply clear the page after hitting the 'Clear Screen' button.
    clearPage: async () => {
        //Clears the table.
        $('#Table').empty()
        //Clears the search bar.
        $('#Search').empty()
    },
    /*
    addItemID function. This gives functionality to the 'Add By Item ID' button.
    After the user types in an ID of a movie and hit this button it will add that movie to their list.
    For example, the number 13 will add Forrest Gump to the list.
    */
    addItemID: async () => {
        //Reverses the order of the elements in the Movies Array.
        Movies.reverse()
        //Adds the newest search value to the Movies array and returns the length.
        Movies.push($('#Search').val())
        //Reverses the order of the elements in the Movies Array again, turning it back to the original state,
        //but this time the items that were pushed are in the front.
        Movies.reverse()
        //calls the refreshList function to refresh the favorites list.
        App.refreshList()
    },
    //AddItem function. This function will add functionality to the 'Add Movie To List' button.
    //Hitting this will add the movie movie to the favorites list.
    AddItem: async (id) => {
        //Pushes the new id of the movie.
        Movies.push(id)
    },
    //refreshList function. Adds functionality to the Display Movie List function.
    //Clicking this will simply show your favorites list.
    refreshList: async () => {
        //I will spare the long comments here, as these next lines do what is done in the searchMovie function.
        //Only this time it only shows what is in your favorites list instead of what you search for.
        $('#Table').html(" ")
        $('#Table').append('<table><caption></caption>')
        $.each(Movies, function(index, result){
            settings.url = "https://api.themoviedb.org/3/movie/" + result + "?api_key=" + APIKEY + "&language=en-US"
            $.ajax(settings).done(function (response){
                $('#Table').append('<tr><td>')
                $('#Table').append('Title: ' + response.title + '<br>Release Date: ' + response.release_date + '<br>TMDb ID: ' + response.id + '<br>' + '<img src="https://image.tmdb.org/t/p/w92/' + response.poster_path+'"onerror=\'this.src="none.jpg"\' ><br>')
                $('#Table').append('<br>' + response.overview + '<br>')
                $('#Table').append('<input type="button" value="Remove Movie From List" onclick ="App.removeItem('+index+');">')
                $('#Table').append('<hr>')
                $('#Table').append('</td></tr>')
            })
        })
        //Ends the table tag.
        $('#Table').append('</table>')
    },
    //clearList function. Gives functionality to the 'Clear List' button. This will simply clear your list of favorites.
    clearList: async () => {
        //Sets the Movies array to empty.
        Movies = null;
        //Calls refreshList to refresh the list.
        App.refreshList();
    },
    //removeItem function. Gives functionality to the 'Remove Movie From List' button.
    //This will simply remove the above movie.
    removeItem: async (id) => {
        //Removes the movie.
        Movies.splice(id, 1);
        //Calls refreshList to refresh the list.
        App.refreshList();
    },
    //displayHelp function. This gives functionality to the 'Help' button. This will display how each button works.
    displayHelp: async () => {
        App.refreshList();
        $('#Table').append('Here is how each button works.<br><br>' +
            'Search: This button has two functionalities.<br><br>' +
            'The first being searching a movie name.<br><br>' +
            'The second being, if you type in the TMDb ID and click Add Item By ID it will add the movie with that ID to your list.<br><br>' +
            'Next we have the Clear Screen button, clicking this will simply clear the screen.<br><br>' +
            'Third we have the aforementioned Add by Item ID Button, this button will add the movie ID entered to your list.<br><br>' +
            'Fourth we have the Display Movie List button, clicking this will display your created list of movies.<br><br>' +
            'Fifth we have the Clear List button, this button will clear the movies put into your list.<br><br>' +
            'Sixth we have the Help Button, this button is how you made it to this dialog.<br><br>' +
            'Last but not least, we have the Credits button, this will show you the credits.<br><br> ' +
            '')
    },
    //displayCredits function. This gives functionality to the 'Credits' button. This will display the credits.
    displayCredits: async () => {
        App.refreshList();
        $('#Table').append('This website was created by Ryan Mendoza for his CS 351 Midterm.<br><br>' +
            'An updated and better version of this will be created with React in the near future.<br><br>' +
            'This website is powered by <a href="https://jquery.com/">JQuery</a> and <a href="https://developers.themoviedb.org/3/getting-started/introduction/">The TMDB API</a>  ')
    }
}