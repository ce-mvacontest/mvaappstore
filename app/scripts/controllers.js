'use strict';
angular.module('MvaAppstore.controllers', [])

.controller('LunchCtrl', ['$scope', '$state', '$timeout', '$window', 'storage', function($scope, $state, $timeout, $window, storage) {
  
  $scope.properties = {};
  var startApp = function() {
    storage.setLocalItem('firstRun', true);
    $state.go('app.init');
  };
  
  $scope.next = function() {
    $scope.$broadcast('slideBox.nextSlide');
  };
  
  //$ionicSideMenuDelegate.canDragContent(false)
  var rightButtons = [
    {
      content:'Skip',
      type:'button-positive button-clear',
      tap: function(e) {
        startApp(); 
      }
    }
  ];
  
  var leftButtons = [{
      content: 'Next',
      type: 'button-positive button-clear',
      tap: function(e) {
        $scope.next(); 
      }
  }];
  
  $scope.properties.leftButtons = leftButtons;
  $scope.properties.rightButtons = rightButtons;
  $scope.properties.hideBackButton = true;
  
  $scope.slideChanged = function(index) {
    if (index > 0) {
      $scope.properties.leftButtons = [
        {
          content: 'Back',
          type: 'button-positive button-clear',
          tap: function(e) {
            $scope.$broadcast('slideBox.prevSlide'); 
          }
        }
      ];
    } else {
      $scope.properties.leftButtons = leftButtons; 
    }
    
    
    if (index == 2) {
      $scope.properties.rightButtons = [
        {
          content: 'Start using MVA Appstore',
          type: 'button-positive button-clear',
          tap: function(e) {
            startApp(); 
          }
        }
      ];
    } else {
      $scope.properties.rightButtons = rightButtons;
    }
  }
  
}])

.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', function($scope, $ionicModal, $timeout) {
  //Search Object
  $scope.search = {
    query: '',
    limit: 0
  };
  
  // Modals
  $ionicModal.fromTemplateUrl('templates/search.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.searchModal = modal;
  });
  
  $ionicModal.fromTemplateUrl('templates/authentication.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.authenticationModal = modal;
  });

  $scope.closeFilter = function() {
    $scope.searchModal.hide();
  };

  $scope.openFilter = function() {
    $scope.searchModal.show();
  };

  $scope.applyFilter = function() {
    //alert($scope.searchFilterData.limit);
    //console.log('Doing login', $scope.searchFilterData.limit);

    $timeout(function() {
      $scope.closeFilter();
    }, 2000);
  };
  
  //Login, SignUp & Authorization
  $scope.doSignUp = function() {
    $scope.authenticationModal.show();
  };
  
  $scope.closeAuthentication = function() {
    $scope.authenticationModal.hide();
  };
  
  $scope.$on('$destroy', function() {
    $scope.authenticationModal.remove();
    $scope.searchModal.remove();
  });
}])

.controller('AppsCtrl', ['$scope', 'AppList', '$ionicScrollDelegate', function($scope, AppList, $ionicScrollDelegate) {
  $scope.properties = {};
  $scope.properties.navTitle = 'Apps';
  $scope.properties.hideBackButton = true;
  //$scope.properties.search = '';
  
  var letters = $scope.letters = [];
  var apps = $scope.apps = [];
  var currentCharCode = 'A'.charCodeAt(0) - 1;
  
  window.APPS = AppList.all().all;
  
  window.APPS.sort(function(a, b) {
    return a.name > b.name ? 1 : -1; 
  })
  .forEach(function(app) {
    var appCharCode = app.name.toUpperCase().charCodeAt(0);
    for(var i = 1, difference = appCharCode - currentCharCode; i <= difference; i++) {
      addLetter(currentCharCode + i);
    }
    currentCharCode = appCharCode;
    apps.push(app);
    
  });
  
  //if names ended before Z, add everything up to Z
  for(var i = currentCharCode + 1; i <= 'Z'.charCodeAt(0); i++) {
    addLetter(i); 
  }
  
  function addLetter(code) {
    var letter = String.fromCharCode(code);
    apps.push({
      isLetter: true,
      letter: letter
    });
    letters.push(letter);
  }
  
  //letters are shorter, everything else is 52 pixels
  $scope.getItemHeight = function(item) {
    return item.isLetter ? 40 : 100;
  };
  $scope.getItemWidth = function(item) {
    return '100%';
  };
  
  $scope.scrollBottom = function() {
    $ionicScrollDelegate.scrollBottom(true); 
  };
  
  var letterHasMatch = {};
  $scope.getApps = function() {
    letterHasMatch = {};
    //Filter contacts by $scope.search
    //Additionally, filter letters so that they only showif there is one or more matching contact
    return apps.filter(function(item) {
      var itemDoesMatch = !$scope.properties.search || item.isLetter || item.name.toLowerCase().indexOf($scope.properties.search.toLowerCase()) > -1;
      //Mark this app's name letter as 'has a match'
      if (!item.isLetter && itemDoesMatch) {
        var letter = item.name.charAt(0).toUpperCase();
        letterHasMatch[letter] = true;
      }
      
      return itemDoesMatch;
    }).filter(function(item) {
      //finally, re-filter all of the letters and take out ones that don't have a match
      if (item.isLetter && !letterHasMatch[item.letter]) {
        return false; 
      }
      return true;
    });
  };
  
  $scope.clearSearch = function() {
    $scope.properties.search = ''; 
  };
  
  //infinite scrolling
  $scope.properties.itemsToDisplay = 10;
  $scope.properties.canLoadMore = true;
  $scope.loadMore = function() {
    
    if (apps.length > $scope.properties.itemsToDisplay) {
      $scope.properties.itemsToDisplay += 10;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }
    else {
      $scope.properties.canLoadMore = false;
    }
  };
  
}])

