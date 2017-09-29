var app = app || {};

(function($) {

    app.AppView = Backbone.View.extend({

        el: "header",

        events: {
            "click #submit-search": "searchFood",
            "click #stats": "toggleSelectedFoods",
        },

        initialize: function() {

            this.$selectedFoods = document.getElementById("selected-foods");
            this.$searchResults = document.getElementById("search-result-list");
            // Listen for an add event in the app.searchResult collection
            // and call the addResult function when the event is triggered.
            this.listenTo(app.searchResult, "add", this.addResult);

            // Initiate a TotalCaloriesView()
            this.TotalCaloriesView = new app.TotalCaloriesView();

            app.selectedFoods.fetch(); 
            this.render();           
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
            
            $(".loader").toggleClass("show-loader");

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
                    $(".loader").removeClass("show-loader");
                    if (!app.searchResult.length) {
                        app.appView.$searchResults.innerHTML += "<li class='food-item'>No results found</li>";
                    }
                })
                // failback function-
                .fail(function(error) {
                    $(".loader").removeClass("show-loader");
                    window.alert("Error trying to access Nutriotionix");
                });
        },

        // Create a FoodView element with the passed food
        // and append it to the page
        addResult: function(food) {
            var view = new app.FoodView({
                model: food
            });
            this.$searchResults.append(view.render().el);
            $(".loader").removeClass("show-loader");
        }, 

        render: function() {

            var length = app.selectedFoods.models.length;

            for (var i=0; i < length; i++) {
                var view = new app.SelectedFoodView({
                    model: app.selectedFoods.models[i]
                });
                this.$selectedFoods.append(view.render().el);
            }

            this.TotalCaloriesView.render();
            this.toggleSelectedFoods();

            return this;
        }

    });

})(jQuery);

app.appView = new app.AppView();