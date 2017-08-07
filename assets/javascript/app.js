$(document).ready(function () {
	// hide directory screen
	$("#directory").hide()
	$("#login-div").hide()
	$("#register-div").hide()
	$(".loading").hide();

	//for the animate.css library
	$.fn.extend({
		animateCss: function (animationName) {
			var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
			this.addClass('animated ' + animationName).one(animationEnd, function () {
				$(this).removeClass('animated ' + animationName);
			});
			return this;
		}
	});
	// main function for running app
	function MainProgram() {
		// Initialize Firebase
		var config = {};
		// Variable to reference the database
		var database;
		// variable for storing zipcode
		var zipcode;
		//array of event locations
		var locations = [];
		//Number of returned 
		var numOfLocations = 25;
		//Initial Lat
		var _lat;
		//Initial Long
		var _lng;

		config = {
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
		$("#confirmZip").click(function (event) {

			event.preventDefault();

			if ($("#zip-input").val() == "" || $("#zip-input").val().length < 5) {
				$("#zipError").empty();
				$("#zipError").append("<div class='alert alert-danger text-center'><strong>Please enter a 5 digit zipcode.</strong></div>");
				console.log($("#zip-input").val().length);
			} else {
				console.log($("#zip-input").val().length);
				$("#brand-row").hide();
				$("#login-register").hide();
				$("#register-div").hide();
				$("#login-div").hide();
				$("#directory").show();
				$("#zipError").empty();

				console.log("Clicked confirmZip")

				var apiKey = "AIzaSyAVeD_VRihMVTcxvIM6mwH6WSEZ-s1kqRo";
				var queryUrl;

				zipcode = $("#zip-input").val();

				queryUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + zipcode + "&key=" + apiKey;

				$.ajax({
					url: queryUrl,
					method: "GET"
				}).done(function (response) {
					console.log(response)

					_lat = response.results[0].geometry.location.lat;
					_lng = response.results[0].geometry.location.lng;

					console.log(_lat);
					console.log(_lng);

					initMap(_lat, _lng);
					$("#zip-input-row").appendTo("#new-zip-input");

				})
			}

		});
		$("#newReg").on("click", function () {
			event.preventDefault();
			$("#login-div").hide();
			$("#register-div").show().animateCss("slideInUp");
		})

		$("#logBtn").on("click", function () {
			event.preventDefault();
			$("#register-div").hide();
			$("#login-div").show().animateCss("slideInUp");
		})

		$("#meetupBtn").on("click", function () {
			$("#directory").hide();

			$(".loading").show();
			getEvents(_lat, _lng, zipcode, locations, numOfLocations);
		});

	}

	function getEvents(_lat, _lng, zip, locations, numOfLocations) {
		//Jake API Key
		// var key = "4f561e404155b324d1b791c124f6221";

		//Corey API Key
		var key = "7e44766f4e7d46533d222a4d7f477b";
		var queryUrl = "https://api.meetup.com/find/groups?key=" + key + "&zip=" + zip + "&only=name,lon,lat";

		$.ajax({
			url: queryUrl,
			method: "GET"
		}).done(function (response) {
			console.log(response);

			//loop through the response and retrieve the latitudes and longitudes for the meetups
			for (var i = 0; i < numOfLocations; i++) {
				locations[i] = {
					name: response[i].name,
					lat: response[i].lat,
					lon: response[i].lon
				};
			}

			console.log(locations);
			$(".loading").hide();
			$("#directory").show();
			initEvents(_lat, _lng, locations, numOfLocations);

		});

	}

	$("body").append('<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAuXTlZpy0_PBxrTVDc9p7S_XDpdX0i7po&callback=initMap"></script>')
	var map;

	window.initMap = function (_lat, _lng) {
		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 12,
			center: new google.maps.LatLng(_lat, _lng),
			mapTypeId: 'roadmap'

		});

	}

	window.initEvents = function (_lat, _lng, locations, numOfLocations) {
		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 10,
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

		var features = [];

		for (var i = 0; i < numOfLocations; i++) {

			features[i] = {
				position: new google.maps.LatLng(locations[i].lat, locations[i].lon),
				type: 'info',
				name: locations[i].name
			};

		}

		// Create markers.
		features.forEach(function (feature) {
			var marker = new google.maps.Marker({
				position: feature.position,
				icon: icons[feature.type].icon,
				map: map
			});
		});

	}

	MainProgram();
	$(document).ajaxError(function () {
		$(".loading").hide()
		$("#loadError").append("<div class='alert alert-danger text-center'><strong>Oops! Something went wrong!</strong></div>");
		setTimeout(loadError, 2000)

		function loadError() {
			window.location.reload();
		}
	});

});