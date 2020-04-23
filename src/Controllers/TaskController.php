<?php
namespace App\Controllers;

use App\Controllers\CoreController;
use App\Models\TaskModel;

class TaskController extends CoreController {

    public $model = '';
    public function __construct()
    {
        parent::__construct();
        $this->model = new TaskModel();
    }

    /*
     * Show All task list.
     * @return json response of task info or error with error message
     */
    public function index($parameters = ''){
        $where = [];
        if(!empty($parameters[0])){
            $where['status'] = filter_var($parameters[0], FILTER_VALIDATE_INT) - 1;
        }

        $model_task =$this->model;
        $list = $model_task->getTasks([],$where);
        $total = $model_task->countTasks([]);
        $total_pending = $model_task->countTasks(['status' => 0]);
//        $this->loadView('Elements.pending_tasks',['tasks' => $array,'type' => '']);
        if($total === false){
            return $this->utilityObject->jsonResponse(['status' => 'error', 'message' => 'Please check your $database_credentials in src/Core/Config.php.Also check Database/alter_query.sql for any alter']);
        }
        return $this->utilityObject->jsonResponse([
            'status' => 'success','data' => $list,'total' => $total,'pending' => $total_pending,
        ]);
    }

    /*
     * add a task
     *
     * POST method to add a task
     *
     * @return json response of newly created task info or error with error message
     */
    public function add(){
        $response = [
            'status' =>'error',
            'message' => 'Something went wrong.Error code: TCA1'
        ];
        if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
            if(!empty($_POST["title"])){
               $title = trim(htmlspecialchars($_POST["title"]));
               $time = date('Y-m-d h:i:s');
               $model_task =$this->model;
              $response = $model_task->add([
                   'title' => $title,
                   'status' => 0,
                   'created' => $time,
                   'modified' => $time,
               ]);
            }
        }else{
            $response['message'] = 'Method should be post.Error code: TCA2';
        }
        rtn:
        $this->utilityObject->jsonResponse($response);
    }

    /*
     * add a task
     *
     * POST method to add a task
     *
     * @return json response of newly created task info or error with error message
     */
    public function complete(){
        $response = [
            'status' =>'error',
            'message' => 'Something went wrong.Error code: TCC1'
        ];
        if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
            if(!empty($_POST["id"])){
               $id = filter_var($_POST["id"], FILTER_VALIDATE_INT);
               $model_task =$this->model;
              $response = $model_task->updateTask($id,['status' => 1]);
            }
        }else{
            $response['message'] = 'Method should be post.Error code: TCC2';
        }
        rtn:
        $this->utilityObject->jsonResponse($response);
    }

    /*
     * remove all completed task
     *
     * POST method to remove all completed task
     *
     * @return json response of row affected task count with success or error with error message
     */
    public function removeCompleted(){
        $response = [
            'status' =>'error',
            'message' => 'Something went wrong.Error code: TCRC1'
        ];
        if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
            $model_task =$this->model;
            $response = $model_task->removeCompleted();
        }else{
            $response['message'] = 'Method should be post.Error code: TCRC2';
        }
        rtn:
        $this->utilityObject->jsonResponse($response);
    }

    /*
     * delete a task
     *
     * POST method to delete a task
     *
     * @return json response of primary key of deleted task with success or error with error message
     */
    public function delete(){
        $response = [
            'status' =>'error',
            'message' => 'Something went wrong.Error code: TCCD1'
        ];
        if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
            if(!empty($_POST["id"])){
                $id = filter_var($_POST["id"], FILTER_VALIDATE_INT);
                $model_task =$this->model;
                $response = $model_task->deleteTask($id);
            }
        }else{
            $response['message'] = 'Method should be post.Error code: TCD2';
        }
        rtn:
        $this->utilityObject->jsonResponse($response);
    }

    /*
     * edit a task
     *
     * POST method to edit a task
     *
     * @return json response of currently edited task info with success or error with error message
     */
    public function edit(){
        $response = [
            'status' =>'error',
            'message' => 'Something went wrong.Error code: TCCD1'
        ];
        if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
            if(!empty($_POST["id"])){
                $id = filter_var($_POST["id"], FILTER_VALIDATE_INT);
                $title = trim(htmlspecialchars($_POST["title"]));
                $time = date('Y-m-d h:i:s');
                $model_task =$this->model;
                $response = $model_task->updateTask($id,['title' => $title,'modified' => $time]);
            }
        }else{
            $response['message'] = 'Method should be post.Error code: TCD2';
        }
        rtn:
        $this->utilityObject->jsonResponse($response);
    }
}