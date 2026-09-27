<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tutorial - E-Waste Recycling System</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary-green: #2ecc71;
            --dark-green: #27ae60;
            --light-green: #a9dfbf;
            --accent-green: #1abc9c;
            --white: #ffffff;
            --light-gray: #f5f5f5;
            --dark-gray: #333333;
            --medium-gray: #95a5a6;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background-color: var(--light-gray);
            color: var(--dark-gray);
            overflow-x: hidden;
        }
        
        /* Navigation Bar */
       /* Navigation Bar Styles */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--white);
    padding: 1rem 5%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
    transition: all 0.3s ease;
}

.navbar.scrolled {
    padding: 0.7rem 5%;
    background-color: rgba(255, 255, 255, 0.95);
}

.logo {
    display: flex;
    align-items: center;
}

.logo-icon {
    color: var(--primary-green);
    font-size: 1.8rem;
    margin-right: 0.5rem;
}

.logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--dark-gray);
}

.logo-text span {
    color: var(--primary-green);
}

.nav-links {
    display: flex;
    list-style: none;
    align-items: center;
}

.nav-links li {
    margin: 0 1rem;
}

.nav-links a {
    text-decoration: none;
    color: var(--dark-gray);
    font-weight: 500;
    font-size: 1rem;
    position: relative;
    transition: all 0.3s ease;
}

.nav-links a:hover, .nav-links a.active {
    color: var(--primary-green);
}

.nav-links a::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--primary-green);
    transition: width 0.3s ease;
}

.nav-links a:hover::after, .nav-links a.active::after {
    width: 100%;
}

.auth-buttons {
    display: flex;
    gap: 1rem;
    margin-left: 1rem;
}

.btn-login, .btn-register {
    padding: 0.6rem 1.2rem;
    border-radius: 50px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    font-size: 0.9rem;
}

.btn-login {
    background-color: transparent;
    border: 1px solid var(--primary-green);
    color: var(--primary-green);
}

.btn-login:hover {
    background-color: var(--primary-green);
    color: var(--white);
}

.btn-register {
    background-color: var(--primary-green);
    color: var(--white);
    border: 1px solid var(--primary-green);
}

.btn-register:hover {
    background-color: var(--dark-green);
    border-color: var(--dark-green);
}

