<?php
namespace App\Models;

use App\Core\Config;
use Medoo\Medoo;
use App\Core\Utility;

class CoreModel extends Config{
    public $connection = '';
    public $table = '';
    public $utilityObject;

    public function __construct()
    {
        $this->utilityObject = new Utility();
    }

    /*
     * Check the Database connection
     *
     * @return array with success status and connection if connection is success.
     */
    public function makeConnection(){
        $response = [
            'status' =>'error',
            'message' => 'Something went wrong.Error code: DBMC0.'
        ];
        try{
            $database_credentials = $this->getDatabaseCredential();
            $serverName = !empty($database_credentials['host'])?$database_credentials['host']:'';
            $dbUserName = !empty($database_credentials['username'])?$database_credentials['username']:'';
            $dbPassword = !empty($database_credentials['password'])?$database_credentials['password']:'';
            $dbName = !empty($database_credentials['db_name'])?$database_credentials['db_name']:'';
            $database_type = !empty($database_credentials['database_type'])?$database_credentials['database_type']:'';

            if(empty($serverName) || empty($dbUserName) || empty($dbName)){
                $response['message'] = 'Required info not given.Error Code: DBMC1';
                goto rtn;
            }
            if(!empty($this->connection)){
                $conn = $this->connection;
            }
            else{
                $conn = new Medoo([
                    'database_type' => $database_type,
                    'database_name' => $dbName,
                    'server' => $serverName,
                    'username' => $dbUserName,
                    'password' => $dbPassword
                ]);
                $this->connection = $conn;
            }
            $response = [
                'status' =>'success',
                'message' => 'connected to '.$dbName,
                'connection' => $conn
            ];
        }catch(\Exception $ex){
            $response['message'] ="Database Connection failed: " . $ex->getMessage();
        }
        rtn:
        return $response;
    }
    /*
     * check if application has active connection
     *
     * @return true if it has active connection or vice versa
     */
    protected function hasConnection(){
        return !empty($this->connection)?true:false;
    }

    /*
     * Every model will attached to database table.
     *
     * set that table name to query further
     */
    protected function setTableName($table){
        $this->table = $table;
        return true;
    }

    /*
     * Run SQL with given inputs
     *
     * @link https://medoo.in/api/select
     *
     * @param array $where define where condition in a SQL
     * @param array $select define select statement in a SQL
     * @param array $order define order statement in a SQL
     * @param array $join define join statement in a SQL ex: [>] == LEFT JOIN,[<] == RIGH JOIN,[<>] == FULL JOIN,[><] == INNER JOIN]
     * @param array $limit define limit statement in a SQL. ex: limit [0,2] or 20
     */
    public function runSQL($where = [],$select = [],$order = [],$join = [],$limit = []){
        $response = [
            'status' =>'error',
            'message' => 'Something went wrong.Error code: 1'
        ];
        try{
            $connection = $this->connection;
            $table = $this->table;
            if(empty($connection) || empty($table)){
                $response['message'] = 'Required info not given.Error code:1.';
                goto rtn;
            }
            // $result = mysqli_query($connection, $sql);
            if(empty($select)){
                $select = '*';
            }
            if(!empty($order)){
                $where['ORDER'] = $order;
            }
            if(!empty($limit)){
                $where['LIMIT'] = $limit;
            }

            if(empty($join)){
                if(isset($where['debug'])){
                    unset($where['debug']);
                    $result = $connection->debug()->select($table,$select,$where);
                }else{
                    $result = $connection->select($table,$select,$where);
                }
            }else{
                if(isset($where['debug'])){
                    unset($where['debug']);
                    $result = $connection->debug()->select($table,$join,$select,$where);
                }else{
                    $result = $connection->select($table,$join,$select,$where);
                }
            }
            $response = [
                'status' =>'success',
                'result' => $result
            ];
        }catch(Exception $ex){
            $response['message'] ="SQL run failed: " . $ex->getMessage();
        }
        rtn:
        return $response;
    }

    /*
     * Central function helps to run various SQL operation in ORM style
     *
     * @param sql
     * - insert bool true means insert data
     * - update bool true means update data
     * - delete bool true means delete data
     * - count bool true means count rows
     * - get bool true means select rows and get data
     * - where array means where condition in a SQL
     * - columns array which means which table's column should be in select statement in SQL
     * - order array define order statement in a SQL
     * - join array define join statement in a SQL ex: [>] == LEFT JOIN,[<] == RIGH JOIN,[<>] == FULL JOIN,[><] == INNER JOIN]
     * - limit array define limit statement in a SQL. ex: limit [0,2] or 20
     *
     * @return array with success or error with a error message
     */
    public function executeORM($sql){
        $connection = $this->connection;
        $tblName = $this->table;
        if(isset($sql['insert']) && isset($sql['data'])){
            return $this->insertSQL($connection,$tblName,$sql['data']);
        }elseif (isset($sql['update']) && isset($sql['data'])){
            return $this->updateSQL($connection,$tblName,$sql['data'],isset($sql['where'])?$sql['where']:[]);
        }elseif (isset($sql['delete'])){
            return $this->deleteSQL($connection,$tblName,isset($sql['where'])?$sql['where']:[]);
        }elseif (isset($sql['count'])){
            return $this->countSQL($connection,$tblName,isset($sql['where'])?$sql['where']:[]);
        }elseif (isset($sql['get'])){
            return $this->getSQL($connection,$tblName,isset($sql['columns'])?$sql['columns']:[],isset($sql['where'])?$sql['where']:[]);
        }
        else{
            $where = isset($sql['where'])?$sql['where']:[];
            $select = isset($sql['select'])?$sql['select']:[];
            $order = isset($sql['order'])?$sql['order']:[];
            $join = isset($sql['join'])?$sql['join']:[];
            $limit = isset($sql['limit'])?$sql['limit']:[];
            return $this->runSQL($where,$select,$order,$join,$limit);
        }

    }

