# Chart

<a name="pie-chart" class="anchor" href="#pie-chart"></a>
## Pie chart

The pie chart outputs information as a circle diagram, with optional label in the center. Example markup:

    <div
        class="control-chart centered wrap-legend"
        data-control="chart-pie"
        data-size="200"
        data-center-text="100">
        <ul>
            <li>Label 1 <span>100</span></li>
            <li>Label 2 <span>100</span></li>
            <li>Label 3 <span>100</span></li>
        </ul>
    </div>

![image](https://github.com/octobercms/docs/blob/master/images/traffic-sources.png?raw=true) {.img-responsive .frame}

<a name="bar-chart" class="anchor" href="#bar-chart"></a>
## Bar chart

The next example shows a bar chart markup. The **wrap-legend** class is optional, it manages the legend layout. The **data-height** and **data-full-width** attributes are optional as well.

    <div
        class="control-chart wrap-legend"
        data-control="chart-bar"
        data-height="100"
        data-full-width="1">
        <ul>
            <li>Label 1 <span>100</span></li>
            <li>Label 2 <span>100</span></li>
            <li>Label 3 <span>100</span></li>
        </ul>
    </div>

![image](https://github.com/octobercms/docs/blob/master/images/bar-chart.png?raw=true) {.img-responsive .frame}

# Example

    <div
        class="control-chart centered wrap-legend"
        data-control="chart-pie"
        data-size="200"
        data-center-text="100">
        <ul>
            <li>Label 1 <span>100</span></li>
            <li>Label 2 <span>100</span></li>
            <li>Label 3 <span>100</span></li>
        </ul>
    </div>

    <div
        class="control-chart wrap-legend"
        data-control="chart-bar"
        data-height="100"
        data-full-width="1">
        <ul>
            <li>Label 1 <span>100</span></li>
            <li>Label 2 <span>100</span></li>
            <li>Label 3 <span>100</span></li>
        </ul>
    </div>