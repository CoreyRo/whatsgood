$(document).ready(function () {
	// hide directory screen
	$("#brandH1").hide();
	$("#directory").hide();
	$("#login-div").hide();
	$("#register-div").hide();
	$(".loading").hide();
	$("#zip-input-row, #login-register").hide();
	$("#zipForm").hide();
	$("#zipInput").hide();
	$("#logout").hide();

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

	setTimeout(brandAni, 600);

	function brandAni() {
		$("#brandH1").show().animateCss("bounceIn");
		setTimeout(zipAni, 600)

		function zipAni() {
			$("#zip-input-row, #login-register").show().animateCss("fadeIn")
		}

	}

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

		var numOfMeetups = 0;
		//Initial Lat
		var lat;
		//Initial Long
		var lng;
		//firebase configuration
		var type;

		var indexAr = [];

		var currentUser;

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

				console.log(currentUser)
	       	    database.ref("profiles/" + currentUser).update(
                {
                  zipcode: zipcode
                });
   		       

			}//end of else statement

		});//end of onclick


        //onClick functions...
		$(".filters").on("click", function() {

	/*		$("#directory").hide();
			$(".loading").show();*/
			type = this.id;

			if(type ==="exercise") {
				type = "Outdoors & Adventure";
			}

			console.log(type);

			if(type==="gas_station" || type==="bank" || type==="bus_station" || type==="gym" || type==="shopping_mall") {

				initPlaces(lat, lng, zipcode, type);
				
			}
			//meetup on click runs getevents function and appends the events from the ajax call to the map
			else if(type==="Tech" || type==="Socializing" || type==="Outdoors & Adventure" || type==="Games") {

				//call the getEvents function that runs an ajax call to the meetups api
				getEvents(lat, lng, zipcode, locations, type, indexAr, numOfMeetups);
				
			}

			else if(type==="food" || type==="restaurant" || type==="grocery_or_supermarket" || type==="meal_delivery") {

				//call the getFood function that runs an ajax call to the local google api
				initFood(lat, lng, zipcode, type);
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

		//Stores the root to the auth section
        var auth = firebase.auth();
        var currentUserId = '';

        //Handles the user logging in
        $("#confirmAccount").click(function(event)
        {
            event.preventDefault();
            $("#zipForm").show();
			$("#zipInput").show();
			$("#register-div").hide();
			$("#login-div").hide();  
            var email = $("#myname-input").val();
            var pass = $("#mypass-input").val();
            //Sign in
            promise = auth.signInWithEmailAndPassword(email, pass);
            promise.catch(function(e)
            {
                alert(e.message);
            })
        })
        //registers a new user
        $("#confirmReg").click(function(event)
        {
            event.preventDefault();
            $("#zipForm").show();
			$("#zipInput").show();
            var email = $("#email-input").val();
            var pass = $("#pass-input").val();

			$("#register-div").hide();
			$("#login-div").hide();            
            //TODO: validate that both the email and password fields are valid
            promise = auth.createUserWithEmailAndPassword(email, pass);
            promise.catch(function(e)
            {
                alert(e.message);
            })
            promise.then(function(resolve)
            {	
                database.ref("/profiles").push(
                {
                  uid: resolve.uid,
                  email: resolve.email,
                  zipcode: "000000"
                });
            })
        })

        //this section will query data stored in a specific user
        var ref = firebase.database().ref("profiles");

        //checks to see if the user is logged in or not
        auth.onAuthStateChanged(function(firebaseUser)
        {
            if(firebaseUser)
            {
                $("#logout").show();
         		$("#loginOrRegister").hide();
         		$("#zipForm").show();
				$("#zipInput").show();

            }
            else
            {
                $("#logout").hide();
                $("#loginOrRegister").show();
            }
        });
        //Logs out the user
        $("#logout").click(function(e)
        {
            firebase.auth().signOut();
            $("#loginOrRegister").show();
            $("#zipForm").hide();
			$("#zipInput").hide();
        })
        
        database.ref("/profiles").on("child_added", function(snap)
        {
        	currentUser = snap.key;
        })

	} //end of main


/********************************************************************************
****************************** Button Functions *********************************
********************************************************************************/

	function getEvents(lat, lng, zip, locations, type, indexAr, numOfMeetups) {


		//Jake API Key
		var key = "4f561e404155b324d1b791c124f6221";
		//Corey API Key
	    //var key = "7e44766f4e7d46533d222a4d7f477b";
		var queryUrl = "https://api.meetup.com/find/groups?&search=" + type + "&key=" + key + "&zip=" + zip +"&callback=?";


		//ajax call to the meetups api to grab local events
		$.getJSON(
		{
			url: queryUrl,
			method: "GET"
		}).done(function(response)
		{
			console.log(response);
			var index = 0;
			
			//loop through the response and retrieve the latitudes and longitudes and extra info and store into an object
			for(var i = 0; i < response.data.length; i++) {

				if(response.data[i].category.name === type) {

					indexAr[index] = i;
					index++;
					numOfMeetups++;


					locations[i] = {name: response.data[i].name, lat: response.data[i].lat, lon: response.data[i].lon, link: response.data[i].link,  description: response.data[i].description, city: response.data[i].city, category: response.data[i].category.name};
				}

			}
			console.log(indexAr);
			console.log(locations);

			$(".loading").hide();
			$("#directory").show();

			//initialize the map with the results from the ajax call 
			initEvents(lat, lng, locations, indexAr, numOfMeetups);

			logResults(locations, indexAr, numOfMeetups, type);

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

	window.initEvents = function(lat, lng, locations, indexAr, numOfMeetups) {
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

			var index = indexAr[i];

			features[i] = {
			position: new google.maps.LatLng(locations[index].lat, locations[index].lon),
			type: 'info',
			name: locations[index].name,
			contentString: "<div id='content'>" +
						   "<div id='siteNotice'>" + 
						   "<h5 id='firstHeading' class='firstHeading'>" + String(locations[index].name) + "</h5>" +
						   "<div id='bodyContent'>" + 
						   "<p>" + String(locations[index].description) + "</p>" +
						   "Link: <a href='" + String(locations[index].link) + "'>" + String(locations[index].link) + "</a>" + 
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

	window.initFood = function(lat, lng, zipcode, type) {

			var filter;
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
	                type: [type]
	            }, callback);
	        }

	        function callback(results, status) {
	        	// console.log(results);
	            if (status === google.maps.places.PlacesServiceStatus.OK) {
	                for (var i = 0; i < results.length; i++) {
	                    createMarker(results[i]);
	                }
	                console.log(results);
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

    window.initPlaces = function(lat, lng, zipcode, type) {
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
	                type: [type]
	            }, callback);
	        }

	        function callback(results, status) {
	        	// console.log(results);
	            if (status === google.maps.places.PlacesServiceStatus.OK) {
	                for (var i = 0; i < results.length; i++) {
	                    createMarker(results[i]);
	                }
	                console.log(results);
	            }

	             logLocal(results);

	        }

	        function createMarker(place) {
	            var open = "";
	            var placeLoc = place.geometry.location;
	            var marker = new google.maps.Marker({
	                map: map,

	                position: place.geometry.location
	            });

	          	if( typeof place.opening_hours === "undefined") {

				open = "N/A";
				}
				else {

					if(place.opening_hours.open_now === true) {
					open = "Yes";
					}
					else {
					open = "No";
					}

				}

	            google.maps.event.addListener(marker, 'click', function() {
	                infowindow.setContent("<strong>" + place.name + "</strong><br>Address: " + place.vicinity + "<br>Rating: " + place.rating + "<br>Open: " + open );
	                infowindow.open(map, this);
	            });
	        }
    }


	function logResults(locations, indexAr, numOfMeetups, type) {


		$("#table-head").empty();
		$("#row-results").empty();

		var headRow = $("<tr>");
		var nameHead = $("<th>");
		var typeHead = $("<th>");
		var locHead = $("<th>");
		var descHead = $("<th>");

		nameHead.html("Meetup Title");
		typeHead.html("Category");
		locHead.html("Location");
		descHead.html("Description");

		headRow.append(nameHead, typeHead, locHead, descHead);
		$("#table-head").append(headRow);


		for (var i = 0; i < numOfMeetups; i++) {

			var index = indexAr[i];

			var resultsRow = $("<tr>");
			var nameCell = $("<td>");
			var typeCell = $("<td>");
			var cityCell = $("<td>");
			var descCell = $("<td>");

			nameCell.html(locations[index].name);
			typeCell.html(type);
			cityCell.html(locations[index].city);
			descCell.html(locations[index].description);

			resultsRow.append(nameCell, typeCell, cityCell, descCell);
			
			resultsRow.find('p').each( function (index, element) {
			 if ($(element).text().match(/(.)\1{9,}/)) { $(element).text('') }
			});
			
			$("#row-results").append(resultsRow);

		}
	}


	function logFood(foodLocations) {

		$("#table-head").empty();
		$("#row-results").empty();

		var headRow = $("<tr>");
		var nameHead = $("<th>");
		var locHead = $("<th>");
		var ratingHead = $("<th>");
		var openHead = $("<th>");

		nameHead.html("Name");
		locHead.html("Location");
		ratingHead.html("Rating");
		openHead.html("Open");

		headRow.append(nameHead, locHead, ratingHead, openHead);
		$("#table-head").append(headRow);

		for (var i = 0; i < foodLocations.length; i++) {

			var open = "";
			var resultsRow = $("<tr>");
			var nameCell = $("<td>");
			var cityCell = $("<td>");
			var descCell = $("<td>");
			var openCell = $("<td>");

			if( typeof foodLocations[i].opening_hours === "undefined") {

				open = "N/A";
			}
			else {

				if(foodLocations[i].opening_hours.open_now === true) {
					open = "Yes";
				}
				else {
					open = "No";
				}

			}


			nameCell.html(foodLocations[i].name);
			cityCell.html(foodLocations[i].vicinity);
			descCell.html(foodLocations[i].rating);
			openCell.html(open);

			resultsRow.append(nameCell, cityCell, descCell, openCell);
			$("#row-results").append(resultsRow);

		}
	}

	function logLocal(locations) {

		$("#table-head").empty();
		$("#row-results").empty();

		var headRow = $("<tr>");
		var nameHead = $("<th>");
		var locHead = $("<th>");
		var ratingHead = $("<th>");

		nameHead.html("Name");
		locHead.html("Location");
		ratingHead.html("Rating");

		headRow.append(nameHead, locHead, ratingHead);
		$("#table-head").append(headRow);

		for (var i = 0; i < locations.length; i++) {
			var resultsRow = $("<tr>");
			var nameCell = $("<td>");
			var cityCell = $("<td>");
			var descCell = $("<td>");
			
			if( typeof locations[i].opening_hours === "undefined") {

				open = "N/A";
			}
			else {

				if(locations[i].opening_hours.open_now === true) {
					open = "Yes";
				}
				else {
					open = "No";
				}

			}

			nameCell.html(locations[i].name);
			cityCell.html(locations[i].vicinity);
			descCell.html(locations[i].rating);

			resultsRow.append(nameCell, cityCell, descCell);
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
	});	

});


