Meteor.startup(function() {
  Rooms.upsert({ name: 'defaultRoom' } , {
    name: 'defaultRoom',
    password: '1234'
  })
})