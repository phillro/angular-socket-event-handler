angular-socket-event-handler
============================

Socket.io event handler factory

This angular module is usefull for integrating angular.js with socket.io. With it one can construct socket 
based services and integrate them into controllers.

The module assumes that your socketio methods will emit messages in the form of:

{event:'some_event_name',data:{}}

Example of usage
============================

First create a service for your namespace, then use the service in your controller:
<pre><code>
angular.module('articleServices', ['socketEventHandler']).factory('ArticleService', function ($socketEventHandler) {
        var socketEventHandler = new $socketEventHandler({host:'http://localhost:3000/'});
        function ArticleService(eventHandler) {
            var self = this
            self.getArticles = function (params) {
                eventHandler._trigger('article_stream', {event:'get_articles', data:{params:params}});
            }
            self._bind = eventHandler._bind
            self._unbind = eventHandler._unbind
        }
    })
   
function ViewerCtrl($scope, $routeParams, ArticleService) {
  $scope.articles = []
  $scope.getArticles = ArticleService.getArticles
  ArticleService._bind('add_article',function(article){
    $scope.articles.push(article)
    $scope.$digest()
  })
}
</code></pre>
