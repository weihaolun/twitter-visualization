console.log("test")

console.log(samplefile)
console.log("this is just the weekdays", Object.keys(samplefile))

const weekdayNamessam = Object.keys(samplefile)
console.log(weekdayNamessam)



resultArraysam = Object.values(samplefile).map(function(weekday) {
    return samplefile[weekday];
})
console.log(resultArraysam)

console.log(samplefile.Monday)