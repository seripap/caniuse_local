var caniuseData = require("./data/data2.js");
var adapterQueryData = require("./data/adapter.js");

module.exports = function(view, edit){
	// view.insert(edit, 0, "HelloWorld");

    var detectBrowers = [
        'ie'
        , 'firefox'
        , 'chrome'
        , 'safari'
        , 'chrome'
        , 'opera'
    ];

    function getSelContent() {
        var selections = view.sel()[0];
        var text = "";
        // console.log(selections);
        if(!selections.empty()) {
            // console.log(view.substr(21));
            var begin = selections.a;
            while(begin++ < selections.b) text += view.substr(begin - 1)
        }
        return text;
    }

    function getResult(data) {
        var result = [];
        for(var i = 0, li; li = detectBrowers[i++]; ) {
            var vers = getVers(data[li]);
            vers && result.push("<li>" + li + ": " + vers + "</li>");
        }
        return "<ul>" + result.join(" ") + "</ul>";
    }

    function getVers(data) {
        var ret = [];
        var result = [];

        var keys = Object.keys(data).sort(function (a, b) {
            return +a > +b;
        });

        for (var i = 0; i < keys.length; i++) {
            (~data[keys[i]].indexOf("a") || ~data[keys[i]].indexOf("y")) && ret.push(keys[i]);
        };
        var begin = ret.shift();
        var end = ret.pop();

        begin && result.push(begin);
        end && result.push(end);

        return result.join("-");
    }

    var showPopup = function() {
        var timer = null;
        var shower = null;
        var uid = 0;
        return function(content) {
            view.show_popup(content);
        }
    }();

    function adapterQuery(query, data) {
        query = (query + "").toLowerCase();
        if(adapterQueryData[query]) return adapterQueryData[query];
        for(var key in adapterQueryData) {
            if(~key.indexOf(query)) return adapterQueryData[key];
        }

        if(data[query]) return query;
        for(var k in data) {
            if(~k.indexOf(query)) return k;
        }
        return "";
    }

    var text = getSelContent();

    // console.log(text);

    if(!text) return;

    var data = caniuseData.data;

    var query = adapterQuery(text, data);

    if(query && data[query]) showPopup("<style>html{background-color: #232628; color:#CCC; padding: 10px;}body {font-size:12px;}h1 {color: #99cc99;font-size: 14px;}</style><h1>" + data[query].title + "</h1>" + getResult(data[query].stats));
}
