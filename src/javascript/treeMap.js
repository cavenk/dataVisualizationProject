import * as d3 from "d3"

const url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"

document.addEventListener("DOMContentLoaded", e =>{

    fetch(url).then(response => response.json())
        .then(data => showData(data))

})


function showData(data){

    //Create width and height
    const w =  900
    const h = 700

    //Select SVG element
    const svg = d3.select("#treemap")
        .attr("width", w)
        .attr("height", h + 240)

    //Create root
    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value)

    //Create treemap
    d3.treemap()
        .size([w, h])
        .padding(2)
        (root)

    //Create nodes
    const nodes = svg.selectAll("g")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr("transform", d=> `translate(${d.x0}, ${d.y0})`)

    //Create color scale
    const colorScale = createColorScale()

    //Select tooltip
    const tooltip = d3.select("#tooltip")

    //Create rect element inside g element
    nodes.append("rect")
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => colorScale(d.data.category))
        .attr("class", "tile")
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .on("mouseover", (e, d) =>{

            tooltip.attr("data-value", d.data.value)
                .style("left", `${d.x1 + 50}px`)
                .style("top", `${d.y1 + 30}px`)
                .attr("class", "visible")
                .html(`category: ${d.data.category} <br>name: ${d.data.name} <br>value: ${d.data.value}`)
        })
        .on("mouseout", e =>{
            tooltip.attr("class", "notVisible")
        })

    //Create legend
    const categories = root.leaves()
        .map( d=> d.data.category)
        .filter((v, i, a)=> a.indexOf(v) === i)

    const legend = svg.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(0, ${h})`)

    legend.selectAll("rect")
        .data(categories)
        .enter()
        .append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("class", "legend-item")
        .attr("fill", d => colorScale(d) )
        .attr("x", (d,i)=>{

            if(i % 3 === 0)
                return w / 3 * 2
            else if(i % 2 === 0)
                return w / 3
            else
                return 0
        })
        .attr("y", (d,i)=>{
            
           return Math.floor(i / 3) * 20 + Math.floor(i / 3) * 10

        })

    legend.selectAll("text")
        .data(categories)
        .enter()
        .append("text")
        .text(d => d)
        .attr("x", (d,i)=>{

            if(i % 3 === 0)
                return w / 3 * 2 + 20 + 10
            else if(i % 2 === 0)
                return w / 3 + 20 + 10
            else
                return 30
        })
        .attr("y", (d,i)=>{
            
           return Math.floor(i / 3) * 20 + Math.floor(i / 3) * 10 + 15

        })


       

   

        
}

function createColorScale(){
    const colors = [
        '#1f77b4',
        '#aec7e8',
        '#ff7f0e',
        '#ffbb78',
        '#2ca02c',
        '#98df8a',
        '#d62728',
        '#ff9896',
        '#9467bd',
        '#c5b0d5',
        '#8c564b',
        '#c49c94',
        '#e377c2',
        '#f7b6d2',
        '#7f7f7f',
        '#c7c7c7',
        '#bcbd22',
        '#dbdb8d',
        '#17becf',
        '#9edae5'
    ]

    return d3.scaleOrdinal().range(colors)
}

