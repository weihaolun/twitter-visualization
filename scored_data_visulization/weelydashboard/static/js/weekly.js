function init() {
    // Grab a reference to the dropdown select element
    const selector = d3.select("#selDataset");

    // Use the list of weekday names to populate the select options
    d3.json("https://raw.githubusercontent.com/weihaolun/twitter-visualization/master/datasources/all_weeks_data.json").then((data) => {

        var dataByWeekday = d3.nest()
            .key(function (d) { return d.weekday; })
            .entries(data);

        const weekdayNames = [];
        for (let i = 0; i < 7; i++) {
            weekdayNames.push(dataByWeekday[i].key);
        }

        weekdayNames.forEach((weekday) => {
            selector
                .append("option")
                .text(weekday)
                .property("value", weekday);
        });

        // Use the first sample from the list to build the initial plots
        const firstWeekday = weekdayNames[0];
        //buildCharts(firstWeekday);
        buildMetadata(firstWeekday);
    });
}

init();

// Initialize the dashboard
function optionChanged(newWeekday) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newWeekday);
    //buildCharts(newWeekday);
};

// // Data Panel
// function buildMetadata(weekday) {
//     d3.json("https://raw.githubusercontent.com/weihaolun/twitter-visualization/master/datasources/weekly_tweets_counts.json").then((data) => {

//         // Create an array for each day
//         const countArray = data.filter(sampleObj => sampleObj.weekday === weekday);
//         console.log("This weekday's total tweets info", countArray);

//         // Create an iterate to accumulate total tweets occured
//         var totalTweets = 0
//         for (var i = 0; i < countArray.length; i++) {
//             totalTweets += countArray[i].tweet_count;
//         }
        
//         // Create an oject of total tweets occured of the day for display
//         const tweetsOccured = {"Total Tweets": totalTweets};
//         console.log("Sum of tweets occured this weekday", tweetsOccured);

//         // Create a panel to hold the all tweets occured content
//         const TOTALPANEL = d3.select("#all-tweets-occured");
//         TOTALPANEL.html("");

//         // Append total tweets occured to the pannel with selector
//         Object.entries(tweetsOccured).forEach(([key, value]) => {
//             TOTALPANEL.append("h6").text(`${key.toUpperCase()}: ${value.toString()}`);
//         });

//         // array to hold all dates
//         const dateArray = [];
//         for (let i = 0; i < data.length; i++) {
//             dateArray.push(data[i].created_date)
//         }

//         // to calculate number of weeks
//         numberOfWeeks = Math.round(dateArray.length / 7);
//         console.log("this is the number of weeks", numberOfWeeks);

//         // object to hold start and end date and weeks
//         const dataDateInfo = {
//             "Date Range": `${dateArray[0]} — ${dateArray[dateArray.length-1]}`,
//             "Number of Weeks": numberOfWeeks
//         }

//         // Create a panel to hold the all tweets occured content
//         const DATEPANEL = d3.select("#data-date-info");
//         DATEPANEL.html("");

//         // Append total tweets occured to the pannel with selector
//         Object.entries(dataDateInfo).forEach(([key, value]) => {
//             DATEPANEL.append("h6").text(`${key.toUpperCase()}: ${value.toString()}`);
//         });

//     })
//     d3.json("https://raw.githubusercontent.com/weihaolun/twitter-visualization/master/datasources/all_weeks_data.json").then((data) => {

//         // Re-arrange the dataset by weekday
//         var dataByWeekday = d3.nest()
//             .key(function (d) { return d.weekday; })
//             .entries(data);
        
//         // Create an array to hold each weekday's detail with key
//         const resultArray = dataByWeekday.filter(sampleObj => sampleObj.key == weekday);
//         console.log("Sample Results", resultArray)
        
//         // Create an array to hold sample data only (with no key)
//         const theDayTweets = resultArray[0].values;
//         console.log("this is the day's data", theDayTweets)

//         // Roll up by scores
//         const tweetsByScore = d3.nest()
//             .key(function (d) {return d.score; })
//             .object(theDayTweets);
//         console.log("this is the day's samples rolled by scores", tweetsByScore);

