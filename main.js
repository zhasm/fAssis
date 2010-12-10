

chrome.extension.sendRequest({greeting: "getVars"}, function(response) {
  //console.log(response.k);
  var x= document.createElement("input");
  x.innerHTML = response.k;
  //x.setAttribute("id","x_keyword");
  //x.setAttribute("color",'yello');

  document.body.appendChild(x);
});


function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "http://code.jquery.com/jquery-1.4.4.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")("");";
    document.body.appendChild(script);
  }, false);
  
  document.body.appendChild(script);
}



// the guts of this userscript
function main(k) {
    //alert(localStorage["favorite_color"]);
        
    //var g_keywords=readCookie("g_keywords");
    //var g_sources=readCookie("g_sources");
    
}

// load jQuery and execute the main function
addJQuery(main);

