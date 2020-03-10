console.log("JAVE popup ");


// send a msg to the bg script
function handleResponse(message) {
  console.log(`Message from the background script:  ${message.response}`);
}

function handleError(error) {
  console.log(`Error: ${error}`);
}

function notifyBackgroundPage(id) {
  var sending = browser.runtime.sendMessage({
      greeting: "Greeting from the content script",
      id: id
  });
  sending.then(handleResponse, handleError);  
}

//event handler for the popup
document.addEventListener("click", (e) => {
    console.log("JAVE popup event handler");

    notifyBackgroundPage(e.target.id);
    // if (e.target.id === "toggleblock") {
    //     notifyBackgroundPage(e);
    // }

    e.preventDefault();
});

