

document.addEventListener("DOMContentLoaded", ()=>{
    
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
    .then(response => response.json())
    .then(data => showData(data.data))

    
})

function showData(data){

    // Get width, height and padding
    const w = 900
    const h = 500
    const padding = 50


    //Get min and max from data
    const minDate = d3.min(data, (d)=> new Date(d[0]))
    const maxDate = d3.max(data, (d)=> new Date(d[0]))
    const maxY = d3.max(data, (d)=> d[1])


    /**
     * Create X and Y scale
     * Create time scale for bottom axis
     * create height scale for heigth of data
     */
    const xScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([padding, w - padding])

    const yScale = d3.scaleLinear()
        .domain([0, maxY])
        .range([h - padding, padding])

    const timeScale = d3.scaleTime()
        .domain([minDate, maxDate])
        .range([padding, w - padding])

    const heightScale = d3.scaleLinear()
            .domain([0, maxY])
            .range([0, h - padding * 2])

    
    //Select SVG element
    const graphic = d3.select("#graphic")
        .attr("width", w)
        .attr("height", h)


    //Select tooltip to show data
    const tooltip = d3.select("#tooltip")


    //Create RECT element in the SVG and append data
    graphic.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", 3)
    .attr("height", d => heightScale(d[1]))
    .attr("x", (d, i)=> xScale(i))
    .attr("y", d => yScale(d[1]))
    .attr("data-date", (d)=> d[0])
    .attr("data-gdp", (d)=> d[1])
    .on("mouseover", (event, d)=>{

        //Set tooltip data and opacity
        tooltip
            .html(`${d[0]} <br> $${d[1]} Billion`)
            .attr("data-date", d[0])
            .style("opacity", 100)
            
    })
    .on("mouseout", (event, d)=>{

        //Reset tooltip opacity back to 0
        tooltip.style("opacity", 0)
    })


    /**
     * Create bottom and left axis
     * Append axis to the graph
     */
    const axisBottom = d3.axisBottom(timeScale)
    const axisLeft = d3.axisLeft(yScale)
    
    graphic.append("g")
        .attr("transform", `translate(0, ${h - padding})`)
        .attr("id", "x-axis")
        .call(axisBottom)
   
    graphic.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${ padding}, 0)`)
        .call(axisLeft)

}