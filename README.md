# TODO

TODO application lets you create your task list and maintain active, completed task List.

## Description
This application can add task which will be by
created with active status.
![Add Task](https://i.imgur.com/Rhsa4g8.png)

There are three tabs to show - **All** task list, **Active** task list, **Completed** task list.
![Task Tabs](https://i.imgur.com/HibBd0l.png) 

User can complete a task by clicking on left circle of a task. 
![Complete Task](https://i.imgur.com/HibBd0l.png)

Completed task will show differently
![Completed Task](https://i.imgur.com/CI01VDN.png)

User can edit the task by clicking on the task.
![Edit Task](https://i.imgur.com/bkbgw8i.png)

User can delete the task by clicking on red cross button related to task.
![Delete Task](https://i.imgur.com/Rhsa4g8.png)

User can clear **all completed task** by clicking on **Clear Completed**
![Clear Completed](https://i.imgur.com/5EH1Lcw.png)

### Prerequisites
```
PHP - minumum version PHP 5.6
Javascript - need to enable javascript on browser
```  

### Installing
 For cloning this project need to run
 ```
git clone 
```
Go to project folder and run in cmd / terminal
```
composer install
```
Create a database on your preferred database engine like MySQL.

Go to Database folder alter_query.sql and run listed queries from that file on newly created database.

Open src/Core/Config.php and update **$databaseCredentials** for Database connection.
```
private $database_credentials = [
        'host' => 'Your Database Host',
        'username' => 'Database username',
        'password' => 'Database password',
        'db_name' => 'Database name',
        'database_type' => 'Database type like mysql',
    ];
```

### Deployment
To run  this application on PHP server locally on your machine run

```
php -S localhost:8000
```
Change the localhost port as needed

### Built With
This application is build with PHP and Javascript. I use PHP OOP, MVC design, jQuery for Javascript, MySQL for database. I use [Meddo](https://medoo.in/) for ORM.