const path = "https://music.yandex.ru/translate/track/"

var observer = (function(){
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  return function( obj, callback ){
    if( !obj || obj.nodeType !== 1 ) return; 

    if( MutationObserver ){
      // define a new observer
      var mutationObserver = new MutationObserver(callback)

      // have the observer observe for changes in children
      mutationObserver.observe( obj, { childList:true, subtree:true })
      return mutationObserver
    }
    
    // browser support fallback
    else if( window.addEventListener ){
      obj.addEventListener('DOMNodeInserted', callback, false)
      obj.addEventListener('DOMNodeRemoved', callback, false)
    }
  }
})()


function getLyrics(url) {
    xmlhttp = false;
    xmlhttp=new XMLHttpRequest();
         xmlhttp.open("GET", url, false);
    xmlhttp.send();

    if(xmlhttp == false)
    {
        return "404";
    }

    var raw = xmlhttp.responseText;

    try {
        return raw.split('<pre>')[1].split('</pre>')[0];
    }
    catch (e){
        return "Lyrics not found ):";
    }
    
}


observer(document.querySelector(".sidebar"), function(m){ 
    var addedNodes = [], removedNodes = [];

    m.forEach(record => record.addedNodes.length & addedNodes.push(...record.addedNodes))
   
    m.forEach(record => record.removedNodes.length & removedNodes.push(...record.removedNodes))

    if (removedNodes.length > 0)
    {
        const sidebar = document.querySelector(".sidebar-track");
        const track = sidebar.querySelector(".d-link").href.split('/')[6];
        var lyrics = getLyrics(path + track);

        var text = document.createElement("pre");
        text.innerHTML = lyrics;
        text.id = "loaded-lyrics";

        sidebar.insertBefore(text, sidebar.children[1]);
    }
    // console.clear();
    //console.log('Added:', addedNodes, 'Removed:', removedNodes);
});

