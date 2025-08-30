<?php
header('Content-Type: application/json');
require_once 'conn.php';

// Only allow POST or DELETE request
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    echo json_encode([
        'success' => false,
        'error' => 'Invalid request method'
    ]);
    exit;
}

try {
    // Read input JSON
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['jtcode'])) {
        echo json_encode([
            'success' => false,
            'error' => 'jtcode is required'
        ]);
        exit;
    }

    $jtcode = $conn->real_escape_string($input['jtcode']);

    // Prepare and execute delete query
    $stmt = $conn->prepare("DELETE FROM jtmaster WHERE jtcode = ?");
    $stmt->bind_param("s", $jtcode);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Item deleted successfully'
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'error' => 'Record not found'
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Query execution failed'
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
