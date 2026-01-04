<div class="layout-row min-size oc-hide" data-media-upload-ui>
    <div class="layout">
        <div class="upload-progress">
            <h5
                data-label="file-number-and-progress"
                data-message-template="<?= e(trans('backend::lang.media.uploading_file_num')) ?> &lt;span&gt;:percents&lt;/span&gt;"
                data-success-template="<?= e(trans('backend::lang.media.uploading_complete')) ?>"
                data-error-template="<?= e(trans('backend::lang.media.uploading_error')) ?>"
            ></h5>

            <div class="progress-controls">
                <div class="progress mb-4" style="height: 10px">
                    <div class="progress-bar" role="progressbar" style="width: 0;" data-media-upload-progress-bar>
                    </div>
                </div>

                <div class="controls">
                    <a href="#" data-command="cancel-uploading"><i class="icon-times-circle" title=""></i></a>
                    <a class="oc-hide" href="#" data-command="close-uploader"><i class="icon-check-circle" title=""></i></a>
                </div>
            </div>
        </div>
    </div>
</div>
