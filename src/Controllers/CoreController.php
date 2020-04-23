<?php
namespace App\Controllers;

use App\Core\Utility;
use App\Models\CoreModel;
use Twig\Loader\FilesystemLoader;
use Twig\Environment;

class CoreController{

    /*
     * utility object is worked as a helper in the controller
     */
    public $utilityObject;

    public function __construct()
    {
        $this->utilityObject = new Utility();
        $this->checkDbConnection();
    }

    /*
     * Database Connection checker
     *
     * Throw error if database is not connected
     */
    protected function checkDbConnection(){
        $coreModel = new CoreModel();
        $db_connection_response = $coreModel->makeConnection();

        if(!$this->utilityObject->isSuccessResponse($db_connection_response)){
            $message = 'There is a Database connection problem.<br>Reason: '.$db_connection_response['message'].'<br>Please check your <b>$databaseCredentials</b> in src/Core/Config.php<br>Also check <u>Database/alter_query.sql</u> for any alter';
            $this->loadView('error',['message' => $message]);
            die();
        }
    }

    /*
     * Twig template to load a view
     *
     * Search in src/Views folder
     *
     * @param string $path to load a view
     * @param array $data to send any required data in a view
     *
     * @return HTML view
     */
    protected function loadView($path = '',$data = []){
        if(!empty($path)){
            $exploded_path = explode('.',$path);
            $total_index = count($exploded_path);
            $filename = $exploded_path[$total_index-1].'.html';
            if($total_index > 1){
                $extra_path = array_slice($exploded_path,0,$total_index-1);
                $path = 'src/Views/'.implode('/',$extra_path);
            } else{
                $path = 'src/Views';
            }
        }
        $loader = new FilesystemLoader([$path,'src/Views']);
        $twig = new Environment($loader);

        echo $twig->render($filename,$data);
    }
}