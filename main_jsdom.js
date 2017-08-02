/**
 * Created by selinplus on 2017/8/1.
 */
'user strict';
const fs = require('fs');
const request = require('request');
const rp = require('request-promise');
const $ = require('cheerio');
const {JSDOM} = require("jsdom");
const bioModel = {
                    title:"p.title",
                    linkUrl:"p.title a",
                    desc:"p.desc",
                    detail:"p.details",
                    rprtid:"dl.rprtid",
                    similar:"p.links.nohighlight a"
};
//define post form
const formData ={

};
//define request options
const options ={
    uri: 'https://www.ncbi.nlm.nih.gov/pubmed/?term=killer+breast',
    method: 'POST',
    form:

}
//define an autoParser
function autoParse(body, response, resolveWithFullResponse) {
    // FIXME: The content type string could contain additional values like the charset.
    // Consider using the `content-type` library for a robust comparison.
    if (response.headers['content-type'] === 'application/json') {
        return JSON.parse(body);
    } else if (response.headers['content-type'] === 'text/html') {
        return $.load(body);
    } else {
        return body;
    }
}
//use the autoParser
const rpap = rp.defaults({ transform: autoParse });
JSDOM.fromURL("https://www.ncbi.nlm.nih.gov/pubmed/?term=killer+breast")
    .then(dom => {
        const countStr = dom.window.document.querySelector("h3.result_count.left").innerHTML;
        if(countStr){
            let pageArray = countStr.split(" ");
            pageArray.forEach(function (ele) {
                console.log(ele);
            })
        }
        
        // for(const v in bioModel){
        //     console.log(bioModel[v]);
        //     const prop = dom.window.document.querySelectorAll(bioModel[v]);
        //     if(bioModel[v].slice(-1)==='a'){
        //         console.log(prop[0].href);
        //     }else{
        //         console.log(prop[0].innerHTML);
        //     }
        //
        // }

    }).catch(err => {
        console.log(err);
    });