//         // Create an array to hold 5 posi tweets from the day
//         const fivePosiTweets = [];
//         for (let i = 0; i < 5; i++) {
//             fivePosiTweets.push(tweetsByScore[1][i].tweet);
//         }

//         // Create an panel to hold the tweet text
//         const POSITWEETSPANEL = d3.select("#positweets");
//         POSITWEETSPANEL.html("");
        
//         // Append the tweet text to display
//         Object.entries(fivePosiTweets).forEach(([key, value]) => {
//             POSITWEETSPANEL.append("h6").text(`${value.toString()}`);
//         });

//         // Create an array to hold 5 posi tweets from the day
//         const fiveNegaTweets = [];
//         for (let i = 0; i < 5; i++) {
//             fiveNegaTweets.push(tweetsByScore[0][i].tweet);
//         }
        
//         // Create an panel to hold the tweet text
//         const NEGATWEETSPANEL = d3.select("#negatweets");
//         NEGATWEETSPANEL.html("");
        
//         // Append the tweet text to display
//         Object.entries(fiveNegaTweets).forEach(([key, value]) => {
//             NEGATWEETSPANEL.append("h6").text(`${value.toString()}`);
//         });

//         // Create an array to hold score and counts
//         const resultScoreCount = d3.nest()
//             .key(function (d) { return d.score; })
//             .rollup(function (v) { return v.length; })
//             .object(theDayTweets);
//         console.log("sample result score count", resultScoreCount);

//         // Creat consts for percentage
//         const posiPercentage = Math.round((resultScoreCount[1] / theDayTweets.length) * 100);
//         const negaPercentage = Math.round((resultScoreCount[0] / theDayTweets.length) * 100);

//         // Create an array to hold counts with label
//         const countDisplay = {
//             "Positive": posiPercentage,
//             "Negative": negaPercentage
//         }

//         // Create panel to hold the counts
//         const COUNTPANEL = d3.select("#weekday-count");
//         COUNTPANEL.html("");
        
//         // Append the counts to display
//         Object.entries(countDisplay).forEach(([key, value]) => {
//             COUNTPANEL.append("h6").text(`${key.toUpperCase()}: ${value.toString()}%`);
//         });

//         var gaugeData = [
//             {
//               domain: { x: [0, 1], y: [0, 1] },
//               value: posiPercentage,
//               number: { suffix: "%" },
//               title: { text: "<b>Positive Sentiment Rate</br>" },
//               type: "indicator",
//               mode: "gauge+number",
//               gauge: {
//                 axis: { range: [null, 100] },
//                 bar: { color: "#b73038" },
//                 steps: [
//                   { range: [0, 25], color: "#b9bec1" },
//                   { range: [25, 50], color: "#8b9094" },
//                   { range: [50, 75], color: "#78797c" },
//                   { range: [75, 100], color: "#4a4b4c" }
//                 ],        
//               }
//             }
//           ];
//         var gaugeLayout = { 
//             width: 600, 
//             height: 400, 
//             margin: { t: 0, b: 0 },
//             paper_bgcolor: "#d7dcdd",
//             plot_bgcolor:"#d7dcdd"
//           };
//         var GAUGE = document.getElementById("gauge");
//         Plotly.newPlot(GAUGE, gaugeData, gaugeLayout);


//         // Create an array to hold day tweets hourly counts by sentiment
//         const theDayHourlyDistribution = d3.nest()
//             .key(function (d) { return d.hours; })
//             .key(function (d) { return d.score; })
//             .rollup(function (v) { return v.length; })
//             .entries(theDayTweets);

//         // Creat an array to hold the day's posi count and an array to hold nega count
//         const hourTimes = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
//         const theDayPosiHour = [];
//         const theDayNegaHour = [];
//         for (let i = 0; i < 24; i++) {
//             theDayPosiHour.push(theDayHourlyDistribution[i].values[1].value);
//             theDayNegaHour.push(theDayHourlyDistribution[i].values[0].value);
//         }

