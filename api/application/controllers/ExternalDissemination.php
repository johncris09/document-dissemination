<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class ExternalDissemination extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('ExternalDisseminationModel');
		$this->load->helper('crypto_helper');
	}
	public function index_get()
	{
		$model = new ExternalDisseminationModel;
		$CryptoHelper = new CryptoHelper;
		$result = $model->getAll();
		$this->response($result, RestController::HTTP_OK);
	}
 
	public function insert_post()
	{

		$model = new ExternalDisseminationModel;
		$requestData = json_decode($this->input->raw_input_stream, true);
		// $this->response($requestData, RestController::HTTP_OK);
		$data = array(
			'external_document' => $requestData['external_document'],
			'endorsed_to' => $requestData['endorsed_to'],
			'date_received' => empty($requestData['date_received']) ? null : $requestData['date_received'],
			'note' => $requestData['note'],
			'messenger_name' => $requestData['messenger_name'],
			'internal_document' => empty($requestData['internal_document']) ? null : $requestData['internal_document'],
			'encoded_by' => $requestData['encoded_by'], 
		);
		
		$result = $model->insert($data);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'New Document Created.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create Document.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}



	public function find_get($id)
	{
		$model = new ExternalDisseminationModel;
		$result = $model->find($id);

		$this->response($result, RestController::HTTP_OK);

	}

	public function update_put($id)
	{


		$model = new ExternalDisseminationModel;

		$requestData = json_decode($this->input->raw_input_stream, true);
	 
		$data = array(
			'external_document' => $requestData['external_document'],
			'endorsed_to' => $requestData['endorsed_to'],
			'date_received' => empty($requestData['date_received']) ? null : $requestData['date_received'],
			'note' => $requestData['note'],
			'messenger_name' => $requestData['messenger_name'],
			'internal_document' => empty($requestData['internal_document']) ? null : $requestData['internal_document'],
			  
		);


		$update_result = $model->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Document Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update document.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


	public function delete_delete($id)
	{
		$model = new ExternalDisseminationModel;
		$result = $model->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Document Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete document.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}

	public function bulk_delete_delete()
	{

		$model = new ExternalDisseminationModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		// Extract IDs
		// Object to array
		$ids = array_map(function ($item) {
			return $item['ID'];
		}, $requestData);

		// Convert IDs to integers
		$ids = array_map('intval', $ids);

		$result = $model->bulk_delete($ids);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Document Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete document.'
			], RestController::HTTP_BAD_REQUEST);

		}

	}

}