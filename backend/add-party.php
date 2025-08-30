<?php
header('Content-Type: application/json');
require_once 'conn.php';

try {
    // Read POST body
    $data = json_decode(file_get_contents("php://input"), true);

    // If no JSON is sent, use static test record
    if (empty($data)) {
        $acode = null; // Let DB handle ID (AUTO_INCREMENT)
        $aname = "Test Party Name";
        $amobile = "9876543210";
        $username = "hari"; // Current username
    } else {
        $acode = null;
        $aname = $data['aname'] ?? '';
        $amobile = $data['amobile'] ?? '';
        $username = $data['username'] ?? '';
    }

    // Validation
    if (empty($aname) || empty($amobile) || empty($username)) {
        echo json_encode([
            'success' => false,
            'error' => 'aname, amobile, and username are required.'
        ]);
        exit;
    }

    // Prepare SQL
    $stmt = $conn->prepare("
        INSERT INTO accmaster (aname, amobile, created_at, updated_at, username)
        VALUES (?, ?, NOW(), NOW(), ?)
    ");
    $stmt->bind_param("sss", $aname, $amobile, $username);

    // Execute
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'id' => $stmt->insert_id,
            'message' => 'Party record added successfully.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => $stmt->error
        ]);
    }

    $stmt->close();
    $conn->close();

} catch (Throwable $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Server error',
        'details' => $e->getMessage()
    ]);
}
