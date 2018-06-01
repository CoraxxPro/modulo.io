(function (module, $, undefined) {

    var moduleReady = "module-ready";
    var moduleLoading = "module-loading";
    var autoRefreshInterval = 1 * 60 * 1000; // minutes X seconds X 1000 to convert in milliseconds

    module.InitAll = function ($parent) {

        var $modulesToInitialize = $(".module");

        if (global.NullOrUndefined($parent)) {
            $modulesToInitialize = $(".module");
        }
        else {
            $modulesToInitialize = $parent.find(".module");
        }

        $.each($modulesToInitialize, function (index, value) {
            var $module = $(value);

            // Stop if module isnt visible
            if (!$module.is(":visible")) {
                return false;
            }

            module.Load(value);

            var autoRefresh = $module.attr("data-module-auto-refresh");
            if (!global.NullOrUndefined(autoRefresh) && autoRefresh == "true") {
                var moduleToRefresh = value;
                setInterval(function () {
                    module.Load(moduleToRefresh);
                }, autoRefreshInterval);
            }
        });
    }

    module.Load = function (module) {
        var $module = $(module);
        var job = $module.attr("data-module-job");

        if (!$module.hasClass(moduleLoading)) {
            eval(job);
        }

        if (!$module.hasClass(moduleReady)) {
            var loadingHtml = $module.attr("data-module-loading");
            $module.append("<span class='loading'>" + loadingHtml + "</span>");
            $module.append("<div class='content'></div>");
            $module.addClass(moduleReady);
        }
    }

    module.Clear = function (target) {
        $(target + " .content").empty();
    }

    module.Append = function (target, html) {
        $(target + " .content").append(html);
    }


    module.ToggleLoading = function (target) {
        var height = $(target).attr("data-module-loading-height");

        if (height > 0) {
            $(target).css("min-height", height + "px");
        }

        $(target).toggleClass(moduleLoading);
    }


}(window.module = window.module || {}, jQuery));