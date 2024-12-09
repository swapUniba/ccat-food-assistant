<?php
?>

<style>
    body {
        background-color: #f8f9fa;
    }

    .form-signup {
        max-width: 400px;
        padding: 15px;
        margin: auto;
        margin-top: 50px;
    }

    .form-signup .form-control {
        margin-bottom: 1rem;
    }
</style>

<main class="form-signup text-center">
    <form id="register-form">
        <h1 class="h3 mb-3 fw-normal">Sign Up</h1>

        <div class="form-floating">
            <input type="text" class="form-control" name="first_name" placeholder="First Name" required>
            <label for="firstname">First Name</label>
        </div>

        <div class="form-floating">
            <input type="text" class="form-control" name="last_name" placeholder="Last Name" required>
            <label for="lastname">Last Name</label>
        </div>

        <div class="form-floating">
            <input type="text" class="form-control" name="username" placeholder="Username" required>
            <label for="username">Username</label>
        </div>

        <div class="form-floating">
            <input type="password" class="form-control" name="password" placeholder="Password" required>
            <label for="password">Password</label>
        </div>

        <button class="w-100 btn btn-lg btn-success" type="submit">Sign Up</button>

        <p class="mt-3">Already have an account? <a href="<?= routeFullUrl('/login') ?>">Sign In</a></p>
    </form>
</main>

<script>
    (function () {
        document.querySelector('#register-form').addEventListener('submit', handleRegister);

        function handleRegister(e) {
            e.preventDefault();
            FuxSwalUtility.loading('Accesso in corso...');
            FuxHTTP.post('<?= routeFullUrl('/register') ?>', {
                username: e.target.querySelector('[name="username"]').value,
                password: e.target.querySelector('[name="password"]').value,
                first_name: e.target.querySelector('[name="first_name"]').value,
                last_name: e.target.querySelector('[name="last_name"]').value,
            }, FuxHTTP.RESOLVE_RESPONSE, FuxHTTP.REJECT_MESSAGE)
                .then(r => {
                    FuxSwalUtility.success(r.message)
                        .then(_ => window.location.href = r.data);
                })
                .catch(m => {
                    console.log(m);
                    FuxSwalUtility.error(m);
                });
        }

    })();
</script>
