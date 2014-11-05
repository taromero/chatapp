Template.auth.rendered = function() {
  Session.set('auth.roomName', this.data.roomName)
}

Template.auth.events({
  'keypress #password': function(evt) {
    if (Helpers.isEnter(evt)) {
      var defaultUser = { _id: Math.random(), passwords: {}, nick: 'defaultName', connectedTo: [] }
      var user = $.jStorage.get('user') || defaultUser
      var roomName = Session.get('auth.roomName')
      var password = $('#password').val()
      Auth.toRoom(password, roomName, function(err, res) {
        if (err) return alert(err)
        user.passwords[roomName] = password
        $.jStorage.set('user', user)
        Users.upsert({ _id: user._id }, user)
        Router.go('/rooms/' + roomName)
      })
    }
  }
})

Template.masterAuth.events({
  'keypress #password': function(evt) {
    if (Helpers.isEnter(evt)) {
      var defaultUser = { _id: Math.random(), passwords: {}, nick: 'defaultName', connectedTo: [] }
      var user = $.jStorage.get('user') || defaultUser
      var password = $('#password').val()
      Auth.masterAuth(password, function(err, res) {
        if (err) return alert(err)
        user.masterPassword = password
        $.jStorage.set('user', user)
        Users.upsert({ _id: user._id }, user)
        Router.go('/rooms')
      })
    }
  }
})