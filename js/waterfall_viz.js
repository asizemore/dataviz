

svg = d3.select("svg")

var width = +svg.attr("width"),
    height = +svg.attr("height");




d3.json("../data/waterfall_30nodes.json", function(error, dict) {

    if (error) throw error;

    
    function drawConnectors(x1,y1,y2,x3,y3) {
        // Return the path for a curve connecting x1, y1 and x3, y3

        let x2 = (x1+x3)/2 

        return `M ${x1} ${y1} Q ${x1} ${y2} ${x2} ${y2} T ${x3} ${y3}`
    }


    function getCoordinatesAndDraw(d, dicti, dicti2) {

        let nFaces = d.faces.length
    
        let pathString = ""

        for (let index = 0; index < nFaces; index++) {

            face_i = dicti.filter(function(n) {return n.id == d.faces[index]})[0]

            // Calculate appropriate y2

            let padding = (d.y-face_i.y)/3
            y2_range = [d.y-padding, face_i.y+padding]
            y2_scale = d3.scaleLinear().domain([1, dicti2.length]).range(y2_range)

            y2 = y2_scale(d.sortedID)

            pathString = `${pathString} ${drawConnectors(d.x, d.y, y2, face_i.x, face_i.y)}`
            
        }

        return pathString
    }

    let simp_levels = Object.keys(dict)

    const varToString = varObj => Object.keys(varObj)[0];

    // Calculate radius size
    let xloc1 = dict.simp0.filter(function(d) {return d.sortedID === 1})[0].x
    let xloc2 = dict.simp0.filter(function(d) {return d.sortedID === 2})[0].x


    const r = (xloc2-xloc1)/3


    // Loop through all the levels in the .json file and plot them all!!
    // Note the json file is not inherantly ordered... so we need to be clever.

    var simp_connections = svg.append("g");
    var simp_circles = svg.append("g");
    

    for (let index = 1; index < simp_levels.length; index++) {



        simp_connections.append("g")
            .selectAll("path")
            .data(dict[`simp${index}`])
            .enter().append("path")
                .attr("d", function(d) {return getCoordinatesAndDraw(d,dict[`simp${index-1}`], dict[`simp${index}`])})
                .attr("fill", "none")
                .attr("class", "links")
                .attr("stroke-opacity", 0.2);

        
    }

    for (let index = 0; index < simp_levels.length; index++) {
        let simp_i = simp_levels[index];

        simp_circles.append("g")
            .selectAll("circle")
            .data(dict[simp_i])
            .enter().append("circle")
                .attr("cx", function(d) {return d.x})
                .attr("cy", function(d) {return d.y})
                .attr("r", r)
                .attr("class", "circles")
                .attr("stroke-opacity", 0.9);

        
    }

    
    
    

    
    const onFvSlider = function() {
        
        fv_current = this.value;

        console.log(this.value)
        
        // Change opacity of links
        d3.selectAll(".links")
        .attr("stroke-opacity", function(d) {return (d.fv>fv_current? 0 : 0.2 ); });
        
        // Change opacity of nodes
        d3.selectAll(".circles")
        .attr("stroke-opacity", function(d) {return (d.fv>fv_current? 0 : 0.9 );});
        
    }
        // Input actions
    d3.select("#slider-range")
        .on("input", onFvSlider)
        .on("change", onFvSlider);



        

        

});




