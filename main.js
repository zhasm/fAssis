
chrome.extension.sendRequest({greeting: "getVars"}, function(response) {
 
  var x= document.getElementById("miibeian");
  x.setAttribute("k",response.k);
  x.setAttribute("s",response.s);
 
});


function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "http://code.jquery.com/jquery-1.4.4.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  
  document.body.appendChild(script);
}

// the guts of this userscript
function main(k) {
    
    var k=$("#miibeian").attr("k");
    var s=$("#miibeian").attr("s");
    
    $("#miibeian").removeAttr("k");
    $("#miibeian").removeAttr("s");
    
    function str2regex(s)
    {
        //'abc,xyz'=> /abc|xyz/i

        var s=s.replace(/\s*,\s*/g, '|'); 
        s=s.trim();
        s=s.replace(/[\|,]+$/m, '');
        if (!s)
        {
            return false;
        }
        
        s.replace("\\", "\\\\");
        return RegExp(s);         
    }

    function hideItem(item)
    {
        //item is a child
        var parent=item.parent();
        var sibling=parent.children();
        parent.click(function () {
            var style=parent.attr('style');
            if (style)
            {
                parent.attr("style","");    //reset style to default;
                sibling.fadeIn('slow');     //show('slow'); 
            }
            else
            {
                sibling.hide();
                parent.attr("style", "min-height:0px; height:5px"); 
            }
        });
        sibling.hide();
        parent.attr("style", "min-height:0px; height:5px"); 

    }
   
    function filter(k, s)
    {
        //filter content that is matched regex k
        //and source that is matched by regex s
        if (s)
        {
            $(".method").each(function(){
                var content=$(this).html();
                var result=content.search(s);
                result=parseInt(result);
                if ( result != -1 ) //-1 means not found; != -1 means found
                {
                    hideItem($(this).parent());
                }
            });
        }
        
       if (k)
       {
           $(".content").each(function(){
               var content=$(this).html();
               var result=content.search(k);
               result=parseInt(result);
               if ( result !=-1 ) // -1 means not found
               {
                   hideItem($(this));
               }
           });
       }
        
    }//filter ends
    
    //repalce the search with advanced search:
    $("li a[href='http://fanfou.com/search']").each(function(){
        $(this).html("高级搜索"); 
        $(this).attr("href", "http://fanfou.com/advancedsearch");
    });

    //get background image
    //global function
    var x=$(".vcard li:eq(1)").after('<li>背景：<a id="xbgimg" title="点击查看本页背景图" target="_blank" class="url" href="">点击查看</a>');
    $("#xbgimg").click(function(){
        var url=$("body").css("background-image");
        url=url.replace(/^url|[('")]/gi,"");
        window.open(url);
        return false;
    });

//  page spacific function
    var path=window.location.pathname; 

    if (path.search("/home") !==-1){
    

        //when loading the page, filter:
        var kr=str2regex(k);
        var sr=str2regex(s);
        
        filter(kr, sr);
        $("#pagination-more, #timeline-notification").click(function(){
                setTimeout(function(){
                    filter(kr, sr);
                }, 1000);
            filter(kr, sr);
        });  

    }

    else if (path.search("advancedsearch") !==-1)
    {
        $("#pagination-more").click(function(){ 
                var href=$(this).attr("href");
                href=href.replace("/search","/advancedsearch");
                window.location.href=href;
        });

        $(".act #keyword + .formbutton").click(function(){
                var keyword=$("#keyword").val();
                var url="http://fanfou.com/advancedsearch?q="+keyword; 
                window.location.href=url;
                return false; 
        }); 
    }
    
    //hyperlink
    var fold="";
    
    var unfold='';

    $("#bio > a:visible").click(function(){
                  
        setTimeout(function()
        {
            $("#bio a").remove();
            $("#user_infos > a").remove();
            unfold=$("#bio").html();
            unfold=unfold.replace(/(?:ftp|https?):\/\/[^\s<>]+/gi,"<a href='$&'>$&</a>");
            
            $("#bio").html(unfold);
            
            $("#user_infos").append("<a id='x_expand' href='#' onClick='return false;'>(收起...)</a>");
            $("#x_expand").click(function(){
               $(".vcard li:gt(3)").toggle();
               var title=$("#x_expand").html();
               $("#x_expand").html(title.search('更多') >-1 ? "(收起...)" : "(更多...)");
            });
            
            
        },200); //setTimeout end
        return false;
        
    });//hyperlink end
    
   
    
}

// load jQuery and execute the main function
addJQuery(main);

