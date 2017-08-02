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
    uri: 'https://www.ncbi.nlm.nih.gov/pubmed',
    method: 'POST',
    transform: autoParse,
    form:{
        term:'killer breast ',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_PageController.PreviousPageName': 'results',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_Facets.FacetsUrlFrag' : 'filters=',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_Facets.FacetSubmitted' : 'false',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_Facets.BMFacets': '',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_ResultsPanel.Pubmed_DisplayBar.sPresentation': 'docsum',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_ResultsPanel.Pubmed_DisplayBar.sSort': 'none',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_ResultsPanel.Pubmed_DisplayBar.sPageSize': '20',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_ResultsPanel.Pubmed_DisplayBar.FFormat': 'docsum',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_ResultsPanel.Pubmed_DisplayBar.FSort': '',
        email_format:'docsum',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_ResultsPanel.Pubmed_DisplayBar.email_sort': '',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_ResultsPanel.Pubmed_DisplayBar.email_count': '20',
        email_start: '1',
        email_address: '',
        email_subj: 'killer breast - PubMed',
        email_add_text: '',
        EmailCheck1: '',
        EmailCheck2: '',
        coll_start: '1',
        citman_count: '20',
        citman_start: '1',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_ResultsPanel.Pubmed_DisplayBar.FileFormat':'docsum',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_ResultsPanel.Pubmed_DisplayBar.LastPresentation':'docsum',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_ResultsPanel.Pubmed_DisplayBar.Presentation':'docsum',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_ResultsPanel.Pubmed_DisplayBar.PageSize':'20',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_ResultsPanel.Pubmed_DisplayBar.LastPageSize':'20',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_ResultsPanel.Pubmed_DisplayBar.PrevPageSize':'20',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_ResultsPanel.Pubmed_DisplayBar.PrevPresentation':'docsum',
        CollectionStartIndex:'1',
        CitationManagerStartIndex:'1',
        CitationManagerCustomRange:'false',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_ResultsPanel.Pubmed_ResultsController.ResultCount':'1324',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_ResultsPanel.Pubmed_Pager.cPage':'1',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_ResultsPanel.Pubmed_Pager.CurrPage':'2',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_ResultsPanel.Pubmed_Pager.cPage':'1',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_ResultsPanel.EmailTab.EmailHID':'1tuORJRoNHJXGKZcMXDJ0uhYvwmCG2MWtoAdRzhZk8sl-zfRibsVvpiTwecad0WAJGYOVPBELEEHQVm6b9ynomZ2JVkjse7Ui9',
        'EntrezSystem2.PEntrez.PubMed.Pubmed_ResultsPanel.TimelineAdPlaceHolder.BlobID':'NCID_1_168186187_130.14.18.34_9001_1501677485_1934053316_0MetA0_S_MegaStore_F_1',
        'EntrezSystem2.PEntrez.DbConnector.Db':'pubmed',
        'EntrezSystem2.PEntrez.DbConnector.LastDb':'pubmed',
        'EntrezSystem2.PEntrez.DbConnector.Term':'killer breast',
        'EntrezSystem2.PEntrez.DbConnector.LastQueryKey':'1',
        'EntrezSystem2.PEntrez.DbConnector.Cmd':'PageChanged',
        p$a:'EntrezSystem2.PEntrez.PubMed.Pubmed_ResultsPanel.Pubmed_Pager.Page',
        p$l:'EntrezSystem2',
        p$st:'pubmed'
    }

}
//define an autoParser
function autoParse(body, response, resolveWithFullResponse) {
    // FIXME: The content type string could contain additional values like the charset.
    // Consider using the `content-type` library for a robust comparison.
    if (response.headers['content-type'] === 'application/json') {
        return JSON.parse(body);
    } else if (response.headers['content-type'] === 'text/html; charset=UTF-8') {
        console.log('text/html');
        return $.load(body);
    } else {
        return body;
    }
}
//use the autoParser
//const rpap = rp.defaults({ transform: autoParse });
rp('https://www.ncbi.nlm.nih.gov/pubmed/?term=killer+breast')
    .then(
        rp(options)
        .then(function ($) {
            console.log($("*").html());
            const pageArray = $("h3 .result_count .left").html().split(' ');
            pageArray.forEach(function (ele) {
                console.log(ele);
            })
        })
    )
// JSDOM.fromURL("https://www.ncbi.nlm.nih.gov/pubmed/?term=killer+breast")
//     .then(dom => {
//         const countStr = dom.window.document.querySelector("h3.result_count.left").innerHTML;
//         if(countStr){
//             let pageArray = countStr.split(" ");
//             pageArray.forEach(function (ele) {
//                 console.log(ele);
//             })
//         }
//
//         // for(const v in bioModel){
//         //     console.log(bioModel[v]);
//         //     const prop = dom.window.document.querySelectorAll(bioModel[v]);
//         //     if(bioModel[v].slice(-1)==='a'){
//         //         console.log(prop[0].href);
//         //     }else{
//         //         console.log(prop[0].innerHTML);
//         //     }
//         //
//         // }
//
//     }).catch(err => {
//         console.log(err);
//     });
