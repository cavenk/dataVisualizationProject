// import * as d3 from "d3";

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"

document.addEventListener("DOMContentLoaded", ()=>{

    fetch(url)
        .then(response => response.json())
        .then(data => showData(data.baseTemperature, data.monthlyVariance))
})

function showData(baseTemperature, data){

    // const cell_w = 15
    // const cell_h = 25
    const cell_w = 5
    const cell_h = 25
    const legendBoxDimension = 20
    const legendSpacing = 5
    const legendHeight = legendBoxDimension * 4 + legendSpacing * 3
    const legendWidth = 250
    const padding_w = 100
    const padding_h = 50
    // const padding_w = 100
    // const padding_h = 50
    const w = padding_w * 2 + cell_w * Math.floor(data.length / 12)
    const h = padding_h * 3 + cell_h * 12 + legendHeight


    //Get SVG
    const svg = d3.select("svg")
        .attr("width", w)
        .attr("height", h)

    
    // Get min and max year
    // Get min and max temperature
    const minYear = data[0].year 
    const maxYear = data[data.length - 1].year
    const minTemp = d3.min(data, d=> d.variance)
    const maxTemp = d3.max(data, d => d.variance)

    console.log(maxYear - minYear)
    console.log(Math.ceil(data.length / 12))

    //update H3
    d3.select("#description")
        .text(`${minYear} - ${maxYear} : base temperature ${baseTemperature}℃`)
    
    
    //Create scale
    const xScale = d3.scaleLinear()
        .domain([minYear, maxYear])
        .range([padding_w, w - padding_w ])

    const yScale = d3.scaleBand()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    .range([padding_h + cell_h * 12, padding_h])


    //Create axis
    const axisBottom = d3.axisBottom(xScale)
        .ticks(20)
        .tickFormat(d => d)

    const axisLeft = d3.axisLeft(yScale)
        .tickFormat(d => formatMonth(d))

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${padding_h + cell_h * 12})`)
        .call(axisBottom)

    svg.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding_w}, 0)`)
        .call(axisLeft)


    //Create 4 temp variance
    const tempVariance = (maxTemp - minTemp) / 4
    const varianceOne = (minTemp + tempVariance).toFixed(3)
    const varianceTwo = (minTemp + tempVariance * 2).toFixed(3)
    const varianceThree = (minTemp + tempVariance * 3).toFixed(3)

    //Select tooltip
    const tooltip = d3.select("#tooltip")

    
    //Show data
    svg.selectAll(".cell")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("class", d => {
            const variance = getVarianceTempClass(d.variance, varianceOne, varianceTwo, varianceThree)

            return "cell " + variance
        })
        .attr("width", cell_w)
        .attr("height", cell_h)
        .attr("x", d => xScale(d.year))
        .attr("y", d => yScale(d.month))
        .attr("data-month", d => d.month -1)
        .attr("data-year", d => d.year)
        .attr("data-temp", d => d.variance)
        .on("mouseover", (e, d)=>{

            //Get x and y of the cell
            const x = parseFloat(e.currentTarget.getAttribute("x"))
            const y = parseFloat(e.currentTarget.getAttribute("y"))

            //Show tooltip
            tooltip
                .style("top", `${y + 20}px` )
                .style("left", `${x + 20}px`)
                .attr("class", "visible")
                .attr("data-year", d.year)
                .html(`${d.year} - ${formatMonth(d.month)} <br>${(baseTemperature + d.variance).toFixed(2)}℃ <br>Variance: ${d.variance}℃`)
        })
        .on("mouseout", (e, d)=>{

            tooltip.attr("class", "notVisible")
        })


    //Create legend
    const legend = svg.append("g")
        .attr("transform", `translate(${padding_w}, ${h - padding_h - legendHeight})`)
        .attr("id", "legend")

        //Box 1
    legend.append("rect")
        .attr("width", legendBoxDimension)
        .attr("height", legendBoxDimension)
        .attr("class", "one")

    legend.append("text")
        .attr("x", legendBoxDimension + legendSpacing)
        .attr("y", legendBoxDimension / 4 * 3)
        .text(`${minTemp}℃ to ${varianceOne}℃ variance`)
   
        //Box 2
    legend.append("rect")
        .attr("width", legendBoxDimension)
        .attr("height", legendBoxDimension)
        .attr("class", "two")
        .attr("y", legendBoxDimension + legendSpacing)

    legend.append("text")
        .attr("x", legendBoxDimension + legendSpacing)
        .attr("y", legendBoxDimension + legendSpacing + (legendBoxDimension / 4 * 3))
        .text(`${varianceOne}℃ to ${varianceTwo}℃ variance`)
    
        //Box 3
    legend.append("rect")
        .attr("width", legendBoxDimension)
        .attr("height", legendBoxDimension)
        .attr("class", "three")
        .attr("y", legendBoxDimension * 2 + legendSpacing * 2)

    legend.append("text")
        .attr("x", legendBoxDimension + legendSpacing)
        .attr("y", legendBoxDimension * 2 + legendSpacing * 2 + (legendBoxDimension / 4 * 3))
        .text(`${varianceTwo}℃ to ${varianceThree}℃ variance`)

        //Box 4
    legend.append("rect")
        .attr("width", legendBoxDimension)
        .attr("height", legendBoxDimension)
        .attr("class", "four")
        .attr("y", legendBoxDimension * 3 + legendSpacing * 3)

    legend.append("text")
        .attr("x", legendBoxDimension + legendSpacing)
        .attr("y", legendBoxDimension * 3 + legendSpacing * 3 + (legendBoxDimension / 4 * 3))
        .text(`${varianceThree}℃ to ${maxTemp}℃ variance`)


}

function getVarianceTempClass(temp, varianceOne, varianceTwo, varianceThree){
    
    if(temp > varianceThree)
        return "four"

    else if(temp > varianceTwo)
        return "three"
    
    else if(temp > varianceOne)
        return "two"

    else    
        return "one"
}

function formatMonth(month){

    switch(month){

        case 1: 
            return "January"
        case 2: 
            return "Febuary"
        case 3: 
            return "March"
        case 4: 
            return "April"
        case 5: 
            return "May"
        case 6: 
            return "June"
        case 7: 
            return "July"
        case 8: 
            return "August"
        case 9: 
            return "September"
        case 10: 
            return "October"
        case 11: 
            return "November"
        case 12: 
            return "December"
    }
}