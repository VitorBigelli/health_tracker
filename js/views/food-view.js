var app = app || {};

(function($) {

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
            $(".food-item").remove();
            app.selectedFoods.add(model);
            var view = new app.SelectedFoodsView({
                model: this.model
            });
            this.$selectedFoods.append(view.render().el);

            app.AppView.toggleSelectedFoods();
            app.AppView.TotalCaloriesView.render();
        }
    });

})(jQuery);