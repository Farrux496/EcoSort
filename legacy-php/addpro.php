<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Waste Recycling System - Add Product</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* CSS styles remain the same */
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
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
        }
        
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
        
        .container {
            width: 80%;
            max-width: 1000px;
            margin: 100px auto 30px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            display: flex;
            overflow: hidden;
        }
        
        .form-section {
            flex: 1;
            padding: 30px;
        }
        
        .image-section {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #e8f5e9;
            padding: 20px;
        }
        
        h1 {
            color: #2e7d32;
            margin-bottom: 25px;
            text-align: center;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #2e7d32;
        }
        
        input[type="text"],
        input[type="number"],
        input[type="email"] {
            width: 100%;
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 16px;
            box-sizing: border-box;
            transition: border-color 0.3s;
        }
        
        input[type="text"]:focus,
        input[type="number"]:focus,
        input[type="email"]:focus {
            border-color: #2e7d32;
            outline: none;
            box-shadow: 0 0 5px rgba(46, 125, 50, 0.3);
        }
        
        .buttons {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }
        
        button {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: background-color 0.3s;
        }
        
        .submit-btn {
            background-color: #2e7d32;
            color: white;
        }
        
        .submit-btn:hover {
            background-color: #1b5e20;
        }
        
        .clear-btn {
            background-color: #e8f5e9;
            color: #2e7d32;
            border: 1px solid #2e7d32;
        }
        
        .clear-btn:hover {
            background-color: #c8e6c9;
        }
        
        img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        
        .logo h2 {
            color: #2e7d32;
            margin: 5px 0;
        }
        
        .logo p {
            color: #5a5a5a;
            margin: 0;
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
        
        /* Error message styling */
        .error-message {
            color: #e74c3c;
            font-size: 0.9rem;
            margin-top: 5px;
            display: none;
        }
        
        /* Success message styling */
        .success-message {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 20px;
            display: none;
        }
        
        /* Responsive styles */
        @media (max-width: 992px) {
            .container {
                width: 90%;
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
            
            .container {
                flex-direction: column;
            }
            
            .image-section {
                order: -1;
                padding: 30px;
            }
            
            .buttons {
                flex-direction: column;
            }
        }
        
        @media (max-width: 576px) {
            .container {
                width: 95%;
                margin: 80px auto 20px;
            }
            
            .form-section {
                padding: 20px;
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
            <!-- <li><a href="index.html">Home</a></li>
            <li><a href="tutorial.html">Tutorial</a></li>
            <li><a href="collections.html" class="active">Collections</a></li>
            <li><a href="stocks.html">Stocks</a></li>
            <li><a href="about.html">About</a></li> -->
            <div class="auth-buttons">
                <a href="insert.php"><button class="btn btn-login">My Shop</button></a>
                <a href="login.php"><button class="btn btn-register" id="logoutBtn">Logout</button></a>
            </div>
            <div class="close-menu"></div>
        </ul>
        
        <div class="toggle-menu">
            <i class="fas fa-bars"></i>
        </div>
    </nav>

    <div class="container">
        <div class="image-section">
            <img src="fo.jpg" alt="E-waste Recycling Image">
        </div>
        
        <div class="form-section">
            <div class="logo">
                <h2>E-Waste Collection</h2>
            </div>
            
            <!-- Success message container -->
            <div id="successMessage" class="success-message"></div>
            
            <form id="collectionForm" method="post" action="insertproduct.php">
                <div class="form-group">
                    <label for="productName">Product Name</label>
                    <input type="text" id="productName" name="productName" placeholder="Enter electronic product name" required>
                    <div id="productNameError" class="error-message"></div>
                </div>
                
                <div class="form-group">
                    <label for="quantity">Quantity</label>
                    <input type="number" id="quantity" name="quantity" min="1" placeholder="Enter quantity" required>
                    <div id="quantityError" class="error-message"></div>
                </div>
                
                <div class="form-group">
                    <label for="price">Price (Rs)</label>
                    <input type="number" id="price" name="price"  placeholder="Enter estimated price" required>
                    <div id="priceError" class="error-message"></div>
                </div>
                
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="Enter your email address" required>
                    <div id="emailError" class="error-message"></div>
                </div>
                
                <div class="buttons">
                    <button type="submit" class="submit-btn" name="submit">Submit</button>
                    <button type="reset" class="clear-btn">Clear</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Form validation function
            function validateForm() {
                let isValid = true;
                const productName = document.getElementById('productName').value.trim();
                const quantity = document.getElementById('quantity').value.trim();
                const price = document.getElementById('price').value.trim();
                const email = document.getElementById('email').value.trim();
                
                // Reset error messages
                document.getElementById('productNameError').style.display = 'none';
                document.getElementById('quantityError').style.display = 'none';
                document.getElementById('priceError').style.display = 'none';
                document.getElementById('emailError').style.display = 'none';
                
                // Validate Product Name
                if (productName === '') {
                    document.getElementById('productNameError').textContent = 'Please enter a product name';
                    document.getElementById('productNameError').style.display = 'block';
                    isValid = false;
                }
                
                // Validate Quantity
                if (quantity === '' || parseInt(quantity) < 1) {
                    document.getElementById('quantityError').textContent = 'Please enter a valid quantity (minimum 1)';
                    document.getElementById('quantityError').style.display = 'block';
                    isValid = false;
                }
                
                // Validate Price
                if (price === '' || parseFloat(price) < 0) {
                    document.getElementById('priceError').textContent = 'Please enter a valid price';
                    document.getElementById('priceError').style.display = 'block';
                    isValid = false;
                }
                
                // Validate Email
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (email === '' || !emailRegex.test(email)) {
                    document.getElementById('emailError').textContent = 'Please enter a valid email address';
                    document.getElementById('emailError').style.display = 'block';
                    isValid = false;
                }
                
                return isValid;
            }

            // Form submission handling
            const form = document.getElementById('collectionForm');
            form.addEventListener('submit', function(e) {
                // Validate form first
                if (!validateForm()) {
                    e.preventDefault();
                    return false;
                }
                
                // For debugging only - uncomment this block to test client-side only
                /*
                e.preventDefault();
                const formData = new FormData(form);
                const productName = formData.get('productName');
                const quantity = formData.get('quantity');
                const price = formData.get('price');
                const email = formData.get('email');
                
                // Show success message
                const successMessage = document.getElementById('successMessage');
                successMessage.textContent = `Thank you for your submission! Product: ${productName}, Quantity: ${quantity}, Price: $${price}, Email: ${email}. We will contact you shortly.`;
                successMessage.style.display = 'block';
                
                // Reset form
                form.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
                */
                
                // The form will naturally submit to insertproduct.php
            });
            
            // Mobile menu toggle
            const toggleMenu = document.querySelector('.toggle-menu');
            const navLinks = document.querySelector('.nav-links');
            
            if (toggleMenu) {
                toggleMenu.addEventListener('click', function() {
                    navLinks.classList.toggle('active');
                });
            }
            
            // Logout button functionality
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function() {
                    // Redirect to logout page or handle logout via AJAX
                    window.location.href = 'logout.php';
                });
            }
        });
    </script>

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
                    <li><a href="index.html">Home</a></li>
                    <li><a href="tutorial.html">Tutorial</a></li>
                    <li><a href="collections.html">Collections</a></li>
                    <li><a href="stocks.html">Stocks</a></li>
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="contact.html">Contact</a></li>
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
                    <div class="contact-text">077 111 2222</div>
                </div>
                <div class="footer-contact-item">
                    <i class="fas fa-envelope contact-icon"></i>
                    <div class="contact-text">ecotech@gmail.com</div>
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
</body>
</html>