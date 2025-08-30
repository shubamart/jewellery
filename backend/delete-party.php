<?php
header('Content-Type: application/json');
require_once 'conn.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);

    $acode = $data['acode'] ?? '';

    // Validation
    if (empty($acode)) {
        echo json_encode([
            'success' => false,
            'error' => 'acode is required.'
        ]);
        exit;
    }

    // Prepare SQL
    $stmt = $conn->prepare("DELETE FROM accmaster WHERE acode = ?");
    $stmt->bind_param("i", $acode);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Party record deleted successfully.'
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
