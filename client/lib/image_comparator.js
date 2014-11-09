// wrapper around image analysis lib to simplify the logic
imageComparator = function(imgElem) {
  return {
    onDiff: function(cb) {
      var diffThreshold = 20 // % (when nobody is around the diff is ~10%)
      var lastSnapshot = null
      var comparisonInterval = setInterval(function() {
        if (lastSnapshot) {
          resemble(imgElem.src).compareTo(lastSnapshot).onComplete(function(data) {
            if (data.misMatchPercentage > diffThreshold) {
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