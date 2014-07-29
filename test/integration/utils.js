module.exports.randomStr = function (length, initChars) {
    var chars = initChars || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
        str = '';
    for (var i = length; i > 0; --i) {
        str += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return str;
};

module.exports.openUrlsOld = function (browser, urls) {

    urls.forEach(function (url) {

        var visitUrl = browser.globals.url + url;

        browser
            .url(visitUrl, function () {
                console.log("Opening ", visitUrl);
            })
            .waitForElementVisible('body', 5000)
            .pause(2000);
    });
    
    browser.end();
};

module.exports.smoteTestUrls = function (urls) {

    var testSteps = {};

    urls.forEach(function (url) {

        var testName = 'Smoke test: "' + url.page + '"';

        testSteps[testName] = function (browser) {

            var visitUrl = browser.globals.url + url.path;

            browser
                .url(visitUrl)
                .waitForElementVisible('body', 5000)
                .pause(2000)
                .assert.noJsErrors();
        };
    });

    testSteps.end = function (browser) {
        browser.end();
    };

    return testSteps;
};

