<?php
require_once __DIR__ . "/../../../config/SessionInit.php";
require_once __DIR__ . "/../../../config/database.php";
?>
<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Đăng nhập</title>
    <link rel="stylesheet" href="../../../public/css/tailwind.css">
  </head>
  <body class="min-h-screen bg-[#EEF0FF] flex items-center justify-center px-4">
      <?php if (!empty($_SESSION["login_error"])): ?>
        <div class="fixed top-4 left-1/2 -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <?= htmlspecialchars($_SESSION["login_error"]) ?>
        </div>
      <?php unset($_SESSION["login_error"]);endif;
// Xóa để lần sau không hiện nữa
?>
    <div class="relative w-full max-w-sm">
      <!-- Logo circle -->
      <div class="absolute left-1/2 -translate-x-1/2 -top-12">
        <div
          class="w-24 h-24 bg-[#EEF0FF] rounded-full border-3 border-[#7C64F0] flex items-center justify-center shadow-md"
        >
          <img src="../../../public/images/cubeflow-logo.png" alt="Cube Flow" class="w-23 h-23 rounded-full" />
        </div>
      </div>
      
      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-lg pt-14 px-6 pb-8">
        <!-- Title -->
        <h2 class="text-center text-[#7C64F0] text-2xl font-bold mb-6">
          Cube Flow
        </h2>
        
        <!-- Form -->
        <form action="LoginProcess.php" method="POST" class="space-y-4">
        
          <!-- Username -->
          <div class="flex items-center bg-[#9A94E5] rounded-xl h-12 px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 text-white mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <input
              type="text"
              name="username"
              placeholder="Tài khoản"
              class="w-full bg-transparent placeholder-white placeholder-opacity-90 focus:outline-none text-white"
              required
            />
          </div>
          
          <!-- Password -->
          <div class="flex items-center bg-[#9A94E5] rounded-xl h-12 px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 text-white mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              class="w-full bg-transparent placeholder-white placeholder-opacity-90 focus:outline-none text-white"
              required
            />
          </div>
          
          <!-- Login button -->
          <button
            type="submit"
            class="w-full h-10 bg-[#2970FF] hover:bg-[#bddef5] text-white font-semibold rounded-xl transition"
          >
            Đăng nhập
          </button>
        </form>
        
        <!-- Forgot password -->
        <div class="mt-4 text-center">
          <a href="#" class="text-[#272E71] text-sm hover:underline font-semibold">
            Quên mật khẩu?
          </a>
        </div>
        
        <!-- Register link -->
        <p class="mt-2 text-center text-gray-800 text-sm">
          Bạn chưa có tài khoản?
          <a href="register.php" class="text-[#2970FF] font-semibold hover:underline">
            Đăng ký tại đây
          </a>
        </p>
      </div>
    </div>
  </body>
</html>