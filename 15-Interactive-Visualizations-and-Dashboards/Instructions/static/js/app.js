 // init app.js with d3.json 
d3.json("samples.json").then((Data) => {
    window.Data = Data;
    console.log(Data);
    var data = Data;
  
    // Add ID#s to dropdown menu
    var idList = data.names;
    for (var i = 0; i < idList.length; i++) {
      selectBox = d3.select("#selDataset");
      selectBox.append("option").text(idList[i]);
    }
  
    // Set up default plot
    updatePlots(0)
  
    // Function for updating plots   
    function updatePlots(index) {
  
  
      // Set up arrays for horizontal bar chart & gauge chart
      var SubjectOTUs = data.samples[index].otu_ids;
      console.log(SubjectOTUs);
      var SubjectFreq = data.samples[index].sample_values;
      var otuLabels = data.samples[index].otu_labels;
  
      var washFrequency = data.metadata[+index].wfreq;
      console.log(washFrequency);
  
  
      // Populate Demographic Data card
      var demoKeys = Object.keys(data.metadata[index]);
      var demoValues = Object.values(data.metadata[index])
      var demographicData = d3.select('#sample-metadata');
  
      // clear demographic data
      demographicData.html("");
  
      for (var i = 0; i < demoKeys.length; i++) {
  
        demographicData.append("p").text(`${demoKeys[i]}: ${demoValues[i]}`);
      };
  
  
      // Slice and reverse data for horizontal bar chart
      var topTenOTUS = SubjectOTUs.slice(0, 10).reverse();
      var topTenFreq = SubjectFreq.slice(0, 10).reverse();
      var topTenToolTips = data.samples[0].otu_labels.slice(0, 10).reverse();
      var topTenLabels = topTenOTUS.map((otu => "OTU " + otu));
      var reversedLabels = topTenLabels.reverse();
  
      // Set up trace1
      var trace1 = {
        x: topTenFreq,
        y: reversedLabels,
        text: topTenToolTips,
        name: "",
        type: "bar",
        orientation: "h"
      };
  
      // data
      var barData = [trace1];
  
      // Apply  layout
      var layout = {
        title: "Top 10 OTUs",
        margin: {
          l: 75,
          r: 75,
          t: 75,
          b: 50
        }
      };
  
      // Render the plot to the div tag with id "plot"
      Plotly.newPlot("bar", barData, layout);
  
      // Set up trace2
      trace2 = {
        x: SubjectOTUs,
        y: SubjectFreq,
        text: otuLabels,
        mode: 'markers',
        marker: {
          color: SubjectOTUs,
          opacity: [1, 0.8, 0.6, 0.4],
          size: SubjectFreq
        }
      }
  
      //data
      var bubbleData = [trace2];
  
      // Apply layout
      var layout = {
        title: 'OTU Frequency',
        showlegend: false,
        height: 600,
        width: 930
      }
  
      // Render the plot to the div tag with id "bubble-plot"
      Plotly.newPlot("bubble", bubbleData, layout)
  
      // Gauge chart
      //set up trace3
      var trace3 = [{
        domain: {x: [0, 1], y: [0,1]},
        type: "indicator",
        mode: "gauge+number",
        value: washFrequency,
        title: { text: "Belly Button Washing Frequency per week"},
        gauge: {
          axis: { range: [0, 9], tickwidth: 0.5, tickcolor: "black" },
          bar: { color: "#003366" },
          bgcolor: "grey",
          borderwidth: 2,
          bordercolor: "transparent",
          steps: [
            { range: [0, 1], color: "#ffffff" },
            { range: [1, 2], color: "#e6faff" },
            { range: [2, 3], color: "ccf5ff" },
            { range: [3, 4], color: "b3f0ff" },
            { range: [4, 5], color: "#99ebff" },
            { range: [5, 6], color: "#80e5ff" },
            { range: [6, 7], color: "#66e0ff" },
            { range: [7, 8], color: "#4ddbff" },
            { range: [8, 9], color: "#33d6ff" }
  
          ],
        }
      }];
  
      gaugeData = trace3;
  
      var layout = {
        width: 600,
        height: 500,
        margin: { t: 0, b: 0 }
      };
  
      Plotly.newPlot("gauge", gaugeData, layout);
  
    }
  
    // On button click, call refreshData()
    d3.selectAll("#selDataset").on("change", refreshData);
  
  
  
    function refreshData() {
      var dropdownMenu = d3.select("#selDataset");
      // Assign the values of the dropdown menu option to a variable
      var personsID = dropdownMenu.property("value");
      console.log(personsID);
      // Initialize an empty array for the individual's data
      console.log(data)
  
      for (var i = 0; i < data.names.length; i++) {
        if (personsID === data.names[i]) {
          updatePlots(i);
          return
        }
      }
    }
  
  });