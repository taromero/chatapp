Oauth = {
  configureProviders: function() {
    Accounts.loginServiceConfiguration.remove({
      service : 'twitter'
    })

    Accounts.loginServiceConfiguration.remove({
      service : 'google'
    })

    Accounts.loginServiceConfiguration.insert({
      service     : 'twitter',
      consumerKey : Meteor.settings.oauth.twitter.consumerKey,
      secret      : Meteor.settings.oauth.twitter.secret
    })

    Accounts.loginServiceConfiguration.insert({
      service     : 'google',
      clientId    : Meteor.settings.oauth.google.clientId,
      secret      : Meteor.settings.oauth.google.secret
    })
  }
}
