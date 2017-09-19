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

	app.SelectedFoodsView = Backbone.View.extend({

		tagName: 'li',

		template: _.template($("#selected-foods-template").html()),

		events: {
			"click .remove": "removeFromSelectedFoods",
		}, 

		initialize: function() {
			this.listenTo(app.selectedFoods, "remove", this.addOne);
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		removeFromSelectedFoods: function (event) {
			app.selectedFoods.remove(this.model);

			event.target.parentElement.parentElement.remove();
		}
	});


	app.FoodView = Backbone.View.extend({

		tagName: 'li', 

		template: _.template($("#foods-template").html()),


		events: {
			"click .add": "addToSelectedFoods",
		},

		initialize: function() {
			this.$selectedFoods = document.getElementById("selected-foods");
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.addClass("food-item");
			return this;
		},

		addToSelectedFoods: function() {
			app.selectedFoods.push(this.model.attributes);

			var view = new app.SelectedFoodsView({model: this.model});
			this.$selectedFoods.append(view.render().el);
		}
	});


	app.AppView = Backbone.View.extend({
		
		el: "header",

		tagName: "p",

		events: {
			"click #submit-search": "searchFood",
			"click #stats": "showSelectedFoods",
		},

		initialize: function() {
			this.$searchResults = document.getElementById("search-result-list");
			this.listenTo(app.searchResult, "add", this.addOne);
		},

		showSelectedFoods: function(event) {
			$(document.getElementsByTagName("aside")[0]).toggleClass("slide");
		}, 

		searchFood: function() {
			var self = this;
			this.search = $(document.getElementById("search-field")).val();
			$(".food-item").remove();
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

		addOne: function(food) {
			var view = new app.FoodView({ model: food });
			this.$searchResults.append(view.render().el);
		}

	});

})(jQuery);

new app.AppView();