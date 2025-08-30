<?php
header('Content-Type: application/json');
require_once 'conn.php';

try {
    // Read POST body
    $data = json_decode(file_get_contents("php://input"), true);

    // Extract values
    $jtname = $data['jtname'] ?? '';

    // Validation
    if (empty($jtname)) {
        echo json_encode([
            'success' => false,
            'error' => 'jtname is required.'
        ]);
        exit;
    }

    // Prepare SQL
    $stmt = $conn->prepare("
        INSERT INTO jtmaster (jtname)
        VALUES (?)
    ");
    $stmt->bind_param("s", $jtname);

    // Execute
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'id' => $stmt->insert_id,
            'message' => 'Item added successfully.'
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
