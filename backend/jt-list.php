<?php
header('Content-Type: application/json');
require_once 'conn.php';

try {
    $result = $conn->query("SELECT jtcode, jtname FROM jtmaster ORDER BY jtcode DESC");

    $items = [];
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }

    echo json_encode([
        'success' => true,
        'data' => $items
    ]);

    $conn->close();

} catch (Throwable $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Server error',
        'details' => $e->getMessage()
    ]);
}
