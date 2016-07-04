angular.module('resultApp')
	.controller('NameSearchController', function(ResultService, $location){
		var vm = this;
		vm.name = null;
		vm.error = null;
		vm.sort = 'name';
		vm.reverse = false;

		vm.class="move-element";

		vm.doSort = function(propName){
			vm.sort = propName;
			vm.reverse = !vm.reverse;
		}

		vm.searchName = function(){
			ResultService.searchName(vm.name)
				.then(function(response){
					vm.result = response.data;
					vm.class="after-move-element";
					if(response.data.length==0){
						vm.error = "No result found";
					} else {
						vm.error = null;

					}
				})
				.catch(function(err){
					console.log(err);
					vm.error = "Error connecting to database";
				});
		}

		vm.clickStudent = function(roll){
			console.log(roll);
			ResultService.setRoll(roll);
			$location.path('/');
		}

	});