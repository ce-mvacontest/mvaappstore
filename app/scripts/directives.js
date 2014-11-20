'use strict';

angular.module('MvaAppstore.directives', [])

.directive('appstoreMenu', function($ionicPopover, CatList, $window) {
  return {
    restrict: 'EA',
    replace: true,
    template: '<div class="bar bar-subheader tabs tabs-icon-left bar-secondary">'
                  +'<a class="tab-item app-category" ng-click="openPopover($event);"><i class="icon ion-androidsort"></i>Category</a>'
                  +'<a href="#/app/explore" class="tab-item app-home"><i class="icon ionhome"></i>Home</a>'
                  +'<a href="#/app/apps" class="tab-item app-apps"><i class="icon ionmap"></i>Apps</a>'
                  +'<a class="tab-item app-blog" ng-click="openLink(\'http://mvacontest.com/blog\')"><i class="icon ion-socialrss"></i>News</a>'
                  +'<a class="tab-item app-contact" ng-click="openLink(\'http://mvacontest.com/contact\')"><i class="icon ion-androidmail"></i>Contact</a>'
              +'</div>',
    scope: {
      activeTabIndex: '=',
      openLink: '&ngClick'
    },
    link: function(scope, element, attrs) {
      element[0].children[scope.$eval(attrs.activeTabIndex)].className += ' active';
      /* Popover */
      $ionicPopover.fromTemplateUrl('templates/popover-category.html', {
        scope: scope
      }).then(function(popover) {
        scope.popover = popover;
        scope.catlist = CatList.all();
      });

      scope.openPopover = function($event) {
        scope.popover.show($event);
      };

      scope.openLink = function(url) {
        $window.open(url, '_blank', 'location=yes');
        
      };
      
      scope.$on('$destroy', function() {
        scope.popover.remove();
      });
    }
  };
})

.directive('mvaRating', function() {
  return {
    restrict: 'EA',
    scope: {
      count: '='
    },
    template: '<div class="stars-small">{{count}}</div>',
    link: function(scope, element, attrs) {
      scope.$watch('count', function(newVal) {
        var _width = Math.max(0, (Math.min(5, parseFloat(newVal)))) * 10;
        //angular.element(element).children('div').html(angular.element('<span />').width(_width));
        element.children('div').html(angular.element('<span />').width(_width));
      });
    }
  };
})

.directive('fadeBar', function($timeout) {
  return {
    restrict: 'E',
    template: '<div class="fade-bar"></div>',
    replace: true,
    link: function($scope, $element, $attr) {
      // Run in the next scope digest
      $timeout(function() {
        // Watch for changes to the openRatio which is a value between 0 and 1 that says how "open" the side menu is
        $scope.$watch('sideMenuController.getOpenRatio()', function(ratio) {
          // Set the transparency of the fade bar
          $element[0].style.opacity = Math.abs(ratio);
        });
      });
    }
  }
});

//.directive('ionSearch', function() {
//  return {
//    restrict: 'E',
//    replace: true,
//    scope: {
//      getData: '&source',
//      model: '=?',
//      search: '=?filter'
//    },
//    link: function(scope, element, attrs) {
//      attrs.minLength = attrs.minLength || 0;
//      scope.placeholder = attrs.placeholder || '';
//      scope.search = { value: '' };
//      
//      if (attrs.class) {
//        element.addClass(attrs.class);
//      }
//      
//      if (attrs.source) {
//        scope.$watch('search.value', function(newValue, oldValue) {
//          if (newValue.length > attrs.minLength) {
//            scope.getData({ query: newValue }).then(function(results) {
//              scope.model = results;
//            }); 
//          } else {
//            scope.model = [];
//          }
//        })
//      }
//      
//      scope.clearSearch = function() {
//        scope.search.value = ''; 
//      };
//    },
//    template: '<div class="item-input-wrapper">'+
//                '<i class="icon ion-android-search"></i>'+
//                '<input type="search" placeholder="{{placeholder}}" ng-model="search.value">'+
//                '<i ng-if="search.value.length > 0" ng-click="clearSearch()" class="icon ion-close"></i>'+
//              '</div>'
//  }
//});
