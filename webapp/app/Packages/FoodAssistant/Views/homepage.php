<?php
?>

<style>
    .hero {
        background: url('<?= asset("img/hero-bg.jpg","FoodAssistant") ?>') center center no-repeat;
        background-size: cover;
        height: 60vh;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
    }

    .hero h1 {
        font-size: 4rem;
        font-weight: bold;
    }

    .feature-box {
        text-align: center;
        padding: 2rem 1rem;
        background-color: #f8f9fa;
        border-radius: 15px;
        margin-bottom: 2rem;
    }

    .cta-btn {
        padding: 1rem 2rem;
        font-size: 1.2rem;
        border-radius: 30px;
    }
</style>

<!-- Hero Section -->
<section class="hero d-flex align-items-center">
    <div class="text-center">
        <h1>The AI assistant for Healthy & Sustainable eating</h1>
        <p class="lead">Discover food choices that are good for you and the planet.</p>
        <a href="<?= routeFullUrl('/chat') ?>" class="btn btn-primary cta-btn">Use the assistant</a>
    </div>
</section>

<!-- Features Section -->
<section class="container my-5">
    <div class="row text-center">
        <h2 class="mb-5">Why Choose Us?</h2>
        <div class="col-md-4">
            <div class="feature-box">
                <i class="bi bi-heart-fill display-4 text-success"></i>
                <h3>Healthy Recommendations</h3>
                <p>Get personalized meal suggestions that fit your dietary needs and help you stay healthy.</p>
            </div>
        </div>
        <div class="col-md-4">
            <div class="feature-box">
                <i class="bi bi-leaf display-4 text-success"></i>
                <h3>Sustainable Choices</h3>
                <p>Our AI suggests eco-friendly food options that minimize your carbon footprint.</p>
            </div>
        </div>
        <div class="col-md-4">
            <div class="feature-box">
                <i class="bi bi-speedometer display-4 text-success"></i>
                <h3>Fast & Efficient</h3>
                <p>Enjoy a smooth and fast experience with accurate recommendations at your fingertips.</p>
            </div>
        </div>
    </div>
</section>

<!-- Footer -->
<footer class="bg-light py-4">
    <div class="container text-center">
        <p>Master's Degree in Computer Science | <a href="https://uniba.it">UniBA</a></p>
    </div>
</footer>