//         // plot the day hourly sentiment line chart
//         const thePosiLine = {
//             x: hourTimes,
//             y: theDayPosiHour,
//             name: 'Positive',
//             type: 'scatter',
//             line: { color: '#B73038',
//                     width: 3.5}
//         };
//         const theNegaLine = {
//             x: hourTimes,
//             y: theDayNegaHour,
//             line: { color: '#8B9094',
//                     width: 3.5},
//             name: 'Negative',
//             type: 'scatter'
//         };
//         const lineLayout = {
//             title: "<b> Sentiment Distribution Each Hour <b>",
//             paper_bgcolor: "#D7DCDD",
//             plot_bgcolor: "#D7DCDD",
//         }
//         const hourSentimentLine = [thePosiLine, theNegaLine];
//         Plotly.newPlot('day-double-line', hourSentimentLine, lineLayout);

//         // Initialize dictionary for word count
//         var wordCounts = {}
//         for (i = 0; i < theDayTweets.length; i++) {
//             // Get value of "string_text" key
//             var arrayOfWords = theDayTweets.map(value => value.text)
//         }
//         arrayOfWords.forEach(function (list) {
//             // Iterate through each word to add to dictionary
//             list.forEach(function (word) {
//                 // Add word if not in dictionary and put 1 as value
//                 if (!wordCounts[word]) {
//                     wordCounts[word] = 1;
//                 } else {
//                     // Add count if word is already in dictionary
//                     wordCounts[word]++;
//                 }
//             })
//         })
//         // Create items array
//         var items = Object.keys(wordCounts).map(function (key) {
//             return [key, wordCounts[key]];
//         });

//         // Sort the array based on the second element
//         items.sort(function (first, second) {
//             return second[1] - first[1];
//         });

//         // Create a new array with only the first 100 / 10 items
//         var topWordsCloud = items.slice(1, 101)
//         var topWords = items.slice(1, 11)
//         console.log("This weekday's top 10 words counts", topWords)

//         // Create the yticks for the bar chart.
//         var yticks = topWords.map(function (word) {
//             return word[0]
//         }).reverse()
//         var wordValues = topWords.map(function (word) {
//             return word[1]
//         }).reverse()
//         //var wordLabels = topWords[0]

//         // Create the trace for the bar chart. 
//         var wordBarData = [{
//             type: "bar",
//             x: wordValues,
//             y: yticks,
//             marker:{color: "#B73038"},
//             //text: wordLabels,
//             orientation: "h"
//         }];

//         // Create the layout for the bar chart. 
//         var wordBarLayout = {
//             title: "<b>Top 10 Words<b>",
//             paper_bgcolor: "#D7DCDD",
//             plot_bgcolor: "#D7DCDD",
//             xaxis: { range: [0, 1600] },
//             yaxis: { range: [-1, 10] },
//         };
//         // Use Plotly to plot the data with the layout. 
//         Plotly.newPlot("word-bar", wordBarData, wordBarLayout);

//         // Tag Cloud
//         CLOUDPANEL = d3.select("#cloud");
//         CLOUDPANEL.html("");
//         anychart.onDocumentReady(function () {
//             // create a tag (word) cloud chart
//             const chart = anychart.tagCloud(topWordsCloud);
//             // set the container id
//             chart.container("cloud");
//             // format the chart title
//             const title = chart.title();
//             title.enabled(true);
//             title.text("Top 100 Words")
//             title.fontWeight("bold");
//             title.fontColor("#4a4b4c");
//             title.fontSize(17);
//             // set an array of angles at which the words will be laid out
//             chart.angles([0]);
//             // set the mode of the tag cloud
//             chart.mode("spiral");
//             // create and configure a color scale.
//             var customColorScale = anychart.scales.ordinalColor();
//             customColorScale.ranges([
//                 { less: 400 },
//                 { from:400, to: 1000 },
//                 { greater: 1000 }
//             ]);
//             customColorScale.colors(["#8B9094", "#4A4B4C", "#B73038"]);
//             // set the color scale as the color scale of the chart
//             chart.colorScale(customColorScale);
//             // add a color range
//             chart.colorRange().enabled(true);
//             var background = chart.background();
//             background.fill('#D7DCDD');
//             // display the word cloud chart
//             chart.tooltip(false);
//             chart.draw();
        
//         });
//     });
// }



