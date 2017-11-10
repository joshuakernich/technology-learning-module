<?php
    $id = $_GET['id'];
    $name = $_GET['name'];
    $entry = $_GET['entry'];
    $db = new SQLite3('community.sqlite'); 
    $query = 'INSERT INTO questions (id,name,entry) VALUES ("'.$id.'","'.$name.'","'.$entry.'")';
    $results = $db->query($query);

    include 'get.php';
?>