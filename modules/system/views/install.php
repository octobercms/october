<h2>
    Installation
</h2>

<?= Form::open() ?>
    <input type="hidden" name="postback" value="1" />

    <div id="progressBarContainer" class="progress-bar-container">
        <div class="progress">
            <div id="progressBar" class="progress-bar infinite_loader" role="progressbar"></div>
        </div>
        <p class="progress-message" id="progressBarMessage"></p>
    </div>

    <a href="javascript:toggleProgress()" id="toggleProgressBtn" class="btn-toggle-progress" style="display: none">
        Show the process output
    </a>

    <div id="progressOutput" class="progress-output" style="display: none"></div>

    <iframe
        id="progressFrame"
        src="<?= Url::to('composer/update') ?>"
        style="display: none"></iframe>

<?= Form::close() ?>

<script>
    function toggleProgress() {
        document.getElementById('toggleProgressBtn').style.display = 'none';
        document.getElementById('progressOutput').style.display = 'block';
    }

    var lastOutputLine = 1;
    function addLineToOutput(message) {
        var itemC = document.createElement('div'),
            itemN = document.createElement('span'),
            itemL = document.createElement('span');

        itemN.innerText = '#' + lastOutputLine++;
        itemN.className = 'progress-number';
        itemL.innerText = message;
        itemL.className = 'progress-line';
        itemC.appendChild(itemN);
        itemC.appendChild(itemL);

        document.getElementById('progressOutput').appendChild(itemC);
    }

    var lastText = null;
    var progressWindow = document.getElementById('progressFrame');
    var poller = setInterval(function() {
        var progressBody = progressWindow.contentWindow.document.body;
        if (!progressBody) {
            return;
        }

        var lastMsg = progressBody.lastElementChild;
        if (!lastMsg) {
            return;
        }

        if (lastMsg.tagName == 'LINE') {
            if (lastText != lastMsg.innerText) {
                setLoadingBar(false);
                addLineToOutput(lastMsg.innerText);
                lastText = lastMsg.innerText;
                setLoadingBar(true, lastText);
            }
        }

        if (lastMsg.tagName == 'EXIT') {
            clearInterval(poller);
            if (lastMsg.innerText === '0') {
                setLoadingBar(false);
                window.location.href = '<?= e($backendUrl) ?>';
            }
            else {
                setLoadingBar('failed', 'Something went wrong during installation...');
                document.getElementById('toggleProgressBtn').style.display = 'block';
            }
        }
    }, 1);

    function setLoadingBar(state, message) {
        var progressBarContainer = document.getElementById('progressBarContainer'),
            progressBar = document.getElementById('progressBar'),
            progressBarMessage = document.getElementById('progressBarMessage');

        if (message) {
            progressBarMessage.innerText = message;
        }

        progressBar.classList.remove('progress-bar-danger');
        progressBarContainer.classList.remove('failed');

        if (state == 'failed') {
            progressBar.classList.add('progress-bar-danger');
            progressBar.classList.remove('animate');
            progressBarContainer.classList.add('failed');
        }
        else if (state) {
            progressBarContainer.classList.add('loading');
            progressBarContainer.classList.remove('loaded');
            progressBar.classList.add('animate');
        }
        else {
            progressBarContainer.classList.add('loaded');
            progressBarContainer.classList.remove('loading');
            progressBar.classList.remove('animate');
        }
    }

    setLoadingBar(true, 'Installing via composer...');

    document.getElementById('progressBarContainer').addEventListener('dblclick', function (e) {
        toggleProgress();
    });
</script>
