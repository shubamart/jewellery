<?php
header('Content-Type: application/json');
require_once 'conn.php';  // include the connection

$sql = "SELECT * FROM people";
$result = $conn->query($sql);

$people = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $people[] = $row;
    }
}

echo json_encode($people);
$conn->close();
?>
