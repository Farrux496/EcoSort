<?php
include_once("connection.php");

if(isset($_POST['submit'])) {
    $name = $_POST["productName"];
    $qun = $_POST["quantity"];
    $price = $_POST["price"];
    $em = $_POST["email"];
    
    // Sanitize input to prevent SQL injection
    $name = mysqli_real_escape_string($conn, $name);
    $qun = mysqli_real_escape_string($conn, $qun);
    $price = mysqli_real_escape_string($conn, $price);
    $em = mysqli_real_escape_string($conn, $em);
    
    $sql = "INSERT INTO tblinsert(name, qun, price, email) 
            VALUES ('$name', '$qun', '$price', '$em')";

    $result = mysqli_query($conn, $sql);

    
    if($result) {
        // Redirect back with success message
        header("Location: addpro.php?status=success");
     //   echo "<script>alert('Data inserted successfully!');</script>";
        exit();
    } else {
        // Redirect back with error message
        header("Location: addpro.php?status=error&msg=" . urlencode(mysqli_error($conn)));
        exit();
    }
} else {
    // If someone accesses this file directly without submitting the form
    header("Location: addpro.php");
    exit();
}
?>