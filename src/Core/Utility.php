<?php
namespace App\Core;

class Utility{
    /*
     * Check various function success of failure response
     *
     * @return - true if success response otherwise false
     */
    public function isSuccessResponse($response){
        if(isset($response['status']) && $response['status'] == 'success'){
            return true;
        }
        return false;
    }
    /*
     * Prepare Json response to send to browser
     */
    public function jsonResponse($response){
        header('Content-Type: application/json');
        echo json_encode($response);
    }
}