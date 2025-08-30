<?php
header('Content-Type: application/json');
require_once 'conn.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);

    $id = $data['id'] ?? '';

    // Validation
    if (empty($id)) {
        echo json_encode([
            'success' => false,
            'error' => 'User ID is required.'
        ]);
        exit;
    }

    // Prepare SQL
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'User deleted successfully.'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'No user found with the given ID.'
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
?>
