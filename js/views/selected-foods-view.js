var app = app || {};

(function($) {

    app.SelectedFoodView = Backbone.View.extend({

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
            this.model.destroy();
            app.selectedFoods.remove(app.selectedFoods.where(this.model.attributes)[0]);
            event.target.parentElement.parentElement.remove();
            app.appView.TotalCaloriesView.render();
        }
    });

})(jQuery);