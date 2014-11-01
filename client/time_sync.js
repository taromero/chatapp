TimeHelper = {
  serverTimestamp: function() {
    return TimeSync.serverTime(Date.now())
  }
}