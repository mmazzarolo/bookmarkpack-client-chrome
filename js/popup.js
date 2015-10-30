'use strict';

$(document).ready(function() {

  updateList();

  refreshForms();

  $('#loginForm').submit(function(event) {
    login();
    event.preventDefault();
  });

  $('#logoutButton').click(function() {
    logout();
  });

  $('#addButton').click(function() {
    addBookmark();
  });

});

/**
 * Refresh page after login/logout
 */
function refreshForms() {
  if (isLoggedIn()) {
    $('#connected').show();
    $('#disconnected').hide();
  } else {
    $('#connected').hide();
    $('#disconnected').show();
  }
}

/**
 * Check if the user is logged in
 */
function isLoggedIn() {
  return (localStorage.getItem('token') != null);
}

/**
 * Update bookmarks list
 */
function updateList() {
  console.log('-> updateList');
  if (isLoggedIn()) {

    var authToken = 'Bearer ' + localStorage.getItem('token');

    $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/user/bookmarks',
      beforeSend: function (request) {
        request.setRequestHeader('authorization', authToken);
      }
    }).done(function(data) {
      console.log('Done');
      $.each(data, function(key, val) {
        appendToList(val);
      });
    }).fail(function() {
      console.log('Fail');
    });
  }
}

function appendToList(bookmark) {
  $("#list").append("<li class=''><div id='img-container'><img src='" + bookmark.favicon + "''></div><a class='url' href='" + bookmark.url + "'>" + bookmark.name + "</a> ");
}

/**
 * Perform login
 */
function login() {
  console.log('-> login');
  var formData = {
    'email': $('input[name=email]').val(),
    'password': $('input[name=password]').val(),
  };
  $.ajax({
    type: 'POST',
    url: 'http://localhost:3000/auth/login',
    data: formData,
    encode: true
  }).done(function(data) {
    console.log('Done');
    localStorage.setItem('email', formData.email);
    localStorage.setItem('token', data.token);
    refreshForms();
    updateList();
  }).fail(function() {
    console.log('Fail');
  });
}

/**
 * Perform logout
 */
function logout() {
  console.log('-> logout');
  localStorage.removeItem('email');
  localStorage.removeItem('token');
  $("#list").empty();
  refreshForms();
}

/**
 * Add a new bookmark
 */
function addBookmark() {
  console.log('-> addBookmark');
  chrome.tabs.getSelected(null, function(tab) {
    var bookmark = { url: tab.url, name: tab.title };
    var authToken = 'Bearer ' + localStorage.getItem('token');

    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/user/bookmarks?extract[]=favicon',
      data: bookmark,
      encode: true,
      beforeSend: function (request) {
        request.setRequestHeader('authorization', authToken);
      }
    }).done(function(data) {
      console.log('Done');
      appendToList(data);
    }).fail(function() {
      console.log('Fail');
    });

  });
}

/**
 * Restore the default click handler
 */
window.addEventListener('click', function(e) {
  if (e.target.href !== undefined) {
    chrome.tabs.create({ url: e.target.href });
  }
});
