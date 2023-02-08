// import * as d3 from "d3";

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

document.addEventListener("DOMContentLoaded", e =>{

    fetch(url)
        .then((response)=> response.json())
        .then((data)=> showData(data))
})

function showData(data){

    const w = 900
    const h = 600
    const padding = 75
    const paddingTop = 100

    //Create SVG
    const svg = d3.select("svg")
        .attr("width", w)
        .attr("height", h)

    // //Create title
    // svg.append("text")
    //     .attr("x", w / 2 )
    //     .attr("y", padding)
    //     .attr("text-anchor", "middle")
    //     .attr("id", "title")
    //     .text("Doping in Professional Bicycle Racing")
        
    //Get min and max of data
    const minX = d3.min(data, d => d.Year)
    const maxX = d3.max(data, d => d.Year)
    const minY = d3.min(data, d => d.Seconds)
    const maxY = d3.max(data, d => d.Seconds)


    //Create scales
    const xScale = d3.scaleTime()
        .domain([new Date(minX, 0), new Date(maxX, 0)])
        .range([padding, w - padding])

    const yScale = d3.scaleLinear()
        .domain([minY, maxY])
        .range([h - padding, paddingTop])


     //Create axis
     const bottomAxis = d3.axisBottom(xScale)
     const leftAxis = d3.axisLeft(yScale)
         .tickFormat(d => formatTime(d))
         
 
     svg.append("g")
         .attr("transform", `translate(0, ${h - padding})`)
         .attr("id", "x-axis")
         .call(bottomAxis)
 
     svg.append("g")
         .attr("transform", `translate(${padding}, 0)`)
         .attr("id", "y-axis")
         .call(leftAxis)
 

    //Select tooltip
    const tooltip = d3.select("#tooltip")


    //Create circle for all data and append to the graph
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d, i)=> xScale(new Date(d.Year, 0)))
        .attr("cy", d => yScale(d.Seconds))
        .attr("r", 7)
        .attr("class", (d)=> d.Doping === "" ? "dot noDoping" : "dot doping")
        .attr("data-xvalue", d => d.Year)
        .attr("data-yvalue", d => new Date(0,0,0,0,0, d.Seconds))
        .on("mouseover", (e,d) =>{

            //Get current X and Y
            const x = parseFloat(e.currentTarget.getAttribute("cx"))
            const y = parseFloat(e.currentTarget.getAttribute("cy"))

            //Create text for tooltip
            const name = `<b>Name:</b> ${d.Name}`
            const time = `<b>Time:</b> ${d.Time}`
            const place = `<b>Place:</b> ${d.Place}`
            const year = `<b>Year:</b> ${d.Year}`

            //Edit tooltip
            tooltip.attr("data-year", d.Year)
                .style("left", x < w / 2 ? `${x + 10}px` : "auto")
                .style("right", x > w / 2 ? `${w - x + 10}px` : "auto")
                .style("top", y < h / 2 ? `${y}px` : "auto")
                .style("bottom", y > h / 2 ? `${h - y}px` : "auto")
                .attr("class", "visible")
                .html(`${name} <br>${time} <br>${place} <br>${year} <br><br>${d.Doping}`)
        })
        .on("mouseout", ()=>{
            tooltip.attr("class", "notVisible")
        })



        //Create legend
        const colorBoxDimension = 25
        const strokeWidth = 2
        const spacing = 5
        const legendWidth = 200
        const legendHeight = strokeWidth * 2 + spacing * 3 + colorBoxDimension * 2

        const legendContainer = svg.append("g")
            .attr("id", "legend")
            .attr("transform", `translate(${w - padding - legendWidth}, ${h - padding - legendHeight - 50})`)


            //border of the legend
        legendContainer.append("rect")
            .attr("width", legendWidth)
            .attr("height", legendHeight )
            .attr("stroke", "gray")
            .attr("stroke-width", strokeWidth)
            .attr("fill", "transparent")


            //Color box for  no doping legend
        legendContainer.append("rect")
            .attr("width", colorBoxDimension)
            .attr("height", colorBoxDimension)
            .attr("class", "noDoping")
            .attr("y", strokeWidth + 5)
            .attr("x", strokeWidth + 5)

            //Text for no doping legend
        legendContainer.append("text")
            .text("No doping allegation")
            .attr("x", colorBoxDimension + 5 + strokeWidth + 5)
            .attr("y", strokeWidth + 5 + colorBoxDimension / 4 * 3)
            .attr("height", colorBoxDimension)

            //Color box for doping legend
        legendContainer.append("rect")
            .attr("width", colorBoxDimension)
            .attr("height", colorBoxDimension)
            .attr("class", "doping")
            .attr("y", strokeWidth + 5 + colorBoxDimension + 5)
            .attr("x", strokeWidth + 5)
        
            //Text for no doping legend
        legendContainer.append("text")
            .text("Doping allegation")
            .attr("x", colorBoxDimension + 5 + strokeWidth + 5)
            .attr("y", strokeWidth + 5 + colorBoxDimension + 5 + colorBoxDimension / 4 * 3)
            .attr("height", colorBoxDimension)



   
}

function formatTime(seconds){

    const minute = Math.floor(seconds / 60)
    const sec = seconds % 60


    return `${minute < 10? "0" + minute : minute}:${sec < 10 ? "0" + sec : sec}`
}


