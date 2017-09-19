var app = app || {};

(function($) {

    //------------- MODEL -------------//

    app.Food = Backbone.Model.extend({

        defaults: {
            name: "",
            calories: null,
        }
    });

    //------------- COLLECTIONS -------------//

    var FoodList = Backbone.Collection.extend({

        model: app.Food,

        // Compute the sum of the "calories" property
        // for all the models
        totalCalories: function() {
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

        tagName: "span",

        template: _.template($("#total-calories-template").html()),

        initialize: function() {

        },

        render: function() {
            this.content = {
                total: app.selectedFoods.totalCalories().toFixed(2)
            };
            console.log(this.$el);
            var view = this.$el.html(this.template(this.content));
            console.log(view);
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
        // This function remove a model from the selectedFoods collection,
        // remove its associated DOM element and update the total calories
        // field by calling app.AppView.TotalCaloriesView.render();
        removeFromSelectedFoods: function(event) {
            console.log(this.model);
            app.selectedFoods.remove(app.selectedFoods.where(this.model.attributes)[0]);
            event.target.parentElement.parentElement.remove();
            app.AppView.TotalCaloriesView.render();
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
        // This function add a new model to the selectedFoods collection,
        // Iniciate a new SelectedFoodsView and append it to the page.
        // Then call app.AppView.TotalCalories.render() to update the
        // TotalCalories field.
        addToSelectedFoods: function() {
            var model = new app.Food(this.model.attributes);
            app.selectedFoods.add(model);

            var view = new app.SelectedFoodsView({
                model: this.model
            });
            this.$selectedFoods.append(view.render().el);

            app.AppView.TotalCaloriesView.render();
        }
    });

    app.AppView = Backbone.View.extend({

        el: "header",

        events: {
            "click #submit-search": "searchFood",
            "click #stats": "toggleSelectedFoods",
        },

        initialize: function() {


            this.$searchResults = document.getElementById("search-result-list");
            // Listen for an add event in the app.searchResult collection
            // and call the addOne function when the event is triggered.
            this.listenTo(app.searchResult, "add", this.addOne);
            // Initiate a TotalCaloriesView()
            this.TotalCaloriesView = new app.TotalCaloriesView();
        },

        hideSelectedFoods: function() {
            $(document.getElementsByTagName("aside")[0]).removeClass("slide");
        },

        toggleSelectedFoods: function(event) {
            $(document.getElementsByTagName("aside")[0]).toggleClass("slide");
        },

        // This function request the Nutritionix API using the text 
        // typed by the user and aqdd the 20 first results in the 
        // app.searchResult collection
        searchFood: function() {
            this.hideSelectedFoods();
            this.search = $(document.getElementById("search-field")).val();
            $(".food-item").remove();
            var url = "https://api.nutritionix.com/v1_1/search/" + this.search +
                "?results=0%3A20&cal_min=0&cal_max=50000&" +
                "fields=*";

            url += "&" + $.param({
                "appId": "d0c20d56",
                "appKey": "719fa1c3a70de3b074a9463c4db07eb5"
            });

            $.getJSON(url, function(data) {
                    var items = data.hits;
                    var length = items.length;

                    for (var i = 0; i < length; i++) {
                        var food = {
                            name: items[i].fields.item_name,
                            calories: items[i].fields.nf_calories
                        };
                        app.searchResult.push(food);
                    }
                })
                // failback function-
                .fail(function(error) {
                    window.alert("Error trying to access Nutriotionix");
                });
        },

        // Create a FoodView element with the passed food
        // and append it to the page
        addOne: function(food) {
            var view = new app.FoodView({
                model: food
            });
            this.$searchResults.append(view.render().el);
        }

    });

})(jQuery);

app.AppView = new app.AppView();