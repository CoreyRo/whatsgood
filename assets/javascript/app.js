$( document ).ready(function() {
    function MainProgram()
        {   
            var config = {};        // Initialize Firebase
            var database;           // Variable to reference the database
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
    MainProgram();

    var map;
        var infowindow;

          function initMap() {
            var location = {lat: lat, lng: lng};

            map = new google.maps.Map(document.getElementById('map'), {
              center: location,
              zoom: 15
            });

            infowindow = new google.maps.InfoWindow();
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
              location: location,
              radius: 500,
              type: ['atm']
            }, callback);
          }

          function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
              }
            }
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
});