<?php
namespace App\Core;


Class Route{
    private $route_path = '/';
    private $config = '';

    /*
     * Set route and initialise routing system
     *
     * @param $config - take config class for credentials, landing page
     */
    public function __construct($config)
    {
        if (isset($_SERVER['PATH_INFO']))
        {
            $this->route_path = $this->pathSplit($_SERVER['PATH_INFO']);
        }
        $this->config = $config;
        $this->defineRoute();
    }

    private function pathSplit($path){
       return explode('/', ltrim($path));
    }

    /*
     * Core routing System
     *
     * Decide which controller and its method to load
     * load the controller and method if run successfully
     * exit the application if requested controller, method not found
     */
    private function defineRoute(){
        if($this->route_path === '/'){
            //go to home
           $controller_name = ucfirst($this->config->getLandingPageControllerName()."Controller");
        }else{
            $controller_name = !empty($this->route_path[1])?ucfirst($this->route_path[1]."Controller"):'';
        }
        $method_name = !empty($this->route_path[2])?$this->route_path[2]:'index';
        $parameters = is_array($this->route_path)?array_slice($this->route_path, 3):'';

        $file_path = ROOT_DIR."/src/Controllers/{$controller_name}.php";
        if(file_exists($file_path)){
            $controller_name_with_namespace = 'App\Controllers\\'.$controller_name;
            $controller_object = new $controller_name_with_namespace();
            if(method_exists($controller_object,$method_name)){
                $controller_object->$method_name($parameters);
            }else{
                exit('Wrong Method');
            }

        }else{
            exit('Wrong Controller');
        }
    }
}