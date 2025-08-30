<?php
header('Content-Type: application/json');
require_once 'conn.php';

try {
    // Fetch all users
    $query = "SELECT id, wusername, wusertype FROM users ORDER BY id ASC";
    $result = $conn->query($query);

    $users = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        echo json_encode([
            'success' => true,
            'count' => count($users),
            'data' => $users
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'No users found.'
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