.toggle-menu {
    display: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--dark-gray);
}

        /* Page Content */
        .main-content {
            padding-top: 100px;
            min-height: calc(100vh - 400px); /* Account for navbar and footer */
        }
        
        .tutorial-header {
            background-color: var(--primary-green);
            color: var(--white);
            padding: 4rem 2rem;
            text-align: center;
        }
        
        .tutorial-header h1 {
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
        }
        
        .tutorial-header p {
            font-size: 1.1rem;
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.6;
        }
        
        .tutorial-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 3rem 2rem;
        }
        
        .tutorial-section {
            margin-bottom: 4rem;
        }
        
        .tutorial-section:last-child {
            margin-bottom: 0;
        }
        
        .tutorial-section h2 {
            font-size: 2rem;
            margin-bottom: 1.5rem;
            color: var(--dark-gray);
            position: relative;
            display: inline-block;
        }
        
        .tutorial-section h2::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 0;
            width: 100%;
            height: 3px;
            background-color: var(--primary-green);
        }
        
        .tutorial-section p {
            font-size: 1.1rem;
            line-height: 1.6;
            color: var(--medium-gray);
            margin-bottom: 1.5rem;
        }
        
        .tutorial-steps {
            counter-reset: step-counter;
            list-style: none;
            margin: 2rem 0;
        }
        
        .tutorial-step {
            display: flex;
            margin-bottom: 2.5rem;
            position: relative;
        }
        
        .tutorial-step:last-child {
            margin-bottom: 0;
        }
        
        .step-number {
            flex: 0 0 60px;
            height: 60px;
            border-radius: 50%;
            background-color: var(--primary-green);
            color: var(--white);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.5rem;
            font-weight: 700;
            margin-right: 1.5rem;
            position: relative;
        }
        
        .step-number::before {
            counter-increment: step-counter;
            content: counter(step-counter);
        }
        
        .step-number::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            width: 2px;
            height: calc(100% + 30px);
            background-color: var(--light-green);
            transform: translateX(-50%);
        }
        
        .tutorial-step:last-child .step-number::after {
            display: none;
        }
        
        .step-content {
            flex: 1;
        }
        
        .step-title {
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 0.8rem;
            color: var(--dark-gray);
        }
        
        .step-description {
            font-size: 1rem;
            line-height: 1.6;
            color: var(--medium-gray);
        }
        
        .tutorial-image {
            border-radius: 10px;
            overflow: hidden;
            margin: 2rem 0;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .tutorial-image img {
            width: 100%;
            height: auto;
            display: block;
        }
        
        .tutorial-note {
            background-color: rgba(46, 204, 113, 0.1);
            border-left: 4px solid var(--primary-green);
            padding: 1.5rem;
            margin: 2rem 0;
            border-radius: 5px;
        }
        
        .tutorial-note h3 {
            font-size: 1.2rem;
            margin-bottom: 0.8rem;
            color: var(--dark-gray);
        }
        
        .tutorial-note p {
            font-size: 1rem;
            margin-bottom: 0;
        }
        
        .tutorial-video {
            margin: 2rem 0;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .video-container {
            position: relative;
            padding-bottom: 56.25%; /* 16:9 aspect ratio */
            height: 0;
            overflow: hidden;
        }
        
        .video-container img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .video-play-button {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80px;
            height: 80px;
            background-color: rgba(46, 204, 113, 0.9);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .video-play-button:hover {
            background-color: var(--primary-green);
            transform: translate(-50%, -50%) scale(1.1);
        }
        
        .video-play-button i {
            color: var(--white);
            font-size: 2rem;
            margin-left: 8px; /* Offset for the play icon */
        }
        
        .cta-box {
            background-color: var(--dark-green);
            padding: 3rem 2rem;
            border-radius: 10px;
            text-align: center;
            color: var(--white);
            margin: 3rem 0;
        }
        
        .cta-box h3 {
            font-size: 1.8rem;
            margin-bottom: 1rem;
        }
        
        .cta-box p {
            font-size: 1.1rem;
            margin-bottom: 2rem;
            color: rgba(255, 255, 255, 0.9);
        }
        
        .cta-buttons {
            display: flex;
            justify-content: center;
            gap: 1rem;
        }
        
        .btn-white {
            background-color: var(--white);
            color: var(--dark-green);
            border: 1px solid var(--white);
        }
        
        .btn-white:hover {
            background-color: transparent;
            color: var(--white);
        }
        
        .btn-outline-white {
            background-color: transparent;
            color: var(--white);
            border: 1px solid var(--white);
        }
        
        .btn-outline-white:hover {
            background-color: var(--white);
            color: var(--dark-green);
        }
        
        /* Footer Section */
        .footer {
            background-color: var(--dark-gray);
            color: var(--white);
            padding: 4rem 2rem 2rem;
        }
        
        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 3rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .footer-info {
            max-width: 350px;
        }
        
        .footer-logo {
            display: flex;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .footer-logo-icon {
            color: var(--primary-green);
            font-size: 1.5rem;
            margin-right: 0.5rem;
        }
        
        .footer-logo-text {
            font-size: 1.3rem;
            font-weight: 700;
            color: var(--white);
        }
        
        .footer-logo-text span {
            color: var(--primary-green);
        }
        
        .footer-description {
            font-size: 0.95rem;
            line-height: 1.6;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 1.5rem;
        }
        
        .footer-social {
            display: flex;
            gap: 1rem;
        }
        
        .social-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.1);
            color: var(--white);
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        .social-icon:hover {
            background-color: var(--primary-green);
            transform: translateY(-3px);
        }
        
        .footer-title {
            font-size: 1.2rem;
            margin-bottom: 1.5rem;
            position: relative;
            padding-bottom: 0.5rem;
        }
        
        .footer-title::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 50px;
            height: 2px;
            background-color: var(--primary-green);
        }
        
        .footer-links {
            list-style: none;
        }
        
        .footer-links li {
            margin-bottom: 0.8rem;
        }
        
        .footer-links a {
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            transition: all 0.3s ease;
            font-size: 0.95rem;
        }
        
        .footer-links a:hover {
            color: var(--primary-green);
            padding-left: 5px;
        }
        
        .footer-contact-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 1rem;
        }
        
        .contact-icon {
            color: var(--primary-green);
            font-size: 1rem;
            margin-right: 1rem;
            min-width: 20px;
        }
        
        .contact-text {
            font-size: 0.95rem;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.5;
        }
        
        .footer-bottom {
            max-width: 1200px;
            margin: 0 auto;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 2rem;
            margin-top: 3rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .copyright {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.5);
        }
        
        .footer-bottom-links {
            display: flex;
            gap: 1.5rem;
        }
        
        .footer-bottom-links a {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.5);
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        .footer-bottom-links a:hover {
            color: var(--primary-green);
        }
        
        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            z-index: 1001;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.5);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .modal.show {
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 1;
        }
        
        .modal-content {
            background-color: var(--white);
            border-radius: 10px;
            padding: 2rem;
            width: 90%;
            max-width: 500px;
            transform: translateY(-50px);
            transition: transform 0.3s ease;
            position: relative;
        }
        
        .modal.show .modal-content {
            transform: translateY(0);
        }
        
        .close-modal {
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 1.5rem;
            color: var(--medium-gray);
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .close-modal:hover {
            color: var(--dark-gray);
        }
        
        .modal-title {
            font-size: 1.8rem;
            margin-bottom: 1.5rem;
            color: var(--dark-gray);
            text-align: center;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-size: 0.95rem;
            color: var(--dark-gray);
            font-weight: 500;
        }
        
        .form-input {
            width: 100%;
            padding: 0.8rem 1rem;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        .form-input:focus {
            outline: none;
            border-color: var(--primary-green);
            box-shadow: 0 0 0 2px rgba(46, 204, 113, 0.2);
        }
        
        .form-button {
            width: 100%;
            padding: 1rem;
            background-color: var(--primary-green);
            color: var(--white);
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .form-button:hover {
            background-color: var(--dark-green);
        }
        
        .form-footer {
            text-align: center;
            margin-top: 1.5rem;
            font-size: 0.9rem;
            color: var(--medium-gray);
        }
        
        .form-footer a {
            color: var(--primary-green);
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .form-footer a:hover {
            color: var(--dark-green);
        }
        
        /* Animations */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fade-in {
            animation: fadeIn 0.8s ease forwards;
        }
        
        .delay-1 {
            animation-delay: 0.1s;
        }
        
        .delay-2 {
            animation-delay: 0.3s;
        }
        
        .delay-3 {
            animation-delay: 0.5s;
        }
        
        .delay-4 {
            animation-delay: 0.7s;
        }
        
        /* Responsive styles */
        @media (max-width: 992px) {
            .tutorial-container {
                padding: 2rem;
            }
        }
        
        @media (max-width: 768px) {
            .navbar {
                padding: 1rem 5%;
            }
            
            .toggle-menu {
                display: block;
            }
            
            .nav-links {
                position: fixed;
                top: 0;
                right: -100%;
                flex-direction: column;
                background-color: var(--white);
                width: 70%;
                height: 100vh;
                padding: 5rem 2rem;
                transition: all 0.5s ease;
                box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
                z-index: 999;
            }
            
            .nav-links.active {
                right: 0;
            }
            
            .nav-links li {
                margin: 1.5rem 0;
            }
            
            .close-menu {
                position: absolute;
                top: 20px;
                right: 20px;
                font-size: 1.5rem;
                color: var(--dark-gray);
                cursor: pointer;
            }
            
            .tutorial-header h1 {
                font-size: 2rem;
            }
            
            .tutorial-section h2 {
                font-size: 1.8rem;
            }
            
            .step-number {
                flex: 0 0 50px;
                height: 50px;
                font-size: 1.3rem;
            }
            
            .step-title {
                font-size: 1.2rem;
            }
            
            .cta-buttons {
                flex-direction: column;
                align-items: center;
                gap: 1rem;
            }
            
            .btn {
                width: 100%;
                max-width: 300px;
            }
            
            .footer-content {
                gap: 2rem;
            }
        }
        
        @media (max-width: 576px) {
            .tutorial-header {
                padding: 3rem 1.5rem;
            }
            
            .tutorial-container {
                padding: 2rem 1.5rem;
            }
            
            .tutorial-header h1 {
                font-size: 1.8rem;
            }
            
            .tutorial-section h2 {
                font-size: 1.5rem;
            }
            
            .tutorial-step {
                flex-direction: column;
            }
            
            .step-number {
                margin-bottom: 1rem;
                margin-right: 0;
            }
            
            .step-number::after {
                display: none;
            }
            
            .footer-bottom {
                flex-direction: column;
                text-align: center;
                gap: 1.5rem;
            }
            
            .footer-bottom-links {
                justify-content: center;
                flex-wrap: wrap;
            }
        }
        
        /* New Stock Table Styles */
        .stock-container {
            max-width: 1200px;
            margin: 120px auto 50px;
            padding: 0 2rem;
        }
        
        .stock-header {
            margin-bottom: 30px;
        }
        
        .stock-header h2 {
            font-size: 2rem;
            color: var(--dark-gray);
            position: relative;
            display: inline-block;
            padding-bottom: 10px;
        }
        
        .stock-header h2::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background-color: var(--primary-green);
        }
        
        .stock-table-container {
            background-color: var(--white);
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            animation: fadeIn 0.5s ease-out;
        }
        
        .stock-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .stock-table th {
            background-color: var(--primary-green);
            color: var(--white);
            font-weight: 600;
            text-align: left;
            padding: 16px 20px;
            font-size: 1rem;
            text-transform: uppercase;
        }
        
        .stock-table td {
            padding: 16px 20px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            color: var(--dark-gray);
            font-size: 1rem;
        }
        
        .stock-table tr:nth-child(even) {
            background-color: rgba(46, 204, 113, 0.05);
        }
        
        .stock-table tr:last-child td {
            border-bottom: none;
        }
        
        .stock-table tr:hover {
            background-color: rgba(46, 204, 113, 0.1);
            transition: background-color 0.3s ease;
        }
        
        .empty-message {
            text-align: center;
            padding: 30px;
            color: var(--medium-gray);
            font-size: 1.1rem;
        }
        
        @media (max-width: 768px) {
            .stock-table th, 
            .stock-table td {
                padding: 12px 15px;
                font-size: 0.9rem;
            }
            
            .stock-header h2 {
                font-size: 1.8rem;
            }
        }
        
        @media (max-width: 576px) {
            .stock-table {
                display: block;
                overflow-x: auto;
                white-space: nowrap;
            }
            
            .stock-table th, 
            .stock-table td {
                padding: 10px 12px;
                font-size: 0.85rem;
            }
            
            .stock-header h2 {
                font-size: 1.5rem;
            }
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
            <li><a href="index.html">Home</a></li>
            <li><a href="/ewaste/tutorial.html" >Tutorial</a></li>
            <li><a href="/ewaste/collections.html"class="active">Collections</a></li>
            <li><a href="/ewaste/cart.html">Stocks</a></li>
            <li><a href="/ewaste/about.html">About</a></li>
            <div class="auth-buttons">
                <a href="addpro.php"><button class="btn btn-login" id="openLoginModal">+Add Item</button></a>
                <a href="login.php"><button class="btn btn-register" id="openRegisterModal">Logout</button></a>
            </div>
            <div class="close-menu">
             
            </div>
        </ul>
        
        
        <div class="toggle-menu">
            <i class="fas fa-bars"></i>
        </div>
    </nav>

   <?php
include_once("connection.php");

// Handle delete request using multiple fields
if (isset($_GET['name'], $_GET['email'], $_GET['qun'], $_GET['price'])) {
    $name = $conn->real_escape_string($_GET['name']);
    $email = $conn->real_escape_string($_GET['email']);
    $qun = intval($_GET['qun']);
    $price = floatval($_GET['price']);

    $deleteSql = "DELETE FROM tblinsert 
                  WHERE name='$name' AND email='$email' AND qun=$qun AND price=$price 
                  LIMIT 1";
    $conn->query($deleteSql);
}

// Fetch data
$sql = "SELECT name, qun, price, email FROM tblinsert";
$result = $conn->query($sql);
?>

<style>
    .cancel-button {
        color: white;
        background-color: red;
        padding: 6px 12px;
        text-decoration: none;
        border-radius: 5px;
        
        transition: background-color 0.3s ease;
    }

   
</style>

<div class="stock-container">
    <div class="stock-header">
        <h2>My Stocks</h2>
    </div>

    <div class="stock-table-container">
        <?php
        if ($result && $result->num_rows > 0) {
            echo "<table class='stock-table'>";
            echo "<tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Email</th>
                    <th style='text-align:right;'></th>
                  </tr>";

            while ($row = $result->fetch_assoc()) {
                $name = urlencode($row["name"]);
                $email = urlencode($row["email"]);
                $qun = $row["qun"];
                $price = $row["price"];

                echo "<tr>
                        <td>" . htmlspecialchars($row["name"]) . "</td>
                        <td>" . htmlspecialchars($row["qun"]) . "</td>
                        <td>" . htmlspecialchars($row["price"]) . "</td>
                        <td>" . htmlspecialchars($row["email"]) . "</td>
                        <td style='text-align:right;'>
                            <a class='cancel-button'
                               href='insert.php?name=$name&email=$email&qun=$qun&price=$price'
                               onclick=\"return confirm('Are you sure you want to cancel this order?');\">
                               Cancel Order
                            </a>
                        </td>
                      </tr>";
            }

            echo "</table>";
        } else {
            echo "<div class='empty-message'>No stock records found.</div>";
        }

        $conn->close();
        ?>
        </div>
    </div>


   <!-- Footer Section -->
   <footer class="footer">
    <div class="footer-content">
        <div class="footer-info">
            <div class="footer-logo">
                <i class="fas fa-recycle footer-logo-icon"></i>
                <div class="footer-logo-text">E-<span>Waste</span></div>
            </div>
            <p class="footer-description">
                We are committed to providing innovative and sustainable solutions for electronic waste management, helping create a cleaner future for our planet.
            </p>
            <div class="footer-social">
                <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
                <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
                <a href="#" class="social-icon"><i class="fab fa-linkedin-in"></i></a>
            </div>
        </div>
        
        <div class="footer-links-section">
            <h3 class="footer-title">Quick Links</h3>
            <ul class="footer-links">
                <li><a href="#">Home</a></li>
                <li><a href="#">Tutorial</a></li>
                <li><a href="#">Collections</a></li>
                <li><a href="#">Stocks</a></li>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </div>
        
        <div class="footer-links-section">
            <h3 class="footer-title">Our Services</h3>
            <ul class="footer-links">
                <li><a href="#">E-Waste Collection</a></li>
                <li><a href="#">Recycling Process</a></li>
                <li><a href="#">Data Security</a></li>
                <li><a href="#">Certification</a></li>
                <li><a href="#">Corporate Programs</a></li>
            </ul>
        </div>
        
        <div class="footer-links-section">
            <h3 class="footer-title">Contact Us</h3>
            <div class="footer-contact-item">
                <i class="fas fa-map-marker-alt contact-icon"></i>
                <div class="contact-text">No 12 Peradeniya Kandy</div>
            </div>
            <div class="footer-contact-item">
                <i class="fas fa-phone-alt contact-icon"></i>
                <div class="contact-text">
                    077 111 2222</div>
            </div>
            <div class="footer-contact-item">
                <i class="fas fa-envelope contact-icon"></i>
                <div class="contact-text">
                    ecotech@gmail.com</div>
            </div>
            <div class="footer-contact-item">
                <i class="fas fa-clock contact-icon"></i>
                <div class="contact-text">Mon - Fri: 9:00 AM - 6:00 PM</div>
            </div>
        </div>
    </div>
    
    <div class="footer-bottom">
        <div class="copyright">© 2025 E-Waste Recycling System. All Rights Reserved.</div>
        <div class="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Sitemap</a>
        </div>
    </div>
</footer>