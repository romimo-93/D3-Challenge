// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight + 30);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";


// (async function () {
  d3.csv("/D3_data_journalism/data.csv").then(function(povData) {
    // var povData = d3.csv.("data.csv");
      console.log(povData)
        // parse data
        povData.forEach(function(data) {
          data.poverty = +data.poverty;
          data.age = +data.age;
          data.income = +data.income;
          data.healthcare = +data.healthcare;
          data.obesity = +data.obesity;
          data.smokes = +data.smokes;
        });

        
    // xLinearScale function above csv import
  var xLinearScale = xScale(povData, chosenXAxis);
        // var xScale = d3.scaleBand()
        //     .domain(povData)
        //     .range([0, width])
//     // Create y scale function
  var yLinearScale = yScale(povData, chosenYAxis);
//   var yLinearScale = d3.scaleLinear()
//     .domain([0, d3.max(povData, d => d.poverty)])
//     .range([height, 0]);
    // var yScale = d3.scaleLinear()
    //     .domain([0,d3.max(povData)])
    //     .range([height, 0])

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);



  // append x axis
  var xAxis = chartGroup.append("g")
    // .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

 // append initial circles
 var circlesGroup = chartGroup.selectAll("g circle")
    .data(povData)
    .enter()
    .append("g");
var circlesXY = circlesGroup.append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .classed("circle", true);
var circlesText = circlesGroup.append("text")
    .text(d => d.abbr)
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => yLinearScale(d[chosenYAxis]) + 5)
    .classed("stateText", true);

// Create group for 3 x-axis labels
var labelsGroupX = chartGroup.append("g")
.attr("transform", `translate(${width / 2}, ${height})`);

var poverty  = labelsGroupX.append("text")
.attr("x", 0)
.attr("y", 30)
.attr("value", "Poverty") // value to grab for event listener
.classed("active", true)
.text("In Poverty (%)");


var age = labelsGroupX.append("text")
.attr("x", 0)
.attr("y", 50)
.attr("value", "Age") // value to grab for event listener
.classed("inactive", true)
.text("Age (Median)");

var income = labelsGroupX.append("text")
.attr("x", 0)
.attr("y", 70)
.attr("value", "Income") // value to grab for event listener
.classed("inactive", true)
.text("Household Income (Median)");

// append y axis
var labelsGroupY = chartGroup.append("g")
// .attr("transform", `translate(${width / 3}, ${height + 20})`);

var healthcare = labelsGroupY.append("text")
.attr("transform", "rotate(-90)")
.attr("y", -80)
.attr("x", - (height / 2))
.attr("value", "Healthcare")
.classed("axis-text", true)
.text("Healthcare (%)");

var smokes = labelsGroupY.append("text")
.attr("transform", "rotate(-90)")
.attr("y", -60)
.attr("x", - (height / 2))
.attr("value", "Smokes")
.classed("axis-text", true)
.text("Smokes (%)");

var obese = labelsGroupY.append("text")
.attr("transform", "rotate(-90)")
.attr("y", -40)
.attr("x", - (height / 2))
.attr("value", "Obese")
.classed("active", true)
.text("Obese (%)");






 // updateToolTip function above csv import
 circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

 // x axis labels event listener
 labelsGroupX.selectAll("text")
   .on("click", function() {
     // get value of selection
     var value = d3.select(this).attr("value");
     if (value !== chosenXAxis) {

       // replaces chosenXAxis with value
       chosenXAxis = value;

    //    console.log(chosenXAxis)

       // functions here found above csv import
       // updates x scale for new data
       xLinearScale = xScale(povData, chosenXAxis);

       // updates x axis with transition
       xAxis = renderXAxes(xLinearScale, xAxis);

    // updates circles with new x values
      circlesXY = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);

      // updates circles text with new x values
      circlesText = renderXText(circlesText, xLinearScale, chosenXAxis);

       // updates circles with new x values
    //    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

       // updates tooltips with new info
       circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

       // changes classes to change bold text
       if (chosenXAxis === "Age") {
         poverty
           .classed("active", false)
           .classed("inactive", true);
         age
           .classed("active", true)
           .classed("inactive", false);
         income
           .classed("active", false)
           .classed("inactive", true);
       }
       else if (chosenXAxis === "Income") {
        poverty
          .classed("active", false)
          .classed("inactive", true);
        age
          .classed("active", false)
          .classed("inactive", true);
        income
          .classed("active", true)
          .classed("inactive", false);
      }
       else {
         poverty
           .classed("active", true)
           .classed("inactive", false);
         age
           .classed("active", false)
           .classed("inactive", true);
         income
           .classed("active", false)
           .classed("inactive", true);
       }
     }
   });

