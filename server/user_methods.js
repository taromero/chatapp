Meteor.methods({
  checkUserExistance: function(userId) {
    if (Users.find(userId).count() > 0) {
      return true;
    } else {
      throw new Meteor.Error(400, 'User don\'t exist anymore on the DB, auth again')
    }
  },
  setSnapshot: function(userId, snapshot, effect) {
    return Users.update(userId, { $set: { snapshot: snapshot, effect: effect } })
  }
})