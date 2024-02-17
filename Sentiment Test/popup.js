// popup.js

document.addEventListener('DOMContentLoaded', function () {
    // Request first words of recent emails from background script
    chrome.runtime.sendMessage({ action: 'getFirstWordsList' }, function (response) {
      if (chrome.runtime.lastError) {
        console.error('Error in sending message:', chrome.runtime.lastError);
        displayError('Error in sending message.');
      } else if (response.error) {
        console.error('Error in background script:', response.error);
        displayError(response.error);
      } else {
        var firstWordsList = response.firstWordsList;
        displayFirstWords(firstWordsList);
      }
    });
  });
  
  // Function to display the first words in the popup
  function displayFirstWords(firstWordsList) {
    var ul = document.getElementById('firstWordsList');
  
    // Clear any existing content
    ul.innerHTML = '';
  
    // Populate the list with the first words
    firstWordsList.forEach(function (word) {
      var li = document.createElement('li');
      li.appendChild(document.createTextNode(word));
      ul.appendChild(li);
    });
  }
  
  // Function to display an error message in the popup
  function displayError(message) {
    var ul = document.getElementById('firstWordsList');
    ul.innerHTML = '<li>Error: ' + message + '</li>';
  }
  