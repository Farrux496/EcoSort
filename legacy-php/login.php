<?php
// Include database connection
include "connection.php";

// Initialize error variable
$error = "";

// Check if form is submitted
if (isset($_POST['submit'])) {
    // Get username and password from form
    $uname = mysqli_real_escape_string($conn, $_POST['uname']);
    $pword = mysqli_real_escape_string($conn, $_POST['pword']);
    
    // Validate input
    if (empty($uname)) {
        $error = "Username is required";
    } else if (empty($pword)) {
        $error = "Password is required";
    } else {
        // Check user in database
		
        $sql = "SELECT * FROM login WHERE uname='$uname' AND pword='$pword'";
        $result = mysqli_query($conn, $sql);
        
        // Check if query was successful
        if ($result === false) {
            // Query failed - display error message for debugging
            $error = "Database error: " . mysqli_error($conn);
        } 
        // If query successful, check if user exists
        else if (mysqli_num_rows($result) === 1) {
            $row = mysqli_fetch_assoc($result);
            // Start a session
            session_start();
            $_SESSION['uname'] = $row['uname'];
            $_SESSION['id'] = $row['id'];
            // Redirect to insert.php page
            header("Location: insert.php");
            exit();
        } else {
            $error = "Invalid username or password";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>E waste collection login</title>
		<link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
		<link rel="stylesheet" href="style.css">
        <style>
            /* Add some basic styling for error messages */
            .error-message {
                color: red;
                font-size: 14px;
                margin-bottom: 15px;
                text-align: center;
            }
        </style>
	</head>
	<body>
		<!-- Navigation Bar -->
		<nav class="navbar">
			<div class="logo">
				<i class="fas fa-recycle logo-icon"></i>
				<div class="logo-text">Eco-<span>Tech</span></div>
			</div>
			
			<ul class="nav-links">
				<!-- <li><a href="up.html">Home</a></li>
				<li><a href="tutorial.html">Tutorial</a></li>
				<li><a href="collections.html">Collections</a></li>
				<li><a href="stocks.html">Stocks</a></li>
				<li><a href="about.html">About</a></li> -->
				<div class="auth-buttons">
					<a href="/ewaste/up.html"><button class="btn btn-login" id="openLoginModal">Back</button></a>
				
				</div>
				<div class="close-menu">
				
				</div>
			</ul>
			
			
			<div class="toggle-menu">
				<i class="fas fa-bars"></i>
			</div>
		</nav>
		
		<div class="container">
			<div class="form-box login">
			<form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
					<h1>Login</h1>
                    
                    <?php if(!empty($error)): ?>
                    <div class="error-message"><?php echo $error; ?></div>
                    <?php endif; ?>
                    
					<div class="input-box">
						<input type="text" name="uname" placeholder="username" >
						<!-- <i class="bx bxs-user"></i> -->
					</div>
					<div class="input-box">
						<input type="password" name="pword" placeholder="password">
						<!-- <i class="bx bxs-lock-alt"></i> -->
					</div>
					<div class="forgot-link">
						<a href="#"></a>
					</div>
					<button type="submit" name="submit" class="login-btn">Login</button>
				</form>
			</div>

			<div class="form-box register">
				<form action="">
					<h1>Registration</h1>
					<div class="input-box">
						<input type="text" placeholder="Username" required>
						<!-- <i class="bx bxs-user"></i> -->
						</div>
						<div class="input-box">
							<input type="email" placeholder="Email" required>
							<!-- <i class="bx bxs-envelope"></i> -->
							</div>
						<div class="input-box">
						<input type="password" placeholder="Password" required>
						<!-- <i class="bx bxs-lock-alt"></i> -->
					</div>
					<button type="submit" class="register-btn">Register</button>
				</form>
			</div>

			<div class="toggle-box">
				<div class="toggle-panel toggle-left">
					<h1>Welcome!</h1>
					<p>Don't have an account?</p>
					<button class="btn register-toggle-btn">Register</button>
				</div>
				<div class="toggle-panel toggle-right">
					<h1>Welcome Back!</h1>
					<p>Already have an account?</p>
					<button class="btn login-toggle-btn">Login</button>
				</div>
			</div>
		</div>

		<script src="script.js"></script>
	</body>
</html>