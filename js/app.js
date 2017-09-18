$(function() {

	var Food = Backbone.Model.extend({
		defaults: {
			name: "No food",
			calories: 0 
		}

	}); 

	var FoodList = Backbone.Collection.extend({

		model: Food,

		getFoods: function() {
			return this;
		}

	});

	var selectedFoods = new FoodList([]);

	var foods = new FoodList([]);




	var App = Backbone.View.extend({

		initialize: function() {

			this.listenTo(foods, "add", this.render);

			function searchFood() {

				var search = document.getElementById("search-field").value;
				search = "orange";

				var url = "https://api.nutritionix.com/v1_1/search/"+ search +
						"?results=0%3A20&cal_min=0&cal_max=50000&" + 
						"fields=*";

				url += "&" + $.param({
					"appId": "d0c20d56",
					"appKey": "719fa1c3a70de3b074a9463c4db07eb5"
				});

				$.getJSON(url, function(data) {
					var items = data.hits;
					var currentFoods =[];
					var length = items.length;
					console.log(url);
					document.getElementById("search-result-list").innerHTML = "";


					for (var i=0; i < length; i++) {
						console.log("Adding: " +  items[i].fields.item_name);
						food = new Food({
							name: items[i].fields.item_name,
							calories: items[i].fields.nf_calories
						});
						foods.push(food);
					}
				})
				.fail( function(error) {
					window.alert("Error trying to access Nutriotionix")
				})
			};

			document.getElementById("submit-button").addEventListener("click", searchFood);
		},

		render: function() {
			var $searchResults = document.getElementById("search-result-list");
			var foodName, foodCalories;

			foodName = food.attributes.name;
			foodCalories = food.attributes.calories;
			$searchResults.innerHTML += "<li>" + 
										"<p class='food'>" + foodName + "</p>" +
										"<span class='info'>" + foodCalories + " calories</span>" + 
										"<span class='add'><i class='fa fa-plus' aria-hidden='true'></i></span>" + 
										"<span class='add-result'></span></li>";

			this.item = $("li:last-of-type"); 
			this.add = this.item.children(".add")[0];
			
			this.add.addEventListener("click", (function() {
				console.log("Clicked");
			}), this );

			return this;
		}



	});

	new App();
});