//   y axis event listener 

labelsGroupY.selectAll("text")
   .on("click", function() {
     // get value of selection
     var value = d3.select(this).attr("value");
     if (value !== chosenYAxis) {

       // replaces chosenXAxis with value
       chosenYAxis = value;

    //    console.log(chosenXAxis)

       // functions here found above csv import
       // updates x scale for new data
       yLinearScale = yScale(povData, chosenYAxis);

       // updates x axis with transition
       yAxis = renderYAxes(yLinearScale, yAxis);

       // updates circles with new y values
      circlesXY = renderYCircles(circlesXY, yLinearScale, chosenYAxis);

      // updates circles text with new y values
      circlesText = renderYText(circlesText, yLinearScale, chosenYAxis);

       // updates circles with new x values
    //    circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);

       // updates tooltips with new info
       circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

       // changes classes to change bold text
       if (chosenYAxis === "Smokes") {
        healthcare
           .classed("active", false)
           .classed("inactive", true);
         smokes
           .classed("active", true)
           .classed("inactive", false);
         obese
           .classed("active", false)
           .classed("inactive", true);
       }
       else if (chosenXAxis === "Obesity") {
        healthcare
          .classed("active", false)
          .classed("inactive", true);
        smokes
          .classed("active", false)
          .classed("inactive", true);
        obese
          .classed("active", true)
          .classed("inactive", false);
      }
       else {
        healthcare
           .classed("active", true)
           .classed("inactive", false);
        smokes
           .classed("active", false)
           .classed("inactive", true);
        obese
           .classed("active", false)
           .classed("inactive", true);
       }
     }
   });
});

// function used for updating x-scale var upon click on axis label
// function xScale(povData, chosenXAxis) {
//   // create scales
//   var xLinearScale = d3.scaleLinear()
//     .domain([d3.min(povData, d => d[chosenXAxis]) * 0.8,
//       d3.max(povData, d => d[chosenXAxis]) * 1.2
//     ])
//     .range([0, width]);

//   return xLinearScale;

// }

// // function used for updating xAxis var upon click on axis label
// function renderAxes(newXScale, xAxis) {
//   var bottomAxis = d3.axisBottom(newXScale);

//   xAxis.transition()
//     .duration(1000)
//     .call(bottomAxis);

//   return xAxis;
// }

// // function used for updating circles group with a transition to
// // new circles
// function renderCircles(circlesGroup, newXScale, chosenXAxis) {

//   circlesGroup.transition()
//     .duration(1000)
//     .attr("cx", d => newXScale(d[chosenXAxis]));

//   return circlesGroup;
// }

// // // function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, circlesGroup) {

//   var label;

//   if (chosenXAxis === "In Poverty (%)h") {
//     label = "In Poverty (%)";
//   }
//   else if (chosenXAxis === "Age (Median)") {
//       label = "Age (Median)";
//   }
//   else {
//     label = "Household Income (Median)";
//   }

//   var toolTip = d3.tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
//     .html(function(d) {
//       return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
//     });

//   circlesGroup.call(toolTip);

//   circlesGroup.on("mouseover", function(data) {
//     toolTip.show(data);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data);
//     });

//   return circlesGroup;
// }

// Retrieve data from the CSV file and execute everything below
// d3.csv("data.csv").then(function(povData, err) {
//   if (err) throw err;
// // console.log(povData)
//   // parse data
//   povData.forEach(function(data) {
//     data.poverty = +data.poverty;
//     data.age = +data.age;
//     data.income = +data.income;
//     data.healthcare = +data.healthcare;
//     data.obesity = +data.obesity;
//     data.smokes = +data.smokes;
//   });
//   console.log(data.poverty)

//   // xLinearScale function above csv import
//   var xLinearScale = xScale(povData, chosenXAxis);

