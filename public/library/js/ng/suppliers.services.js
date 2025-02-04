(function () {

  angular.module('suppliers.services', [])

    .factory('SuppliersService', ['$http', '$q', '$filter' , function ($http, $q , $filter) {
        var normalize = $filter('normalize');

        function all() {
          var deferred = $q.defer();

          $http.get('API/suppliers')
            .success(function (data) {
              deferred.resolve(data);
            });

          return deferred.promise;
        }

        function findById(id)
        {
          var deferred = $q.defer();

          $http.get('API/suppliers/findById?id='+id)
            .success(function (data) {
              deferred.resolve(data);
            });

          return deferred.promise;
        }

        function search(find, suppliersAll , status)
        {

          find = normalize(find);

          var suppliers;

          suppliersAll = findByStatus(status , suppliersAll);

          if(find == '')
              suppliers =  suppliersAll;
            else
            {
              suppliers = suppliersAll.filter(function (user) {
                return normalize(user.id.toString()).indexOf(find) != -1
                  || normalize(user.name).indexOf(find) != -1
                  || normalize(user.email).indexOf(find) != -1;
              });
            }

            return suppliers;
        }

        function findByStatus(status, suppliersAll)
        {

          var suppliers;

          if(status == '')
            suppliers =  suppliersAll;
          else
          {
            suppliers = suppliersAll.filter(function (client)
            {
              return client.status ==  status;
            });
          }

          return suppliers;

        }

        function API( method , params)
        {

          var deferred = $q.defer();

          var url = 'API/suppliers/';

          url += method + '?';

          var count = 0;

          angular.forEach( params , function(value, key) {

            url += key + '=' + value;

            count++;

            if(count < Object.keys(params).length)
            {
              url += '&';
            }

          });

          $http.get(url)
              .success(function (data) {
                deferred.resolve(data);
              });

          return deferred.promise;

        }


      return {
        all: all ,
        findById : findById,
        search : search,
        API : API

      };

    }]);

})();
