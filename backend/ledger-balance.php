<?php
header('Content-Type: application/json');
require_once 'conn.php';

try {
    // Get params
    $acode     = isset($_GET['acode']) ? $_GET['acode'] : null;
    $from_date = isset($_GET['from_date']) ? $_GET['from_date'] : null;
    $to_date   = isset($_GET['to_date']) ? $_GET['to_date'] : null;

    // Validate input
    if (!$acode || !$from_date || !$to_date) {
        echo json_encode([
            'success' => false,
            'error' => 'Missing required parameters (acode, from_date, to_date)'
        ]);
        exit;
    }

    // --- Calculate Total Balance ---
    $sqlBalance = "
        SELECT 
            SUM(
                CASE 
                    WHEN status = 'debit' THEN -wtotalwt		
                    WHEN status = 'credit' THEN wtotalwt		
                    ELSE 0
                END
            ) AS total_balance
        FROM transactions
        WHERE acode = ? AND tdate BETWEEN ? AND ?;
    ";

    $stmt = $conn->prepare($sqlBalance);
    $stmt->bind_param("iss", $acode, $from_date, $to_date);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $total_balance = $row['total_balance'] ?? 0;
    $stmt->close();

    // --- Get Transactions List ---
    $sqlList = "
        SELECT 
            transvno,
            pname,
            tdate,
            status,
            CASE 
                WHEN status = 'debit' THEN -wtotalwt	
                WHEN status = 'credit' THEN wtotalwt	
                ELSE 0
            END AS wtotalwt	
        FROM transactions
        WHERE acode = ? AND tdate BETWEEN ? AND ?
        ORDER BY tdate ASC, transvno ASC;
    ";

    $stmt = $conn->prepare($sqlList);
    $stmt->bind_param("iss", $acode, $from_date, $to_date);
    $stmt->execute();
    $result = $stmt->get_result();

    $transactions = [];
    while ($row = $result->fetch_assoc()) {
        $transactions[] = $row;
    }
    $stmt->close();

    // --- Final Response ---
    echo json_encode([
        'success' => true,
        'acode' => $acode,
        'from_date' => $from_date,
        'to_date' => $to_date,
        'total_balance' => $total_balance,
        'transactions' => $transactions
    ]);

    $conn->close();

} catch (Throwable $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Server error',
        'details' => $e->getMessage()
    ]);
}
