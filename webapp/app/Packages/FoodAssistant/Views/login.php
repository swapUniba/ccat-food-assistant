<?php
?>

<style>
    body {
        background-color: #f8f9fa;
    }

    .form-signin {
        max-width: 400px;
        padding: 15px;
        margin: auto;
        margin-top: 100px;
    }

    .form-signin .form-control {
        margin-bottom: 1rem;
    }
</style>

<main class="form-signin text-center">
    <form id="login-form">
        <h1 class="h3 mb-3 fw-normal">Sign In</h1>

        <div class="form-floating">
            <input type="text" class="form-control" name="username" placeholder="Username" required>
            <label for="username">Username</label>
        </div>

        <div class="form-floating">
            <input type="password" class="form-control" name="password" placeholder="Password" required>
            <label for="password">Password</label>
        </div>

        <button class="w-100 btn btn-lg btn-primary" type="submit">Sign In</button>

        <p class="mt-3">Don't have an account? <a href="<?= routeFullUrl('/register') ?>">Sign Up</a></p>
    </form>
</main>

<script>
    (function () {
        document.querySelector('#login-form').addEventListener('submit', handleLogin);

        function handleLogin(e) {
            e.preventDefault();
            FuxSwalUtility.loading('Accesso in corso...');
            FuxHTTP.post('<?= routeFullUrl('/login') ?>', {
                username: e.target.querySelector('[name="username"]').value,
                password: e.target.querySelector('[name="password"]').value
            }, FuxHTTP.RESOLVE_DATA, FuxHTTP.REJECT_MESSAGE)
                .then(url => {
                    window.location.href = url;
                })
                .catch(m => {
                    console.log(m);
                    FuxSwalUtility.error(m);
                });
        }

    })();
</script>