.controller('CategoryCtrl', ['$scope', '$stateParams', 'AppList', function($scope, $stateParams, AppList) {
  
  $scope.properties = {};
  $scope.properties.navTitle = 'Categories';
  $scope.properties.hideBackButton = true;
  
  $scope.categoryApps = AppList.get($stateParams.categoryId);
  $scope.properties.itemsToDisplay = 10;
  $scope.properties.canLoadMore = true;
  $scope.loadMore = function() {
    
    if ($scope.categoryApps.length > $scope.properties.itemsToDisplay) {
      $scope.properties.itemsToDisplay += 5;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }
    else {
      $scope.properties.canLoadMore = false;
    }
  };
}])

.controller('ReviewsCtrl', ['$scope', 'storage', function($scope, storage) {
  $scope.properties = {
    navTitle: 'Reviews',
    reviews: storage.getLocalItem('reviews')
  };
  
  
  
}])

.controller('SettingsCtrl', ['$scope', '$ionicLoading', '$timeout', 'storage', function($scope, $ionicLoading, $timeout, storage) {
  $scope.settings = {
    notifications: {
      on: storage.getLocalItem('notifications') ? true : false,
      registered: false
    },
    searchSettings: {
      limit: 0 
    },
    langauge: 'en'
  };
  
  $scope.registerDevice = function() {
    //emulate this for now..
    $ionicLoading.show({ content: '<p>registering device....</p>' });
    $timeout(function() {
      $scope.settings.notifications.registered = true;
      $ionicLoading.hide();
    },2000);
  }; 
  
  $scope.deregisterDevice = function() {
    //emulate this for now..
    $ionicLoading.show({ content: '<p>De-registering device....</p>' });
    $timeout(function() {
      $scope.settings.notifications.registered = false;
      $ionicLoading.hide();
    },2000);
  };
  
}])

.controller('FavouritesCtrl', ['$scope', 'storage', function($scope, storage) {
  $scope.properties = {};
  $scope.properties.navTitle = 'Favourites';
  $scope.properties.favourites = storage.getLocalItem('favourites') || 0;
  
  $scope.removeThis = function(item) {
    var newFavourites = [];
    $scope.properties.favourites.some(function(data, index, array) {
      if (data.id != item.id)
        newFavourites.push(data);
      //console.log(data.id);
    });
    $scope.properties.favourites = newFavourites;
    storage.setLocalItem('favourites', newFavourites);
    
  };
  
  $scope.shareThis = function(item) {
  };
  
}])

.controller('ProfileCtrl', ['$scope', function($scope) {
  $scope.navTitle = 'User Profile';
  
}])

