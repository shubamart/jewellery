<?php
$host = "localhost";
$db = "dbnl";
$user = "root";
$pass = ""; // default in XAMPP

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM users";
$result = $conn->query($sql);

$users = array();
while ($row = $result->fetch_assoc()) {
  $users[] = $row;
}

echo json_encode($users);
$conn->close();
?>
