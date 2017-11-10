<?php
    $id = $_GET['id'];
    
    $db = new SQLite3('community.sqlite'); 
    if(empty($_GET['name'])){
    	$query = 'SELECT * FROM questions WHERE id="'.$id.'"'; 
    }
    else{
    	$name = $_GET['name'];
    	$query = 'SELECT * FROM questions WHERE id="'.$id.'" AND name="'.$name.'"'; 
    }
    $results = $db->query($query);
    $arr = [];
    while ($row = $results->fetchArray()) {
        array_push( $arr, (object) ['name'=>$row['name'],'entry'=>$row['entry']] );
    }
    echo json_encode($arr);
    
?>