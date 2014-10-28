Helpers = {
  isEnter: function(evt) {
    return evt.which === 13
  }
}

Handlebars.registerHelper('timeago', function(time) {
  return jQuery.timeago(time)
});