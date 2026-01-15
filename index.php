<?php
/**
 * BBSMART Plus - Laragon Entry Point
 * This file helps you run the Node.js application within Laragon.
 */

$node_port = 3000;
$app_name = "BBSMART Plus";

// Check if Node server is running
$connection = @fsockopen('localhost', $node_port);
$is_running = is_resource($connection);
if ($is_running) {
    fclose($connection);
}

?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $app_name; ?> - Laragon Manager</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .card { border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .status-dot { height: 15px; width: 15px; border-radius: 50%; display: inline-block; }
        .online { background-color: #28a745; }
        .offline { background-color: #dc3545; }
    </style>
</head>
<body>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card p-4">
                    <h2 class="text-center mb-4"><?php echo $app_name; ?></h2>
                    
                    <div class="alert <?php echo $is_running ? 'alert-success' : 'alert-warning'; ?> d-flex align-items-center">
                        <span class="status-dot <?php echo $is_running ? 'online' : 'offline'; ?> me-2"></span>
                        <div>
                            <strong>สถานะเซิร์ฟเวอร์:</strong> 
                            <?php echo $is_running ? "กำลังทำงาน (Online)" : "ยังไม่ได้เริ่มทำงาน (Offline)"; ?>
                        </div>
                    </div>

                    <?php if ($is_running): ?>
                        <div class="text-center mt-3">
                            <p>เซิร์ฟเวอร์ Node.js พร้อมใช้งานแล้ว</p>
                            <a href="http://localhost:<?php echo $node_port; ?>" class="btn btn-primary btn-lg px-5">เข้าสู่แอปพลิเคชัน</a>
                        </div>
                    <?php else: ?>
                        <div class="mt-3">
                            <h5>วิธีเริ่มต้นใช้งานบน Laragon:</h5>
                            <ol>
                                <li>เปิดโฟลเดอร์โครงการใน Laragon</li>
                                <li>รันไฟล์ <code>run_on_laragon.bat</code> เพื่อเริ่มเซิร์ฟเวอร์</li>
                                <li>เมื่อเซิร์ฟเวอร์เริ่มแล้ว ให้รีเฟรชหน้านี้</li>
                            </ol>
                            <div class="alert alert-info">
                                <strong>Tip:</strong> คุณสามารถตั้งค่า Nginx ให้ใช้ชื่อ <code>bbsmart-plus.test</code> ได้โดยดูคู่มือในไฟล์ <code>laragon_nginx.conf</code>
                            </div>
                        </div>
                    <?php endif; ?>

                    <hr>
                    <div class="text-muted small">
                        <p>Project Path: <code><?php echo __DIR__; ?></code></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
