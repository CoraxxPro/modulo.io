;(function($){
    // Variables
    var pluginName = "md-page";

    // Publics methods definition
    var publicMethods = {
        alert : function() {
            displayText("Alert : " + getData(this).text);
        },
        content : function(test) {
            displayText("Content : " + test);
        },
        get : function(data) {
            return getValue.call(this, data);
        },
        set : function(options) {
            return update.call(this, options);
        }
    };

    // Private methods
    var displayText = function(text) {
        $("body").append(text + "<br>");
    }

    var initialize = function(options){
        return $(this).data(pluginName, options);
    };

    var update = function(options){
        var existingOptions = getData(this);
        var options = $.extend({}, existingOptions, options);
        return $(this).data(pluginName, options);
    };

    var getValue = function(dataName){
        var existingOptions = getData(this);
        return existingOptions[dataName];
    };

    var getData = function(item){
        return $(item).data(pluginName);
    }

    // Initializer and methods caller
    $.fn.extend({
        page: function(options,arg) {
            var objects = []; 
            this.each(function() {
                objects.push($.page(this, options, arg));
            });
            return objects;
        }
    });

    // Constructor
    $.page = function(item, options, arguments) {
        if (options && typeof(options) == 'string') {
            if (publicMethods[options]) {
               return publicMethods[options].call(item, arguments);
            }

            $.error('Method ' +  options + ' does not exist on jQuery.page');
            return;
        }

        if (typeof options === 'object' || !options) {
            options = $.extend({}, $.page.defaults, options);
        } 

        var $object = getData(item);
        if(typeof $object === 'undefined'){
            $object = initialize.call(item, options);
        }
        else {
            $object = update.call(item, options);
        }

        return $object;
    };

    // Properties
    $.page.defaults = {
        "name" : pluginName
    };
})(jQuery);