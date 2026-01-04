<div data-media-preview-container></div>

<script type="text/template" data-media-audio-template>
    <div class="media-panel pb-0">
        <audio src="{src}" controls>
            <div class="media-player-fallback panel-embedded">Your browser doesn't support HTML5 audio.</div>
        </audio>
    </div>
</script>

<script type="text/template" data-media-video-template>
    <video src="{src}" controls preload="metadata">
        <div class="media-panel media-player-fallback">Your browser doesn't support HTML5 video.</div>
    </video>
</script>

<script type="text/template" data-media-image-template>
    <div class="sidebar-image-placeholder-container"><div class="sidebar-image-placeholder" data-path="{path}" data-last-modified="{last-modified}" data-loading="true" data-media-sidebar-thumbnail></div></div>
</script>

<script type="text/template" data-media-no-selection-template>
    <div class="sidebar-image-placeholder-container">
        <div class="sidebar-image-placeholder no-border">
            <i class="icon-crop"></i>
            <p><?= e(trans('backend::lang.media.nothing_selected')) ?></p>
        </div>
    </div>
</script>

<script type="text/template" data-media-multi-selection-template>
    <div class="sidebar-image-placeholder-container">
        <div class="sidebar-image-placeholder no-border">
            <i class="icon-asterisk"></i>
            <p><?= e(trans('backend::lang.media.multiple_selected')) ?></p>
        </div>
    </div>
</script>

<script type="text/template" data-media-go-up>
    <div class="sidebar-image-placeholder-container">
        <div class="sidebar-image-placeholder no-border">
            <i class="icon-level-up"></i>
            <p><?= e(trans('backend::lang.media.return_to_parent')) ?></p>
        </div>
    </div>
</script>
