(function (page, $, undefined) {

    // Elements
    var bodyContent = "#body-content";
    var pageWrapper = "#page-wrapper";
    var pageTitle = "#page-title";
    var pageIcon = "#page-icon";
    var pageContent = "#page-content";
    var $bodyContent;
    var $pageWrapper;
    var $pageTitle;
    var $pageContent;

    // Classes
    var pageReadyClass = "page-ready";
    var pageLoadingClass = "page-loading";

    // Variables
    var currentUrl = "";
    var currentDatas;
    var currentCallback;
    var currentNeedPageRefresh;
    var currentPageRefreshIntervalDelay;
    var isInitialized = false;

    var pageLoading = false;

    var timeBeforeAllowAnotherPage = 500; // ms
    var pageRefreshInterval;
    var defaultPageRefreshIntervalDelay = 1 * 60 * 1000; // minutes X seconds X 1000 to convert in milliseconds

    page.Load = function (pageObject) {
        Initialize();

        var url = pageObject.url;
        if (global.NullOrUndefined(url) || url === "") {
            console.log("Url not valid for page loading");
            return;
        }

        currentUrl = pageObject.url;
        currentDatas = pageObject.datas;
        currentCallback = pageObject.callback;
        currentNeedPageRefresh = pageObject.autoRefresh;
        currentPageRefreshIntervalDelay = pageObject.autoRefreshInterval > 0 ? pageObject.autoRefreshInterval : defaultPageRefreshIntervalDelay;

        Load();
    }

    page.Refresh = function () {
        Initialize();

        var keepIcon = true;
        Load(keepIcon);
    }

    function Load(keepIcon) {
        Initialize();

        if (global.NullOrUndefined(currentUrl) || currentUrl === "") {
            console.log("Url not valid for page loading");
            return;
        }

        if (page.IsLoading()) {
            console.log("Already loading page");
            return;
        }

        var success = function (data) {
            var obj = global.parseJSON(data);
            var title = obj.title;
            var content = obj.content;
            var additionals = obj.additionals; // could be empty or never used by callback() function below

            if (global.NullOrUndefined(title) || title === "") {
                console.log("Empty title, cannot load page");
                return;
            }

            if (global.NullOrUndefined(content) || content === "") {
                console.log("Empty content, cannot load page");
                return;
            }

            Append(title, content);
            RemoveLoading();

            if (typeof currentCallback === 'function') {
                currentCallback(additionals); // callback() function
            }
        };

        SetInterval();

        page.Clear(keepIcon);
        SetLoading();

        global.postJSON(global.BaseArea + currentUrl, currentDatas, success, null, "html", false);
    }

    page.Clear = function (keepIcon) {
        if (global.NullOrUndefined(keepIcon)) {
            keepIcon = false;
        }

        Initialize();

        $(pageContent).empty();
        $(pageTitle).empty();

        if (!keepIcon) {
            $(pageIcon).removeClass();
        }

        SetPageReady(false);

        RemoveLoading();
    }

    function Initialize() {
        if (isInitialized) {
            return;
        }

        $bodyContent = $(bodyContent);
        $pageWrapper = $(pageWrapper);
        $pageTitle = $(pageTitle);
        $pageContent = $(pageContent);

        isInitialized = true;

        clearInterval(pageRefreshInterval);
    }

    function SetInterval() {
        clearInterval(pageRefreshInterval);

        if (currentNeedPageRefresh) {
            pageRefreshInterval = setInterval(function () {
                page.Refresh();
            }, currentPageRefreshIntervalDelay);
        }
    }

    function Append(title, html) {
        $pageTitle.text(title);
        $pageContent.append(html);

        SetPageReady(true);
    }

    function SetPageReady(isReady) {
        if (isReady) {
            $pageWrapper.addClass(pageReadyClass);
            $bodyContent.addClass(pageReadyClass);
        }
        else {
            $pageWrapper.removeClass(pageReadyClass);
            $bodyContent.removeClass(pageReadyClass);
        }
    }

    function SetLoading() {
        $(pageWrapper).addClass(pageLoadingClass);
        pageLoading = true;
    }

    function RemoveLoading() {
        $(pageWrapper).removeClass(pageLoadingClass);

        // Set a delay before set pageLoading = false because we want to be sure that all page component are loaded and ready
        setTimeout(function () {
            pageLoading = false;
        }, timeBeforeAllowAnotherPage);
    }

    page.IsLoading = function () {
        return global.isLoading || pageLoading;
    }

}(window.page = window.page || {}, jQuery));