    /*
     * Send count of rows
     *
     * @return array success with row count or error with a error message
     */
    public function countSQL($connection = '',$table = '',$where = []){
        $response = [
            'status' =>'error',
            'message' => 'Something went wrong.Error code: 11'
        ];
        try{
            if(empty($connection) || empty($table)){
                $response['message'] = 'Required info not given.Error code:11.';
                goto rtn;
            }
            $result = $connection->count($table,$where);
            $response = [
                'status' =>'success',
                'result' => $result,
            ];
        }catch(Exception $ex){
            $response['message'] ="SQL count failed: " . $ex->getMessage();
        }
        rtn:
        return $response;
    }

    /*
     * Execute Insert SQL
     *
     * @return array last row insert ID with success or error with a error message
     */
    public function insertSQL($connection = '',$table = '',$data = []){
        $response = [
            'status' =>'error',
            'message' => 'Something went wrong.Error code: 8'
        ];
        try{
            if(empty($connection) || empty($table)){
                $response['message'] = 'Required info not given.Error code:1.';
                goto rtn;
            }
            $connection->pdo->beginTransaction();
            $result = $connection->insert($table,$data);
            $connection->pdo->commit();
            if(!empty($result) && !empty($result->rowCount())){
                $last_id = $connection->id();
                $response = [
                    'status' =>'success',
                    'result' => isset($last_id)?$last_id:0,
                    'message' => 'Data inserted successfully',
                ];
            }else{
                $response['message'] = $connection->error();
            }
        }catch(Exception $ex){
            $connection->pdo->rollBack();
            $response['message'] ="SQL insert failed: " . $ex->getMessage();
        }
        rtn:
        return $response;
    }

    /*
     * execute a select SQL
     *
     *  @return array result with success or error with a error message
     */
    public  function getSQL($connection = '',$table = '',$columns = [],$where = []){
        $response = [
            'status' =>'error',
            'message' => 'Something went wrong.Error code: 15'
        ];
        try{
            if(empty($connection) || empty($table)){
                $response['message'] = 'Required info not given.Error code:15.';
                goto rtn;
            }
            if(empty($columns)){
                $columns = '*';
            }
            $result = $connection->get($table,$columns,$where);
            $response = [
                'status' =>'success',
                'result' => $result,
            ];
        }catch(Exception $ex){
            $response['message'] ="SQL get failed: " . $ex->getMessage();
        }
        rtn:
        return $response;
    }

    /*
     * execute update statement
     *
     * @return array row affected count with success or error with a error message
     */
    public function updateSQL($connection = '',$table = '',$data = [],$where = []){
        $response = [
            'status' =>'error',
            'message' => 'Something went wrong.Error code: 9'
        ];
        try{
            if(empty($connection) || empty($table)){
                $response['message'] = 'Required info not given.Error code:9.';
                goto rtn;
            }
            $connection->pdo->beginTransaction();
            $result = $connection->update($table,$data,$where);
            $connection->pdo->commit();
            if(!empty($result)){
                $row_affected = $result->rowCount();
            }
            $response = [
                'status' =>'success',
                'result' => isset($row_affected)?$row_affected:0,
                'message' => 'Data updated successfully'
            ];
        }catch(Exception $ex){
            $connection->pdo->rollBack();
            $response['message'] ="SQL update failed: " . $ex->getMessage();
        }
        rtn:
        return $response;
    }

    /*
     * Execute a delete SQL
     *
     * @return array of affected row count with success or error with a error message
     */
    public function deleteSQL($connection = '',$table = '',$where = []){
        $response = [
            'status' =>'error',
            'message' => 'Something went wrong.Error code: 10'
        ];
        try{
            if(empty($connection) || empty($table)){
                $response['message'] = 'Required info not given.Error code:12.';
                goto rtn;
            }
            $connection->pdo->beginTransaction();
            $result = $connection->delete($table,$where);
            $connection->pdo->commit();
            if(!empty($result)){
                $row_affected = $result->rowCount();
            }
            $response = [
                'status' =>'success',
                'result' => isset($row_affected)?$row_affected:0,
                'message' => 'Data updated successfully'
            ];
        }catch(Exception $ex){
            $connection->pdo->rollBack();
            $response['message'] ="SQL update failed: " . $ex->getMessage();
        }
        rtn:
        return $response;
    }

    /*
     * Execute Raw SQL
     *
     * @return array of PDO object with success or error with a error message
     */
    public function runRawSQL($sql = '',$connection = ''){
        $response = [
            'status' =>'error',
            'message' => 'Something went wrong.Error code: 2.'
        ];
        try{
            if(empty($connection)|| empty($sql)){
                $response['message'] = 'Required info not given.Error Code: 2';
                goto rtn;
            }
            $result = $connection->query($sql);
            $has_error = $connection->error();
            if(!empty($has_error)){
                if(is_array($has_error)){
                    if(isset($has_error[2]) && $has_error != null){
                        $response['message'] = $has_error[2];
                        goto rtn;
                    }
                }else{
                    $response['message'] = $has_error;
                    goto rtn;
                }

            }
            // $result = $connection->select($select,$where);

            $response = [
                'status' =>'success',
                'result' => $result
            ];
        }catch(Exception $ex){
            $response['message'] ="SQL run failed: " . $ex->getMessage();
        }
        rtn:
        return $response;
    }
}