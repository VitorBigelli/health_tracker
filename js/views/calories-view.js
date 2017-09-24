var app = app || {};

(function($) {

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
            var view = this.$el.html(this.template(this.content));
        }

    });

})(jQuery);