.controller('InstallCtrl', function($scope, $ionicModal, $ionicLoading, $timeout, $stateParams, AppStore, AppList, storage, $ionicSideMenuDelegate, $window) {
  $scope.properties = {};
  $scope.properties.favBtn = true;
  $scope.properties.favItems = storage.getLocalItem('favourites') || [];
  
  $scope.viewAll = function(app) {
    app.textLength = 9999;
    $('#readmoretext').fadeOut();
  };
  
  //get resource from API then update view with fetched resource
  $ionicLoading.show();
  $scope.applist = AppList.all();
  $scope.appInfo = {};
  $timeout(function() {
    AppStore.fetchApp($stateParams.appId).then(function(resp) {
      //console.log(resp);
      $scope.appInfo.app = resp;
      //append textLength to text info
      //then look at the appended text and examine ht filees\
      $scope.appInfo.app.textLength = 200;
      $scope.appInfo.similar = [];

      angular.forEach($scope.applist.all, function(data,i) {

        if (data.category_id == $scope.appInfo.app.category_id) {
          $scope.appInfo.similar.push(data);
          $scope.appInfo.app.category = data.category;
        }
        else if ($scope.properties.favItems[i] && $scope.properties.favItems[i].id == $scope.appInfo.app.id) {
          $scope.properties.favBtn = false;
        }
      });

      $ionicLoading.hide();

    }, function(err) {
      console.log(err);
    });
  
  }, 1000);

  $ionicModal.fromTemplateUrl('templates/review.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.reviewModal = modal;
  });
  
  $scope.addReview = function() {
    $scope.reviewModal.show();
  };
  
  $scope.closeReview = function() {
    $scope.reviewModal.hide();
  };
  
  $scope.submitReview = function() {
    $ionicLoading.show();
    $timeout(function() {
      $ionicLoading.hide();
      $scope.reviewModal.hide();
      
    }, 3000);
  };
  
  $scope.openLink = function(url) {
    //Todo
    // initialize the appstore app installed on the users device..
    console.log(url);
    //window.open here
    $window.open(url, '_blank', 'location=yes');
  };
  
  
  $scope.favouriteThis = function(appname) {
    appname.category = $scope.appInfo.app.category;
    $scope.properties.favItems.push(appname);
    
    storage.setLocalItem('favourites', $scope.properties.favItems);
    
    $scope.properties.favBtn = false;
  };
  
  
  $scope.shareThis = function(appname) {
    var message = 'Hey fam, I just downloaded the ' + appname.name + ' app, please check it out',
      image = $scope.env.url + appname.icon,
      link = 'http://mvaappstore.com/api/application/' + appname.name;
    $window.plugins.socialsharing
      .shareViaFacebook(message, image, link)
      .then(function(result) {
        $window.navigator.notification.alert(result);
      }, function(err) {
        $window.navigator.notification.alert('An error has occured' + err);
      })
      .shareViaTwitter(message, image, link)
      .then(function(result) {
        $window.navigator.notification.alert(result);
      }, function(err) {
        $window.navigator.notification.alert('An error has occured' + err);
      })
      .shareViaWhatsApp(message, image, link)
      .then(function(result) {
         $window.navigator.notification.alert(result);
      }, function(err) {
        $window.navigator.notification.alert('An error has occured' + err);
      });
  };
  
  $scope.toggleDevMenu = function(team) {
    //Todo: Get team data into mva-devs menu list content directives
    $ionicSideMenuDelegate.toggleRight();
  };
  
  $scope.$on('$destroy', function() {
    $scope.reviewModal.remove();
  });
  
})

.controller('SearchCtrl', ['$scope', 'AppList', '$ionicLoading', '$timeout', 'search', function($scope, AppList, $ionicLoading, $timeout, search) {
  $scope.properties = {};
  $scope.searchResults = [];
  $scope.properties.searchStatus = 2; //2 = default, 0 = no result, 1 = network error
  $scope.doSearch = function() {
    $ionicLoading.show();
    $timeout(function() {
      //$http promise
      search.get($scope.properties.search).then(function(result) {
        if (!result.length > 0) {
          $scope.properties.searchStatus = 0;
        }
        //update searchResults
        $scope.properties.searchStatus = 2;
      }).catch(function(e) {
        $scope.properties.searchStatus = 1;
      }).finally(function(e) {
        $ionicLoading.hide();
      });
    }, 1000);
  };
  
  $scope.clearSearch = function() {
    $scope.properties.search = '';
  };  
}])

.controller('MoreCtrl', ['$scope', '$stateParams', '$timeout', 'storage', function($scope, $stateParams, $timeout, storage) {
  
  $scope.applist = storage.getLocalItem('applist');
  switch($stateParams.categoryname) {
    case 'Recommended':
      $scope.appData = $scope.applist.recommended;
      break;
    case 'Featured':
      $scope.appData = $scope.applist.featured;
      break;
    case 'Prerelease':
      $scope.appData = $scope.applist.prerelease;
      break;
    case 'Top Rated':
      $scope.appData = $scope.applist.won;
      break;
  }
  //render
  $scope.properties = {};
  $scope.properties.navTitle = 'Explore More';
  $scope.properties.categoryname = $stateParams.categoryname;
  
  $scope.properties.itemsToDisplay = 10;
  $scope.properties.canLoadMore = true;
  $scope.loadMore = function() {
    
    if ($scope.appData.length > $scope.properties.itemsToDisplay) {
      $scope.properties.itemsToDisplay += 5;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }
    else {
      $scope.properties.canLoadMore = false;
    }
  };
  
}])

