/*
    Detect different versions of Microsoft Internet Explorer or Edge
    Assumes a browser environment where window.navigator.userAgent is present.

    ---
    Returns    Object     containing a Bool flag and more info about which version

*/

export default function () {

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');
    var edge = ua.indexOf('Edge/');

    if ( msie > 0 ) { return { flag: true, version: "<=10" }; }
    else if ( trident > 0 ) { return { flag: true, version: "11" }; }
    else if ( edge > 0 ) { return { flag: true, version: "Edge" }; }
    else { return { flag: false }; }
}