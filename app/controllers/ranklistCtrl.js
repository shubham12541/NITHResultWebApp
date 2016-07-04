angular.module('resultApp')
	.controller('RanklistController', function(ResultService, $location){
		var vm = this;

		vm.year = null;
		vm.branch = null;
		vm.order = null;

		vm.sort = null;
		vm.reverse= false;
		vm.error = null;

		vm.generateList = function(){

			if(vm.year && vm.branch && vm.order){
				var data = {"year": vm.year, "branch": vm.branch, "order": "Roll No"};

				if(vm.order === "Rank"){
					vm.sort = 'cgpi';
					vm.reverse = !vm.reverse;
				}

				ResultService.getList(data)
					.then(function(response){
						if(response.data.length==0){
							vm.error = "Request Invalid";
						} else{
							vm.list = response.data;
							vm.error=null;
							generateFeilds(vm.list);
							vm.error = null;
						}
					})
					.catch(function(err){
						console.log(err);
					});
			} else{
				vm.error = "All fields required";
			}

		}

		function comparator(a, b){
			if(a.roll_no>b.roll_no){
				return 1;
			} else if(a.roll_no<b.roll_no){
				return -1;
			} else{
				return 0;
			}
		}

		function generateFeilds(temp_list){

			
			vm.labels=[];
			for(var i=0, len=temp_list.length;i<len;i++){
				vm.labels.push(temp_list[i].roll_no);
			}

			vm.series = ['List'];
			vm.data = [];

			var temp_data = [];

			for(var i=0, len=temp_list.length;i<len;i++){
				temp_data.push(temp_list[i].cgpi);
			}
			vm.data.push(temp_data);

		}

		vm.onClick = function(points, evt){
			console.log(points);
		}

		vm.doSort = function(propName){
			if(propName==="roll_no"){
				vm.order = "Roll No";
			} else if(propName === "cgpi"){
				vm.order = "Rank";
			} else if(propName === "name"){
				vm.order = "";
			}

			vm.sort = propName;
			vm.reverse = !vm.reverse;
		}

		vm.clickName = function(roll){
			ResultService.setRoll(roll);
			$location.path('/');
		}
		
	});