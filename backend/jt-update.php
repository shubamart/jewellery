<?php
header('Content-Type: application/json');
require_once 'conn.php';

try {
    // Read POST body
    $data = json_decode(file_get_contents("php://input"), true);

    $jtcode = $data['jtcode'] ?? '';
    $jtname = $data['jtname'] ?? '';

    // Validation
    if (empty($jtcode) || empty($jtname)) {
        echo json_encode([
            'success' => false,
            'error' => 'jtcode and jtname are required.'
        ]);
        exit;
    }

    // Prepare SQL
    $stmt = $conn->prepare("
        UPDATE jtmaster
        SET jtname = ?
        WHERE jtcode = ?
    ");
    $stmt->bind_param("si", $jtname, $jtcode);

    // Execute
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Item updated successfully.'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'No record found with given jtcode.'
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
