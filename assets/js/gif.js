var gifs = []; //an array that holds all of the gif submitted terms from the user. This array is used to create the corresponding gif buttons that makes the call to the giphy api. I've opted not to initialize since I feel it's better for the user to search their own terms only and not include my own; though I can easily add my own without breaking functionality by adding in strings separated by commas as elements in the array. 

//creates the buttons based on user input
function renderButtons() {
	$("#gif-buttons").empty();
	for (var i = 0; i<gifs.length; i++){
		var a = $("<button>");
		a.addClass("gif-button gap-top gap-right btn btn-success")
		a.attr("id", gifs[i]);
		a.text(gifs[i]);
		$("#gif-buttons").append(a);
	}
}

//gets the gifs and rating from the giphy api
function getGifs(){
	var giffy = $(this).attr("id");
	var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        giffy + "&api_key=dc6zaTOxFJmzC&limit=9";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response){
    	var response = response.data
    	$("#gifs").empty();

    	for (var i = 0; i < response.length; i++) {
			var gifDiv = $("<div>");
			gifDiv.addClass("col-lg-4");
			var p = $("<p>");
			p.text("Rating: " + response[i].rating);
			p.addClass("gap-top")
			var gifImage = $("<img>");
			gifImage.addClass("gif img-responsive center-block");

			//stores the still image url from the giphy api for each image into the img attribute 'data-still'
			gifImage.attr("data-still", response[i].images.fixed_height_still.url);

			//stores the animated image url from the giphy api for each image into the img attribute 'data-animate'
			gifImage.attr("data-animate", response[i].images.fixed_height.url);

			//creates data-state attribute to help with pause play logic
			gifImage.attr("data-state", "still");
			gifImage.attr("order", i);
			gifImage.attr("src", response[i].images.fixed_height_still.url);
			gifDiv.prepend(p, gifImage);
			$("#gifs").append(gifDiv);

		}
    })
}

//creates the user generate gif button every time the submit gif button is pushed. stores the responses in gif array
$("#add-gif").on("click", function(event){
	event.preventDefault();
	var gif = $("#gif-input").val();
	gifs.push(gif);
	renderButtons();
})

//initial call
$(document).on("click", ".gif-button", getGifs);

//when a gif is clicked, this determines if the state of the img is still or animate. It will switch the attribute to do the opposite of the current state when clicked, then it will switch the img src to the corresponding state
$(document).on("click", ".gif", function(){
	console.log("clicked");
	var state = $(this).attr("data-state");
	if (state === 'still'){
		$(this).attr("src", $(this).attr("data-animate"));
		$(this).attr("data-state", 'animate');
	}
	else if(state === 'animate'){
		$(this).attr("src", $(this).attr("data-still"));
		$(this).attr("data-state", 'still');
	}

});
renderButtons();