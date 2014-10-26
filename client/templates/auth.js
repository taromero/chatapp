Template.auth.rendered = function() {
  Session.set('auth.roomName', this.data.roomName)
}

Template.auth.events({
  'keypress #password': function(evt) {
    if (evt.which === 13) {
      var user = $.jStorage.get('user', { passwords: {} })
      var roomName = Session.get('auth.roomName')
      var password = $('#password').val()
      Auth.toRoom(password, roomName, function(err, res) {
        console.log(err)
        if (err) return alert(err)
        user.passwords[roomName] = password
        $.jStorage.set('user', user)
        Router.go('/rooms/' + roomName)
      })
    }
  }
})