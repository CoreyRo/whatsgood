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
		//array of food locations
		var foodLocations = [];
		//Number of returned events
		var numOfMeetups = 20;
		//Initial Lat
		var lat;
		//Initial Long
		var lng;
		//firebase configuration
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
			//prevent page refresh
			event.preventDefault();


			//Error check the zip input to make sure the zipcode is valid length
			if($("#zip-input").val() == "" || $("#zip-input").val().length != 5) {
				$("#zipError").empty();
				$("#zipError").append("<div class='alert alert-danger text-center'><strong>Please enter a 5 digit zipcode.</strong></div>");
				console.log($("#zip-input").val().length);
			}
			//If zipcode is 5 digits long then proceed...
			else {

				console.log($("#zip-input").val().length);
				$("#brand-row").hide();
				$("#login-register").hide();
				$("#register-div").hide();
				$("#login-div").hide();
				$("#directory").show();
				$("#zipError").empty();
				//ajax call to the google maps api
				var apiKey = "AIzaSyAVeD_VRihMVTcxvIM6mwH6WSEZ-s1kqRo";
				var queryUrl;

				//value taken from user input
				zipcode = $("#zip-input").val();
				queryUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + zipcode + "&key=" + apiKey;

				$.ajax({
					url: queryUrl,
					method: "GET"
				}).done(function(response)
				{
					console.log(response);


					//center the map over the zipcode input
					lat = response.results[0].geometry.location.lat;
					lng = response.results[0].geometry.location.lng;

					console.log(lat);
					console.log(lng);

					initMap(lat, lng);
					$("#zip-input-row").appendTo("#new-zip-input");

				});//end of ajax call

			}//end of else statement

		});//end of onclick
		
		//meetup on click runs getevents function and appends the events from the ajax call to the map
		$("#meetupBtn").on("click", function() {

			$("#directory").hide();
			$(".loading").show();

			//call the getEvents function that runs an ajax call to the meetups api
			getEvents(lat, lng, zipcode, locations, numOfMeetups);
		});

		//food on click runs getfood function and appends the events from the ajax call to the map
		$("#foodBtn").on("click", function() {

			// $("#directory").hide();
			// $(".loading").show();

			//call the getFood function that runs an ajax call to the local google api
			initFood(lat, lng, zipcode, locations);
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

	} //end of main


/********************************************************************************
****************************** Button Functions *********************************
********************************************************************************/

	function getEvents(lat, lng, zip, locations, numOfMeetups) {


		//Jake API Key
		var key = "4f561e404155b324d1b791c124f6221";
		//Corey API Key
	    //var key = "7e44766f4e7d46533d222a4d7f477b";
		var queryUrl = "https://api.meetup.com/find/groups?key=" + key + "&zip=" + zip/* + "&only=zip,name,lon,lat,link,description&*/+"&callback=?";


		//ajax call to the meetups api to grab local events
		$.getJSON(
		{
			url: queryUrl,
			method: "GET"
		}).done(function(response)
		{
			console.log(response);
			
			//loop through the response and retrieve the latitudes and longitudes and extra info and store into an object
			for(var i = 0; i < numOfMeetups; i++) {

				locations[i] = { name: response.data[i].name, lat: response.data[i].lat, lon: response.data[i].lon, link: response.data[i].link,  description: response.data[i].description, city: response.data[i].city};
			}

			console.log(locations);
			$(".loading").hide();
			$("#directory").show();

			logResults(locations);

			//initialize the map with the results from the ajax call 
			initEvents(lat, lng, locations, numOfMeetups);

		});
	}


	/********************************************************************************
	****************************** Map Functions ************************************
	********************************************************************************/

	//Append the body with a script tag essential for the google maps api
	$("body").append('<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAuXTlZpy0_PBxrTVDc9p7S_XDpdX0i7po&libraries=places&callback=initMap"></script>');
	var map;

	//initializes map and location based off of the zipcode input
	window.initMap = function(lat, lng) {
			map = new google.maps.Map(document.getElementById('map'), {
			zoom: 12,
			center: new google.maps.LatLng(lat, lng),
			mapTypeId: 'roadmap'

		});
	}

	window.initEvents = function(lat, lng, locations, numOfMeetups) {
		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 10,
			center: new google.maps.LatLng(lat, lng),
			mapTypeId: 'roadmap'

		});

		var iconBase = 'https://maps.google.com/mapfiles/kml/paddle/';
		var icons = {
			parking: {
				icon: iconBase + 'M.png'
			},
			library: {
				icon: iconBase + 'M.png'
			},
			info: {
				icon: iconBase + 'M.png'
			}
		};

		var features = [];

		for(var i = 0; i < numOfMeetups; i++) {


			features[i] = {
			position: new google.maps.LatLng(locations[i].lat, locations[i].lon),
			type: 'info',
			name: locations[i].name,
			contentString: "<div id='content'>" +
						   "<div id='siteNotice'>" + 
						   "<h5 id='firstHeading' class='firstHeading'>" + String(locations[i].name) + "</h5>" +
						   "<div id='bodyContent'>" + 
						   "<p>" + String(locations[i].description) + "</p>" +
						   "Link: <a href='" + String(locations[i].link) + "'>" + String(locations[i].link) + "</a>" + 
						   "</div>" + 
						   "</div>"
			};

		}

			// Create markers.
			features.forEach(function(feature) {


			var InfoWindow = new google.maps.InfoWindow({
				content: feature.contentString
			});


			var marker = new google.maps.Marker({
				position: feature.position,
				icon: icons[feature.type].icon,
				map: map
			});
			
			marker.addListener('click', function() {
				InfoWindow.open(map, marker);
			})

		
		});

		
	}

	window.initFood = function(lat, lng, zipcode, foodLocations) {

		// setTimeout(foodTime,2000)
		// function foodTime(){
		// 	$(".loading").hide();
		// 	$("#directory").show();
		// }
			console.log("clicked");
	        var map;
	        var infowindow;
	        initMap(lat, lng);
	        function initMap(lat, lng) {
	        	console.log(lat + "," + lng)
	            var pyrmont = {lat,
	            	lng};

	            map = new google.maps.Map(document.getElementById('map'), {
	                center: pyrmont,
	                zoom: 12
	            });

	            infowindow = new google.maps.InfoWindow();
	            var service = new google.maps.places.PlacesService(map);
	            service.nearbySearch({
	                location: pyrmont,
	                radius: 8100, //about 5 miles
	                type: ['food']
	            }, callback);
	        }

	        function callback(results, status) {
	        	// console.log(results);
	            if (status === google.maps.places.PlacesServiceStatus.OK) {
	                for (var i = 0; i < results.length; i++) {
	                    createMarker(results[i]);
	                    foodLocations[i] = results[i];
	                }
	            }

	             logFood(results);

	        }

	        function createMarker(place) {
	            var placeLoc = place.geometry.location;
	            var marker = new google.maps.Marker({
	                map: map,

	                position: place.geometry.location
	            });

	            google.maps.event.addListener(marker, 'click', function() {
	                infowindow.setContent(place.name);
	                infowindow.open(map, this);
	            });
	        }
    }


	function logResults(locations) {

		$("#table-head").empty();

		var headRow = $("<tr>");
		var nameHead = $("<th>");
		var locHead = $("<th>");
		var descHead = $("<th>");

		nameHead.html("Meetup Title");
		locHead.html("Location");
		descHead.html("Description");

		headRow.append(nameHead, locHead, descHead);
		$("#table-head").append(headRow);


		for (var i = 0; i < locations.length; i++) {
			console.log(locations[i]);
			var resultsRow = $("<tr>");
			var nameCell = $("<td>");
			var cityCell = $("<td>");
			var descCell = $("<td>");

			nameCell.html(locations[i].name);
			cityCell.html(locations[i].city);
			descCell.html(locations[i].description);

			resultsRow.append(nameCell, cityCell, descCell);
			$("#row-results").append(resultsRow);

		}
	}


	function logFood(foodLocations) {

		$("#table-head").empty();

		var headRow = $("<tr>");
		var nameHead = $("<th>");
		var locHead = $("<th>");
		var ratingHead = $("<th>");
		var openHead = $("<th>");

		nameHead.html("Name");
		locHead.html("Location");
		ratingHead.html("Rating");
		openHead.html("Open?");

		headRow.append(nameHead, locHead, ratingHead, openHead);
		$("#table-head").append(headRow);

		for (var i = 0; i < foodLocations.length; i++) {
			var resultsRow = $("<tr>");
			var nameCell = $("<td>");
			var cityCell = $("<td>");
			var descCell = $("<td>");
			var openCell = $("<td>");

			nameCell.html(foodLocations[i].name);
			cityCell.html(foodLocations[i].vicinity);
			descCell.html(foodLocations[i].rating);
			openCell.html(foodLocations[i].opening_hours.open_now);

			resultsRow.append(nameCell, cityCell, descCell, openCell);
			$("#row-results").append(resultsRow);

		}
	}

	/********************************************************************************
	****************************** Function Calls ***********************************
	********************************************************************************/

	MainProgram();

	$(document).ajaxError(function(){
	    $(".loading").hide()
	    $("#loadError").append("<div class='alert alert-danger text-center'><strong>Oops! Something went wrong!</strong></div>");
	    // setTimeout(loadError, 2000)
	    // function loadError(){
	    // 	window.location.reload();
	    // }
	});	

});


