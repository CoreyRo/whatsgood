$(document).ready(function()
{	
	// hide directory screen
	$("#directory").hide()

	// main function for running app
	function MainProgram()
	{	
		// Initialize Firebase
			var config = {};
			// Variable to reference the database
			var database;

			config = 
			{
				apiKey: "AIzaSyDrsI6iSQqpK66S3C_SDd3UIzGaECV6tqY",
			    authDomain: "whatsgood-f9823.firebaseapp.com",
			    databaseURL: "https://whatsgood-f9823.firebaseio.com",
			    projectId: "whatsgood-f9823",
			    storageBucket: "whatsgood-f9823.appspot.com",
			    messagingSenderId: "905439758172"
			};

			firebase.initializeApp(config);

			database = firebase.database();
		// end firebase initializing


		// on clicking confirm button on main screen
		$("#confirmZip").click(function(event)
		{
			// prevent the page from refreshing
			event.preventDefault();

			//hide the start screen
			$("#start").hide();

			// show the directry screen
			$("#directory").show();
			
			
			console.log("Clicked confirmZip")

			// variable for storing zipcode
			var zipcode;
			//variable for storing the api key
			var apiKey = "AIzaSyAVeD_VRihMVTcxvIM6mwH6WSEZ-s1kqRo";
			// variable for storing the queryUrl
			var queryUrl;

			// giving zipcode variabel the value of the zip input on the start screen
			zipcode = $("#zip-input").val();
			queryUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + zipcode + "&key=" + apiKey;

			$.ajax(
			{
				url: queryUrl,
				method: "GET"
			}).done(function(response)
			{
				console.log(response)
			})
		});
	}

	// function for creating and displaying map
	function CreateMap(location, key)
	{
		var main;

		main = $("<iframe>");
		main.attr("width", 600);
		main.attr("height",450);
		main.attr("src", "https://www.google.com/maps/embed/v1/search?key=" + key + "&q=bar," + location + " allowfullscreen>");
		$(".map").append(main);
	}

	MainProgram();
	
});