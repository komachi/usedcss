var myApp = angular.module('myApp', []);
myApp.run(function($templateCache) {
  $templateCache.put('template1.html', '<div class="test11"></div>');
});
