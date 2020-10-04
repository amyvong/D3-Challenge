
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
.attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);



// Load data from hours-of-tv-watched.csv
d3.csv("data.csv").then(function(healthdata, err) {
  if (err) throw err;
  


  var chosenXAxis = "poverty";
  // var chosenYAxis = "obesity";
  
  
  function xScale(healthdata, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthdata, d => d[chosenXAxis]) * 0.8,
        d3.max(healthdata, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, chartWidth]);
  
    return xLinearScale;
  }


  function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }




  function renderCircles(circlesGroup, newXScale, chosenXAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }

  function updateToolTip(chosenXAxis, circlesGroup) {

    var label;
  
    if (chosenXAxis === "poverty") {
      label = "Poverty:";
    }
    else {
      label = "Obesity";
    }
  
   
  }





  // Cast the hours value to a number for each piece of tvData
  healthdata.forEach(function(d) {
    d.poverty = +d.poverty;
    d.obesity =+d.obesity
    
  })
  




  var xLinearScale = xScale(healthdata, chosenXAxis);



// Create a linear scale for the vertical axis.
var yLinearScale = d3.scaleLinear()
  .domain([d3.min(healthdata,d=>d.obesity)*.8, d3.max(healthdata, d => d.obesity)])
  .range([chartHeight, 0]);


  var circlesGroup = chartGroup.selectAll("circle")
  .data(healthdata)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.obesity))
  .attr("r", "15")
  .attr("fill", "blue")
  .attr("opacity", ".5")


 var circletext= chartGroup.selectAll("text")
  .data(healthdata)
  .enter()
  .append("text")
  .attr("x", d => xLinearScale(d.poverty))
  .attr("y", d => yLinearScale(d.obesity))
  .attr("dx","-10")
  .attr("dy", "5")
  .text(d=>d.abbr)


var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);






var xAxis=chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${chartHeight})`)
  .call(bottomAxis);



var yAxis=chartGroup.append("g")
  .call(leftAxis);



var labelsGroup = chartGroup.append("g")
.attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);







var povertylabel = labelsGroup.append("text")
.attr("x", 0)
.attr("y", 20)
.attr("value", "poverty") // value to grab for event listener
.classed("active", true)
.text("Poverty %");



var yLabel = chartGroup.append("g")
  .attr("transform","rotate(-90)");





yLabel.append("text")
  .attr("x",0-(chartHeight/2))
  .attr("y",10-chartMargin.left)
  .attr("dy","1em")
  .text("Obese (%)");








  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>Poverty %: ${d.poverty}<br>Obesity %: ${d.obesity}`);
    });

  chartGroup.call(toolTip);





    circletext.on("mouseover", function(data) {
      toolTip.show(data);
      console.log("mouseover")
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
        console.log("mouseout")
      });
  








}).catch(function(error) {
console.log(error);


});


// When the browser window is resized, makeResponsive() is called.

