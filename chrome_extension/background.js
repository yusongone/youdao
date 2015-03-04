var staticData={
}
var page={};

chrome.contextMenus.create({
  "id":"cd",
  "title":"词典",
  "contexts":["selection"],
  "onclick":function(info, tab){
    alertLogin(info,tab);
    return;
  }
}, function(err){
  console.log(err);
});

chrome.contextMenus.create({
  "id":"fc",
  "title":"分词",
  "contexts":["selection"],
  "onclick":function(info, tab){
    //alertLogin(info,tab);
    return;
  }
}, function(err){
  console.log(err);
});


function alertLogin(info,tab){
  chrome.tabs.insertCSS(tab.id,{file:"/css/content.css"});
  chrome.tabs.executeScript(null, {file: "/js/jquery-2.1.1.min.js"},function(){ });
  chrome.tabs.executeScript(null, {file: "/js/content.js"});
  getTrans(info,tab);
}

function getTrans(info,tab){
    $.ajax({
      type:"post",
      url:"http://www.makejs.com/trans/getTranslateData",
      data:{
        q:info.selectionText
      },
      dataType:"json"
    }).error(function(){
    }).done(function(data){
          chrome.tabs.sendMessage(tab.id,{"data":data},function(){ });
        if(data.message=="login time out"){
          chrome.tabs.create({url:"http://www.makejs.com/login/"});
        }
    });
};




