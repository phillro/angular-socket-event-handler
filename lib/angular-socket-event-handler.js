/**
 * User: philliprosen
 * Date: 6/21/12
 * Time: 10:17 PM
 */

(function (window, angular, undefined) {
    'use strict';

    angular.module('socketEventHandler', ['ng']).
        factory('$socketEventHandler', ['$document', '$log', function ($document, $log) {
        function SocketEventHandlerService(options) {
            var self = this
            angular.extend({host:'http://localhost/'}, options)
            $document.data('socketOptions', options)
            $document.data('sockets', {})
            $document.data('socketBindings', {})


            self._trigger = function (ns, params) {

                var sockets = $document.data('sockets')
                if (!sockets[ns]) {
                    var socket = io.connect(options.host + ns)
                    sockets[ns] = socket
                    sockets[ns].on('eventMsg', function (obj) {
                        if (typeof obj == 'string') {
                            obj = JSON.parse(obj);
                        }
                        if (typeof obj.data == 'string') {
                            obj.data = JSON.parse(obj.data);
                        }

                        if ('event' in obj) {
                            self._triggerEvent(obj.event, obj.data);
                        }
                    })
                    $document.data('sockets', sockets)
                }
                sockets[ns].emit(params.event, params.data)
                return this
            }

            self.getSocket = function (ns) {
                var sockets = $document.data('sockets')
                return sockets[ns]
            }

            self._bind = function (event, callback) {
                var socketBindings = $document.data('socketBindings')
                if (!socketBindings[event]) {
                    socketBindings[event] = []
                }
                socketBindings[event].push(callback)
                $document.data('socketBindings', socketBindings)
            }

            self._unbind = function (event) {
                var socketBindings = $document.data('socketBindings')
                socketBindings[event] = []
                $document.data('socketBindings', socketBindings)
            }

            self._triggerEvent = function (event, arg) {
                var socketBindings = $document.data('socketBindings')
                if (socketBindings[event]) {
                    for (var i = 0; i < socketBindings[event].length; i++) {
                        socketBindings[event][i](arg)
                    }
                }
            }
        }
        return SocketEventHandlerService
    }])

})(window, window.angular);