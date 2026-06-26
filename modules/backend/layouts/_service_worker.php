<?php
    $forceUnregister = $forceUnregister ?? false;
    $serviceWorkerSetting = Config::get('backend.enable_service_workers');
    $serviceWorkersEnabled = !$forceUnregister && ($serviceWorkerSetting === null ? !Config::get('app.debug') : (bool) $serviceWorkerSetting);
?>
<?php if ($serviceWorkersEnabled): ?>
    <script>
        oc.waitFor(() => window.registerBackendServiceWorker).then(() =>
            registerBackendServiceWorker(
                '<?= Backend::url('service-worker.js') ?>?v=<?= Backend::assetVersion() ?>',
                '<?= Backend::baseUrl() ?>/'
            )
        )
    </script>
<?php else: ?>
    <script>
        oc.waitFor(() => window.unregisterServiceWorkers).then(() =>
            unregisterServiceWorkers()
        )
    </script>
<?php endif ?>
