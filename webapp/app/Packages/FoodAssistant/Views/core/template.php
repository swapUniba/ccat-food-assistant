<?php
/**
 * @var string $title
 * @var string $view
 * @var array $viewData
 * @var string $viewPackage
 */
?>
<!doctype html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

    <!-- Font Awesome -->
    <?= assetOnce("lib/fontawesome/css/all.min.css","CSS"); ?>

    <!-- jQuery  -->
    <script src="<?= asset('lib/jquery/jquery-3.4.1.min.js') ?>"></script>

    <!-- Fux  -->
    <?= assetOnce('lib/FuxFramework/FuxHTTP.js', 'script') ?>
    <?= assetOnce('lib/FuxFramework/FuxUIUtility.js', 'script') ?>
    <?= assetOnce('lib/FuxFramework/FuxSwalUtility.js', 'script') ?>
    <?= assetOnce('lib/FuxFramework/AsyncCrud.js', 'script') ?>

    <!-- SweetAlerts 2 -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@7.28.8/dist/sweetalert2.all.min.js"></script>

    <style>
        .bg-primary {
            background-color: #ff4b4b !important;
        }

.btn-primary {
  color: #ffffff;
  background-color: #FF4B4B;
  border-color: #FF4B4B;
}

.btn-primary:hover,
.btn-primary:focus,
.btn-primary:active,
.btn-primary.active,
.open .dropdown-toggle.btn-primary {
  color: #ffffff;
  background-color: #E64343;
  border-color: #FF4B4B;
}

.btn-primary:active,
.btn-primary.active,
.open .dropdown-toggle.btn-primary {
  background-image: none;
}

.btn-primary.disabled,
.btn-primary[disabled],
fieldset[disabled] .btn-primary,
.btn-primary.disabled:hover,
.btn-primary[disabled]:hover,
fieldset[disabled] .btn-primary:hover,
.btn-primary.disabled:focus,
.btn-primary[disabled]:focus,
fieldset[disabled] .btn-primary:focus,
.btn-primary.disabled:active,
.btn-primary[disabled]:active,
fieldset[disabled] .btn-primary:active,
.btn-primary.disabled.active,
.btn-primary[disabled].active,
fieldset[disabled] .btn-primary.active {
  background-color: #FF4B4B;
  border-color: #FF4B4B;
}

.btn-primary .badge {
  color: #FF4B4B;
  background-color: #ffffff;
}
    </style>

    <title><?= $title ?></title>
</head>
<body>
<?= viewCompose(\App\Packages\AdminDashboard\Services\NavbarVCService::VIEW_NAME) ?>
<?= view($view, $viewData, $viewPackage) ?>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
</body>
</html>
