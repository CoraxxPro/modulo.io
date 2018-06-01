;(function($){
    var pluginName = "md-page";

    var publicMethods = {
        alert : function() {
            displayText("Alert : " + getData(this).text);
        },
        content : function(test) {
            displayText("Content : " + test);
        }
    };

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

    var getData = function(item){
        return $(item).data(pluginName);
    }

    // Initializer
    $.fn.extend({
        page: function(options,arg) {
            var objects = []; 
            this.each(function() {
                objects.push(new $.page(this, options, arg));
            });
            return objects;
        }
    });

    // Constructor and methods caller
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

    $.page.defaults = {
        "name" : pluginName
    };
})(jQuery);