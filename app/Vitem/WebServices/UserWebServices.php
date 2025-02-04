<?php namespace Vitem\WebServices;

use Vitem\Filters\ACLFilter;
use Vitem\Repositories\UserRepo;


class UserWebServices extends BaseWebServices {

	/*public function getModel()
	{
		return new User;
	}*/

	static function all(){

		$store_id = (!empty($_GET['store_id'])) ? $_GET['store_id'] : false;

		$return = UserRepo::with(['Employee.commissions', 'Employee', 'Role' , 'Store']);

		$usersPermitted = \ACLFilter::generateAuthCondition();

		if(count($usersPermitted))
		{
			$return->whereIn('id' , $usersPermitted);
		}

		$storesPermitted = \ACLFilter::generateStoreCondition();

		if(count($storesPermitted))
		{
			$return->whereIn('store_id' , $storesPermitted);
		}

		if($store_id)
		{
			$return = $return->where('store_id' , $store_id);

		}

		$users = $return->get();

		return \Response::json($users);
		
	}

	static function getByField()
	{

		$field = (isset($_GET['f'])) ? $_GET['f'] : false;

		$search = (isset($_GET['s'])) ? $_GET['s'] : false;

		if(!$field || !$search)
		{
			return false;
		}

		$users = UserRepo::getByField( $field , $search );

		return \Response::json($users);
	}

	static function getTopSellers()
	{
		$initDefault =time()- (7 * 24 * 60 * 60);

		$endDefault =  time() ;

		$typeDefault =  'total_sales' ;

		$limitDefault =  5;

		$init = (!empty($_GET['init'])) ? $_GET['init'] : $initDefault;

		$end = (!empty($_GET['end'])) ? $_GET['end'] : $endDefault;

		$type = (!empty($_GET['type'])) ? $_GET['type'] : $typeDefault;

		$limit = (!empty($_GET['limit'])) ? $_GET['limit'] : $limitDefault;

		$top = UserRepo::getTopSellers($init , $end , $type , $limit);

		return \Response::json($top);

	}

	static function getUserById()
	{

		$id = (!empty($_GET['id'])) ? $_GET['id'] : false;

		$user = UserRepo::with(['Employee' , 'Store']);

		$usersPermitted = ACLFilter::generateAuthCondition();

		if(count($usersPermitted))
		{
			$user = $user->whereIn('id' , $usersPermitted);
		}

		$storesPermitted = ACLFilter::generateStoreCondition();

		if(count($storesPermitted))
		{
			$user = $user->whereIn('store_id' , $storesPermitted);
		}

		$user = $user->where( 'id' , $id)->first();

		return \Response::json($user);

	}

	static function getByLevelId()
	{

		$level_id = (!empty($_GET['level_id'])) ? $_GET['level_id'] : false;

		$users = UserRepo::with(['role' , 'employee' , 'store']);

		$usersPermitted = ACLFilter::generateAuthCondition();

		if(count($usersPermitted))
		{
			$users = $users->whereIn('id' , $usersPermitted);
		}

		$storesPermitted = ACLFilter::generateStoreCondition();

		if(count($storesPermitted))
		{
			$users = $users->whereIn('store_id' , $storesPermitted);
		}

		$users = $users->whereIn('role_id' ,function($query) use ($level_id)
		{
			$query->select(\DB::raw('id'))
				->from('roles')
				->whereRaw('roles.level_id = '.$level_id);

		})->get();

		return \Response::json($users);

	}

	static function getEmployeeById()
	{

		$id = (!empty($_GET['id'])) ? $_GET['id'] : false;

		$user = UserRepo::with(['Employee' , 'store']);

		$usersPermitted = ACLFilter::generateAuthCondition();

		if(count($usersPermitted))
		{
			$user = $user->whereIn('id' , $usersPermitted);
		}

		$storesPermitted = ACLFilter::generateStoreCondition();

		if(count($storesPermitted))
		{
			$user = $user->whereIn('store_id' , $storesPermitted);
		}

		$user = $user->where( 'id' , $id)->first();

		return \Response::json($user);

	}

	static function getSellers()
	{
		$store_id = (!empty($_GET['store_id'])) ? $_GET['store_id'] : false;

		$sellers = UserRepo::with(['Employee' , 'store']);

		$usersPermitted = ACLFilter::generateAuthCondition();

		if(count($usersPermitted))
		{
			$sellers = $sellers->whereIn('id' , $usersPermitted);
		}

		$storesPermitted = ACLFilter::generateStoreCondition();

		if(count($storesPermitted))
		{
			$sellers = $sellers->whereIn('store_id' , $storesPermitted);
		}

		$sellers = $sellers->where('role_id' ,function($query)
		{
			$query->select(\DB::raw('id'))
				->from('roles')
				->whereRaw('roles.slug = "vendedor"');

		})->get();

		return \Response::json($sellers);

	}

	static function getDrivers()
	{
		$store_id = (!empty($_GET['store_id'])) ? $_GET['store_id'] : false;

		$sellers = UserRepo::with(['Employee' , 'store']);

		$usersPermitted = ACLFilter::generateAuthCondition();

		if(count($usersPermitted))
		{
			$sellers = $sellers->whereIn('id' , $usersPermitted);
		}

		$storesPermitted = ACLFilter::generateStoreCondition();

		if(count($storesPermitted))
		{
			$sellers = $sellers->whereIn('store_id' , $storesPermitted);
		}

		if($store_id)
		{
			$sellers = $sellers->where('store_id' , $store_id);

		}

		$sellers = $sellers->where('role_id' ,function($query)
		{
			$query->select(\DB::raw('id'))
				->from('roles')
				->whereRaw('roles.slug = "chofer"');

		})->get();

		return \Response::json($sellers);

	}

	static function compareSellers()
	{
		$seller_1 = (!empty($_GET['seller_1'])) ? $_GET['seller_1'] : false;

		$seller_2 = (!empty($_GET['seller_2'])) ? $_GET['seller_2'] : false;

		$init_date = (!empty($_GET['init_date'])) ? $_GET['init_date'] : false;

		$end_date = (!empty($_GET['end_date'])) ? $_GET['end_date'] : false;

		$compare = [];

		if(!$seller_1 || !$seller_2)
			return \Response::json($compare);

		$compare = UserRepo::compareSellers($seller_1 , $seller_2 , $init_date , $end_date);

		return \Response::json($compare);
	}

	static function compareDrivers()
	{
		$driver_1 = (!empty($_GET['driver_1'])) ? $_GET['driver_1'] : false;

		$driver_2 = (!empty($_GET['driver_2'])) ? $_GET['driver_2'] : false;

		$init_date = (!empty($_GET['init_date'])) ? $_GET['init_date'] : false;

		$end_date = (!empty($_GET['end_date'])) ? $_GET['end_date'] : false;

		$compare = [];

		if(!$driver_1 || !$driver_2)
			return \Response::json($compare);

		$compare = UserRepo::compareDrivers($driver_1 , $driver_2 , $init_date , $end_date);

		return \Response::json($compare);
	}

}