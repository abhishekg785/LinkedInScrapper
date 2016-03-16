document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {

    chrome.tabs.getSelected(null, function(tab) {
      var url = tab.url;
      var urlArray = url.split('http://');
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "http://localhost:3000/home?url="+url, false);
      xhr.send();
      console.log('ATER REQUEST IS SUCCESSFULL'+result);
      var result = xhr.responseText;
    });
  }, false);
}, false);
