<?php

defined('BASEPATH') or exit('No direct script access allowed');

class ExternalDocumentModel extends CI_Model
{

	public $table = 'table_receivedocu';

	public function getAll()
	{
		$query = $this->db 
			->order_by('id', 'DESC')
			->get($this->table, 500);
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