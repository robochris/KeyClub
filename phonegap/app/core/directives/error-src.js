window.agApp.directive('errorSrc', function() {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        console.log('oops!');
        if (attrs.src != attrs.errorSrc) {
          attrs.$set('src', attrs.errorSrc);
        }
      });
    }
  }
});
