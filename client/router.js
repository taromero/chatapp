Router.configure({
  layoutTemplate: 'layout',
  onBeforeAction: function() {
    User = $.jStorage.get('user')
  }
})

Router.route('auth', {
  path: '/auth/:room',
  template: 'auth',
  data: function() {
    return { roomName: this.params.room }
  }
})

Router.route('masterAuth', {
  path: '/masterAuth',
  template: 'masterAuth'
})

Router.route('rooms', {
  path: '/rooms',
  template: 'rooms',
  waitOn: function() {
    return [
      Meteor.subscribe('rooms')
    ]
  },
  onBeforeAction: function() {
    var user = $.jStorage.get('user')
    if (!user) {
      this.redirect('/')
    } else {
      var that = this
      Auth.masterAuth(user.masterPassword, function(err, res) {
        if (err) {
          return that.redirect('/masterAuth')
        } else {
          that.render('rooms')
        }
      })
    }
  }
})

Router.route('room', {
  path: '/rooms/:room',
  template: 'chat_room',
  waitOn: function() {
    return [
      Meteor.subscribe('users', this.params.room),
      Meteor.subscribe('messages', this.params.room),
      Meteor.subscribe('mentions', this.params.room)
    ]
  },
  data: function() {
    return { roomName: this.params.room }
  },
  action: function() {
    this.ready() ? this.render() : this.render('loading')
  },
  onBeforeAction: function() {
    var user = $.jStorage.get('user')
    var roomName = this.params.room
    if (!user) {
      this.redirect('/auth/' + roomName)
    } else {
      var that = this
      Auth.checkUserExistance(user._id, function(err, res) {
        if (err) {
          console.error(err)
          $.jStorage.deleteKey('user')
          that.redirect('/auth/' + roomName)
        } else {
          Auth.toRoom(user.passwords[roomName], roomName, function(err) {
            err && that.redirect('/auth/' + roomName)
          })
        }
      })
    }
  }
})

Router.route('/', {
  onBeforeAction: function() {
    this.redirect('/rooms/defaultRoom')
  }
})