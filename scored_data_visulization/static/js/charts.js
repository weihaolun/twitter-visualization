function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of weekday names to populate the select options
    d3.json("https://raw.githubusercontent.com/weihaolun/twitter-visualization/master/scored_data_visulization/hourly_sample.json").then((data) => {
        var weekdayNames = data.names;

        weekdayNames.forEach((weekday) => {
        selector
            .append("option")
            .text(weekday)
            .property("value", weekday);
        });

        // Use the first sample from the list to build the initial plots
        var firstWeekday = weekdayNames[0];
        buildCharts(firstWeekday);
        buildMetadata(firstWeekday);
    });
    }

init();

// Initialize the dashboard
function optionChanged(newWeekday) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newWeekday);
  buildCharts(newWeekday);
};

//
function buildMetadata(weekday) {
    d3.json("https://raw.githubusercontent.com/weihaolun/twitter-visualization/master/scored_data_visulization/hourly_sample.json").then((data) =>{
        var metadata = data.metadata;
        var weekday = metadata.weekday;
        var hourlyByWeekday = d3.nest()
            .key(function(d) {return d.weekday})
            .entries(metadata);
        
        var resultTweets = hourlyByWeekday[0].values;
        console.log(resultTweets);

        // Create an array to hold score and counts
        var resultScore = d3.nest()
            .key(function(d) { return d.score; })
            .rollup(function(v) { return v.length; })
            .object(resultTweets);
            console.log(resultScore);
        
        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");
        
        Object.entries(resultScore).forEach(([key,value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value.toString()}`);
    });
    });
}
// // Dashboard Panel
// function buildCharts(weekday) {
//     d3.json("https://raw.githubusercontent.com/weihaolun/twitter-visualization/master/scored_data_visulization/hourly_sample.json").then((data) =>{
//         var metadata = data.metadata;
//         // Hourly sample group by weekday
//         var hourlyByWeekday = d3.nest()
//             .key(function(d) {return d.weekday})
//             .entries(metadata);
//         console.log(hourlyByWeekday);

//         // Create an array to hold all monday tweets
//         var mondayTweets = hourlyByWeekday[0].values;
//         console.log(mondayTweets);

//         // Create an array to hold score and counts
//         var scoreMonday = d3.nest()
//             .key(function(d) { return d.score; })
//             .rollup(function(v) { return v.length; })
//             .entries(mondayTweets);
//             console.log(scoreMonday);

//         // Create an array to hold 0 and 1 and another array to hold sentiment counts
//         const mondayScoreArray = [];
//         const mondayCountArray = [];
//         for (let i = 0; i < 2; i++){
//             mondayScoreArray.push(scoreMonday[i].key);
//             mondayCountArray.push(scoreMonday[i].value);
//         }

//         // plot monday sentiment distribution pie chart
//         var mondayScoreTrace = {
//             labels: mondayScoreArray,
//             values: mondayCountArray,
//             labels: ["0=Positive", "1=Negative"],
//             type: 'pie'
//             };
//         var data = [mondayScoreTrace];
//         var layout = {
//             title: "Monday Sentiment Distribution",
//             };
//         Plotly.newPlot("monday-pie-plot", data, layout);
//     })
// }