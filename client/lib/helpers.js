Helpers = {
  isEnter: function(evt) {
    return evt.which === 13
  }
}

Handlebars.registerHelper('timeago', function(time) {
  return jQuery.timeago(time)
})

Handlebars.registerHelper('picHeight', function(time) {
  return Session.get('picHeight') + 'px'
})

Handlebars.registerHelper('picWidth', function(time) {
  return Session.get('picWidth') + 'px'
})

Handlebars.registerHelper('firstTenDigits', function(timestamp) {
  // livestamp only works with 10 digit timestamps for some reason.
  return Math.floor(timestamp/1000)
})

currentRoom = function() {
  return Rooms.findOne()
}