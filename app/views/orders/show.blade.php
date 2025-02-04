@extends('layout')

@section('header')

    @include('header' , [ 'css' => [
    'library/assets/bootstrap-fileupload/bootstrap-fileupload.css',
    'library/assets/dropzone/css/dropzone.css'
    ]
    ]
    )

@stop

@section('sidebar_left')

@include('sidebar_left')

@stop

@section('content')

<!-- page start-->
<div ng-app="orders">
	<div class="row"  ng-controller="ShowController" ng-init="generateAuthPermissions({{ \Auth::user()->role_id; }})">
		<aside class="profile-nav col-lg-3">
			<section class="panel">
				<div class="user-heading round">
					<h1>{{ $order->id }}</h1>
					@if(!empty($order->supplier))
						<p> Proveedor </p>
						<p>{{ $order->supplier->name }}</p>
					@endif
				</div>

				<ul class="nav nav-pills nav-stacked">
					<!--<li class="active"><a href="profile.html"> <i class="fa fa-user"></i>Paquete</a></li>-->
					<li ng-if="$root.auth_permissions.update.order" ><a href="{{ route('orders.edit' , [ $order->id ]) }}"> <i class="fa fa-edit"></i> Editar pedido</a></li>
				</ul>

			</section>
		</aside>
		<aside class="profile-info col-lg-9">

	                      <section class="panel" >
	                      	<div class="panel-heading">
	                      		<h2>Datos del pedido. </h2>
	                      	</div>
	                      	<div class="panel-body bio-graph-info">
	                      		<div class="row">
	                      			<div class="col-sm-6">
	                      				<span class="col-sm-6">Id </span><p class="col-sm-6"> {{ $order->id }}</p>
	                      			</div>
	                      			@if(!empty($order->user->name))
	                      			<div class="col-sm-6">
	                      				<span class="col-sm-6">Usuario que realizo el pedido </span><p class="col-sm-6"> {{ $order->user->name }}</p>
	                      			</div>
	                      			@endif
	                      			@if(!empty($order->supplier))
	                      			<div class="col-sm-6">
	                      				<span class="col-sm-6">Proveedor</span><p class="col-sm-6"> {{ $order->supplier->name }}</p>
	                      			</div>
	                      			@endif
	                      			<div class="col-sm-6">
	                      				<span class="col-sm-6">Total</span><p class="col-sm-6"> {{ "<?php echo $order->total ?>" | currency }}</p>
	                      			</div>
	                      		</div>
	                      	</div>
	                      </section>

	                      @if(!empty($order->products))
	                      <section class="panel" >
	                      	<div class="panel-heading">
	                      		<h3>Productos. </h3>
	                      	</div>
	                      </section>
	                      <section>
	                          <div class="row directory-info-row">
	                          	@foreach($order->products as $product )
	                              <div class="col-md-6 ">
	                                  <div class="panel">
	                                      <div class="panel-body">
	                                          <div class="bio-chart ">
	                                              <img src="{{ $product->image_url}}" class="img-responsive thumb media-object" />
	                                          </div>
	                                          <div class="bio-desk">
	                                              <h4 class="red">{{ $product->name }}</h4>
	                                              <p>{{ $product->key }}</p>
	                                              <p>{{ $product->model }}</p>
	                                              <p>Cantidad: {{ $product->pivot->quantity }}</p>
	                                              <p>Status: {{ $product->pivot->status }}</p>
	                                          </div>
	                                      </div>
	                                  </div>
	                              </div>
	                            @endforeach
	                          </div>
	                      </section>
	                      @endif
	                  </aside>
	              </div>
	            </div>
              <!-- page end-->

              @stop

              @section('sidebar_right')

              	@include('sidebar_right')

              @stop

@section('footer')

    @include('footer', ['js' => [
            'library/js/ng/orders.js',
            'library/js/ng/orders.controllers.js',
            'library/js/ng/orders.services.js',
            'library/js/ng/products.services.js',
            'library/js/ng/suppliers.services.js',
            'library/js/ng/users.filters.js',
            'library/js/ng/directives.js',
            'library/js/jquery-ui-1.9.2.custom.min.js' ,
            'library/assets/bootstrap-fileupload/bootstrap-fileupload.js',


            /*new product */
            'library/js/ng/products.filters.js',
            'library/js/ng/products.services.js',
            'library/js/ng/suppliers.services.js',
            'library/js/ng/colors.services.js',
            'library/assets/dropzone/dropzone.js',
            'library/js/jquery.validate.min.js'


            /*new product */
    ]
    ]
    )


@stop