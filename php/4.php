<?php
//$db_host = "resultapp.cpkw2ci3rdjb.us-west-2.rds.amazonaws.com";
$db_host = "csec.nith.ac.in";
$db_username = "root";
$db_password = "qwertyuiop";
$db = "results";


$conn = new mysqli($db_host, $db_username,$db_password,$db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$name = $_POST['name'];
//$name="Mukesh";
//$sem = "14MI5421";
$query = "select * from students where name like '$name%' or name like '%$name%' or name like '%$name'";
$result = $conn->query($query);

if($result){
	$count = 0;
	$res = array();
	while($row = $result->fetch_assoc()){
		$temp = array("Name" => $row['name'], "roll_no"=>$row['roll_no'], "CGPI"=>$row['cgpi'],"Year"=>$row['year_rank'],"College"=>$row['college_rank']);
		array_push($res, $temp);
		$count++;
		
	}
	$f_res = array("result" => $res);
	echo json_encode($f_res);
	
} else{
	echo "error in fetching";
}

?>
