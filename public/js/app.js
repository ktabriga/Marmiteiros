'use strict';

var marmiteirosApp = angular.module('marmiteirosApp', ['ngRoute','controllers']);

marmiteirosApp.config(['$routeProvider', 
	function ($routeProvider) {
		$routeProvider
			.when('/pedido',{
				templateUrl :'partials/pedido.html',
				controller : 'mainController'
			})
			.when('/listaPedidos',{
				templateUrl : 'partials/listaPedidos.html',
				controller : 'listaController'
			})
			.otherwise({
				redirectTo : '/pedido'
			});
	} ]);

marmiteirosApp.factory('socket',['$rootScope', function($rootScope){
	var socket = io.connect();
	var addListener = function(name, callback) {
        socket.addListener(name, function() {
            var args = arguments;
            $rootScope.$apply(function() {
                callback.apply(socket, args);
            });
        });
    };

    var emit = function(name, data){
    	socket.emit(name, data);
    }

    return {
    	on : addListener,
    	emit : emit
    }
}]);