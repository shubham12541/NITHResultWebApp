angular.module('resultApp')
	.factory('ResultService', function($http){
		var factory = {};

		factory.result = null;

		var recent_roll;

		factory.searchRoll = function(roll){
			recent_roll = roll;
			return $http.get('/result/' + roll);
		};

		factory.searchSem = function(data){
			return $http.post('/semester', data);

		};

		factory.searchName = function(name){
			return $http.get('/search/' + name);
		}

		var roll, sem, name, roll2;

		factory.setData = function(n, r, s){
			name = n;
			roll=r;
			sem=s;
		};

		factory.setRoll = function(val){
			roll2 = val;
		};

		factory.getRollNo = function(){
			return roll2;
		};

		factory.clearRoll = function(){
			roll2=null;
		}

		factory.getData = function(){
			return { "roll": roll, "sem":sem, "name": name };
		};

		factory.getRecentSearch = function(){
			return $http.get('/result/' + recent_roll);
		};

		var recent_result;

		factory.storeRecentResult = function(data){
			recent_result=data;
		};

		factory.getRecentResult = function(){
			return recent_result;
		};

		factory.getList = function(data){
			return $http.post('/ranklist', data);
		};

		return factory;
	});