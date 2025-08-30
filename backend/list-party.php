<?php
header('Content-Type: application/json');
require_once 'conn.php';

try {
    // Fetch all records
    $query = "SELECT acode, aname, amobile, created_at, updated_at, username FROM accmaster ORDER BY created_at DESC";
    $result = $conn->query($query);

    $parties = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $parties[] = $row;
        }
        echo json_encode([
            'success' => true,
            'count' => count($parties),
            'data' => $parties
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'No records found.'
        ]);
    }

    $conn->close();

} catch (Throwable $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Server error',
        'details' => $e->getMessage()
    ]);
}
