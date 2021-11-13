function init() {
    // Grab a reference to the dropdown select element
    const selector = d3.select("#selDataset");

    // Use the list of weekday names to populate the select options
    d3.json("https://raw.githubusercontent.com/weihaolun/Twitter-Sentiment-Analysis/main/words_viz_draft/cleaned_scored_tweets.json").then((data) => {
         
        var dataByWeekday = d3.nest()
            .key(function(d) {return d.weekday;})
            .entries(data);

        const weekdayNames = [];
        for (let i = 0; i < 7; i++){
        weekdayNames.push(dataByWeekday[i].key);}

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

// Info Panel
function buildMetadata(weekday) {
    d3.json("https://raw.githubusercontent.com/weihaolun/Twitter-Sentiment-Analysis/main/words_viz_draft/cleaned_scored_tweets.json").then((data) =>{
        
        var dataByWeekday = d3.nest()
            .key(function(d) {return d.weekday;})
            .entries(data);
    
        const resultArray = dataByWeekday.filter(sampleObj => sampleObj.key == weekday);
        
        const theDayTweets = resultArray[0].values;

        // Create an array to hold score and counts
        const resultScoreCount = d3.nest()
            .key(function(d) { return d.score; })
            .rollup(function(v) { return v.length; })
            .object(theDayTweets);
            console.log("result sccore count", resultScoreCount);
        
        const countDisplay = {"Positive": resultScoreCount[0], 
                            "Negative": resultScoreCount[1]}
       
        const COUNTPANEL = d3.select("#weekday-count");
        COUNTPANEL.html("");
        
        Object.entries(countDisplay).forEach(([key,value]) => {
            COUNTPANEL.append("h6").text(`${key.toUpperCase()}: ${value.toString()}`);
            });

        // const PANEL2 = d3.select("#weekinfo");

        // const numofWeeks = {"WEEKS": "2", "Date Range": "11/01/2021 - 11/15/2021"}
        // Object.entries(numofWeeks).forEach(([key,value]) => {
        //     PANEL2.text(`${key.toUpperCase()}: ${value.toString()}`);
        //     });

        // Create an array to hold 0 and 1 and another array to hold sentiment counts
        const scoreLabel = ["1=Positive", "0=Negative"];
        const theDayCount = [];
        for (let i = 0; i < 2; i++){
            theDayCount.push(resultScoreCount[i]);
        }
        
        // plot the day's sentiment distribution pie chart
        const dayScorePie = {
            labels: scoreLabel,
            values: theDayCount,
            // labels: ["0=Positive", "1=Negative"],
            type: 'pie',
            marker: {colors: ["#B73038", "#8B9094"]}};
            const pieData = [dayScorePie];
            const pielayout = {
            title: "<b> Sentiment Distribution <b>",
            paper_bgcolor: "#D7DCDD",
            plot_bgcolor: "#D7DCDD",  
            };
            Plotly.newPlot("theday-pie-plot", pieData, pielayout);

        // Create an array to hold day tweets hourly counts by sentiment
        const theDayHourlyDistribution = d3.nest()
            .key(function(d) {return d.hours; }) 
            .key(function(d) { return d.score; })
            .rollup(function(v) { return v.length; })
            .entries(theDayTweets);
        console.log(theDayHourlyDistribution);

        // Creat an array to hold the day's posi count and an array to hold nega count
        
        const hourTimes = ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"];
        const theDayPosiHour = [];
        const theDayNegaHour = [];
        for (let i = 0; i < 24; i++){
            theDayPosiHour.push(theDayHourlyDistribution[i].values[0].value);
            theDayNegaHour.push(theDayHourlyDistribution[i].values[1].value);
            }
        
        // plot the day hourly sentiment line chart
        const thePosiLine = {
            x: hourTimes,
            y: theDayPosiHour,
            name: '0=Positive',
            type: 'scatter',
            line: {color: '#B73038'}
        };
        const theNegaLine = {
            x: hourTimes,
            y: theDayNegaHour,
            line: {color: '#8B9094'},
            name: '1=Negative',
            type: 'scatter'
        };
        const lineLayout = {
            title: "<b> Sentiment Distribution Each Hour <b>",
            paper_bgcolor: "#D7DCDD",
            plot_bgcolor: "#D7DCDD",         
        }
        const hourSentimentLine = [thePosiLine, theNegaLine];
        Plotly.newPlot('day-double-line', hourSentimentLine, lineLayout);
    });
}
