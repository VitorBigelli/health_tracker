var app = app || {};

(function() {

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

        localStorage: new Backbone.LocalStorage("selectedFoods")
    });

    app.selectedFoods = new FoodList();
    app.searchResult = new FoodList();

})();