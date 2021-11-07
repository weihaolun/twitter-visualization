console.log(scoredTweets);

// Group Tweets by weekday
var tweetsByWeekday = d3.nest()
    .key(function(d) {return d.weekday;})
    .entries(scoredTweets);
console.log(tweetsByWeekday);

// Weekday tweets count (array)
var weekdayCount = d3.nest()
    .key(function(d) { return d.weekday; })
    .rollup(function(v) { return v.length; })
    .entries(scoredTweets);
console.log(weekdayCount);

// Create array to hold weekdays, and another array to hold counts
const weekdayArray = [];
const weekdayCountArray = [];
for (let i = 0; i < 6; i++){
    weekdayArray.push(weekdayCount[i].key);
    weekdayCountArray.push(weekdayCount[i].value);
}
console.log(weekdayArray);
console.log(weekdayCountArray);

// Hour tweets count (array)
var hourCount = d3.nest()
    .key(function(d) { return d.hours; })
    .rollup(function(v) { return v.length; })
    .entries(scoredTweets);
console.log(hourCount);

// Create array to hold hours, and another array to hold counts
const hourArray = [];
const hourCountArray = [];
for (let i = 0; i < 24; i++){
    hourArray.push(hourCount[i].key);
    hourCountArray.push(hourCount[i].value);
}
console.log(hourArray);
console.log(hourCountArray);

// // Plot weekday barchart
// var weektrace = {
//     x: weekdayArray,
//     y: weekdayCountArray,
//     type: "bar"
//   };
//   var data = [weektrace];
//   var layout = {
//     title: "Number of tweets per weekday",
//     xaxis: { title: "weekdays" },
//     yaxis: { title: "number of tweets"}
//   };
//   Plotly.newPlot("bar-plot", data, layout);

//   // Plot hourly line chart
//   var hourtrace = {
//     x: hourArray,
//     y: hourCountArray,
//     type: "line"
//   };
//   var data = [hourtrace];
//   var layout = {
//     title: "Number of tweets per hour",
//     xaxis: { title: "time" },
//     yaxis: { title: "number of tweets"}
//   };
//   Plotly.newPlot("line-plot", data, layout);

var value = [['33515']]
var totalTweets = [{
    type: 'table',
    header: {
        values: [["<b>Total Tweets 7 Days<b>"]],
        align: "center",
        line: {width: 1, color: 'black'},
        fill: {color: "grey"},
        font: {family: "Arial", size: 12, color: "white"}
    },
    cells: {
        values: value,
        align: "center",
        line: {color: "black", width: 1},
        font: {family: "Arial", size: 11, color: "black"}
    }
}]
Plotly.newPlot("total-table", totalTweets);

// // Group Tweets by score
// var scoreGroup = d3.nest()
//     .key(function(d) {return d.score;})
//     .entries(scoredTweets);
// console.log(scoreGroup);

// Score tweets count (array)
var scoreCount = d3.nest()
    .key(function(d) { return d.score; })
    .rollup(function(v) { return v.length; })
    .entries(hourlySample);
console.log(scoreCount);

// Create array to hold scores, and another array to hold counts
const scoreArray = [];
const scoreCountArray = [];
for (let i = 0; i < 2; i++){
    scoreArray.push(scoreCount[i].key);
    scoreCountArray.push(scoreCount[i].value);
}
console.log(scoreArray);
console.log(scoreCountArray);

var scoretrace = {
    labels: scoreArray,
    values: scoreCountArray,
    type: 'pie'
   };
   var data = [scoretrace];
   var layout = {
    title: "Overall Sentiment Distribution",
   };
   Plotly.newPlot("pie-plot", data, layout);



// Weekday: count of 0 and count of 1 
var scoreByDay = d3.nest()
  .key(function(d) { return d.weekday; })
  .key(function(d) { return d.score; })
  .rollup(function(v) { return v.length; })
  .entries(hourlySample);
console.log(scoreByDay);


//Create array to score counts for each days [ each posi] [each nega]
const posiCount = [];
const negaCount = [];
for (let i = 0; i < 6; i++){
    posiCount.push(scoreByDay[i].values[0].value);
    negaCount.push(scoreByDay[i].values[1].value);
}
console.log(posiCount);
console.log(negaCount);

