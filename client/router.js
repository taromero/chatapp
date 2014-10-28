Router.configure({
  layoutTemplate: 'layout',
  onBeforeAction: function() {
    Session.set('user', $.jStorage.get('user'))
  }
})

Router.route('auth', {
  path: '/auth/:room',
  template: 'auth',
  data: function() {
    return { roomName: this.params.room }
  }
})

Router.route('room', {
  path: '/rooms/:room',
  template: 'chat_room',
  waitOn: function() {
    return [
      Meteor.subscribe('users', this.params.room),
      Meteor.subscribe('messages'),
      Meteor.subscribe('mentions')
    ]
  },
  data: function() {
    return { roomName: this.params.room }
  },
  onBeforeAction: function() {
    Session.set('roomName', this.params.room)
    var user = $.jStorage.get('user')
    var roomName = this.params.room
    if (!user) {
      this.redirect('/auth/' + roomName)
    } else {
      this.render('loading')
      var that = this
      Auth.toRoom(user.passwords[roomName], roomName, function(err, res) {
        err && this.redirect('/auth/' + roomName)
        that.render('chat_room')
      })
    }
  }
})

Router.route('/', {
  onBeforeAction: function() {
    this.redirect('/rooms/defaultRoom')
  }
})