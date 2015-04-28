Template.auth.rendered = function() {
  Session.set('auth.roomName', this.data.roomName)
}

Template.auth.events({
  'keypress #password': function(evt) {
    if (Helpers.isEnter(evt)) {
      var roomName = Session.get('auth.roomName')
      var password = $('#password').val()
      Auth.toRoom(password, roomName, function(err, res) {
        if (err) return alert(err)
        Router.go('/rooms/' + roomName)
      })
    }
  }
})

