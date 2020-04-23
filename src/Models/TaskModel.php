<?php
namespace App\Models;

use App\Models\CoreModel;


class TaskModel extends CoreModel{
    public function __construct()
    {
        parent::__construct();
        if(!$this->hasConnection()){
            $connection_response = $this->makeConnection();
            if(!$this->utilityObject->isSuccessResponse($connection_response)){
                die($connection_response['message']);
            }
        }
        $this->setTableName('task');
    }

    /*
     * count the task
     *
     * @param array $where where statement of SQL
     *
     * @return int of row count or 0 if error
     */
    public function countTasks($where){
        $response = $this->executeORM(['count' => true,'where' => $where]);
        if($this->utilityObject->isSuccessResponse($response)){
            return $response['result'];
        }
        return 0;
    }

    /*
     * send the task related row info
     *
     * @param array $select select statement of SQL
     * @param array $where where statement of SQL
     *
     * @return array of row result or [] if error
     */
    public function getTasks($select = [],$where = []){
        $response = $this->executeORM(['where' => $where,'select' => $select]);
        if($this->utilityObject->isSuccessResponse($response)){
            return $response['result'];
        }
        return [];
    }

    /*
     * add the task
     *
     * @param array $data task related info
     *
     * @return array of last inserted row id with success or error
     */
    public function add($data = []){
        if(!empty($data)){
            return $this->executeORM(['insert' => true,'data' =>$data]);
        }else{
            return ['status' => 'error', 'message' => 'Data is not given to save. Code:TMA1'];
        }
    }

    /*
     * update the task
     *
     * @param int $id primary key of task table
     * @param array $data which data to update
     *
     * @return array of row affected with success or error with error message
     */
    public function updateTask($id,$data =[]){
        if(!empty($id)){
            return $this->executeORM(['update' => true,'data' =>$data,'where' => ['id' => $id]]);
        }else{
            return ['status' => 'error', 'message' => 'Data is not given to update. Code:TMUT1'];
        }
    }

    /*
     * delete the task
     *
     * @param int $id primary key of task table
     *
     * @return array of row affected with success or error with error message
     */
    public function deleteTask($id){
        if(!empty($id)){
            return $this->executeORM(['delete' => true,'where' => ['id' => $id]]);
        }else{
            return ['status' => 'error', 'message' => 'Data is not given to update. Code:TMUT1'];
        }
    }

    /*
     * remove complete task from task table
     *
     * @return array of row affected with success or error with error message
     */
    public function removeCompleted(){
        return $this->executeORM(['delete' => true,'where' => ['status' => 1]]);
    }
}