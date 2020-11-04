


svg = d3.select("svg")

var width = +svg.attr("width"),
    height = +svg.attr("height");




d3.json("../data/simplicialcomplex_small.json", function(error, dict) {

    if (error) throw error;

    


    // Functions for drawing filled areas 
    function triangle_path(vertices) {
        

        // console.log(vertices)

        // This is hacky right now. Should make a set of vertices and take the unique ones

        v1 = dict.simp0.filter(function(n) {return n.id == vertices[0]})[0]
        v2 = dict.simp0.filter(function(n) {return n.id == vertices[1]})[0]
        v3 = dict.simp0.filter(function(n) {return n.id == vertices[2]})[0]

        // console.log(v1,v2,v3)
        
        return `M ${v1.x},${v1.y} L ${v2.x},${v2.y} L ${v3.x}, ${v3.y} L ${v1.x} ${v1.y}`
    }

    // We have to draw the lowest levels first
    var simp2 = svg.append("g")
        .selectAll("path")
        .data(dict.simp2)
            .enter().append("g")

    simp2.append("path")
        .attr("class", "simp2")
        .attr("d", function(d) {console.log(d.vertices); return triangle_path(d.vertices)})
        .attr("fill", "white")
        .style("stroke", "none")



    var simp1 = svg.append("g")
        .selectAll("line")
        .data(dict.simp1)
            .enter().append("g");

    simp1.append("line")
        .attr("x1", function(d) {return dict.simp0.filter(function(n){return n.id == d.vertices[0];})[0].x;})
        .attr("y1", function(d) {return dict.simp0.filter(function(n){return n.id == d.vertices[0];})[0].y;})
        .attr("x2", function(d) {return dict.simp0.filter(function(n){return n.id == d.vertices[1];})[0].x;})
        .attr("y2", function(d) {return dict.simp0.filter(function(n){return n.id == d.vertices[1];})[0].y;})
        .attr("stroke", "white")
        .attr("class", "simp1")

    var simp0 = svg.append("g")
    .selectAll("circle")
    .attr("class", "nodes")
    .data(dict.simp0)
        .enter().append("g")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .append("circle")
            .attr("cx", function(d) {return d.x})
            .attr("cy", function(d) {return d.y})
            .attr("r", 10)
            .attr("fill", "white")
            .attr("stroke","navy")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));




    function mouseover() {
        console.log("hovering");

        var selected_node = d3.select(this);
        var selected_node_data = Object.entries(selected_node.data()[0])
        // console.log(selected_node_data)


        selected_node.select("circle").transition()
        .duration(200)
        .attr("fill", "rgb(8, 8, 16)")
        .attr("stroke", "white");
        
    }


    function mouseout() {
        console.log("mouseout")
        d3.select(this).select("circle").transition()
        .duration(200)
        .attr("fill", "white")
        .attr("stroke", "black");


        }




    function dragstarted(d) {
        // d3.select(this).raise().attr("stroke", "black")
        console.log("dragstarted");
    }

    function dragged(d) {

        let new_x_pos, new_y_pos;

        // Keep the nodes within the svg box
        if (d3.event.x > 700) {
            new_x_pos = 700;  
        } else if (d3.event.x < 20) {
            new_x_pos = 20;
        } else {
            new_x_pos = d3.event.x;
        }

        if (d3.event.y > 600) {
            new_y_pos = 600;  
        } else if (d3.event.y < 20) {
            new_y_pos = 20;
        } else {
            new_y_pos = d3.event.y;
        }


        d3.select(this).attr("cx", d.x = new_x_pos).attr("cy", d.y = new_y_pos)

        console.log("dragged");

        d3.selectAll(".simp1")
            .attr("x1", function(d) {return dict.simp0.filter(function(n){return n.id == d.vertices[0];})[0].x;})
            .attr("y1", function(d) {return dict.simp0.filter(function(n){return n.id == d.vertices[0];})[0].y;})
            .attr("x2", function(d) {return dict.simp0.filter(function(n){return n.id == d.vertices[1];})[0].x;})
            .attr("y2", function(d) {return dict.simp0.filter(function(n){return n.id == d.vertices[1];})[0].y;});

        d3.selectAll(".simp2")
            .attr("d", function(d) {return triangle_path(d.vertices)});

    }

    function dragended(d) {
        // d3.select(this).attr("stroke", null)
        console.log("drag ended");
    }

    

    





        



})






