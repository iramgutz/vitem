(function () {

  angular.module('products.controllers', [])

    .controller('ProductsController', ['$scope', '$filter' , 'ProductsService' , function ($scope ,  $filter , ProductsService ) {

        $scope.find = '';
        $scope.status = '';
        $scope.sort = 'id';
        $scope.reverse = false;
        $scope.pagination = true;
        $scope.page = 1;
        $scope.perPage = 50;
        $scope.optionsPerPage = [ 5, 10, 15 , 20 , 30, 40, 50, 100 ];
        $scope.viewGrid = 'list';
        $scope.productsAll = false;

        /*Generar XLS */

        $scope.filename = 'reporte_productos';

        $scope.dataExport = false;

        $scope.headersExport = JSON.stringify([
          {
            field : 'id',
            label : 'Id'
          },
          {
            field : 'key',
            label : 'Código'
          },
          {
            field : 'name',
            label : 'Nombre'
          },
          {
            field : 'username',
            label : 'Nombre de usuario'
          },
          {
            field : {
              role : 'name'
            },
            label : 'Tipo de usuario'
          },
          {
            field : {
              store : 'name'
            },
            label : 'Sucursal'
          },
          {
            field : {
              employee : 'salary'
            },
            label : 'Salario'
          },
          {
            field : {
              employee : 'entry_date'
            },
            label : 'Fecha de ingreso'
          },
          {
            field : 'email',
            label : 'Correo electrónico'
          },
          {
            field : 'phone',
            label : 'Teléfono'
          },
          {
            field : 'address',
            label : 'Dirección'
          },
          {
            field : 'street',
            label : 'Calle'
          },
          {
            field : 'outer_number',
            label : 'Número exterior'
          },
          {
            field : 'inner_number',
            label : 'Número interior'
          },
          {
            field : 'zip_code',
            label : 'Código postal'
          },
          {
            field : 'colony',
            label : 'Colonia'
          },
          {
            field : 'city',
            label : 'Ciudad'
          },
          {
            field : 'state',
            label : 'Estado'
          },
        ]);

        $scope.generateJSONDataExport = function( data )
        {

          return JSON.stringify(data);

        }

        /*Generar XLS */

        $scope.init = function()
        {

          ProductsService.API(

            'find',
            {
              page : $scope.page ,
              perPage : $scope.perPage ,
              find : $scope.find ,
              status : $scope.status

            }).then(function (data) {

                $scope.productsP = data.data;

                $scope.total = data.total;

                $scope.pages = Math.ceil( $scope.total / $scope.perPage );

            });

        }

        $scope.init();



        ProductsService.all().then(function (data) {

          $scope.productsAll = data;

          $scope.products = data;

          /*Generar XLS */

          $scope.dataExport = $scope.generateJSONDataExport($scope.products);

          /*Generar XLS */

          $scope.search(true);

          $scope.paginate();

          //$scope.paginate(1);

        });



        $scope.paginate = function( p )
        {
          if($scope.pagination)
          {

            if(p)
              $scope.page = parseInt(p);

            if(!$scope.productsAll)
            {

              $scope.init();

            }
            else
            {

              $scope.total = $scope.products.length;

              $scope.pages = Math.ceil( $scope.total / $scope.perPage );

              $scope.productsP = $scope.products.slice( ( ($scope.page -1) *  $scope.perPage ) , ($scope.page *  $scope.perPage ) );

            }

          }
          else
          {
            $scope.productsP = $scope.products
          }
        }



        $scope.search = function ( init )
        {

          if(!$scope.productsAll)
          {

            $scope.init();

          }
          else
          {

            $scope.products = ProductsService.search($scope.find , $scope.productsAll , $scope.status );

            /*Generar XLS */

            $scope.dataExport = $scope.generateJSONDataExport($scope.products);

            /*Generar XLS */

          }

          if(!init){

            $scope.paginate(1);

          }

        }

        $scope.clear = function ()
        {
          $scope.find = '';
          $scope.type = '';
          $scope.status = '';
          $scope.sort = 'id';
          $scope.reverse = false;
          $scope.products = $scope.productsAll;
          $scope.paginate(1);
          $scope.modal = false;

        }


    }])

    .controller('FormController', [ '$scope' , 'SuppliersService'  , 'SegmentService', 'ProductsService', 'CatalogService', function ($scope , SuppliersService , SegmentService , ProductsService , CatalogService ) {

      $scope.status = 'No disponible';
      $scope.find = '';
      $scope.autocomplete = false;
      $scope.supplierSelected = {};

      SuppliersService.all().then(function (data) {

        $scope.countriesAll = data;

      });



      $scope.checkValuePreOrOld = function (pre , old , def)
      {
          if(!def)
              def = '';

          var value = def;

          if(pre)
              value = pre;

          if(old)
              value = old;

          return value;


            }
        $scope.search = function ()
        {

            if($scope.find.length != '')
            {
                $scope.suppliers = SuppliersService.search($scope.find , $scope.countriesAll , 1 );

                $scope.autocomplete = true;

            }else{

                $scope.suppliers = {};

                $scope.autocomplete = false;

            }


        }

        $scope.addAutocomplete = function(supplier)
        {


            $scope.find = supplier.name;

            $scope.supplierSelected = supplier;

            $scope.autocomplete = false;

            return false;
        }

        $scope.hideItems = function ()
        {
            window.setTimeout(function() {

                $scope.$apply(function() {

                    $scope.autocomplete = false;

                });

            }, 300);

        }

        $scope.supplierSelectedInit = function (id)
        {

          SuppliersService.findById(id).then(function (data) {

            $scope.supplierSelected = data;

            $scope.newSupplier = false;

            $scope.find = $scope.supplierSelected.name ;

          });



        }

        $scope.cost = '';

        $scope.percent_gain = '';

        $scope.suggested_price = ''

        $scope.calculatePrice = function()
        {


          if($scope.cost && $scope.percent_gain)
          {

            $scope.suggested_price = parseFloat( ($scope.cost*$scope.percent_gain)/100 ) + parseFloat($scope.cost);

          }

          $scope.assignSuggestedPrice();

        }

        $scope.assignSuggestedPrice = function()
        {

          if($scope.suggested_price_active && $scope.suggested_price)
          {

            $scope.price = $scope.suggested_price;

          }

        }

        $scope.calculateTotalStock = function()
        {

          var stock = $scope.stock;

          var total_stock = 0;

          angular.forEach($scope.stores, function(store, key) {

            total_stock += parseInt(store.quantity);

          });

          $scope.total_stock = total_stock;

          console.log($scope.total_stock);


        }

        $scope.checkQuantityByStore = function(store_id)
        {

          quantity = $scope.ProductStore[store_id].quantity;

          if(!isNaN(quantity) )
          {

            if($scope.restrict == 1)
            {
              var stock = $scope.stock;

              var pre = $scope.ProductStore[store_id].quantity_pre;

              var init = $scope.ProductStore[store_id].quantity_init;

              var diff = parseInt(quantity) - parseInt(pre);

              stock -= diff;

              if(stock <= 0)
              {

                quantity = quantity + stock;

                stock = 0;

              }

              $scope.stock = stock;

            }

          }
          else
          {
            quantity = $scope.ProductStore[store_id].quantity_init;
          }

          $scope.ProductStore[store_id].quantity_pre = quantity;

          $scope.ProductStore[store_id].quantity = quantity;

        }

        $scope.min = 0;

        $scope.quantity_segment = 0;

        $scope.allSegments = [];

        $scope.initSegments = function(product_id)
        {

          var product_id = product_id || false;

          SegmentService.API('all')
            .then(function(segments){

              if(!$scope.allSegments.length && !$scope.segments.length)
              {

                $scope.allSegments = segments;

              }

              if(product_id){
                ProductsService.API('getSegmentProduct' , { id : product_id})
                  .then(function (segmentsP) {

                    angular.forEach(segmentsP , function(c , i) {

                      if($scope.allSegments){

                        $scope.addSegmentI(c);
                      }
                      else
                      {
                        SegmentService.API('all')
                          .then(function(segments){ console.log('aqui')

                            $scope.allSegments = segments;

                            $scope.addSegmentI(c);

                          })
                      }

                    });


                  })
              }

            })
        }

        $scope.addSegmentI = function(segmentI)
        {
          var segment = false;

          angular.forEach($scope.allSegments , function(c , i){

            if(c.id == segmentI.id)
            {
              segment = c;

              segment.segment_id = i;
            }

          });

          if(segment)
          {

            segment.quantity = segmentI.pivot.quantity;

            $scope.segments.push(segment);

            $scope.allSegments.splice( segment.segment_id , 1);

            $scope.selectSegments = false;

            $scope.quantity_segment = 0;

          }
        }

        $scope.calculateMin = function()
        {

          var min = 0;

          if($scope.stock < 1){
            min = 0;
          }

          $scope.min = min;

        }

        $scope.segments = [];

        $scope.addSegment = function()
        {
          var segment = false;

          angular.forEach($scope.allSegments , function(c , i){

            if(c.id == $scope.selectSegments)
            {
              segment = c;

              segment.segment_id = i;
            }

          })

          if(segment)
          {

            segment.quantity = $scope.quantity_segment;

            $scope.segments.push(segment);

            $scope.allSegments.splice( segment.segment_id , 1);

            $scope.selectSegments = false;

            $scope.quantity_segment = 0;

          }
        }

        $scope.validAddSegment = function()
        {

          return !($scope.stock && $scope.selectSegments && $scope.quantity_segment >= 0) ? true : false ;
        }

        $scope.stock = 0;

        $scope.calculateMax = function()
        {

          var max = $scope.stock;

          angular.forEach($scope.segments , function (segment , i) {
            max -= segment.quantity;
            if(max < 0)
              max = 0;
          })

          return max;

        }
        $scope.calculateNotAssigned = function()
        {

          var max = $scope.stock;

          angular.forEach($scope.segments , function (segment , i) {
            max -= segment.quantity;
            /*if(max < 0)
              max = 0;*/
          })

          return max;

        }

        $scope.removeSegment = function(segment)
        {
          var segment_key = false;

          angular.forEach($scope.segments , function(c , i ){
            if(c.id == segment.id)
              segment_key = i
          })


          if(segment_key >= 0)
          {

            $scope.allSegments.push(segment);

            $scope.segments.splice(segment_key , 1);

          }


        }

        $scope.updateSegment = function(segment)
        {

          var segment_key = false;

          angular.forEach($scope.segments , function(c , i ){
            if(c.id == segment.id)
              segment_key = i
          })


          if(segment_key >= 0)
          {
            $scope.allSegments.push(segment);

            $scope.selectSegments = segment.id;

            $scope.quantity_segment = segment.quantity;

            $scope.segments.splice(segment_key , 1);
          }

        }

        $scope.notSegment = false;

        SegmentService.

          API('getNotAssignedId')

          .then(function(segment) {

            $scope.notSegment = segment;

            $scope.notSegment.quantity = $scope.stock;

          })

        $scope.segmentsOld = [];

        $scope.getSegmentsOld = function(){

          SegmentService.API('all')
            .then(function(segments){

              $scope.allSegments = segments;

              angular.forEach($scope.segmentsOld , function(segment , i) {

                if(segment.segment_id != $scope.notSegment.id)
                {
                    $scope.addSegmentInit(segment)
                }

              });

            })

        }

        $scope.addSegmentInit = function(segmentInit)
        {

          var segment = false;

          angular.forEach($scope.allSegments , function(c , i){

            if(c.id == parseInt(segmentInit.segment_id))
            {
              segment = c;

              segment.segment_id = i;
            }

          })

          if(segment)
          {

            segment.quantity = segmentInit.quantity;

            $scope.segments.push(segment);

            angular.forEach($scope.allSegments , function(c , i ){

              if(segment.slug == c.slug)
              {
                console.log(segment)

                $scope.allSegments.splice( i , 1);

              }

            })

          }
        }

          /* NEW SEGMENT */

          $scope.catalogs = [];

          $scope.clearCatalogs = [];

          $scope.items = [];

          $scope.CatalogItem = [];

          $scope.catalog = '';

          $scope.item = '';

          $scope.name = '';

          CatalogService.API('all').then(function(catalogs){

              $scope.catalogs = catalogs;

              $scope.clearCatalogs = angular.copy($scope.catalogs);

          });

          $scope.getCatalogItems = function()
          {

              $scope.items = $scope.catalog.items;
          }

          $scope.addCatalogItem = function()
          {
              var item = {
                  catalog : $scope.catalog,
                  item : $scope.item
              };

              angular.forEach($scope.catalogs , function(catalog , c){

                  if(catalog.id == item.catalog.id)
                  {
                      $scope.catalogs.splice(c, 1);
                  }
              });

              $scope.items = [];

              $scope.catalog = '';

              $scope.item = '';

              var nameBeforeAdd = '';

              angular.forEach($scope.CatalogItem, function(item){

                  if(nameBeforeAdd != '')
                  {
                      nameBeforeAdd += ', ';
                  }
                  nameBeforeAdd += item.item.name;
              });

              $scope.CatalogItem.push(item);

              var nameAfterAdd = '';

              angular.forEach($scope.CatalogItem, function(item){

                  if(nameAfterAdd != '')
                  {
                      nameAfterAdd += ', ';
                  }
                  nameAfterAdd += item.item.name;
              });

              if(nameBeforeAdd == $scope.name || $scope.name == '')
              {
                  $scope.name = nameAfterAdd;
              }

          }

          $scope.removeCatalogItem = function(k , item)
          {

              var nameBeforeAdd = '';

              angular.forEach($scope.CatalogItem, function(item){

                  if(nameBeforeAdd != '')
                  {
                      nameBeforeAdd += ', ';
                  }
                  nameBeforeAdd += item.item.name;
              });

              $scope.CatalogItem.splice(k,1);

              var nameAfterAdd = '';

              angular.forEach($scope.CatalogItem, function(item){

                  if(nameAfterAdd != '')
                  {
                      nameAfterAdd += ', ';
                  }
                  nameAfterAdd += item.item.name;
              });

              if(nameBeforeAdd == $scope.name || $scope.name == '')
              {
                  $scope.name = nameAfterAdd;
              }

              $scope.catalogs.push(item.catalog);
          }

          $scope.reset = function()
          {
              $scope.CatalogItem = [];

              $scope.catalogs = angular.copy($scope.clearCatalogs);

              console.log($scope.catalogs);
          }

          $scope.newSegment = function()
          {

              var segment = {

                  'name' : $scope.name,

                  'CatalogItem' : []

              };

              angular.forEach($scope.CatalogItem , function(item){

                  segment.CatalogItem.push(item.item.id)

              });

              SegmentService.add(segment)
                  .then(function(data){

                      if(data.hasOwnProperty('success'))
                      {

                          $scope.reset();

                          $scope.name = '';

                          if(data.new)
                          {
                              $scope.allSegments.push(data.segment);
                          }

                          $scope.selectSegments = data.segment.id;

                          $scope.addSegment();

                          $(".close_modal").click();

                      }

                  })
          }

          /* NEW SEGMENT */

    }])

    .controller('ShowController', ['$scope', '$filter' , 'SalesService', function ($scope ,  $filter , SalesService) {

        $scope.tab = 'profile';
        $scope.find = '';
        $scope.sale_type = '';
        $scope.pay_type = '';
        $scope.sort = 'id';
        $scope.reverse = false;
        $scope.pagination = true;
        $scope.page = 1;
        $scope.perPage = 10;
        $scope.optionsPerPage = [ 5, 10, 15 , 20 , 30, 40, 50, 100 ];
        $scope.viewGrid = 'list';
        $scope.operatorSaleDate = '';
        $scope.saleDate = '';
        $scope.dateOptions = {

            dateFormat: "yy-mm-dd",
            prevText: '<',
            nextText: '>',
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            dayNames: ['Domingo', 'Lunes', 'Martes', 'MIercoles', 'Jueves', 'Viernes', 'Sábado'],
            dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
            dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
        };

        $scope.init = function(product_id)
        {

          $scope.product_id = product_id;

          SalesService.API(

            'findByProduct',
            {
              product_id : product_id ,
              page : $scope.page ,
              perPage : $scope.perPage ,
              find : $scope.find ,
              sale_type : $scope.sale_type ,
              pay_type : $scope.pay_type,
              operatorSaleDate : $scope.operatorSaleDate ,
              saleDate : $scope.saleDate

            }).then(function (data) {

                $scope.salesP = data.data;

                $scope.total = data.total;

                $scope.pages = Math.ceil( $scope.total / $scope.perPage );

            });


        }

        $scope.getByProduct = function()
        {

          SalesService.API(

            'getByProduct',

            {
              product_id : $scope.product_id
            }

          ).then(function (data) {

            $scope.salesAll = data;

            $scope.sales = data;

            $scope.search(true);

            $scope.paginate();

          });
        }

        $scope.paginate = function( p )
        {
          if($scope.pagination)
          {

            if(p)
              $scope.page = parseInt(p);

            if(!$scope.salesAll)
            {

              $scope.init();

            }
            else
            {

              $scope.total = $scope.sales.length;

              $scope.pages = Math.ceil( $scope.total / $scope.perPage );

              $scope.salesP = $scope.sales.slice( ( ($scope.page -1) *  $scope.perPage ) , ($scope.page *  $scope.perPage ) );

            }

          }
          else
          {
            $scope.salesP = $scope.sales
          }
        }



        $scope.search = function ( init )
        { console.log($scope.find);

          if(!$scope.salesAll)
          {

            $scope.init();

          }
          else
          {

            $scope.sales = SalesService.search($scope.find , $scope.salesAll , $scope.sale_type , $scope.pay_type, $scope.operatorSaleDate , $scope.saleDate);


          }

          if(!init){

            $scope.paginate(1);

          }

        }

        $scope.clear = function ()
        {
          $scope.find = '';
          $scope.sale_type = '';
          $scope.pay_type = '';
          $scope.operatorSaleDate = '';
            $scope.saleDate = '';
          $scope.sort = 'id';
          $scope.reverse = false;
          $scope.sales = $scope.salesAll;
          $scope.paginate(1);
          $scope.modal = false;

        }


    }])


})();