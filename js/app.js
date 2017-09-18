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

	var FoodView = Backbone.View.extend({

		initialize: function() {
						
		},

		render: function() {
		},

		
	});

	var App = Backbone.View.extend({

		initialize: function() {

			this.listenTo(foods, "add", this.render);

			function searchFood() {

				var search = document.getElementById("search-field").value;

				var url = "https://api.nutritionix.com/v1_1/search/"+search+
						"?results=0%3A20&cal_min=0&cal_max=50000&" + 
						"fields=*";

				url += "&" + $.param({
					"appId": "d0c20d56",
					"appKey": "719fa1c3a70de3b074a9463c4db07eb5"
				});

				$.getJSON(url, function(data) {
					var items = data.hits; 
					var length = items.length;
					var display
					for (var i=0; i < length; i++) {
						console.log("Adding: " +  items[i].fields.item_name);
						var food = new Food({
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
			var models = foods.models;
			var length = models.length;
			var $searchResults = document.getElementById("search-result-list");
			var foodName, foodCalories;

			foods.each( function(food) {
				foodName = food.attributes.name;
				foodCalories = food.attributes.nf_calories;
				$searchResults.innerHTML += "<li class='food-item'>" + foodName + "</li>";

			}, this); 

			return this;
		}



	});

	new App();
});
