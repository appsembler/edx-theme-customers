function log(obj) {
    response = JSON.stringify(obj);
    if (response.search("sent")  && response.search('"reject_reason":null')){
      alert("Email sent successfully")
    }
    else {
      alert("There was an issue please contact technical+extracare@appsembler.com")
    }
}

function sendTheMail() {
    m.messages.send(params, function(res) {
        log(res);
    }, function(err) {
        log(err);
    });
}
