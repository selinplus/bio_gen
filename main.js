/**
 * Created by selinplus on 2017/7/31.
 */
'user strict';

var select = require('soupselect').select,
    htmlparser = require("htmlparser"),
    http = require('http'),
    sys = require('sys');

// fetch some HTML...
var http = require('http');
var host = 'https://www.ncbi.nlm.nih.gov/pubmed/?term=killer+breast';
var client = http.createClient(80, host);
var request = client.request('GET', '/',{'host': host});

request.on('response', function (response) {
    response.setEncoding('utf8');

    var body = "";
    response.on('data', function (chunk) {
        body = body + chunk;
    });

    response.on('end', function() {

        // now we have the whole body, parse it and select the nodes we want...
        var handler = new htmlparser.DefaultHandler(function(err, dom) {
            if (err) {
                sys.debug("Error: " + err);
            } else {

                // soupselect happening here...
                var titles = select(dom, 'a.title');

                sys.puts("Top stories from reddit");
                titles.forEach(function(title) {
                    sys.puts("- " + title.children[0].raw + " [" + title.attribs.href + "]\n");
                })
            }
        });

        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(body);
    });
});
request.end();
    request
        .get('https://www.ncbi.nlm.nih.gov/pubmed/?term=killer+breast')
        .on('error',function (error) {
            console.log(error);
        })
        .on('response',function (response) {
            response.on('data',function (data) {

                parser.write(data);
                parser.end();
            })
        })

// }