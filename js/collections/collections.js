var app = app || {};

(function() {
    'use strict';

//------------- COLLECTIONS -------------//
    var FoodList = Backbone.Collection.extend({

        model: app.Food,

        localStorage: new Backbone.LocalStorage('selected-foods'),


        // Compute the sum of the "calories" property
        // for all the models
        totalCalories: function() {
            return this.reduce(function(memo, value) {
                return memo + value.get("calories");
            }, 0);
        }

    });

    app.selectedFoods = new FoodList();
    app.searchResult = new FoodList();

})();