// wrapper around image analysis lib to simplify the logic
imageComparator = function(imgElem) {
  return {
    onDiff: function(cb) {
      var diffThreshold = 20 // % (when nobody is around the diff is ~10%)
      var lastSnapshot = null
      var comparisonInterval = setInterval(function() {
        if (lastSnapshot) {
          var api = resemble(imgElem.src).compareTo(lastSnapshot).onComplete(function(data) {
            console.log('data.misMatchPercentage ' , data.misMatchPercentage);
            if (data.misMatchPercentage > diffThreshold) {
              console.log('diff detected')
              clearInterval(comparisonInterval)
              cb()
            }
          })
        }
        lastSnapshot = imgElem.src
      }, 1000)
    }
  }
}