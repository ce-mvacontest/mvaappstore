'use strict';
angular.module('MvaAppstore', ['ionic', 'ngResource', 'config', 'MvaAppstore.controllers', 'MvaAppstore.directives', 'MvaAppstore.services', 'MvaAppstore.filters', 'yaru22.angular-timeago'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      window.StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('app', {
			url: '/app',
			abstract: true,
			templateUrl: 'templates/menu.html',
			controller: 'AppCtrl'
		})
  
    .state('app.lunch', {
			url: '/lunch',
			views: {
				'menuContent' : {
					templateUrl: 'templates/lunch.html',
					controller: 'LunchCtrl'
				}
			}
		})
	
		.state('app.explore', {
			url: '/explore',
			views: {
				'menuContent' : {
					templateUrl: 'templates/explore.html',
					controller: 'ExploreCtrl'
				}
			}
		})
  
    .state('app.more', {
			url: '/more/:categoryname',
			views: {
				'menuContent' : {
					templateUrl: 'templates/more.html',
					controller: 'MoreCtrl'
				}
			}
		})
	
		.state('app.profile', {
			url: '/profile',
			views: {
				'menuContent' : {
					templateUrl: 'templates/profile.html',
					controller: 'ProfileCtrl'
				}
			}
		})
  
    .state('app.install', {
			url: '/install/:appId',
			views: {
				'menuContent' : {
					templateUrl: 'templates/install.html',
					controller: 'InstallCtrl'
				}
			}
		})
  
    .state('app.search', {
			url: '/search',
			views: {
				'menuContent' : {
					templateUrl: 'templates/search.html',
					controller: 'SearchCtrl'
				}
			}
		})
	
		.state('app.favourites', {
			url: '/favourites',
			views: {
				'menuContent' : {
					templateUrl: 'templates/favourites.html',
					controller: 'FavouritesCtrl'
				}
			}
		})
	
		.state('app.myreviews', {
			url: '/myreviews',
			views: {
				'menuContent' : {
					templateUrl: 'templates/myreviews.html',
					controller: 'ReviewsCtrl'
				}
			}
		})
		
		.state('app.settings', {
			url: '/settings',
			views: {
				'menuContent' : {
					templateUrl: 'templates/settings.html',
					controller: 'SettingsCtrl'
				}
			}
		})
	
		.state('app.category', {
			url: '/category/:categoryId',
			views: {
				'menuContent' : {
					templateUrl: 'templates/category.html',
					controller: 'CategoryCtrl'
				}
			}
		})
	
    .state('app.init', {
			url: '/init',
			views: {
				'menuContent' : {
					templateUrl: 'templates/init.html',
					controller: 'InitCtrl'
				}
			}
		})
  
		.state('app.apps', {
			url: '/apps',
			views: {
				'menuContent' : {
					templateUrl: 'templates/apps.html',
					controller: 'AppsCtrl'
				}
			}
		});
   
  // if none of the above states are matched, use this as the fallback 
  $urlRouterProvider.otherwise('/app/init');
});
