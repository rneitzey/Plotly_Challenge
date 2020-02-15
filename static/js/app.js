
var sample_data;

function buildCharts(sampleID) {

  selected_sample = sample_data.samples.filter(sample => sample.id === sampleID)[0];

  let otu_labels = selected_sample.otu_labels.slice(0,10).reverse();
  let otu_ids = selected_sample.otu_ids.slice(0,10).reverse();
  let sample_values = selected_sample.sample_values.slice(0,10).reverse();


  // Trace1 for the Greek Data
  let trace1 = {
    x: sample_values,
    y: otu_ids.map(otuID => `OTU ${otuID}`),
    text: otu_labels,
    title: "Top 10 OTU for Subject",
    type: "bar",
    orientation: "h"
  };

  // data
  let chartData = [trace1];

  // Apply the group bar mode to the layout
  let layout = {
    title: "",
    margin: {
      l: 100,
      r: 100,
      t: 25,
      b: 100
    }
  };

  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("bar", chartData, layout);

  let bubbleChart = [
    {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }
  ];

  let bubbleChartLayout = {
    margin: { t: 0 },
    xaxis: { title: "OTU ID" }
  };

  Plotly.plot("bubble", bubbleChart, bubbleChartLayout);
};

function buildMetadata(sampleID) {
  // Make an API call to gather all data and then reduce to matching the sample selected
   // Use d3 to select the panel id
   let panel = d3.select("#sample-metadata");

    // Clear prior data
    panel.html("");

    let selectedMetaData = sample_data.metadata.filter(meta => meta.id === parseInt(sampleID))[0];
    // Add each key and value pair to the panel
    Object.entries(selectedMetaData).forEach(([key, value]) => {
      panel.append("h5").text(`${key}:${value}`);
    });
  };

function init() {

    // Grab a reference to the dropdown select element
    let selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("static/samples.json").then((data) => {
      sample_data = data;
      console.log(sample_data);
      
      let sampleNames = data.names;
      sampleNames.forEach(name => {
        selector.append("option").attr("value", name).text(name)
      });

      // Use the first sample from the list to build the initial plots
      let firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);

    });
  };

  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  };

  // Initialize the dashboard
  init();