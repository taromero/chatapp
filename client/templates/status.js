Template.status.events({
  'click #normal': setFilter(''),
  'click #call': setFilter('grayscale'),
  'click #dark': setFilter('invert'),
  'click #brb': setFilter('blur'),
  'click #lunch': setFilter('sepia'),

  'click #picSmall': function() {
    Session.set('picHeight', 47)
    Session.set('picWidth', 58)
  },
  'click #picMedium': function() {
    Session.set('picHeight', 70)
    Session.set('picWidth', 86)
  },
  'click #picBig': function() {
    Session.set('picHeight', 140)
    Session.set('picWidth', 172)
  }
})

function setFilter(name) {
  return function() {
    $('video')[0].className = ''
    $('video').addClass(name)
    Session.set('status.class', name)
  }
}