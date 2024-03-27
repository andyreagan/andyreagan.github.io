var data = [
    [
        {
            "x": 10,
            "y": 8.04
        },
        {
            "x": 8,
            "y": 6.95
        },
        {
            "x": 13,
            "y": 7.58
        },
        {
            "x": 9,
            "y": 8.81
        },
        {
            "x": 11,
            "y": 8.33
        },
        {
            "x": 14,
            "y": 9.96
        },
        {
            "x": 6,
            "y": 7.24
        },
        {
            "x": 4,
            "y": 4.26
        },
        {
            "x": 12,
            "y": 10.84
        },
        {
            "x": 7,
            "y": 4.82
        },
        {
            "x": 5,
            "y": 5.68
        }
    ],
    [
        {
            "x": 10,
            "y": 9.14
        },
        {
            "x": 8,
            "y": 8.14
        },
        {
            "x": 13,
            "y": 8.74
        },
        {
            "x": 9,
            "y": 8.77
        },
        {
            "x": 11,
            "y": 9.26
        },
        {
            "x": 14,
            "y": 8.1
        },
        {
            "x": 6,
            "y": 6.13
        },
        {
            "x": 4,
            "y": 3.1
        },
        {
            "x": 12,
            "y": 9.13
        },
        {
            "x": 7,
            "y": 7.26
        },
        {
            "x": 5,
            "y": 4.74
        }
    ],
    [
        {
            "x": 10,
            "y": 7.46
        },
        {
            "x": 8,
            "y": 6.77
        },
        {
            "x": 13,
            "y": 12.74
        },
        {
            "x": 9,
            "y": 7.11
        },
        {
            "x": 11,
            "y": 7.81
        },
        {
            "x": 14,
            "y": 8.84
        },
        {
            "x": 6,
            "y": 6.08
        },
        {
            "x": 4,
            "y": 5.39
        },
        {
            "x": 12,
            "y": 8.15
        },
        {
            "x": 7,
            "y": 6.42
        },
        {
            "x": 5,
            "y": 5.73
        }
    ],
    [
        {
            "x": 8,
            "y": 6.58
        },
        {
            "x": 8,
            "y": 5.76
        },
        {
            "x": 8,
            "y": 7.71
        },
        {
            "x": 8,
            "y": 8.84
        },
        {
            "x": 8,
            "y": 8.47
        },
        {
            "x": 8,
            "y": 7.04
        },
        {
            "x": 8,
            "y": 5.25
        },
        {
            "x": 19,
            "y": 12.5
        },
        {
            "x": 8,
            "y": 5.56
        },
        {
            "x": 8,
            "y": 7.91
        },
        {
            "x": 8,
            "y": 6.89
        }
    ]
];

var ans_ind = 0;

var svg = d3.select("#ans-intro").append("svg").attr({width: 600, height: 600,});

var xscale = d3.scale.linear()
    .domain(d3.extent(data[0],function(d) { return d.x; }))
    .range([100,500]);

var yscale = d3.scale.linear()
    .domain(d3.extent(data[0],function(d) { return d.y; }))
    .range([500,100]);

var circles = svg.selectAll("circle").data(data[0])
    .enter()
    .append("circle")
    .attr({
        cx: function(d,i) { return xscale(d.x); },
        cy: function(d,i) { return yscale(d.y); },
        r: 10,
    })
    .on("click", function(d,i) {
        ans_ind = ( ans_ind + 1 ) % 4;
        xscale.domain(d3.extent(data[ans_ind],function(d) { return d.x; }));
        yscale.domain(d3.extent(data[ans_ind],function(d) { return d.y; }));
        circles.data(data[ans_ind])
            .transition()
            .duration(2000)
            .attr({
                cx: function(d,i) { return xscale(d.x); },
                cy: function(d,i) { return yscale(d.y); },
            });
    });



