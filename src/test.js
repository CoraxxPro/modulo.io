;(function($){
    // Variables
    var pluginName = "modulo";
    var pageLoading = false;
    var isInitialized = false;
    var currentUrl = "";
    var currentDatas;
    var currentCallback;
    var currentNeedPageRefresh;
    var currentPageRefreshIntervalDelay;
    var pageRefreshInterval;

    // Publics methods definition
    var publicMethods = {
        get : function(data) {
            return getValue.call(this, data);
        },
        set : function(options) {
            return update.call(this, options);
        },
        page : function(pageName) {
            var pageConfig = getPage.call(this, pageName);

            if(nullOrUndefined(pageConfig)) {
                $.error("No one configuration found for this page : "+pageName+".");
            }

            console.log(pageConfig);
        }
    };

    // Private methods
    var nullOrUndefined = function(toTest) {
        if (typeof toTest === "undefined" || toTest === null) {
            return true;
        }

        if (toTest.jquery === "undefined") {
            return false;
        }

        if (toTest.length == 0) {
            return true;
        }
        return false;
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

    var getPage = function(page){
        var pages = getValue.call(this, "pages");
        return pages.find(x => x.name === page);
    };

    var getData = function(item){
        return $(item).data(pluginName);
    }

    var getElem = function(selector) {
        return $(selector);
    }

    // Initializer and methods caller
    $.fn.extend({
        modulo: function(options,arg) {
            var objects = []; 
            this.each(function() {
                objects.push($.modulo(this, options, arg));
            });
            return objects;
        }
    });

    // Constructor
    $.modulo = function(item, options, arguments) {
        if (options && typeof(options) == 'string') {
            if (publicMethods[options]) {
               return publicMethods[options].call(item, arguments);
            }

            $.error('Method ' +  options + ' does not exist on jQuery.modulo');
            return;
        }

        if (typeof options === 'object' || !options) {
            options = $.extend({}, $.modulo.defaults, options);
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
    $.modulo.defaults = {
        // Global
        "name" : pluginName,
        "pages" : [],

        // Elements
        "bodyContent"      : "#body-content",
        "pageWrapper"      : "#page-wrapper",
        "pageTitle"        : "#page-title",
        "pageIcon"         : "#page-icon",
        "pageContent"      : "#page-content",

        // Classes
        "pageReadyClass"   : "page-ready",
        "pageLoadingClass" : "page-loading",

        // Timer
        "timeBetweenPage" : 500,                  // ms
        "pageAutoRefreshInterval" : 1 * 60 * 1000 // minutes X seconds X 1000 to convert in milliseconds
    };
})(jQuery);