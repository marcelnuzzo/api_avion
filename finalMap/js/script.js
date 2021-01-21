
var MAP_API = {

	AVIATION_API_ENDPOINT: "http://localhost/api-webservice/map2/API/airports.php",

	map : null,
	icon: null,
	airports: null,
	markers: [],
	newAirport : null,

	formAirport : null,
	inputMode: null,
	inputId: null,
	inputName: null,
	inputLatitude: null,
	inputLongitude: null,

	initMap : function () {

		this.formAirport = document.querySelector('#form-airport');
		this.inputMode = this.formAirport.querySelector('input[name="mode"]');
		this.inputId = this.formAirport.querySelector('input[name="id"]');
		this.inputName = this.formAirport.querySelector('input[name="name"]');
		this.inputLatitude = this.formAirport.querySelector('input[name="latitude"]');
		this.inputLongitude = this.formAirport.querySelector('input[name="longitude"]');

		this.buildMap();
		this.fetchData();
		this.initModal();
	},

	buildMap : function () {

		console.log("Build map - ma page est chargée")

		var self = this;

		var paris = { 
			lat: 48.8534, 
			lng: 2.3488
		};

		this.map = new google.maps.Map(document.getElementById("map"), {
			zoom: 3,
			center: paris
		});

		this.map.addListener("click", function (event) {
			
			// console.log( "CLICK", event.latLng.lat(), event.latLng.lng() );

			self.placeMarkerAndOpenModal(event.latLng, self.map);
		});
	},

	fetchData : function () {

		var self = this;

		var initObject = { 
			method: 'GET',
			mode: 'cors',
			headers: new Headers()
		};

		fetch( this.AVIATION_API_ENDPOINT, initObject )
			.then( function( response ) { 
				return response.json() 
			})
			.then( function( list_airports ) {

				self.cleanList();
				self.cleanMap();

				self.airports = list_airports;

				self.airports.forEach( function ( airport, index ) {

					self.appendElementToList( airport );
					self.drawAirportOnMap( self.map, airport );

				} );

			} );

	},

	placeMarkerAndOpenModal : function( latLng, map ) {

		var self = this;

		// Place Marker
		self.newAirport = new google.maps.Marker({
			position: latLng,
			map: map
		});
		
		map.panTo(latLng);


		// Open Modal
		// TODO Ouvrir la modal et remplir le formulaire avec l'objet latLng
		// mode = 'create'
		// latLng = latLng // objet google map avec latitute et longitude
		// latLng > .lat() / .lng()
		self.displayModal( "create", null, latLng );
		
	},

	initModal : function() {

		var self = this;

		document.querySelector('.btn-close').addEventListener('click', function(e) {
			e.preventDefault();
			self.hideModal();
		});

		document.querySelector('.modal-background').addEventListener('click', function() {
			self.hideModal();
		});

		self.formAirport.addEventListener('submit', function(e) {
			e.preventDefault();
			
			// TODO verifier input mode
			if ( self.inputMode.value == 'create' ) {
				
			// if create
			// request avec body (name, longitude, latitude)

				// recupérer les valeurs input
				var requestBody = {
					name: self.inputName.value,
					latitude : self.inputLatitude.value,
					longitude: self.inputLongitude.value
				};
				
				// Fetch request / create
				self.fetchRequest( "POST", requestBody );

			} else if ( self.inputMode.value == 'update' ) {

			// if update 
			// request update avec body (id, name, longitude, latitude)

				// recupérer les valeurs input
				var requestBody = {
					id: self.inputId.value,
					name: self.inputName.value,
					latitude : self.inputLatitude.value,
					longitude: self.inputLongitude.value
				};
				
				// Fetch request / PUT pour update
				self.fetchRequest( "PUT", requestBody );

			}

  		});
	},

	/*
	 * this.fetchRequest( method : string, body : objet javascript );
	 */
	fetchRequest : function( requestMethod, requestBody ) {

		var self = this;

		var initObject = {
			method: requestMethod,
			mode: 'cors',
			headers: new Headers(),
			body: JSON.stringify(requestBody)
		};

		fetch( self.AVIATION_API_ENDPOINT, initObject )
			.then( function( response ) {

				console.log( "status", response.status );
				return response.json();
			})
			.then( function ( responseJSON ) {

				console.log( responseJSON );

				self.hideModal();
				self.fetchData();

			} );
	},

	drawAirportOnMap : function( map, airport ) {

		var self = this;

		var marker = new google.maps.Marker({
			map: map,
			position: {
				lat: parseFloat(airport.latitude),
				lng: parseFloat(airport.longitude)
			},
			airport_id: airport.id
		});

		// TODO au click sur un marker ouvrir la modal
		// mode = 'update'
		// id = marker.get('airport_id')
		marker.addListener('click', function(e) {

			self.displayModal( 'update', marker.get('airport_id') );
		});

		self.markers.push(marker);
	},

	appendElementToList : function ( airport ) {

		var li = document.createElement("LI");

		var a = document.createElement("A");
		a.setAttribute('data-id', airport.id);

		var airport_name = document.createTextNode( airport.name );
		a.appendChild(airport_name);

		var btnDelete = document.createElement("A");
		btnDelete.setAttribute('data-id', airport.id);
		btnDelete.classList.add('btn-delete');

		var iconDelete = document.createTextNode( "x" );
		btnDelete.appendChild(iconDelete);
		
		li.appendChild(a);
		li.appendChild(btnDelete);

		var self = this;

		a.addEventListener('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			
			// TODO Afficher la modal 
			// mode = 'update'
			// id = event.target.dataset.id
			console.log( "update", event.target.dataset.id );
			// update 21

			self.displayModal( "update", event.target.dataset.id );

		});

		btnDelete.addEventListener('click', function(event) {

			event.preventDefault();

			// TODO faire la requete pour supprimer l'aeroport
			// mode = 'delete'

			console.log( event.target.dataset.id );

			// on recupère l'id de l'element sur lequel on clique
			// id = event.target.dataset.id

			var initObject = { 
				method: 'DELETE',
				mode: 'cors',
				headers: new Headers(),
				body: JSON.stringify({ "id" : event.target.dataset.id })
			};

			// on cree la requete Fetch avec initObject > methode DELETE
			fetch( self.AVIATION_API_ENDPOINT, initObject )
				.then( function( response ) {

					// une fois que la requete est terminee
					// on affiche le resultat
					console.log( response );

				} );

		});

		document.getElementById("airports-list").appendChild(li);

	},

	hideModal : function() {

		document.querySelector(".modal").classList.remove('visible');
		
		// TODO supprimer le newAirport
		// delete( newAirport )
		var self = this;

		if ( self.newAirport ) {
			self.newAirport.setMap(null);
			self.newAirport = null;
		}

	},

	displayModal: function( mode, id, latLng ) {

		var self = this;

		self.cleanForm();

		// TODO 
		// remplir les valeurs des champs cachés : inputMode et inputId
		self.inputMode.value = mode;
		self.inputId.value = id;

		// verification du mode create ou update
		if ( mode == 'create' ) {

			// latLng > .lat() / .lng()
			self.inputLatitude.value = latLng.lat();
			self.inputLongitude.value = latLng.lng();
		
		} else if ( mode == 'update' ) {

			// selectionne l'aeroport correspondant à notre id
			var selectedAirport = self.airports.find( function( airport ) {
				return airport.id == id;
			} );

			// on rempli les champs du formulaire
			self.inputName.value = selectedAirport.name;
			self.inputLatitude.value = selectedAirport.latitude;
			self.inputLongitude.value = selectedAirport.longitude;
		}

		// on affiche la modal
		document.querySelector(".modal").classList.add('visible');
	},

	cleanForm : function() {

		this.inputMode.value = "";
		this.inputId.value = "";

		this.inputName.value = "";
		this.inputLatitude.value = "";
		this.inputLongitude.value = "";
	},

	cleanList : function() {

		document.getElementById("airports-list").innerHTML = "";
	},

	cleanMap : function() {

		// if ( this.markers.length == 0 ) return;

		this.markers.forEach( function ( marker ) {
			marker.setMap(null);
		} );

		this.markers = [];
	}
}