//Creat control bar chart for weekly sentiment
var overallPosiBar = {
    x: weekdayArray,
    y: posiCount,
    name: '0=Positive',
    type: 'bar'
};
var overallNegaBar = {
    x: weekdayArray,
    y: negaCount,
    name: '1=Negative',
    type: 'bar'
};

var overallControlBar = [overallPosiBar, overallNegaBar];
var layout = {barmode: 'group'};
Plotly.newPlot('control-bar-wholeweek', overallControlBar, layout);

// Hourly: count of 0 and count of 1 
var scoreByHour = d3.nest()
  .key(function(d) { return d.hours; })
  .key(function(d) { return d.score; })
  .rollup(function(v) { return v.length; })
  .entries(hourlySample);
console.log(scoreByHour);


//Create array to score counts for each days [ each posi] [each nega]
const posiCountHour = [];
const negaCountHour = [];
for (let i = 0; i < 24; i++){
    posiCountHour.push(scoreByHour[i].values[0].value);
    negaCountHour.push(scoreByHour[i].values[1].value);
}
console.log(posiCountHour);
console.log(negaCountHour);

//Creat line chart for weekly sentiment
var overallPosiLine = {
    x: hourArray,
    y: posiCountHour,
    name: '0=Positive',
    type: 'scatter'
};
var overallNegaLine = {
    x: hourArray,
    y: negaCountHour,
    name: '1=Negative',
    type: 'scatter'
};

var overallControlLine = [overallPosiLine, overallNegaLine];
Plotly.newPlot('double-line-wholeweek', overallControlLine, layout);

// Hourly samples group by weekday
var hourlyByWeekday = d3.nest()
    .key(function(d) {return d.weekday;})
    .entries(hourlySample);
console.log(hourlyByWeekday);

// Create an array to hold all monday tweets
var mondayTweets = hourlyByWeekday[0].values;
console.log(mondayTweets);

// Create an array to hold score and counts
var scoreMonday = d3.nest()
  .key(function(d) { return d.score; })
  .rollup(function(v) { return v.length; })
  .entries(mondayTweets);
console.log(scoreMonday);

// Create an array to hold 0 and 1 and another array to hold sentiment counts
const mondayScoreArray = [];
const mondayCountArray = [];
for (let i = 0; i < 2; i++){
    mondayScoreArray.push(scoreMonday[i].key);
    mondayCountArray.push(scoreMonday[i].value);
}

console.log(mondayScoreArray);
console.log(mondayCountArray);

// plot monday sentiment distribution pie chart
var mondayScoreTrace = {
    labels: mondayScoreArray,
    values: mondayCountArray,
    labels: ["0=Positive", "1=Negative"],
    type: 'pie'
   };
   var data = [mondayScoreTrace];
   var layout = {
    title: "Monday Sentiment Distribution",
   };
   Plotly.newPlot("monday-pie-plot", data, layout);

// Create an array to hold monday tweets hourly counts by sentiment
var scoreMondayHourly = d3.nest()
  .key(function(d) {return d.hours; }) 
  .key(function(d) { return d.score; })
  .rollup(function(v) { return v.length; })
  .entries(mondayTweets);
console.log(scoreMondayHourly);

// Creat an array to hold monday posi count and an array to hold monday nega count
const mondayPosiCountHour = [];
const mondayNegaCountHour = [];
for (let i = 0; i < 24; i++){
    mondayPosiCountHour.push(scoreMondayHourly[i].values[0].value);
    mondayNegaCountHour.push(scoreMondayHourly[i].values[1].value);
}
console.log(hourArray);
console.log(mondayPosiCountHour);
console.log(mondayNegaCountHour);

// plot monday hourly sentiment line chart
var mondayPosiLine = {
    x: hourArray,
    y: mondayPosiCountHour,
    name: '0=Positive',
    type: 'scatter'
};
var mondayNegaLine = {
    x: hourArray,
    y: mondayNegaCountHour,
    name: '1=Negative',
    type: 'scatter'
};
var mondaySentimentLine = [mondayPosiLine, mondayNegaLine];
Plotly.newPlot('double-line-monday', mondaySentimentLine, layout);

exports.array = mondayTweets;