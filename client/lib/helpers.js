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
