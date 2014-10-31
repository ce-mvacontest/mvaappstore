'use strict';

angular.module('MvaAppstore.services', ['ngResource'])

.service('AppStore', ['$q', '$resource', '$http', function($q, $resource, $http) {
//  var url = 'http://mvaappstore.com/api/';
//  
//  return {
//    fetch: function(params) {
//      console.log("working...");
//      return $http.jsonp(url + params + '?callback=JSON_CALLBACK');
//    }
//  }
  var url = 'http://mvaappstore.com/api/';
  
  return {
    fetch: function() {
//      var applications = $http.get(url + 'applications.json?callback=JSON_CALLBACK'),
//          categories = $http.get(url + 'categories.json?callback=JSON_CALLBACK');
      var applications = $http.get(url + 'applications/?callback=JSON_CALLBACK'),
          categories = $http.get(url + 'categories/?callback=JSON_CALLBACK'),
          slideShow = $http.get(url + 'photos/q/slides/?callback=JSON_CALLBACK');
      
      var q = $q.all([applications, categories, slideShow]).then(function(result) {
        var tmp = [];
        angular.forEach(result, function(response) {
          tmp.push(response.data);
        });
        return tmp;
      }).then(function(result) {
        return result;
      });
      
      return q;
    },
    
    fetchApp: function(appId) {
      var deferred = $q.defer();
      $http.get(url + 'applications/'+appId+'?callback=JSON_CALLBACK')
      .success(function(data) {
        deferred.resolve(data);
      })
      .error(function(e) {
        deferred.reject(e);
      });
      return deferred.promise;
    }
  };
  
}])

.service('search', ['$q', '$http', 'ENV', function($q, $http, ENV) {
  return {
    get: function(query) {
      var deferred = $q.defer();
      $http.get(ENV.api + '/?q=' + query)
      .success(function(data) {
        deferred.resolve(data);
      })
      .error(function(e) {
        deferred.reject(e);
      });
      return deferred.promise;
    }
  };
}])

.service('Apps', ['$q', '$http', function($q, $http) {
  return {get: function(id) {
    var url = 'http://mvaappstore.com/api/application/' + id;
    var deferred = $q.defer();
    $http.get(url)
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(e){
      deferred.reject(e);
    });
    return deferred.promise;
  }};
}])

.service('AppList', ['storage', function(storage) {
  var dataSource = storage.getLocalItem('applist');
  //var self = this;
  return {
    all: function() {
      return dataSource;
    },
    get: function(catId) {
      var items = [];
      for(var i=0, l = dataSource.all.length; i < l; i++){
        if (dataSource.all[i].category_id == catId) {
          items.push(dataSource.all[i]);
        }
      }
      return items;
    }
  };
  
}])

.service('CatList', ['storage', function(storage) {
  var dataSource = storage.getLocalItem('catlist');
  return {
    all: function() {
      return dataSource;
    },
    get: function(catId) {
      var items = [];
      for (var i=0, l = dataSource.all.length; i < l; i++) {
        if (dataSource.all[i].category_id == catId) {
          items.push(dataSource.all[i]);
        }
      }
      return items;
    }
  };
}])

.service('Shuffle', function() {
  /* Fisher-Yates Shuffle Algorithm */
  return {
    shuffleArray: function(array) {
      var m = array.length, t, i;
      while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }
    }
  };
})

.service('storage', function() {
  var db = window.localStorage;
  var getLocalItem = function(tableName) {
    return angular.fromJson(db.getItem(tableName));
  };
      
  var setLocalItem = function(tableName, items) {
      db.setItem(tableName, angular.toJson(items));
  };
  
  return {
    getLocalItem: getLocalItem,
    setLocalItem: setLocalItem
  };
});