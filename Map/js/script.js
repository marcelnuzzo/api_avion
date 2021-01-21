var MAP_API = {
    

    //AVIATION_API_ENDPOINT: "http://api.aviationstack.com/v1/airports?access_key=6cdfdcbda57de4d10a8a94a8ee798a59",
    AVIATION_API_ENDPOINT: "http://localhost/map2/API/api/airports.php",
    map : null,
    icon: null,
    airports: null,

    initMap : function () {

        this.buildMap();
        this.fetchData();
    },

    buildMap : function () {

        // this.icon = {
        //     url: "./img/plane.svg",
        //     anchor: new google.maps.Point(10,20),
        //     scaledSize: new google.maps.Size(20,20)
        // };

        var paris = { 
            lat: 48.8534, 
            lng: 2.3488 
        };

        this.map = new google.maps.Map(document.getElementById("map"), {
            zoom: 3,
            center: paris
		});
		
    },

    fetchData : function () {

        var self = this;

        var apiHeader = new Headers();

        var initObject = {
            method: 'GET',
            headers: apiHeader,
            mode: 'cors',
            cache: 'default'
		};
		fetch(this.AVIATION_API_ENDPOINT, initObject).then(function(response) {

            console.log("response est arrivée", response);

            response.json().then(function(list_airports) {

                console.log("response en JSON", list_airports);

                self.airports = list_airports;

                self.airports.forEach(function(airport, index) {

                    // console.log(airport.airport_name, airport.country_name);
                    self.appendElementToList(airport);
                    self.drawAirportOnMap(self.map, airport);

                })

            })
        })
    },

    drawAirportOnMap : function(map, airport) {
		var iconPlane = {
            url: "./img/plane.svg",
            anchor: new google.maps.Point(10,20),
            scaledSize: new google.maps.Size(20,20)
		};

		const infowindow = new google.maps.InfoWindow({
			content: airport.airport_name,
		  });

        var marker = new google.maps.Marker({
            map: this.map,
            position: {
                lat: parseFloat(airport.latitude),
                lng: parseFloat(airport.longitude)
			},
			icon:iconPlane,
		})

		marker.addListener("click", () => {
			infowindow.open(map, marker);
		  });

    },

    appendElementToList : function (airport) {
        
        var li = document.createElement("LI");
        var airport_name = document.createTextNode(airport.name + ", " + airport.latitude + " ," + airport.longitude);
        li.appendChild(airport_name);
        document.getElementById("airports-list").appendChild(li);
    }
}