'use strict';

$(document).ready(function() {

  console.log('Are you logged in? ' + isLoggedIn());

  updateList();

  refreshForms();

  $('#loginForm').submit(function(event) {
    login();
    event.preventDefault();
  });

  $('#logoutForm').submit(function(event) {
    logout();
    event.preventDefault();
  });

  $('#addBookmarkForm').submit(function(event) {
    addBookmark();
    event.preventDefault();
  });
});

function refreshForms() {
  if (isLoggedIn()) {
    $('#loginForm').hide();
    $('#logoutForm').show();
    $('#addBookmarkForm').show();
  } else {
    $('#loginForm').show();
    $('#logoutForm').hide();
    $('#addBookmarkForm').hide();
  }
}

function isLoggedIn() {
  return (localStorage.getItem('token'));
}

function updateList() {
  console.log('-> updateList');
  if (isLoggedIn()) {

    var authToken = 'Bearer ' + localStorage.getItem('token');

    $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/user',
      beforeSend: function (request) {
        request.setRequestHeader('authorization', authToken);
      }
    }).done(function(data) {
      console.log('Done');
      $.each(data.bookmarks, function(key, val) {
        appendToList(val);
      });
    }).fail(function() {
      console.log('Fail');
    }).always(function(data) {
      console.log(JSON.stringify(data));
    });
  }
}

function appendToList(bookmark) {
  $("#list").append("<li><img src='" + bookmark.favicon + "''><a class='url' href='" + bookmark.url + "'>" + bookmark.name + "</a> ");
}

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
  }).always(function(data) {
    console.log(JSON.stringify(data));
  });
}

function logout() {
  console.log('-> logout');
  localStorage.removeItem('email');
  localStorage.removeItem('token');
  $("#list").empty();
  refreshForms();
}

function addBookmark() {
  console.log('-> addBookmark');
  chrome.tabs.getSelected(null, function(tab) {
    var bookmark = { url: tab.url };
    var authToken = 'Bearer ' + localStorage.getItem('token');

    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/user/bookmarks',
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
    }).always(function(data) {
      console.log(JSON.stringify(data));
    });

  });
}

window.addEventListener('click', function(e) {
  if (e.target.href !== undefined) {
    chrome.tabs.create({ url: e.target.href });
  }
});
