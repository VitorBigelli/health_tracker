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

	var foods = new FoodList([]);

	var FoodView = Backbone.View.extend({

		initialize: function() {
			document.getElementById("submit-button").addEventListener("click", this.searchFood);
			this.listenTo(this.model, "change", this.render);
		},

		searchFood: function() {
			var search = document.getElementById("search-field").value;

			var url = "https://api.nutritionix.com/v1_1/search/"+search+"?results=0%3A20&cal_min=0&cal_max=50000&fields=item_name%2Cbrand_name%2Citem_id%2Cbrand_id";

			url += "&" + $.param({
				"appId": "d0c20d56",
				"appKey": "719fa1c3a70de3b074a9463c4db07eb5"
			});

			$.getJSON(url, function(data) {
				console.log(url);
				console.log("Done");
			})
			.fail( function(error) {
				window.alert("Error trying to access Nutriotionix")
			})
		},

		render: function() {
			console.log("Rendering");
		}

	});

	new FoodView();
});
