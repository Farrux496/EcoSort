<?php
$sname="localhost";
$uname="root";
$password="";
$db_name="e_waste";

$conn = mysqli_connect($sname,$uname,$password,$db_name);
if(!$conn){
echo "connection failled";
}
else{
echo "";
}
?>