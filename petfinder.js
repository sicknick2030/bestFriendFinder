var config = {
    apiKey: "AIzaSyBj0VNeS_U8PR-NDxZNYUnfb67Ca76FEzw",
    authDomain: "bestfriendfinder-26231.firebaseapp.com",
    databaseURL: "https://bestfriendfinder-26231.firebaseio.com",
    projectId: "bestfriendfinder-26231",
    storageBucket: "bestfriendfinder-26231.appspot.com",
    messagingSenderId: "739384275677"
  };

firebase.initializeApp(config);
var db = firebase.database().ref();
var dbFav = firebase.database().ref("/favorites");


console.log("wow");
var PetFinderAPIKey = "156a1b8fa2233c99240e24d804ef4754";

function getPets(event) {
	event.preventDefault();
	// console.log("getPets");

	var petType = $("#petType").val().trim();
	var zipCode = $("#zipCode").val().trim();
	var petAge = $("#petAge").val().trim();
	var petSize = $("#petSize").val().trim();
	var petGender = $("#petGender").val().trim();

	// db.push({
	// 	petType: petType,
	// 	zipCode: zipCode,
	// });

	var queryURL = "https://api.petfinder.com/pet.find";

	$.ajax({
		url: queryURL,
		jsonp: "callback",
		dataType: "jsonp",
		data: {
			key: PetFinderAPIKey,
			animal: petType,
			location: zipCode,
			age: petAge,
			size: petSize,
			sex: petGender,
			output: "basic",
			format: "json",
			count: 5,
		},
		success: function(petApiData) {
			// console.log(petApiData);
			var pets = petApiData.petfinder.pets.pet;
			console.log("pets", pets);

			for (var i = 0; i < pets.length; i++) {
				var animalDiv = $("<div class ='animalDiv'>");

				var animalName = pets[i].name.$t;
				var animalNameDiv = $("<h2>").text(animalName);
				animalDiv.append(animalNameDiv);

				var animalImageURL = pets[i].media.photos.photo[2].$t;
				var animalImage = $("<img class='animal'>").attr("src", animalImageURL);
				animalDiv.append(animalImage);

				// var animalDescription = pets[i].description.$t;
				// var animalDescriptionDiv = $("<p>").text(animalDescription);
				// animalDiv.append(animalDescriptionDiv);

				var animalID = pets[i].id.$t;
				var favoriteButton = $("<button class='addFavorite' value='" + animalID + "'>").text("Favorite");
				animalDiv.append(favoriteButton);

				$("#results").append(animalDiv);

				// NEED TO GENERATE A LIST OF SHELTERS
				// AND THEN PULL THE SHELTER INFO FROM PETFINDER TO GIVE TO THE GOOGLE MAPS API
			}
		}
	})
}

// $(document).on("click","#petFinderSubmit",getPets);
$(document).on("change",".target",getPets);

function addFavorite() {
	var animalID = this.value;

	var queryURL = "https://api.petfinder.com/pet.get";
	
	$.ajax({
		url: queryURL,
		jsonp: "callback",
		dataType: "jsonp",
		data: {
			key: PetFinderAPIKey,
			id: animalID,
			output: "basic",
			format: "json",
		},
		success: function(petResponse) {
			console.log(petResponse);
			var pet = petResponse.petfinder.pet;
			var favoriteName = pet.name.$t;
			var favoriteShelterID = pet.shelterId.$t;
			var favoritePhoto = pet.media.photos.photo[2];
			dbFav.push({
				favoriteID: animalID,
				favoriteName: favoriteName,
				favoriteShelterID: favoriteShelterID,
				favoritePhoto: favoritePhoto,
			});
		}
	})
}

$(document).on("click",".addFavorite",addFavorite);

dbFav.on("child_added", function(snapshot) {
	console.log("child_added", snapshot.val());

	var favID = snapshot.val().favoriteID;

	// var queryURL = "https://api.petfinder.com/pet.get";
	
	// $.ajax({
	// 	url: queryURL,
	// 	jsonp: "callback",
	// 	dataType: "jsonp",
	// 	data: {
	// 		key: PetFinderAPIKey,
	// 		id: animalID,
	// 		output: "basic",
	// 		format: "json",
	// 	},
	// 	success: function(petResponse) {
	// 		console.log(petResponse);
	// 		var pets = petApiData.petfinder.pet;
	// 	}
	// })

	// var favDiv = $("<div class ='favDiv'>");

	// var animalName = pets[i].name.$t;
	// var animalNameDiv = $("<h2>").text(animalName);
	// favDiv.append(animalNameDiv);

	// var animalImageURL = pets[i].media.photos.photo[2].$t;
	// var animalImage = $("<img class='animal'>").attr("src", animalImageURL);
	// favDiv.append(animalImage);

	// var animalID = pets[i].id.$t;
	// var favoriteButton = $("<button class='addFavorite' value='" + animalID + "'>").text("Favorite");
	// favDiv.append(favoriteButton);

	// $("#favorites").append(favDiv);

})

// 	var queryURL = "https://api.petfinder.com/pet.get";
	
// 	$.ajax({
// 		url: queryURL,
// 		jsonp: "callback",
// 		dataType: "jsonp",
// 		data: {
// 			key: PetFinderAPIKey,
// 			id: animalID,
// 			output: "basic",
// 			format: "json",
// 		},
// 		success: function(petResponse) {
// 			console.log(petResponse);
// 			var pets = petApiData.petfinder.pet;
// 		}
// 	})





// section below is just experimental, but i think we can use it to generate the secondary dropdown (animal > breed)
// but maybe not, may get unwieldy 

function getBreeds() {
	console.log("getBreeds");
	var queryURL = "https://api.petfinder.com/breed.list";
	var petType = $("#petType").val().trim();

	$.ajax({
		url: queryURL,
		jsonp: "callback",
		dataType: "jsonp",
		data: {
			key: PetFinderAPIKey,
			animal: petType,
			output: "basic",
			format: "json",
		},
		success: function(breedResponse) {
			console.log(breedResponse.petfinder.breeds.breed);
		}
	})
}

$(document).on("click","#getBreedList", getBreeds);

function showShelter()  {
	var queryURL = "https://api.petfinder.com/shelter.get";
	
	$.ajax({
		url: queryURL,
		jsonp: "callback",
		dataType: "jsonp",
		data: {
			key: PetFinderAPIKey,
			id: "CA827",
			output: "basic",
			format: "json",
		},
		success: function(shelterResponse) {
			// console.log(shelterResponse);
		}
	})
}

$(document).on("click","#getShelters",showShelter);