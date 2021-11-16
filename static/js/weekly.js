function init() {
    // Grab a reference to the dropdown week selection
    const weekSelector = d3.select("#selWeeks");

    // Use the list of weeks to populate the select options
    d3.json("https://raw.githubusercontent.com/weihaolun/twitter-visualization/master/datasources/weekly_tweets_counts.json").then((data) => {
        console.log("this is the weekly count data", data);

        // Roll data by weeks
        var dataByWeeks = d3.nest()
            .key(function (d) { return d.weeks; })
            .entries(data);
        console.log("this is rolled by weeks", dataByWeeks);

        // Create an array to retrieve weeks names
        const weeksNames = [];
        for (let i =0; i < dataByWeeks.length; i++) {
            weeksNames.push(dataByWeeks[i].key);
        }

        weeksNames.forEach((weeks) => {
            weekSelector
                .append("option")
                .text(weeks)
                .property("value", weeks);
        });

        // Use the first week from the list to build the initial plots
        const firstWeek = weeksNames[0];
        // buildWeekdata(fisrtweek)
        buildWeekdata(firstWeek);
})
}

init();

// Initialize the weekly dashboard
function weekChanged(newWeek) {
    // Fetch new data each time a new sample is selected
    buildWeekdata(newWeek);
};

// Data Panel
function buildWeekdata(weeks) {
    d3.json("https://raw.githubusercontent.com/weihaolun/twitter-visualization/master/datasources/weekly_tweets_counts.json").then((data) => {
        
        // Roll data by weeks
        const dataByWeeks = d3.nest()
            .key(function (d) { return d.weeks; })
            .entries(data);
        
        // Create array filtered by weeks
        const weekArray = dataByWeeks.filter(sampleObj => sampleObj.key == weeks);

        // Create array to hold the values only
        const theWeekData = weekArray[0].values;
        console.log("this is the week's value only", theWeekData);

        // Create an array to hold the date range of this week
        const weekDateRange = {
            "Start": `${theWeekData[0].created_date}`, 
            "End": `${theWeekData[theWeekData.length-1].created_date}`
        }
        console.log("this is the date range of the week", weekDateRange);

        // Date Range Panel
        const RANGEPANEL = d3.select("#weekly-data-range");
        RANGEPANEL.html("");

        Object.entries(weekDateRange).forEach(([key, value]) => {
            RANGEPANEL.append("h6").text(`${key.toUpperCase()}: ${value.toString()}`);
        });

      // Accumulate the weekly occured.
        var totalWeeklyOccured = 0
        for (var i = 0; i < theWeekData.length; i++) {
            totalWeeklyOccured += theWeekData[i].tweet_count;
        }
        const totalTweetsOccured = {
            "Weekly Total": `${totalWeeklyOccured}`
        };
        console.log("this is the total weekly occured", totalTweetsOccured)

        // Total Tweets Panel
        const OCCURPANEL = d3.select("#total-tweets-occurred");
        OCCURPANEL.html("");

        Object.entries(totalTweetsOccured).forEach(([key, value]) => {
            OCCURPANEL.append("h6").text(`${key.toUpperCase()}: ${value.toString()}`);
        });

        // Calculate the average count per day
        averageCount = Math.round(totalWeeklyOccured / 7);
        const averageTweets = {
            "Average Tweets": `${averageCount}`
        };
        console.log("this is the average occured per day", averageTweets)
        
        // Average Tweets Panel
        const AVERAGEPANEL = d3.select("#average-tweets");
        AVERAGEPANEL.html("");

        Object.entries(averageTweets).forEach(([key, value]) => {
            AVERAGEPANEL.append("h6").text(`${key.toUpperCase()}: ${value.toString()}`);
        });
       
        // Plot the barchart
        const theWeekdayList = [];
        const eachDayCount = [];
        for (let i = 0; i < 7; i++) {
            theWeekdayList.push(theWeekData[i].weekday);
            eachDayCount.push(theWeekData[i].tweet_count);
        }

        var weeklyBarTrace = {
            x: theWeekdayList,
            y: eachDayCount,
            type: 'bar',
            text: eachDayCount.map(String),
            textposition: "auto",
            hoverinfo: 'none',
            width: 0.6,
            marker : {
                color: '#b73038',
                },        
            }
        var barData = [weeklyBarTrace];

        var barLayout = {
            title: "<b> Total Tweets Occured Each Day<b>",
            paper_bgcolor: "#D7DCDD",
            plot_bgcolor: "#D7DCDD",
        };

        Plotly.newPlot("weekly-bar", barData, barLayout);

        
        


})
}