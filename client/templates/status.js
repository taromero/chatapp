Template.status.events({
  'click #normal': function() {
    $('video')[0].className = ''
    Session.set('status.class', '')
  },
  'click #call': function() {
    $('video')[0].className = ''
    $('video').addClass('grayscale')
    Session.set('status.class', 'grayscale')
  },
  'click #dark': function() {
    $('video')[0].className = ''
    $('video').addClass('invert')
    Session.set('status.class', 'invert')
  },
  'click #brb': function() {
    $('video')[0].className = ''
    $('video').addClass('blur')
    Session.set('status.class', 'blur')
  },

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