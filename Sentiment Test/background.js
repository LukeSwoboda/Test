// background.js

// Constants for Gmail API
const GMAIL_API_BASE_URL = 'https://www.googleapis.com/gmail/v1/users/';
const MAX_RESULTS = 10;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === 'getFirstWordsList') {
      // Call a function to get the first words of the 10 most recent emails
      getFirstWordsList(sendResponse);
      return true; // Need to return true to indicate that the response will be asynchronous
    }
  }
);

// Function to get the first words of the 10 most recent emails
function getFirstWordsList(sendResponse) {
  // Ensure that you have the OAuth 2.0 access token
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    if (chrome.runtime.lastError || !token) {
      console.error('Error getting OAuth token:', chrome.runtime.lastError);
      sendResponse({ error: 'Error getting OAuth token' });
      return;
    }

    // Fetch the list of recent emails
    fetchRecentEmails(token, function(recentEmails) {
      if (recentEmails.error) {
        console.error('Error fetching recent emails:', recentEmails.error);
        sendResponse({ error: 'Error fetching recent emails' });
      } else {
        // Extract the first word from each email
        const firstWordsList = recentEmails.map(email => extractFirstWord(email, token));

        sendResponse({ firstWordsList: firstWordsList });
      }
    });
  });
}

// Function to fetch the list of recent emails
function fetchRecentEmails(token, callback) {
  const url = GMAIL_API_BASE_URL + 'me/messages?maxResults=' + MAX_RESULTS;

  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  })
  .then(response => response.json())
  .then(data => {
    callback(data.messages || []);
  })
  .catch(error => {
    console.error('Error fetching recent emails:', error);
    callback({ error: 'Error fetching recent emails' });
  });
}

// Function to extract the first word from an email
function extractFirstWord(email, token) {
  // Fetch the full email details using the message ID
  const url = GMAIL_API_BASE_URL + 'me/messages/' + email.id;

  return fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  })
  .then(response => response.json())
  .then(data => {
    // Extract the first word from the email body
    const body = data.payload.parts[0].body.data;
    const decodedBody = atob(body);
    const firstWord = decodedBody.split(' ')[0];

    return firstWord;
  })
  .catch(error => {
    console.error('Error fetching email details:', error);
    return '';
  });
}
