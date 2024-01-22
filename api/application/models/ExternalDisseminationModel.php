<?php

defined('BASEPATH') or exit('No direct script access allowed');

class ExternalDisseminationModel extends CI_Model
{

	public $table = 'external_dissemination';

	public function getAll()
	{
		$query = "
		SELECT
			ed.id,
			tr.LogNo external_log_number,
			tr.LetterSubject as letter_subject,
			tr.FromOffice as from_office,
			ed.*,
			tri.LogNo as internal_log_number,
			tl.name as encoded_by
		FROM
			`external_dissemination` AS ed  
		Join table_receivedocu AS tr on ed.external_document = tr.id 
		Join table_login AS tl on ed.encoded_by = tl.id 
		LEFT JOIN table_receivedinternaldocu as tri on ed.internal_document = tri.id
		  
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