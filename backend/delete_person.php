<?php
header('Content-Type: application/json');
require_once 'conn.php';

// Get ID from POST request
$data = json_decode(file_get_contents("php://input"), true);
$id = isset($data['id']) ? intval($data['id']) : 0;

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => "Invalid or missing ID"]);
    exit;
}

// Prepare and execute delete
$stmt = $conn->prepare("DELETE FROM people WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => "Person with ID $id deleted"]);
    } else {
        echo json_encode(['success' => false, 'message' => "No person found with ID $id"]);
    }
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
