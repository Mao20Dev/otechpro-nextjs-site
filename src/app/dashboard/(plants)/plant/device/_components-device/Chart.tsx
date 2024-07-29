'use client'

import React, { useEffect, useRef } from "react";
import Dygraph from "dygraphs";

import "./dygraph.css";

var graphStyle = {
    width: "100%",
    height: 300
};

var divStyle = {
    border: "1px solid #c8c8c8",
    padding: "1rem 2rem 2rem 0",
    boxSizing: "border-box",
    margin: "1rem",
    borderRadius: "4px"
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
    rollPeriod: 7,
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
    rollPeriod: 10,
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
    showRangeSelector: true,
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
};


function legendFormatter(data: any) {
    if (data.x == null) {
    // This happens when there's no selection and {legend: 'always'} is set.
    return +data.series
        .map(function (series: any) {
        return series.dashHTML + " " + series.labelHTML;
        })
        .join();
    }

    var html = "<b>" + data.xHTML + "</b>";
    data?.series?.forEach((series: any) => {
    if (!series.isVisible) return;

    var labeledData = series.labelHTML + " <b>" + series.yHTML + "</b>";

    if (series.isHighlighted) {
        labeledData = "<b>" + labeledData + "</b>";
    }

    html +=
        "<div class='dygraph-legend-row'>" +
        series.dashHTML +
        "<div>" +
        labeledData +
        "</div></div>";
    });
    return html;
}

export default function Graph(props: any) {
    const graphEl: any = useRef(null);
    useEffect(() => {
    new Dygraph(graphEl.current, props.data, fullPresets);
    });
    return (
    <div >
        <h3 style={header}>{props.title || ""}</h3>
        <div style={graphStyle} className={props.id} ref={graphEl} />
    </div>
  );
}
