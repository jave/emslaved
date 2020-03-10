
// to see the extensions log messages, load the extension, inspect it in the debug panel
console.log("JAVE loading background");

var blocked=false;
var timerId=0;

function forceBlock() {
    console.log("JAVE timer block ");
    blocked=true;

    browser.browserAction.setIcon({path: "icons/bookmark-it.png"});
    socket.send("emslaved-ff is blocking");    
}

function forceUnblock() {
    console.log("JAVE  unblock ");
    blocked=false;
    browser.browserAction.setIcon({path: "icons/border-48.png"});    
    timerId=setTimeout(forceBlock, 1000*60*10); //block automatically after 10 minutes. i suppose there should be only 1 timer
    //check timerid, if set, cancel timer, then start the new one
    socket.send("emslaved-ff is unblocking");        
}

//the extension can only have a single toolbar button
//browser.browserAction.onClicked.addListener(toggleBlock);


function handleBeforeNavigate(navDetails) {
    console.log("JAVE handleBeforeNavigate "+blocked + " " + navDetails.url);
    if (!blocked) return;
    //example of distractive urls i want to block
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
//toggleBlock();

////////////// native
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/connectNative

// ~/.mozilla/native-messaging-hosts/emslaved.json
var port = browser.runtime.connectNative("emslaved");
console.log("JAVE  native port: " + port);
port.onMessage.addListener((response) => {
    console.log("JAVE Received from native: " + response);
});


browser.browserAction.onClicked.addListener(() => {
    console.log("JAVE Sending to native:  ping");
    port.postMessage("ping");
});

//////////////// mess with tabs

//https://github.com/mdn/webextensions-examples/blob/master/tabs-tabs-tabs/tabs.js
//https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/update
function tabmess()
{
    console.log("JAVE tab mess ");
    //    browser.tabs.query({currentWindow: true}, logTabs);  //api is call-back based dumps all tabs as array to console
    // browser.tabs.show(2).then(onShown, onError); //show tab 2 , no this only works for "hidden" tabs

    // browser.tabs.update(tabs[0].id, {
    //           active: true
    // });

    var querying = browser.tabs.query({currentWindow:true});
    querying.then(updateFirstTab, onError);
    
}



function logTabs(tabs) {
    console.log(tabs)
}


function onShown() {
    console.log(`Shown`);
}

function onError(error) {
    console.log(`Error: ${error}`);
}



function onUpdated(tab) {
    console.log(`Updated tab: ${tab.id}`);
}

function updateFirstTab(tabs) {
    var updating = browser.tabs.update(tabs[0].id, {
        active: true
        //    url: "https://developer.mozilla.org"
    });
    updating.then(onUpdated, onError);
}



//receive message from popup.js, see other half there
//https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/sendMessage


function handleMessage(request, sender, sendResponse) {
    console.log("Message from the content script: " +
                request.greeting +" "+sender+" "+sendResponse);
    switch(request.id){
    case "block":
        forceBlock();
        break;
    case "unblock":
        forceUnblock();
        break;
    }
    //toggleBlock();    
    sendResponse({response: "Response from background script"});
}

browser.runtime.onMessage.addListener(handleMessage);


/////////////////////////////
// websocket to emacs attempt

let socket = new WebSocket("ws://localhost:9000");

socket.onopen = function(e) {
  console.log("[open] Connection established");
  console.log("Sending to server");
    socket.send("My name is emslaved");
};

socket.onmessage = function(event) {
    console.log(`[message] Data received from server: ${event.data}`);
    eval(event.data); //yolo
};

socket.onclose = function(event) {
  if (event.wasClean) {
    console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    console.log('[close] Connection died');
  }
};

socket.onerror = function(error) {
  console.log(`[error] ${error.message}`);
};
