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
      this.redirect('/masterAuth')
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
      Meteor.subscribe('mentions', this.params.room),
      Meteor.subscribe('room', this.params.room),
      Meteor.subscribe('calls', this.params.room)
    ]
  },
  action: function() {
    this.ready() ? this.render() : this.render('loading')
  },
  onBeforeAction: function() {
    var router = this
    var user = Meteor.user()
    var roomName = this.params.room
    if (!user) {
      this.redirect('/auth/' + roomName)
    } else {
      if (!user.passwords) {
        user.passwords = {}
      }
      Auth.toRoom(user.passwords[roomName], roomName, function(err) {
        // console.log(err)
        // err && router.redirect('/auth/' + roomName)
      })
    }
  }
})

Router.route('selectRoom', {
  path: '/selectRoom',
  template: 'select_room',
  waitOn: function() {
    return Meteor.subscribe('rooms')
  },
  action: function() {
    this.ready() ? this.render() : this.render('loading')
  }
})

Router.route('/', {
  onBeforeAction: function() {
    this.redirect('/selectRoom')
  }
})
