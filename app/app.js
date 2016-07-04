angular.module('resultApp', ['ngRoute', 'angular-loading-bar', 'ngAnimate', 'chart.js'])
	.config(function($routeProvider){
		$routeProvider
			.when('/', {
				templateUrl: 'app/views/home.html',
				controller: 'SearchRollController',
				controllerAs: 'search'
			})
			.when('/ranklist', {
				templateUrl: 'app/views/ranklist.html',
				controller: 'RanklistController',
				controllerAs: 'rank'
			})
			.when('/namesearch',{
				templateUrl: 'app/views/namesearch.html',
				controller: 'NameSearchController',
				controllerAs: 'nameCtrl'
			})
			.when('/semester', {
				templateUrl: 'app/views/semesterResult.html',
				controller: 'SemesterController',
				controllerAs: 'result'
			})
			.otherwise({
				redirectTo: '/'
			});
	});