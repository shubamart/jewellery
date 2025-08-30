<?php
header('Content-Type: application/json');
require_once 'conn.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);

    $acode = $data['acode'] ?? '';
    $aname = $data['aname'] ?? '';
    $amobile = $data['amobile'] ?? '';
    $username = $data['username'] ?? '';

    // Validation
    if (empty($acode) || empty($aname) || empty($amobile) || empty($username)) {
        echo json_encode([
            'success' => false,
            'error' => 'acode, aname, amobile, and username are required.'
        ]);
        exit;
    }

    // Prepare SQL
    $stmt = $conn->prepare("
        UPDATE accmaster
        SET aname = ?, amobile = ?, username = ?, updated_at = NOW()
        WHERE acode = ?
    ");
    $stmt->bind_param("sssi", $aname, $amobile, $username, $acode);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Party record updated successfully.'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'No record found with the given acode.'
            ]);
        }
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
