<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

require_once 'conn.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);

    $wusername = $data['wusername'] ?? '';
    $wpassword = $data['wpassword'] ?? '';

    if (empty($wusername) || empty($wpassword)) {
        echo json_encode(['success' => false, 'error' => 'Username and password are required.']);
        exit;
    }

    $stmt = $conn->prepare("SELECT id, wusername, wusertype FROM users WHERE wusername = ? AND wpassword = ?");
    $stmt->bind_param("ss", $wusername, $wpassword);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid username or password.']);
    }

    $stmt->close();
    $conn->close();
} catch (Throwable $e) {
    echo json_encode(['success' => false, 'error' => 'Server error', 'details' => $e->getMessage()]);
}
