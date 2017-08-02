$(document).ready(function()
{
	function MainProgram()
	{	
		var config = {};		// Initialize Firebase
		var database;			// Variable to reference the database
		var lat;
		var lng;

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

		$("#confirmZip").click(function(event)
		{
			event.preventDefault();
			var zipcode;
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

		});
	}

	function CreateMap(location, key)
	{
		var main;

		main = $("<iframe>");
		main.attr("width", 600);
		main.attr("height",450);
		main.attr("src", "https://www.google.com/maps/embed/v1/search?key=" + key + "&q=bar," + location + " allowfullscreen>");
		$("#map").append(main);
	}

	MainProgram();
	
});