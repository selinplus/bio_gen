/**
 * Created by selinplus on 2017/8/6.
 */

'use strict';

const rp = require('request-promise');
const $ = require('cheerio');
const fs = require('fs');

const keywords = ['geo epidemiology'];
//define post form
const formData ={
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
};
//get options for pubmed
const optionsInit = {
    uri: 'https://www.ncbi.nlm.nih.gov/pubmed/?term=',
    transform: initParse,
    jar: true
};

let cnt = 0;
//post options for pubmed
const options ={
    uri: 'https://www.ncbi.nlm.nih.gov/pubmed',
    method: 'POST',
    jar: true,
    transform: autoParse,
    form: formData

};
function initParse(body) {
    return $.load(body);
}
//define an autoParser
function autoParse(body, response) {
    // FIXME: The content type string could contain additional values like the charset.
    // Consider using the `content-type` library for a robust comparison.
    if (response.headers['content-type'] === 'application/json') {
        return JSON.parse(body);
    } else if (response.headers['content-type'] === 'text/html; charset=UTF-8') {
        return $.load(body);
    } else {
        return body;
    }
}
//main entry
// keywords.forEach(function (keyword) {
//         doQuery(keyword);
// });
for(let i =0; i<keywords.length;i++){
    //query by keyword reset the keyword records count
    cnt = 0;
    doQuery(keywords[i]);
}

function doQuery(keyword) {
    const param = keyword.toString().replace(' ','+');
    console.log('----------查询关键字:' + keyword);
    //update query uri
    optionsInit.uri = 'https://www.ncbi.nlm.nih.gov/pubmed?term='+param;
    rp(optionsInit)
        .then($$ => {
            const pageArray = $$("h3.result_count.left").html().split(' ');
            formData['EntrezSystem2.PEntrez.PubMed.Pubmed_ResultsPanel.Pubmed_ResultsController.ResultCount']= pageArray[5];

            const totalCount= Number.parseInt(pageArray[5]);
            const pages =totalCount%20 ===0 ? totalCount/20:Math.trunc(totalCount/20)+1;
            console.log('查询关键字:' + keyword+ ' 第1页,共'+pages+'页');
            //first page
            parseAndSaveCatagoryPage($$);
            formData.term = keyword;
            //turn page
            doTurnPage(pages);
        })
        .catch(function (err) {
            console.log(err);
        })
}
function doTurnPage(pages,pageNum=2){
    if(pageNum<=pages) {
        formData['EntrezSystem2.PEntrez.PubMed.Pubmed_ResultsPanel.Pubmed_Pager.CurrPage'] = pageNum.toString();
        rp(options)
            .then($$ => {
                parseAndSaveCatagoryPage($$);
                doTurnPage(pages,pageNum+1);
            })
            .catch(function (err) {
                console.log(err);
            })
    }
}
function parseAndSaveCatagoryPage($$){
    //let catagories = [];
    const p_title_a = $$('p.title a');
    const p_desc = $$('p.desc');
    const p_details = $$('p.details');
    const rprtid = $$('dl.rprtid dd');

    for(let index =0; index<p_title_a.length;index++){
        const {attribs: ptitleattribs,children: ptitlechildren} = p_title_a[index];
        const {children: pdescchildren} = p_desc[index];
        let title = ptitlechildren[0].data;
        let linkUrl = ptitleattribs.href;
        let desc = pdescchildren[0].data;
        let details = p_details.eq(index).html();
        let pmid = rprtid.eq(index).text();
        //catagories.push({title,linkUrl,desc,details,pmid});
        console.log('第'+(++cnt)+'条数据');
        fs.appendFile('tmp_contents.txt',JSON.stringify({title,linkUrl,desc,details,pmid}));
    }
    //todo save in mongodb
    //fs.appendFile('tmp_contents.txt',catagories);
    //todo query content

}