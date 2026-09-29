<div class="list-image-thumbs">
    <?php foreach ($imageUrls as $imageUrl): ?>
        <span class="list-image-thumb <?= $isDefaultSize ? 'is-default-size' : '' ?>">
            <img src="<?= e($imageUrl) ?>" width="<?= (int) $width ?>" height="<?= (int) $height ?>" alt="" />
        </span>
    <?php endforeach ?>
</div>
