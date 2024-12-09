<?php
/**
 * @var \App\Packages\FoodAssistant\Models\UsersModel $user
 */
?>
<!-- Navbar -->
<nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">
            <img src="<?= asset('img/logo.png','FoodAssistant') ?>" height="35px"/>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <a class="nav-link" aria-current="page" href="<?= routeFullUrl('/') ?>">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="<?= routeFullUrl('/chat') ?>">Chat</a>
                </li>
                <?php if (!isset($user)) { ?>
                    <li class="nav-item">
                        <a class="nav-link" href="<?= routeFullUrl('/register') ?>">Register</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?= routeFullUrl('/login') ?>">Login</a>
                    </li>
                <?php } else { ?>
                    <li class="nav-item">
                        <a class="nav-link" href="<?= routeFullUrl('/logout') ?>">Logout</a>
                    </li>
                <?php } ?>
            </ul>
        </div>
    </div>
</nav>
