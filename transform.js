#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var jsdom = require("jsdom");

var htmlSource = fs.readFileSync("dummy.html", "utf8");
call_jsdom(htmlSource, function (window) {
    var $ = window.$;

    var title = $("title").text();
    $("h1").text(title);

    console.log(documentToSource(window.document));
});

function documentToSource(doc) {
    // The non-standard window.document.outerHTML also exists,
    // but currently does not preserve source code structure as well

    // The following two operations are non-standard
    return doc.doctype.toString()+doc.innerHTML;
}

function call_jsdom(source, callback) {
    jsdom.env(
        source,
        [ 'jquery-1.7.1.min.js' ],
        function(errors, window) {
            process.nextTick(
                function () {
                    if (errors) {
                        throw new Error("There were errors: "+errors);
                    }
                    callback(window);
                }
            );
        }
    );
}
