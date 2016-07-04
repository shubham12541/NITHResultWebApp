angular.module('resultApp')
	.controller('SemesterController', function(ResultService){
		var vm = this;

		function init(){
			var ar = ResultService.getData();
			vm.sem = ar.sem;
			vm.roll = ar.roll;
			vm.name = ar.name;

			var data = {"roll":vm.roll, "semester":vm.sem };
			ResultService.searchSem(data)
				.then(function(response){
					vm.semResult = response.data;
				})
				.catch(function(err){
					console.log(err);
				});
		}

		vm.update = function(){
			var data = {"roll": vm.roll, "semester": vm.sem};
			ResultService.searchSem(data)
				.then(function(response){
					if(response.data.length==0){
						vm.error = "Invalid Semester";
					} else{
						vm.semResult = response.data;
						if(vm.error){
							vm.error = null;
						}
					}
				})
				.catch(function(err){
					console.log(err);
					vm.error = "Error connecting";
				});
		}
		

		init();

	});