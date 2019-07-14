console.log("JAVE loading background");

var blocked=false;
function toggleBlock()
{
    blocked = !blocked;
    console.log("JAVE toggle "+blocked);
    if(blocked)
        browser.browserAction.setIcon({path: "icons/bookmark-it.png"});
    else
        browser.browserAction.setIcon({path: "icons/border-48.png"});
        //
    //bookmark-it.png
    //border-48.png
}


browser.browserAction.onClicked.addListener(toggleBlock);




function handleBeforeNavigate(navDetails) {
    console.log("JAVE handleBeforeNavigate "+blocked + " " + navDetails.url);
    if (!blocked) return;
    var re = RegExp ("dn.se|svd.se|nytimes|manga|penny|smbc|warhammer|tube|dailykos|blacklibrary");
    if (navDetails.frameId == 0) {
        
	//checkTab(navDetails.tabId, navDetails.url, false);
        if(re.test(navDetails.url)){
            console.log("JAVE blockeing this url");
            //document.body.style.border = "10px solid red";            
            browser.tabs.update(navDetails.tabId, {url:"no.html"});
            // browser.notifications.create("emslaved",
            //                              {"type":"basic",
            //                               "title":"block",
            //                               "message" : "NO! " + navDetails.url + " do something else!"});
            //            browser.tabs.executeScript({code: "alert('block');"});
        }

        
    }
}


browser.webNavigation.onBeforeNavigate.addListener(handleBeforeNavigate);
toggleBlock();

////////////// native

var port = browser.runtime.connectNative("emslaved");
console.log("JAVE  native port: " + port);
port.onMessage.addListener((response) => {
  console.log("JAVE Received from native: " + response);
});


browser.browserAction.onClicked.addListener(() => {
  console.log("JAVE Sending to native:  ping");
  port.postMessage("ping");
});
