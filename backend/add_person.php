<?php
header('Content-Type: application/json');
require_once 'conn.php';

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

$wusername = $data['wusername'] ?? '';
$wpassword = $data['wpassword'] ?? '';
$wusertype = $data['wusertype'] ?? 'user'; // Default user type

// Static test data
//$wusername = 'testuser123';
//$wpassword = 'TestPassword@123';
//$wusertype = 'admin'; // or 'user', 'guest', etc.

// Input validation (basic)
if (empty($wusername) || empty($wpassword)) {
    echo json_encode(['success' => false, 'error' => 'Username and password are required.']);
    exit;
}

// Hash the password
//$hashedPassword = password_hash($wpassword, PASSWORD_DEFAULT);

// Prepare and bind SQL
$stmt = $conn->prepare("INSERT INTO users (wusername, wpassword, wusertype) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $wusername, $wpassword, $wusertype);

// Execute and respond
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
