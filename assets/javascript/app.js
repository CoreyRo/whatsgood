$(document).ready(function() {
			$("#directory").hide()

			function MainProgram() {
				var config = {}; // Initialize Firebase
				var database; // Variable to reference the database
				var lat;
				var lng;

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

				$("#confirmZip").click(function(event) {
					event.preventDefault();
					$("#start").hide();
					$("#directory").show();


					console.log("Clicked confirmZip")
					var apiKey = "AIzaSyAuXTlZpy0_PBxrTVDc9p7S_XDpdX0i7po";
					var zipcode = $("#zip-input").val();
					console.log("zip " + zipcode);
					// CreateMap(zipcode, apiKey);

					var queryUrl;

					zipcode = $("#zip-input").val();
					queryUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + zipcode + "&key=" + apiKey;

					$.ajax({
						url: queryUrl,
						method: "GET"
					}).done(function(response) {
						console.log(response)

						lat = response.results[0].geometry.location.lat;
						lng = response.results[0].geometry.location.lng;

						console.log(lat);
						console.log(lng);
						initMap(lat, lng);



					})




				});
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


			MainProgram();