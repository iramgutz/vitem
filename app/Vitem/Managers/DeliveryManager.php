<?php namespace Vitem\Managers;

use Vitem\Repositories\PermissionRepo;
use Vitem\Validators\DeliveryValidator;
use Vitem\Managers\DestinationManager;


class DeliveryManager extends BaseManager {

    protected $delivery;

    public function setSaleId($id)
    {
        $data = $this->data;

        $data['sale_id'] = $id;

        $this->data = $data;

    }

    public function save()
    {
        $data = $this->data;

        if(empty($data['access_token']))
        {
            $canCreateDestination = PermissionRepo::checkAuth('Destination' , 'Create');
        }

        if(isset($data['new_destination']) && $canCreateDestination)
        {
            return $this->saveWithNewDestination();
        }
        else
        {
            return $this->saveWithExistsDestination();
        }

    }

    public function saveWithNewDestination()
    {

        $data = $this->data;

        $createDestination = new DestinationManager( $data['destination'] );

        $responseDestination = $createDestination->save();

        if(isset($responseDestination['return_id']))
        {
            $data['destination_id'] = $responseDestination['return_id'];
        }

        $this->data = $data;

        $responseDelivery = $this->saveWithExistsDestination();

        if($responseDestination['success'] && $responseDelivery['success'])
        {
            $response = $responseDelivery;
        }
        else
        {
            if(isset($responseDestination['errors']))
            {
                foreach($responseDestination['errors'] as $k => $e)
                {

                    $responseDestination['errors']['destination.'.$k] = $e;

                    unset($responseDestination['errors'][$k]);

                }
            }

            $errors = ( (isset( $responseDestination['errors'] ) ) ? $responseDestination['errors'] : [] )

                    + ( (isset( $responseDelivery['errors'] ) ) ? $responseDelivery['errors'] : [] );

            $response = [
                'success' => false,
                'errors' => $errors,
                'newDestination' => true,
                'destinationSelectedId' => 0
            ];
        }

        return $response;

    }


    public function saveWithExistsDestination()
    {
        $DeliveryValidator = new DeliveryValidator(new \Delivery);

        $deliveryData = $this->data;

        $deliveryData = $this->prepareData($deliveryData);

        $deliveryValid  =  $DeliveryValidator->isValid($deliveryData);



        if( $deliveryValid )
        {

            $delivery = new \Delivery( $deliveryData );

            $delivery->save();

            $store_id = $delivery->sale->store_id;

            \Movement::create([
                'user_id' => $delivery->user_id,
                'store_id' => $delivery->sale->store_id,
                'type' => 'create',
                'entity' => 'Delivery',
                'entity_id' => $delivery->id,
                'amount_in' => $delivery->total,
                'amount_out' => 0,
                'date' => $delivery->delivery_date
            ]);

            //\Setting::checkSettingAndAddResidue('add_residue_new_delivery', $deliveryData['subtotal'] , $store_id );

            $response = [
                'success' => true,
                'return_id' => $delivery->id
            ];

        }
        else
        {

            $deliveryErrors = [];

            if($DeliveryValidator->getErrors())
                $deliveryErrors = $DeliveryValidator->getErrors()->toArray();

            $errors =  $deliveryErrors;



             $response = [
                'success' => false,
                'errors' => $errors
            ];
        }

        return $response;

    }

    public function update()
    {

        $deliveryData = $this->data;

        $canCreateDestination = PermissionRepo::checkAuth('Destination' , 'Create');

        if(isset($data['new_destination']) && $canCreateDestination)
        {
            return $this->updateWithNewDestination();
        }
        else
        {
            return $this->updateWithExistsDestination();
        }



    }

    public function updateWithNewDestination()
    {

        $data = $this->data;

        $createDestination = new DestinationManager( $data['destination'] );

        $responseDestination = $createDestination->save();

        if(isset($responseDestination['return_id']))
        {
            $data['destination_id'] = $responseDestination['return_id'];
        }

        $this->data = $data;

        $responseDelivery = $this->updateWithExistsDestination();

        if($responseDestination['success'] && $responseDelivery['success'])
        {
            $response = $responseDelivery;
        }
        else
        {
            if(isset($responseDestination['errors']))
            {
                foreach($responseDestination['errors'] as $k => $e)
                {

                    $responseDestination['errors']['destination.'.$k] = $e;

                    unset($responseDestination['errors'][$k]);

                }
            }

            $errors = ( (isset( $responseDestination['errors'] ) ) ? $responseDestination['errors'] : [] )

                    + ( (isset( $responseDelivery['errors'] ) ) ? $responseDelivery['errors'] : [] );

            $response = [
                'success' => false,
                'errors' => $errors,
                'newDestination' => true,
                'destinationSelectedId' => 0
            ];
        }

        return $response;

    }

