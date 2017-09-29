var app = app || {};

(function() {
	'use strict';

    //------------- MODEL -------------//

    app.Food = Backbone.Model.extend({

        defaults: {
            name: '',
            calories: null,
        }
    });
    
})();