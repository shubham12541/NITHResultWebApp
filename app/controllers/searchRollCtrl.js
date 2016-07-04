angular.module('resultApp')
	.controller('SearchRollController', function($location, ResultService){
		var vm = this;
		vm.roll = null;
		vm.processing = false;
		vm.result=null;

		vm.sort = 'sem';
		vm.reverse = false;

		vm.class="move-element";

		vm.labels = [];

		function init(){
			vm.roll = ResultService.getRollNo();
			if(vm.roll){
				ResultService.clearRoll();
				fetchData(vm.roll);
			} else{
				vm.roll = ResultService.getData().roll;
				if(vm.roll){
					vm.result = ResultService.getRecentResult();

					generateFeilds();
				}
			}
			// vm.roll = ResultService.getData().roll;
			// if(!vm.roll){
			// 	vm.roll = ResultService.getRollNo();
			// 	// console.log("roll" + vm.roll);
			// 	if(vm.roll){
			// 		fetchData(vm.roll);
			// 	}
			// } else{
			// 	vm.result = ResultService.getRecentResult();
			// }
		}

		vm.doSort = function(propName){
			vm.sort = propName;
			vm.reverse = !vm.reverse;
		}

		init();

		function fetchData(rollNo){
			ResultService.searchRoll(rollNo)
				.then(function(response){
					if(response.data.length==0){
						vm.error = "Invalid Roll No.";
					} else{
						vm.result=response.data;
						generateFeilds();
						ResultService.storeRecentResult(response.data);
						if(vm.error){
							vm.error = null;
						}
						// console.log(response.data);
						// $location.path('/result');
					}
				})
				.catch(function(err){
					console.log(err);
					vm.error = "Unable to connect to database";
				});
		}


		function generateFeilds(){

			vm.class="after-move-element";
			
			vm.labels=[];
			for(var i=1, len=vm.result.length;i<=len;i++){
				vm.labels.push("Sem " + i);
			}

			vm.series = ['Semesters'];
			vm.data = [];

			var temp_data = [];

			for(var i=0, len=vm.result.length;i<len;i++){
				temp_data.push(vm.result[i].sgpi);
			}
			vm.data.push(temp_data);

		}

		vm.onClick = function(points, evt){
			console.log(points);
		}

		vm.search = function(){
			fetchData(vm.roll);
		}


		vm.semClick = function(name, roll, sem){
			$location.path('/semester');
			ResultService.setData(name, roll, sem);
		}

		vm.getSem = function(sem){
			var semester = sem.semester_no;
			semester = semester.substring(semester.length-1, semester.length);
			return semester;
		}




	});