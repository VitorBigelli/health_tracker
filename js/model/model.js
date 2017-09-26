var app = app || {};

(function() {

    //------------- MODEL -------------//

    app.Food = Backbone.Model.extend({

        defaults: {
            name: "",
            calories: null,
        }
    });

    app.localStorage = new Backbone.LocalStorage("selectedFoods");
    
})();