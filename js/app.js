var app = app || {};

(function($) { 

	//------------- MODEL -------------//

	app.Food = Backbone.Model.extend({

		defaults: {
			id: null,
			name: "",
			calories: null 
		}

	}); 

	//------------- COLLECTIONS -------------//

	var FoodList = Backbone.Collection.extend({

		model: app.Food,

		localStorage: new Backbone.LocalStorage("foods-backbone"),
	});

	app.selectedFoods = new FoodList();
	app.searchResult = new FoodList();


	//------------- VIEW -------------//

	app.FoodView = Backbone.View.extend({

		tagName: 'li', 

		events: {
			"click .add": "addToSelectedFoods"			
		},

		initialize: function() {
			this.listenTo(app.search, "add", this.addOne);
		},

		render: function() {
			foodId = food.id,
			foodName = food.name;
			foodCalories = food.calories;
			return this;
		}, 

		addOne: function(food) {
			console.log(food);
		},

		addToSelectedFoods: function(foodId) {
			console.log("Selected");
		}
	});


	app.AppView = Backbone.View.extend({
		el: "header",

		events: {
			"click #submit-search": "searchFood",
			"click #stats": "showSelectedFoods",
		},

		initialize: function() {
			this.$searchResults = document.getElementById("search-result-list");
			this.$selectedFoods = document.getElementById("selected-foods");
			this.listenTo(app.searchResult, "add", this.addOne);
		},

		showSelectedFoods: function(event) {
			$(document.getElementsByTagName("aside")[0]).toggleClass("slide");
		}, 

		searchFood: function() {
			var self = this;
			this.search = $(document.getElementById("search-field")).val();
			
			var url = "https://api.nutritionix.com/v1_1/search/"+ this.search +
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

				for (var i=0; i < length; i++) {
					food = {
						id: items[i].fields.item_id,
						name: items[i].fields.item_name,
						calories: items[i].fields.nf_calories
					};
					app.searchResult.push(food);
				}
			})
			.fail( function(error) {
				window.alert("Error trying to access Nutriotionix")
			})
		}, 

		addOne: function(event) {

		}


	});

})(jQuery);

new app.AppView();