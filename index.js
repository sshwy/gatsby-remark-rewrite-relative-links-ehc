"use strict";
var path = require("path");
var visit = require("unist-util-visit");
function withPathPrefix(url, pathPrefix) {
    var prefixed = pathPrefix + url;
    return prefixed.replace(/\/\//, '/');
}
module.exports = function plugin(_a) {
    var markdownAST = _a.markdownAST, markdownNode = _a.markdownNode, pathPrefix = _a.pathPrefix;
    //console.log("DEBUG!");
    function visitor(node) {
        if( !node.url.startsWith('/') &&
            !node.url.startsWith('#') &&
            !node.url.startsWith('mailto:') &&
            !/^https?:\/\//.test(node.url)) {
            var fullLink=markdownNode.fileAbsolutePath.toString().replace(/^.*docs\//,'');
            var relativeLink=node.url.toString();
            var fullLinkList=fullLink.split('/');
            var relativeLinkList=relativeLink.replace(/\.md/,'/').split('/');
            //console.log(fullLink);
            //console.log(relativeLink);
            if( relativeLink.match(/\.md$/) ||
                relativeLink.match(/\.md#/) ) {
                fullLinkList.pop();
            }
            while(relativeLinkList[0]=='..'||relativeLinkList[0]=='.'){
                if(relativeLinkList[0]=='.')relativeLinkList.shift();
                else {
                    relativeLinkList.shift();
                    fullLinkList.pop();
                }
            }
            //console.log(relativeLinkList);
            //console.log(fullLinkList);
            var url='';
            fullLinkList.forEach((str)=>{ 
                if(str!=''){
                    url=url+str;
                    if(str[0]!='#')url=url+'/';
                }
            })
            relativeLinkList.forEach((str)=>{ 
                if(str!=''){
                    url=url+str;
                    if(str[0]!='#')url=url+'/';
                }
            })

            //console.log(url);

            node.url=url;
            //node.url = withPathPrefix(path
            //    .resolve(markdownNode.fields.slug
            //        .replace(/\/$/, '')
            //        .split(path.sep)
            //        .slice(0, -1)
            //        .join(path.sep) || '/', node.url)
            //    .replace(/\/?(\?|#|$)/, '/$1'), pathPrefix);
        }
    }
    visit(markdownAST, 'link', visitor);
    return markdownAST;
};
