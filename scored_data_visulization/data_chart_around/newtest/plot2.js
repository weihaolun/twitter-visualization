console.log("hello")

firstweekdata = d3.json("https://raw.githubusercontent.com/weihaolun/twitter-visualization/master/datasources/first_week_data.json")
console.log(firstweekdata)

var dataByWeekday = d3.nest()
    .key(function(d) {return d.weekday;})
    .object(firstweekdata);

    console.log(dataByWeekday);

    console.log(firstweekdata[0]);
