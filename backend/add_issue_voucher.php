<?php
header('Content-Type: application/json');
require_once 'conn.php';

try {
    $data = json_decode(file_get_contents("php://input"), true);

    $acode = $data['acode'] ?? '';
    $vdate = $data['vdate'] ?? '';
    $pname = $data['pname'] ?? '';
    $issuegrosswt = isset($data['issuegrosswt']) && $data['issuegrosswt'] !== '' ? floatval($data['issuegrosswt']) : 0;
    $issuedwt     = isset($data['issuedwt']) && $data['issuedwt'] !== '' ? floatval($data['issuedwt']) : 0;
$issuestwt    = isset($data['issuestwt']) && $data['issuestwt'] !== '' ? floatval($data['issuestwt']) : 0;
$issuetotalwt = isset($data['issuetotalwt']) && $data['issuetotalwt'] !== '' ? floatval($data['issuetotalwt']) : 0;
    $status = $data['status'] ?? '';
    $wpurity = $data['wpurity'] ?? '';
    $issuewastage = isset($data['issuewastage']) && $data['issuewastage'] !== '' ? floatval($data['issuewastage']) : 0;
    $wastagerate  = isset($data['wastagerate']) && $data['wastagerate'] !== '' ? intval($data['wastagerate']) : 0;
    $remarks = $data['remarks'] ?? '';
    $wusername = $data['wusername'] ?? '';
    $pid = $data['pid'] ?? 0;

    if (empty($acode) || empty($vdate) || empty($pname)) {
        echo json_encode(['success' => false, 'error' => 'acode, vdate, and pname are required.']);
        exit;
    }

    // Insert into jvoucherdet
    $stmt = $conn->prepare("
        INSERT INTO jvoucherdet (
            acode, vdate, pname, issuegrosswt, issuedwt, issuestwt, issuetotalwt,
            status, wpurity, issuewastage, wastagerate, remarks, wusername, pid
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("issddddsdisssi", 
    $acode,       // i
    $vdate,       // s
    $pname,       // s
    $issuegrosswt,// d
    $issuedwt,    // d
    $issuestwt,   // d
    $issuetotalwt,// d
    $status,      // s
    $wpurity,     // s
    $issuewastage,// d
    $wastagerate, // i
    $remarks,     // s
    $wusername,   // s
    $pid          // i
);


    if ($stmt->execute()) {
        $vno = $stmt->insert_id; // Voucher number (auto id)

        // Insert into transactions
        $flag = ($status === 'Credit') ? 'RECEIVED' : 'ISSUED';
        $wwastage = ($status === 'Credit') ? 0 : $issuewastage; // only debit uses issuewastage

        $stmt2 = $conn->prepare("
        INSERT INTO transactions (tdate, acode, status, transcode, flag, wwastage, wtotalwt, username, pname)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt2->bind_param("sssisdsss",
        $vdate, $acode, $status, $vno, $flag, $issuewastage, $issuetotalwt, $wusername, $pname
        );

        $stmt2->execute();
        $stmt2->close();

        echo json_encode([
            'success' => true,
            'vno' => $vno,
            'message' => 'Issue voucher added successfully and transaction recorded.'
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => $stmt->error]);
    }

    $stmt->close();
    $conn->close();

} catch (Throwable $e) {
    echo json_encode(['success' => false, 'error' => 'Server error', 'details' => $e->getMessage()]);
}
?>
