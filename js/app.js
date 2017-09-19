var app = app || {};

(function($) { 

	//------------- MODEL -------------//

	app.Food = Backbone.Model.extend({

		defaults: {
			name: "",
			calories: null,
			quantity: 1
		}
	}); 

	//------------- COLLECTIONS -------------//

	var FoodList = Backbone.Collection.extend({

		model: app.Food,

		totalCalories: function(){
    		return this.reduce(function(memo, value) {
        		return memo + value.get("calories");
    		}, 0);
		},

		localStorage: new Backbone.LocalStorage("foods-backbone"),
	});

	app.selectedFoods = new FoodList();
	app.searchResult = new FoodList();

	//------------- VIEW -------------//
	app.TotalCaloriesView = Backbone.View.extend({

		 el: "#total-calories",

		 tagName: "p",

		 template: _.template($("#total-calories-template").html()),

		 tagName: "p", 

		 initialize: function() {

		 },

		 render: function() {
		 		this.content = {
		 		total: app.selectedFoods.totalCalories()
		 	}
		 	var view = this.$el.html(this.template(this.content));
		 	this.el.append(view);
		 }

	});

	app.SelectedFoodsView = Backbone.View.extend({

		tagName: 'li',

		template: _.template($("#selected-foods-template").html()),

		events: {
			"click .remove": "removeFromSelectedFoods",
		}, 

		initialize: function() {
			this.$totalCalories = document.getElementById("total-calories");
			this.listenTo(app.selectedFoods, "remove", this.updateTotalCalories);
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		removeFromSelectedFoods: function (event) {
			app.selectedFoods.remove(this.model);
			event.target.parentElement.parentElement.remove();
			
			app.AppView.TotalCaloriesView.render()

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
			this.$totalCalories = document.getElementById("total-calories");
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.addClass("food-item");
			return this;
		},

		addToSelectedFoods: function() {
			app.selectedFoods.add(new app.Food(this.model.attributes));
			var view = new app.SelectedFoodsView({model: this.model});
			this.$selectedFoods.append(view.render().el);

			app.AppView.TotalCaloriesView.render();
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
			this.listenTo(app.searchResult, "add", this.addOne);
			this.TotalCaloriesView = new app.TotalCaloriesView();
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
			view = new app.FoodView({ model: food });
			this.$searchResults.append(view.render().el);
		}

	});

})(jQuery);

app.AppView = new app.AppView();
