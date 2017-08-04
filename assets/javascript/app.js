$(document).ready(function()
<<<<<<< HEAD
{
	$("#directory").hide()

	function MainProgram()
	{	
		var config = {};		// Initialize Firebase
		var database;			// Variable to reference the database
		var lat;
		var lng;
		var zipcode;
=======
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
>>>>>>> 40ac5125d6848e151359c969f32671a2e5a3274c

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
<<<<<<< HEAD
			event.preventDefault();
			if($("#zip-input").val() == "" || $("#zip-input").val().length < 5) {
				$("#zipError").empty();
				$("#zipError").append("<div class='alert alert-danger text-center'><strong>Please enter a 5 digit zipcode.</strong></div>");
				console.log($("#zip-input").val().length);
			}
			else {
				console.log($("#zip-input").val().length);
				$("#start").hide();
				$("#directory").show();
				$("#zipError").empty();
				
				
				console.log("Clicked confirmZip")

				var apiKey = "AIzaSyAVeD_VRihMVTcxvIM6mwH6WSEZ-s1kqRo";
				var queryUrl;

				zipcode = $("#zip-input").val();

				queryUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + zipcode + "&key=" + apiKey;

				$.ajax(
				{
					url: queryUrl,
					method: "GET"
				}).done(function(response)
				{
					console.log(response)

					lat = response.results[0].geometry.location.lat;
					lng = response.results[0].geometry.location.lng;

					console.log(lat);
					console.log(lng);


				})
			}

=======
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
>>>>>>> 40ac5125d6848e151359c969f32671a2e5a3274c
		});

		$("#meetupBtn").on("click", function() {
			getMeetupLocations(zipcode);
		})

	}

<<<<<<< HEAD
	function CreateMap(location)
=======
	// function for creating and displaying map
	function CreateMap(location, key)
>>>>>>> 40ac5125d6848e151359c969f32671a2e5a3274c
	{
		var main;

		main = $("<iframe>");
		main.attr("width", 600);
		main.attr("height",450);
		main.attr("src", "https://www.google.com/maps/embed/v1/search?key=" + key + "&q=bar," + location + " allowfullscreen>");
		$(".map").append(main);
	}

	function getMeetupLocations(zip) {

		key = "4f561e404155b324d1b791c124f6221";
		queryUrl = "https://api.meetup.com/2/events/?radius=25.0&order=time&key="+ key + "&zipcode=" + zip + "&sign=true";


		$.ajax(
		{
			url: queryUrl,
			method: "GET"
		}).done(function(response)
		{
			console.log(response)


		})

	}

	MainProgram();

	
});