'use strict';

var mainAppModule = angular.module( 'Hello',[] );

mainAppModule.controller( 'NameController' , ['$scope' , function ($scope) {
    $scope.bigname ='wwawawawawa';
}]);

mainAppModule.filter( 'sayhello' , function() {
    return function(name){
        return 'Hello , '+name;
    };
});