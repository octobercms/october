# Scoreboard

### Scoreboard

    <div class="scoreboard">
        <div data-control="toolbar">
            <div class="scoreboard-item title-value">
                <h4>Weight</h4>
                <p>100</p>
                <p class="description">unit: kg</p>
            </div>

            <div class="scoreboard-item title-value">
                <h4>Comments</h4>
                <p class="positive">44</p>
                <p class="description">previous month: 32</p>
            </div>

            <div class="scoreboard-item title-value">
                <h4>Latest commenter</h4>
                <p class="oc-icon-star">John Smith</p>
                <p class="description">registered: yes</p>
            </div>
        </div>
    </div>

### Complete example

    <div class="scoreboard">
        <div data-control="toolbar">
            <div class="scoreboard-item control-chart" data-control="chart-pie">
                <ul>
                    <li data-color="#95b753">Published <span>84</span></li>
                    <li data-color="#e5a91a">Drafts <span>12</span></li>
                    <li data-color="#cc3300">Deleted <span>18</span></li>
                </ul>
            </div>

            <div class="scoreboard-item control-chart" data-control="chart-bar">
                <ul>
                    <li data-color="#95b753">Published <span>84</span></li>
                    <li data-color="#e5a91a">Drafts <span>12</span></li>
                    <li data-color="#cc3300">Deleted <span>18</span></li>
                </ul>
            </div>

            <div class="scoreboard-item title-value">
                <h4>Weight</h4>
                <p>100</p>
                <p class="description">unit: kg</p>
            </div>

            <div class="scoreboard-item title-value">
                <h4>Comments</h4>
                <p class="positive">44</p>
                <p class="description">previous month: 32</p>
            </div>

            <div class="scoreboard-item title-value">
                <h4>Length</h4>
                <p class="negative">31</p>
                <p class="description">previous: 42</p>
            </div>

            <div class="scoreboard-item title-value">
                <h4>Latest commenter</h4>
                <p class="oc-icon-star">John Smith</p>
                <p class="description">registered: yes</p>
            </div>

            <div class="scoreboard-item title-value" data-control="goal-meter" data-value="88">
                <h4>goal meter</h4>
                <p>88%</p>
                <p class="description">37 posts remain</p>
            </div>

            <div class="scoreboard-item title-value goal-meter-inverse" data-control="goal-meter" data-value="88">
                <h4>goal meter</h4>
                <p>88%</p>
                <p class="description">37 posts remain</p>
            </div>
        </div>
    </div>

