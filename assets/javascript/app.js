$(document).ready(function()
{
	var account =
	{
		username: "",
		password: "",
		index: 0,

		GetUsername()
		{
			this.username = $("#name-input").val().trim();
		},

		GetPassword()
		{
			this.password = $("#pass-input").val().trim();
		}
	};

	// hide directory screen
	$("#directory").hide()

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

		});

		$("#meetupBtn").on("click", function() {
			getMeetupLocations(zipcode);
		})

		$("#confirmAccount").click(function(event)
		{
			event.preventDefault();
			var ref = database.ref("profile");

			account.GetUsername();
			account.GetPassword();

			ref.orderByChild("username").equalTo(account.username).once("value", function(snapshot)
			{
			    var userData;

			    userData = snapshot.val();

			    if (userData)
			    {
				    alert("Account already exists, please try again.");
			    	$("#name-input").val("");
			    	$("#pass-input").val("");
			    }
			    else
			    {
			    	ref.orderByChild("password").equalTo(account.password).once("value", function(snapshot)
					{
					    var userData;

					    userData = snapshot.val();

					    if(userData)
					    {
					    	alert("Account already exists, please try again.");
					    	$("#name-input").val("");
					    	$("#pass-input").val("");
					    }
					    else
					    {
					    	database.ref("/profile").push(
							{
								username: account.username,
								password: account.password,
								indexOn: account.index
							})

					    	localStorage.setItem("username", account.username);
					    	localStorage.setItem("password", account.password);

							$("#name-input").val("");
					    	$("#pass-input").val("");	

							account.index++;
					    }
					})
			    }
			});
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

	window.initMap = function(lat, lng) {
		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 16,
			center: new google.maps.LatLng(-33.91722, 151.23064),
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
		}, {
			position: new google.maps.LatLng(-33.91539, 151.22820),
			type: 'info'
		}, {
			position: new google.maps.LatLng(-33.91747, 151.22912),
			type: 'info'
		}, {
			position: new google.maps.LatLng(-33.91910, 151.22907),
			type: 'info'
		}, {
			position: new google.maps.LatLng(-33.91725, 151.23011),
			type: 'info'
		}, {
			position: new google.maps.LatLng(-33.91872, 151.23089),
			type: 'info'
		}, {
			position: new google.maps.LatLng(-33.91784, 151.23094),
			type: 'info'
		}, {
			position: new google.maps.LatLng(-33.91682, 151.23149),
			type: 'info'
		}, {
			position: new google.maps.LatLng(-33.91790, 151.23463),
			type: 'info'
		}, {
			position: new google.maps.LatLng(-33.91666, 151.23468),
			type: 'info'
		}, {
			position: new google.maps.LatLng(-33.916988, 151.233640),
			type: 'info'
		}, {
			position: new google.maps.LatLng(-33.91662347903106, 151.22879464019775),
			type: 'parking'
		}, {
			position: new google.maps.LatLng(-33.916365282092855, 151.22937399734496),
			type: 'parking'
		}, {
			position: new google.maps.LatLng(-33.91665018901448, 151.2282474695587),
			type: 'parking'
		}, {
			position: new google.maps.LatLng(-33.919543720969806, 151.23112279762267),
			type: 'parking'
		}, {
			position: new google.maps.LatLng(-33.91608037421864, 151.23288232673644),
			type: 'parking'
		}, {
			position: new google.maps.LatLng(-33.91851096391805, 151.2344058214569),
			type: 'parking'
		}, {
			position: new google.maps.LatLng(-33.91818154739766, 151.2346203981781),
			type: 'parking'
		}, {
			position: new google.maps.LatLng(-33.91727341958453, 151.23348314155578),
			type: 'library'
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

	// function CreateMap(location, key)
	// {
	// 	var main;

	// 	main = $("<iframe>");
	// 	main.attr("width", 600);
	// 	main.attr("height",450);
	// 	main.attr("frameborder", 0);
	// 	main.attr("id", "map");
	// 	main.addClass("center-block");
	// 	main.attr("src", "https://www.google.com/maps/embed/v1/place?key=" + key + "&q=" + location + "&zoom=13");
	// 	$(".map").append(main);
	// }	

	MainProgram();

	
});