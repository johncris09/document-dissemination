<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class User extends RestController
{

  function __construct()
  {
    // Construct the parent class
    parent::__construct();
    $this->objOfJwt = new CreatorJwt();
    $this->load->model('UserModel');
    $this->load->helper('crypto_helper');
  }




  public function index_get()
  { 
    $user = new UserModel;
    $CryptoHelper = new CryptoHelper;
    $result = $user->get();
    $this->response($result, RestController::HTTP_OK);
  }


  public function login_post()
  {


    try {
      $userModel = new UserModel;
      $requestData = json_decode($this->input->raw_input_stream, true);
      $userLogin = $userModel->login($requestData);

 


      if ($userLogin) {
        $tokenData['id'] = $userLogin->ID;
        $tokenData['name'] = $userLogin->Name;
        $tokenData['role'] = $userLogin->Role;
        $tokenData['office_assignment'] = $userLogin->OfficeAssignment;
        $tokenData['userName'] = $userLogin->UserName; 
        $jwtToken = $this->objOfJwt->GenerateToken($tokenData);


        $this->response([
          'status' => true,
          'token' => $jwtToken,
          'message' => 'Login Successfully',
        ], RestController::HTTP_OK);

      } else {

        $this->response([
          'status' => false,
          'message' => 'Invalid Username/Password. Please Try Again!',
        ], RestController::HTTP_OK);
      }


    } catch (Exception $e) {
      // Handle other exceptions here


      $this->response([
        'status' => false,
        "message" => "Invalid Username/Password"
      ], 500);



    }

  }

  public function find_get($id)
  {

    $model = new UserModel;
    $CryptoHelper = new CryptoHelper;

    $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($model->find($id)));
    $this->response($result, RestController::HTTP_OK);

  }


  public function insert_post()
  {

    $model = new UserModel;
    $requestData = json_decode($this->input->raw_input_stream, true);



    $data = array(
      'FirstName' => $requestData['first_name'],
      'LastName' => $requestData['last_name'],
      'MidIn' => $requestData['middle_initial'],
      'UserName' => $requestData['username'],
      'Password' => $requestData['password'],
      'ConfirmPassword' => $requestData['password'],
      'Role' => $requestData['role_type'],
    );

    $result = $model->insert($data);

    if ($result > 0) {
      $this->response([
        'status' => true,
        'message' => 'Successfully Inserted.'
      ], RestController::HTTP_OK);
    } else {

      $this->response([
        'status' => false,
        'message' => 'Failed to create new user.'
      ], RestController::HTTP_BAD_REQUEST);
    }
  }


  public function update_put($id)
  {


    $model = new UserModel;
    $requestData = json_decode($this->input->raw_input_stream, true);


    $data = array(
      'FirstName' => $requestData['first_name'],
      'LastName' => $requestData['last_name'],
      'MidIn' => $requestData['middle_initial'],
      'UserName' => $requestData['username'],
      'Role' => $requestData['role_type'],

    );

    $update_result = $model->update($id, $data);

    if ($update_result > 0) {
      $this->response([
        'status' => true,
        'message' => 'Successfully Updated.'
      ], RestController::HTTP_OK);
    } else {

      $this->response([
        'status' => false,
        'message' => 'Failed to update.'
      ], RestController::HTTP_BAD_REQUEST);

    }
  }


  public function delete_delete($id)
  {
    $model = new UserModel;
    $result = $model->delete($id);
    if ($result > 0) {
      $this->response([
        'status' => true,
        'message' => 'Successfully Deleted.'
      ], RestController::HTTP_OK);
    } else {

      $this->response([
        'status' => false,
        'message' => 'Failed to delete.'
      ], RestController::HTTP_BAD_REQUEST);

    }
  }




  public function change_password_put($id)
  {


    $model = new UserModel;
    $requestData = json_decode($this->input->raw_input_stream, true);

    $data = array(
      'Password' => $requestData['password'],
      'ConfirmPassword' => $requestData['password'],
    );

    $update_result = $model->update($id, $data);

    if ($update_result > 0) {
      $this->response([
        'status' => true,
        'message' => 'Successfully Updated.'
      ], RestController::HTTP_OK);
    } else {

      $this->response([
        'status' => false,
        'message' => 'Failed to update.'
      ], RestController::HTTP_BAD_REQUEST);

    }
  }


}