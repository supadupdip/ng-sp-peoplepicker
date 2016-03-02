angular.module('devPortal')
	.directive('spPeoplePicker', function(){
		return{
			restrict: 'EA',
			transclude: true,
			require: 'ngModel',
			templateUrl: "sp-peoplepicker.html",
			scope:{
				userObject: '=ngModel',
				allowMultiple: '=allowMultiple',
				returnLimit: '=returnLimit',
				siteURL: '@siteUrl'
			},
			link: function($scope, $element, $attrs, ngModelCtrl){
					$element.find('.searchTextInput').on('keyup', function($event){
						if($event.keyCode === 13){
						$event.preventDefault();
							$scope.$apply(function(){
								$scope.$eval($scope.startSearch);
							});
						}
					});/*
					$element.find('.quickSearchInput').on('keydown', function($event){
						//$event.preventDefault();
							$scope.$apply(function(){
								$scope.$eval($scope.startQuickSearch);
							});

					});*/

					/*$element.pillbox();*/
			},
			controller: function($scope, $element, $attrs, $http){
				if($scope.userObject === null){
					$scope.userObject = [];
				}
				$scope.noResults = false;
				$scope.searchActive = false;
				$scope.searchText = "";
				$scope.error = false;
				$scope.instantSearchText = null;
				$scope.toggleSearch = function(currentState){
					(currentState)? $scope.searchActive= false: $scope.searchActive= true;
				}
				$scope.$watch("instantSearchText", function(instantSearchText){
					$scope.startQuickSearch();
				});
				$scope.startSearch = function(){
					$scope.error = false;
					$scope.getSearchResults($scope.searchText, $scope.returnLimit, false);

				}
				$scope.startQuickSearch = function(){
					$scope.getSearchResults($scope.instantSearchText, 5, true);
				}
				$scope.checkForEmpty = function(thisPerson){
					if(thisPerson.length >0){
						return false;
					}
					else{
						return true;
					}

				}
				$scope.getSearchResults = function(searchText, queryLimit, searchTypeQuick){
					$scope.searchResults = [];
	                var responsePromise = $http({
	                	method: 'POST',
	                	url: $scope.siteURL+"/_vti_bin/People.asmx",
	                	cache: false,
	                	headers: {'Content-Type': 'text/xml;charset=utf-8',
	                				'Accept' : 'application/xml, text/xml'
	                	},
          				data: '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' + '<soap:Body><SearchPrincipals xmlns="http://schemas.microsoft.com/sharepoint/soap/">' + '<searchText>' + searchText + '</searchText>' + '<maxResults>' + queryLimit + '</maxResults>' + '<principalType>' + 'All' + '</principalType>' + '</SearchPrincipals></soap:Body></soap:Envelope>'
	                });

	                responsePromise.success(function(data, status, headers, config) {
	                    var searchResults = [];
	                    $(data).find('PrincipalInfo').each(function(){
								var info = {};
								info.accountName = $(this).find('AccountName').text();
								info.userInfoID = $(this).find('UserInfoID').text();
								info.displayName = $(this).find('DisplayName').text();
								info.text = $(this).find('DisplayName').text();
								info.email = $(this).find('Email').text();
								info.department = $(this).find('Department').text();
								info.title = $(this).find('Title').text();
								info.isResolved = $(this).find('IsResolved').text();
								info.principalType = $(this).find('PrincipalType').text();
								searchResults.push(info);

	                    });
                		if(!searchResults.length){
							$scope.noResults= true;
						}else
						{
							$scope.noResults= false;
						}

	                    //console.log(headers);
	                    //console.log(data);
	                    //$scope.searchResults = data;
	                    //console.log(searchResults);
	                    $scope.noResults= false;
	                    if(searchTypeQuick){
	                    	$scope.quickResults = searchResults;
	                    }
	                    else{
	                    	$scope.returnedPeople = searchResults;
	                    }

	                    //return $scope.searchResults;

	                });
	                responsePromise.catch(function(data, status, headers, config) {
	                    $scope.error = true;
				     	$scope.errorMessage = data;
	                    $scope.noResults= true;
	                    return data;
	                });


				}
				$scope.clearInput = function(event){
					$scope.searchText = "";
					$scope.instantSearchText= "";
					$scope.returnedPeople = [];
					$scope.quickResults = [];
					if(event){
						event.preventDefault();
					}
				}
				$scope.addUser = function(thisPerson){
					//console.log('adding '+thisPerson.displayName);
					//console.log(thisPerson);
					var newObj = {userID: thisPerson.userInfoID, userName: thisPerson.displayName};
					$scope.isEmpty = false;
					if($scope.allowMultiple){
						//We can just push this to the array
						$scope.userObject.push(newObj);
					}
					else{
						//We need to remove the current user and add the new one
						$scope.userObject = [];
						$scope.userObject.push(newObj);
					}
					$scope.clearInput();
				}
				$scope.removeUser = function(thisPerson){
					//console.log(this);
					var index = $scope.userObject.indexOf(thisPerson);
					$scope.userObject.splice(index, 1);
					$scope.isEmpty = $scope.checkForEmpty($scope.userObject)
				}
				$scope.isEmpty = $scope.checkForEmpty($scope.userObject);
			}
		}

	})
	.directive('hasPopOver',function(){
		return{
			restrict: 'A',
			transclude: true,
			template: "<i class='glyphicon glyphicon-search'></i>",
			scope:{
				userObject: '=user'
			},
			link: function($scope, $element, $attrs){
					$element.popover({
						content: "<strong>Email:</strong> "+$scope.userObject.email+"<br/><strong>Department:</strong> "+$scope.userObject.department+"<br><strong>Title:</strong> "+$scope.userObject.title,
						html: true,
						placement: 'left',
						title: $scope.userObject.displayName
					});
			}
		}
	});
