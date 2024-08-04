'use client';

import React, { useEffect, useRef } from "react";
import Dygraph from "dygraphs";

import "./dygraph.css";

var graphStyle = {
    width: "100%",
};

var divStyle = {
    border: "1px solid #c8c8c8",
    padding: "1rem 2rem 2rem 0",
    boxSizing: "border-box",
    margin: "1rem",
    borderRadius: "4px",
    overflow: 'visible'
};

var header = {
    margin: 0,
    opacity: 0.8,
    marginBottom: "1rem"
};

var cleanPresets = {
    axes: {
        x: {
            drawGrid: false,
            drawAxis: false
        },
        y: {
            drawGrid: false,
            drawAxis: false
        }
    },
    rollPeriod: 1,
    labelsDiv: "",
    highlightCircleSize: 2,
    strokeWidth: 2,
    legend: "none",
    animatedZooms: false,
    colors: ["#f47560", "#61cdbb"]
};

var fullPresets: any = {
    axes: {
        x: {
            drawGrid: false,
            drawAxis: true,
            axisLineColor: "white",
            axisLineWidth: 1.5
        },
        y: {
            drawAxis: true,
            gridLineWidth: 1,
            gridLineColor: "#eee",
            gridLinePattern: [5, 5],
            axisLineColor: "white",
            axisLineWidth: 1
        }
    },
    rollPeriod: 1,
    xAxisHeight: 50,
    resizable: 'both',
    digitsAfterDecimal: 4,
    highlightCircleSize: 5,
    labels: ["Fecha", "Dato"],
    legendFormatter: legendFormatter,
    legend: "follow",
    strokeWidth: 1.5,
    fillGraph: true,
    fillAlpha: 0.1,
    colors: ["rgb(212, 212, 216)"],
    fillColor: ["rgba(212, 212, 216,0.4)", "rgba(212, 212, 216,0.4)"],
    colorSaturation: 0.2,
    visibility: [true, true],
    animatedZooms: false,
    hideOverlayOnMouseOut: true,
    rangeSelectorHeight: 40,
    rangeSelectorPlotFillColor: 'rgb(212, 212, 216)',
    rangeSelectorPlotFillGradientColor: 'rgb(212, 212, 216)',
    colorValue: 0.5,
    showRangeSelector: false,
    axisLabelFontSize: 12,
    rangeSelectorBackgroundStrokeColor: 'rgb(212, 212, 216)',
    series: {
        0: {
            strokeWidth: 7,
            strokeColor: 'rgb(212, 212, 216)',
            strokeOpacity: 0.8,
            strokePattern: [10, 2],
        },
    },
    plotter: barChartPlotter // Integrar el plotter de barras personalizado
};

function legendFormatter(data: any) {
    if (data.x == null) {
        return data.series.map(function (series: any) {
            return series.dashHTML + " " + series.labelHTML;
        }).join();
    }

    var html = "<b>" + data.xHTML + "</b>";
    data?.series?.forEach((series: any) => {
        if (!series.isVisible) return;

        var labeledData = series.labelHTML + " <b>" + series.yHTML + "</b>";

        if (series.isHighlighted) {
            labeledData = "<b>" + labeledData + "</b>";
        }

        html += "<div class='dygraph-legend-row'>" + series.dashHTML + "<div>" + labeledData + "</div></div>";
    });
    return html;
}

function barChartPlotter(e: any) {
    var ctx = e.drawingContext;
    var points = e.points;

    var y_bottom = e.dygraph.toDomYCoord(0);

    ctx.fillStyle = e.color;

    var min_sep = Infinity;
    for (var i = 1; i < points.length; i++) {
        var sep = points[i].canvasx - points[i - 1].canvasx;
        if (sep < min_sep) min_sep = sep;
    }
    var bar_width = Math.floor(2.0 / 3 * min_sep);

    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        var center_x = p.canvasx;

        ctx.fillRect(center_x - bar_width / 2, p.canvasy,
            bar_width, y_bottom - p.canvasy);

        ctx.strokeRect(center_x - bar_width / 2, p.canvasy,
            bar_width, y_bottom - p.canvasy);
    }
}

export default function BarGraph(props: any) {
    const graphEl: any = useRef(null);
    useEffect(() => {
        new Dygraph(graphEl.current, props.data, fullPresets);
    });
    return (
        <div >
            <h3 style={header}>{props.title || ""}</h3>
            <div style={{ ...graphStyle, ...props.graphStyle }} className={`graph-container ${props.id}`} ref={graphEl} />
        </div>
    );
}
