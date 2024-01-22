<?php

defined('BASEPATH') or exit('No direct script access allowed');

class InternalDisseminationModel extends CI_Model
{

	public $table = 'internal_dissemination';

	public function getAll()
	{
		$query = " 

		SELECT
			internal.id,
			tri.LogNo internal_log_number,
			tri.DocuSubject as letter_subject,
			tri.DateReceived as date_received,
			tri.TimeReceived as time_received,
			internal.*,
			tr.LogNo as external_log_number,
			tl.name as encoded_by
		FROM
			`internal_dissemination` AS internal  
		Join table_receivedinternaldocu  AS tri on internal.internal_document = tri.id 
		Join table_login AS tl on internal.encoded_by = tl.id 
		LEFT JOIN table_receivedocu as tr on internal.external_document = tr.id
		  
		";
		
        $query = $this->db->query($query );
        return $query->result();
	}

	public function get_active_course()
	{
		$query = $this->db->select('*')
			->where('colManager', 'Active')
			->where('colCourse !=', '')
			->order_by('colCourse', 'asc')
			->get($this->table);
		return $query->result();
	}
	public function insert($data)
	{
		return $this->db->insert($this->table, $data);
	}

	public function find($id)
	{
		$this->db->where('id', $id);
		$query = $this->db->get($this->table);
		return $query->row();
	}


	public function update($id, $data)
	{
		$this->db->where('id', $id);
		return $this->db->update($this->table, $data);
	}

	public function delete($id)
	{
		return $this->db->delete($this->table, ['id' => $id]);
	}


	public function bulk_delete($data)
	{
		$this->db->where_in('id', $data);
		return $this->db->delete($this->table);
	}
}