    public function updateWithExistsDestination()
    {
        $deliveryData = $this->data;

        $this->delivery = \Delivery::find($deliveryData['id']);

        $totalOld = $this->delivery->total;

        $dateOld = $this->delivery->delivery_date;

        $store_id = $this->delivery->sale->store_id;

        $store_old = (!empty($deliveryData['store_id_old'])) ? $deliveryData['store_id_old'] : $store_id;

        $DeliveryValidator = new DeliveryValidator($this->delivery);

        $deliveryData = $this->prepareData($deliveryData);

        $deliveryValid  =  $DeliveryValidator->isValid($deliveryData);

        if( $deliveryValid )
        {

            $delivery = $this->delivery;

            $delivery->update($deliveryData);

            if($store_old == $delivery->sale->store_id && $dateOld == $delivery->delivery_date)
            {
                \Movement::create([
                    'user_id' => \Auth::user()->id,
                    'store_id' => $store_old,
                    'type' => 'update',
                    'entity' => 'Delivery',
                    'entity_id' => $delivery->id,
                    'amount_in' => $delivery->total,
                    'amount_out' => $totalOld,
                    'date' => $delivery->delivery_date
                ]);
            }
            else
            {

                \Movement::create([
                    'user_id' => \Auth::user()->id,
                    'store_id' => $store_old,
                    'type' => 'update',
                    'entity' => 'Delivery',
                    'entity_id' => $delivery->id,
                    'amount_in' => 0,
                    'amount_out' => $totalOld,
                    'date' => $dateOld
                ]);


                \Movement::create([
                    'user_id' => \Auth::user()->id,
                    'store_id' => $store_old,
                    'type' => 'update',
                    'entity' => 'Delivery',
                    'entity_id' => $delivery->id,
                    'amount_in' => $delivery->total,
                    'amount_out' => 0,
                    'date' => $delivery->delivery_date
                ]);

            }

            //\Setting::checkSettingAndAddResidue('add_residue_new_delivery', $totalOld*(-1) , $store_old );

            //\Setting::checkSettingAndAddResidue('add_residue_new_delivery', $deliveryData['subtotal'] , $store_id );

            $response = [
                'success' => true,
                'return_id' => $delivery->id
            ];

        }
        else
        {

            $deliveryErrors = [];

            if($DeliveryValidator->getErrors())
                $deliveryErrors = $DeliveryValidator->getErrors()->toArray();

            $errors =  $deliveryErrors;



             $response = [
                'success' => false,
                'errors' => $errors
            ];
        }

        return $response;

    }

    public function delete()
    {

        $deliveryData = $this->data;

        $this->delivery = \Delivery::find($deliveryData['id']);

        $delivery = $this->delivery;

        $store_id = $delivery->sale->store_id;

        \Movement::create([
            'user_id' => \Auth::user()->id,
            'store_id' => $delivery->sale->store_id,
            'type' => 'delete',
            'entity' => 'Delivery',
            'entity_id' => $delivery->id,
            'amount_in' => 0,
            'amount_out' => $delivery->total,
            'date' => $delivery->delivery_date
        ]);

        //\Setting::checkSettingAndAddResidue('add_residue_new_delivery', ( ($delivery->subtotal)*(-1)  ) , $store_id );

        return $delivery->delete();

    }

    public function prepareData($deliveryData)
    {

        //$deliveryData['user_id'] = \Auth::user()->id;

        $subtotal = 0;

        if(isset($deliveryData['destination_id']))
        {
            $destination = \Destination::find($deliveryData['destination_id']);

            if($destination)
            {
                $total = $destination->cost;
            }
        }

        $commission_pay = 0;

        if(isset($deliveryData['pay_type_id']))
        {
            $payType = \PayType::find($deliveryData['pay_type_id']);

            if($payType)
            {
                $commission_pay = ($total / 100) * $payType->percent_commission;
            }
        }

        $deliveryData['total'] = number_format($total, 2, '.', '');

        $deliveryData['commission_pay'] = number_format($commission_pay, 2, '.', '');

        $deliveryData['subtotal'] = number_format(($total + $commission_pay), 2, '.', '');

        return $deliveryData;
    }

}

