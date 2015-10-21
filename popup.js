$(document).ready(function() {
  $.getJSON("http://localhost:3000/users/mazza", function(data) {
    $.each(data.user.bookmarks, function(key, val) {
      // var list = $("#list");
      // var li = $('<li></li>')
      //   .appendTo(list);
      // var img = $('<img>');
      // img.attr('src', val.favicon)
      // img.appendTo(li);
      // var a = $('<a>');
      // a.attr('href', val.url)
      // a.text(val.name)
      // a.onclick = function () {
      //   alert('asdf');
      //   chrome.tabs.create({active: true, url: val.url});
      // }
      // a.appendTo(li);
      $("#list").append("<li><img src='" + val.favicon + "''><a href='" + val.url + "'>" + val.name + "</a> ");
    });
  });
});

window.addEventListener('click', function(e) {
  if (e.target.href !== undefined) {
    chrome.tabs.create({
      url: e.target.href
    })
  }
});
