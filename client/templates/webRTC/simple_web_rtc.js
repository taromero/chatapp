Template.simple_web_rtc.rendered = function() {
  Tracker.autorun(function() {
    var call = Session.get('call')
    if (!call) {
      // If the call has been removed, hang
      Caller.hang()
    } else if (call.from == User._id) {
      // If the user made the call, automatically participate in it
      Caller.answer()
    } else if (call.to == User._id) {
      // If the user is receiving a call, let him answer it or hang
      $('#receiveCallModal').modal('show')
    }
  })

  Calls.find({ $or: [{ from: User._id }, { to: User._id }] }).observe({
    added: function(call) {
      Session.set('call', call)
    },
    removed: function(call) {
      console.log('call removed')
      Session.set('call', false)
    }
  })
}

Template.simple_web_rtc.events({
  'click #hang': function() {
    Caller.hang()
    $('#receiveCallModal').modal('hide')
  },
  'click #answerCall': function() {
    Caller.answer()
    $('#receiveCallModal').modal('hide')
  }
})