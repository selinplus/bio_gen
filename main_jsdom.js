/**
 * Created by selinplus on 2017/8/1.
 */
'user strict';
const fs = require('fs');
const jsdom = require("jsdom");
const {JSDOM} = jsdom;

JSDOM.fromURL("https://www.ncbi.nlm.nih.gov/pubmed/?term=killer+breast")
    .then(dom => {
        // console.log(dom.serialize());
        // const content = dom.window.document.querySelector("a");
        // fs.writeFile('dest.txt',dom.serialize(),function (error,data) {
        //     if(error){
        //         console.log(error);
        //     }
        // })
        const content = dom.window.document.getElementsByClassName('rslt');
        //console.log(content);
        if(content.length>0) {
            console.log(content.length);
        }else{
            console.log('no match!')
        }
    });
