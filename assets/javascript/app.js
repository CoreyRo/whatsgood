$(document).ready(function()
{
	// hide directory screen
	$("#directory").hide()
	$("#login-div").hide()
	$("#register-div").hide()
	
	//for the animate.css library
    $.fn.extend({
        animateCss: function(animationName) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            this.addClass('animated ' + animationName).one(animationEnd, function() {
                $(this).removeClass('animated ' + animationName);
            });
            return this;
        }
    });


	var lat = 0.0;
	var lng = 0.0;


	// main function for running app
	function MainProgram()
	{	
		// Initialize Firebase
			var config = {};
			// Variable to reference the database
			var database;
			
			// variable for storing zipcode
			var zipcode;

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

			event.preventDefault();
			
			if($("#zip-input").val().length != 5) {
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


					initMap(lat, lng);

				})
			}

		});
		$("#newReg").on("click", function(){
			event.preventDefault();
			$("#login-div").hide();
			$("#register-div").show().animateCss("slideInUp");
		})

		$("#logBtn").on("click", function(){
			event.preventDefault();
			$("#register-div").hide();
			$("#login-div").show().animateCss("slideInUp");
		})

		$("#meetupBtn").on("click", function() {
			getMeetupLocations(zipcode);
		})

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

	$("body").append('<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAuXTlZpy0_PBxrTVDc9p7S_XDpdX0i7po&callback=initMap"></script>')
	var map;

	function initMap(_lat, _lng) {

		console.log(_lat + ", " + _lng);

		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 12,
			center: new google.maps.LatLng(_lat, _lng),
			mapTypeId: 'roadmap'

		});

		var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
		var icons = {
			parking: {
				icon: iconBase + 'parking_lot_maps.png'
			},
			library: {
				icon: iconBase + 'library_maps.png'
			},
			info: {
				icon: iconBase + 'info-i_maps.png'
			}
		};

		var features = [{
			position: new google.maps.LatLng(-33.91721, 151.22630),
			type: 'info'
		
		}];

		// Create markers.
		features.forEach(function(feature) {
			var marker = new google.maps.Marker({
				position: feature.position,
				icon: icons[feature.type].icon,
				map: map
			});
		});
		
	}


	MainProgram();

	
});