//   // Create y scale function
//   var yLinearScale = d3.scaleLinear()
//     .domain([0, d3.max(povData, d => d.poverty)])
//     .range([height, 0]);

//   // Create initial axis functions
//   var bottomAxis = d3.axisBottom(xLinearScale);
//   var leftAxis = d3.axisLeft(yLinearScale);

//   // append x axis
//   var xAxis = chartGroup.append("g")
//     .classed("x-axis", true)
//     .attr("transform", `translate(0, ${height})`)
//     .call(bottomAxis);

//   // append y axis
//   chartGroup.append("g")
//     .call(leftAxis);

//   // append initial circles
//   var circlesGroup = chartGroup.selectAll("circle")
//     .data(povData)
//     .enter()
//     .append("circle")
//     .attr("cx", d => xLinearScale(d[chosenXAxis]))
//     .attr("cy", d => yLinearScale(d.num_hits))
//     .attr("r", 20)
//     .attr("fill", "pink")
//     .attr("opacity", ".5");

//   // Create group for two x-axis labels
//   var labelsGroupX = chartGroup.append("g")
//     .attr("transform", `translate(${width / 3}, ${height + 20})`);

//   var poverty  = labelsGroupX.append("text")
//     .attr("x", 0)
//     .attr("y", 20)
//     .attr("value", "In Poverty (%)") // value to grab for event listener
//     .classed("active", true)
//     .text("In Poverty (%)");
  

//   var age = labelsGroupX.append("text")
//     .attr("x", 0)
//     .attr("y", 40)
//     .attr("value", "Age (Median)") // value to grab for event listener
//     .classed("inactive", true)
//     .text("Age (Median)");

//   var income = labelsGroupX.append("text")
//     .attr("x", 0)
//     .attr("y", 40)
//     .attr("value", "Household Income (Median)") // value to grab for event listener
//     .classed("inactive", true)
//     .text("Household Income (Median)");

//   // append y axis
//   var labelsGroupY = chartGroup.append("g")
//     .attr("transform", `translate(${width / 3}, ${height + 20})`);
 
//   var obese = labelsGroupY.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - margin.left)
//     .attr("x", 0 - (height / 2))
//     .attr("dy", "1em")
//     .classed("axis-text", true)
//     .text("Obese (%)");

//   var smokes = labelsGroupY.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - margin.left)
//     .attr("x", 0 - (height / 2))
//     .attr("dy", "1em")
//     .classed("axis-text", true)
//     .text("Smokes (%)");

//   var healthcare = labelsGroupY.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - margin.left)
//     .attr("x", 0 - (height / 2))
//     .attr("dy", "1em")
//     .classed("axis-text", true)
//     .text("Healthcare (%)");

//   chartGroup.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - margin.left)
//     .attr("x", 0 - (height / 2))
//     .attr("dy", "1em")
//     .classed("axis-text", true)
//     .text("Number of Billboard 500 Hits");

//   // updateToolTip function above csv import
//   var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

//   // x axis labels event listener
//   labelsGroupX.selectAll("text")
//     .on("click", function() {
//       // get value of selection
//       var value = d3.select(this).attr("value");
//       if (value !== chosenXAxis) {

//         // replaces chosenXAxis with value
//         chosenXAxis = value;

//         console.log(chosenXAxis)

//         // functions here found above csv import
//         // updates x scale for new data
//         xLinearScale = xScale(povData, chosenXAxis);

//         // updates x axis with transition
//         xAxis = renderAxes(xLinearScale, xAxis);

//         // updates circles with new x values
//         circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

//         // updates tooltips with new info
//         circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

//         // changes classes to change bold text
//         if (chosenXAxis === "In Poverty (%)") {
//           poverty
//             .classed("active", true)
//             .classed("inactive", false);
//           age
//             .classed("active", false)
//             .classed("inactive", true);
//           income
//             .classed("active", false)
//             .classed("inactive", true);
//         }
//         else {
//           poverty
//             .classed("active", true)
//             .classed("inactive", false);
//           age
//             .classed("active", false)
//             .classed("inactive", true);
//           income
//             .classed("active", false)
//             .classed("inactive", true);
//         }
//       }
//     });
// }).catch(function(error) {
//   console.log(error);
// });
