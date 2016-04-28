function loadDataFromCSV() {
    d3.csv('./assets/dataset/environment-component.csv', function (err, data) {
        loadDataSet(data)
    });
}

function loadDataSet(data) {
    var csvData = [];
    var k;
    var incomingData = data;
    var yearlySec = 31540000;
    var difference = Math.ceil((new Date() - new Date('1/1/2016')) / 1000);

    for (k = 0; k < 4; ++k) 
        csvData[k] = data.splice(0, 4);

    var arrayCounter = 0;
    var mystring;
    var teamG;

    d3.select("#main-box").style('width' , '1487px');

    d3.select("#grids-container")
        .append('svg')
        .attr('style','color: white;width: 100%;height: 830px')
        .selectAll("g")
        .data(csvData)
        .enter()
        .append("g")
        .attr("id", "teamsG")
        .attr("class", function (d, i) {
            return "overallG" + i
        })
        .attr("transform", function (d, i) {
            return "translate(0," + i * 210 + ")"
        });
    
    for (k = 0; k < 4; ++k) {
        mystring = "g.overallG" + k;

        teamG = d3.selectAll(mystring);

        teamG
            .selectAll("g")
            .data(csvData[k])
            .enter()
            .append("g")
            .attr("class", "overallG")
            .attr("transform", function (d, i) {
                return "translate(" + (i * 365) + ", 0)"
            })
            .attr('title', function(d){return 'Emission rate'})
            .attr('data-content',function (d) {
                return d.collectionName
            });
    }
    
    for (k = 0; k < 4; ++k) {
        mystring = "g.overallG" + k;

        var gGroup = d3.select(mystring).selectAll("g.overallG");

        gGroup
            .append("rect")
            .style("width", "350px")
            .attr("height", 200)
            .style("fill", function (d, i) {
                return d.bgColor.split('-').join(',');
            })
            .attr("rx", "20")
            .attr("ry", "20")
            .attr("class", "rectGroup");

        gGroup.insert("image", "text")
            .attr("xlink:href", function(d) {
                return d.thumbnailUrl;
            })
            .attr("x", "170")
            .attr("y", "100")
            .attr("width", 0)
            .attr("height", 0)
            .transition()
            .duration(1000)
            .attr("width", "250px")
            .attr("height", "100px")
            .attr("x", "50")
            .attr("y", "10");

        gGroup
            .append("text")
            .style("text-anchor", "middle")
            .attr("x", 170)
            .attr("y", 140)
            .style("font-size", "15px")
            .style("font-weight", "bold")
            .text(function(d) {return d.collectionName});

        gGroup
            .append("text")
            .style("text-anchor", "middle")
            .attr("x", 170)
            .attr("y", 160)
            .attr("class","units")
            .text(function(d) {return d.units});

        gGroup
            .append("text")
            .style("text-anchor", "middle")
            .attr("x", 170)
            .attr("y", 185)
            .attr("class","counter")
            .text(function (d) {
                difference = Math.ceil((new Date() - new Date('1/1/2016')) / 1000);
                return ((d.total / yearlySec) * difference).toFixed(2);
            });

        setInterval(function(){
            d3.selectAll("text.counter")
                .text(function (d) {
                    difference = Math.ceil((new Date() - new Date('1/1/2016')) / 1000);
                    return ((d.total / yearlySec) * difference).toFixed(2)
                });

        },1000)

    }

    /*Tool tip*/
    $('.overallG').popover({
        'trigger':'hover'
        ,'container': 'body'
        ,'placement': 'top'
        ,'white-space': 'nowrap'
        ,'html':'true'
    });
}

function pieChart(){
    var data = [
        [11975,  5871, 8916, 2868],
        [ 1951, 10048, 2060, 6171],
        [ 8010, 16145, 8090, 8045],
        [ 1,   3,  2, 6]
    ];

    var m = 10,
        r = 100,
        z = d3.scale.category20c();

    var svg = d3.select("body").selectAll("svg")
        .data(data)
        .enter()
        .append("svg")
        .attr("width", (r + m) * 2)
        .attr("height", (r + m) * 2)
        .append("g")
        .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");


    svg.selectAll("path")
        .data(d3.layout.pie())
        .enter()
        .append("path")
        .attr("class", 'cir')
        .attr("d", d3.svg.arc()
            .innerRadius(0)
            .outerRadius(r))
        .style("fill", function(d, i) { return z(i); });

    /*Tool tip*/
    d3.selectAll('.cir')
        .attr('title', function(d){return 'Emission rate'})
        .attr('data-content','<h1>123</h1>');

    $('.cir').popover({
        'trigger':'hover'
        ,'container': 'body'
        ,'placement': 'top'
        ,'white-space': 'nowrap'
        ,'html':'true'
    });
}