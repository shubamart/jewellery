<?php
$host = 'localhost';
$db   = 'dbnl';
$user = 'root';
$pass = '';

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}
//echo 'working';
?>