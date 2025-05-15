<?php
ini_set("display_errors", 1);
ini_set("display_startup_errors", 1);
error_reporting(E_ALL);

session_start();
include_once "../../../config/database.php";
$message = "";

if (!$connect) {
  die("Không kết nối được DB: " . $connect->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $username = trim($_POST["username"] ?? "");
  $password = $_POST["password"] ?? "";

  if ($username === "" || $password === "") {
    $message = "Vui lòng nhập đầy đủ thông tin!";
  } else {
    // Truy vấn user (không dùng prepare)
    $sql = "SELECT * FROM Users WHERE Username='$username'";
    $result = $connect->query($sql);

    if (!$result || $result->num_rows === 0) {
      $message = "Tên đăng nhập hoặc mật khẩu không chính xác!";
    } else {
      $user = $result->fetch_assoc();
      // Kiểm tra mật khẩu hash (bcrypt)
      if (md5($password) === $user["Password"]) {
        // Đăng nhập thành công
        $_SESSION["user_id"] = $user["UserID"];
        $_SESSION["username"] = $user["Username"];
        $_SESSION["role"] = $user["Role"];
        $_SESSION["fullname"] = $user["FullName"];
        $_SESSION["avatar"] = $user["Avatar"] ?? "/images/default-avatar.png";
        $_SESSION["last_activity"] = time();
        $_SESSION["success"] = "🎉 Đăng nhập thành công!";
        header("Location: LoginSuccess.php");
        exit();
      } else {
        $message = "Tên đăng nhập hoặc mật khẩu không chính xác!";
      }
    }
  }
}

if ($message !== "") {
    $_SESSION["login_error"] = $message;
    header("Location: login.php");
    exit();
}

?>