.controller('InitCtrl', ['$rootScope', '$scope', '$state', '$ionicLoading', '$timeout', 'storage', 'AppStore', 'ENV', function($rootScope, $scope, $state, $ionicLoading, $timeout, storage, AppStore, ENV) {
  //check if first run
  if (storage.getLocalItem('firstRun')) {
    $state.go('app.lunch');
  }
  else {
    $scope.properties = {};
    $scope.properties.navTitle = 'loading dashboard...';
    $scope.properties.hideRefreshButton = true;
    $rootScope.env = ENV;

    $scope.getApps = function() {
      $ionicLoading.show();
      AppStore.fetch().then(function(resp) {

        var _applist = resp[0];
        $scope.catlist = resp[1];
        $rootScope.slideShow = resp[2];
        $scope.applist = {
          featured: [],
          testing: [],
          won: [],
          recommended: [],
          prerelease: [],
          all: {}
        };

        angular.forEach(_applist, function(apps, i) {

          //append categoryName not available in API. Remove in future for performance
          _applist[i].group = _applist[i].name.charAt(0);
          switch (_applist[i].category_id) {
            case 1:
                _applist[i].category = 'Games';
                break;

            case 2:
                _applist[i].category = 'Life Style';
                break;

            case 21:
                _applist[i].category = 'Media & Social Networking';
                break;

            case 19:
                _applist[i].category = 'Children & Teens';
                break;

            case 20:
                _applist[i].category = 'Education';
                break;

            case 17:
                _applist[i].category = 'Church Management';
                break;

            case 16:
                _applist[i].category = 'Utility';
                break;

            case 22:
                _applist[i].category = 'Communications';
                break;

            case 23:
                _applist[i].category = 'Pre Releases';
                break;
          }

          //split into groups
          if (apps.featured === 1) {
            $scope.applist.featured.push(_applist[i]);
          }
          if (apps.testing === 1) {
            $scope.applist.testing.push(_applist[i]);
          }
          if (apps.won === 1) {
            $scope.applist.won.push(_applist[i]);
          }
          if (apps.recommended === 1) {
            $scope.applist.recommended.push(_applist[i]);
          }
          if (apps.prerelease === 1) {
            $scope.applist.prerelease.push(_applist[i]);
          }
        });

        $scope.applist.all = _applist;
        storage.setLocalItem('applist', $scope.applist);
        storage.setLocalItem('catlist', $scope.catlist);

        //Small garbage collection
        _applist = null;

        $state.go('app.explore');
      },
      function(err) {
        $scope.properties.navTitle = 'Network Error';
        $scope.properties.hideRefreshButton = !$scope.properties.hideRefreshButton;
        console.log(err);
      }).finally(function() {
        $timeout(function() {
          $ionicLoading.hide();
        }, 500);
      });
    };

    $scope.reload = function() {
      $scope.properties.navTitle = 'loading Dashboard...';
      $scope.properties.hideRefreshButton = true;
      $scope.getApps();
    };

    $scope.getApps();
  }
}])

.controller('rateThis', function($scope) {
})

.controller('ExploreCtrl', ['$scope', 'storage', '$timeout', '$ionicLoading', function($scope, storage, $timeout, $ionicLoading) {
  //scopes
  $scope.properties = {};
  $scope.properties.navTitle = 'MVA Appstore';
  $scope.properties.hideBackButton = true;
  
  $ionicLoading.show();
  $timeout(function() {
    $scope.applist = storage.getLocalItem('applist');
    $ionicLoading.hide();
  }, 1000);
//  $scope.randomSort = function(array) {
//    return Shuffle.shuffleArray(array);
//  };
  
  //Renderers
//  $scope.featuredSwiper = function() {
//    jQuery('.slider-bar').swiper({
//      centeredSlides: false,
//      slidesPerView: 'auto',
//      initialSlide: 2,
//      tdFlow: {
//        rotate: 10,
//        stretch: 30,
//        dept: 150
//      }
//    });
//  };
  
  //$scope.featuredSwiper();
  
//  $scope.doSearch = function() {
//    console.log($scope.search.query);
//    $state.go('app.search');
//  };
  
}]);
