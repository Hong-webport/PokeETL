// Submit Button handler

function handleSubmit() {
  
    // Prevent the page from refreshing
    d3.event.preventDefault();
  
    // Select the input value from the form
    var pokemon_abi = d3.select("#Ability").node().value.replace(/\s+/g, '-').toLowerCase();
    console.log(pokemon_abi);
    var pokemon_moves = d3.select("#Moves").node().value.replace(/\s+/g, '-').toLowerCase();
    console.log(pokemon_moves);
    var pokemon = d3.select("#Pokemon").node().value;
    console.log(pokemon);
    // clear the input value
    d3.select("#Ability").node().value = "";
    d3.select("#Moves").node().value = "";
    d3.select("#Pokemon").node().value = "";

    // Build the plot with the new stock
    buildPlot3(pokemon_abi);    buildPlot2(pokemon_moves);
  
  
    // clear the input value
  
    // Build the plot with the new stock
    buildPlot(pokemon);
}
///// Pokemon
function buildPlot(pokemon) {
  var url = `https://pokeapi.co/api/v2/pokemon/${pokemon}/`;

  d3.json(url).then(function(data) {
      console.log(data)
      // Grab values from the response json object to build the plots
      // var id = data.id
      var poke_name=data.name

      var ability_key = data.abilities
      var abi_lis = []
      for(i = 0; i < ability_key.length; i++) {abi_lis.push(ability_key[i].ability.name)}
      console.log(abi_lis)
      var move_key = data.moves
      var move_ls = []
      for(i = 0; i < move_key.length; i++) {move_ls.push(move_key[i].move.name)}
      console.log(move_ls)

function Chidren_1(list){
  var list_names = [];
  for (i=0;i<list.length;i++){
      list_names.push({"name":list[i].toUpperCase()});
  }
  return list_names;
}


var x = Chidren_1(abi_lis)
console.log(x);

/////

///

var y = Chidren_1(move_ls)
console.log(y)

var treeData =
{
  "name": poke_name.toUpperCase(),
  "children": [
   
      {   "name": 'Abilities' ,
          "children": x 
    }
    ,
    {   "name": "Moves" ,"children": y}
  ]
};


// Set the dimensions and margins of the diagram
var margin = {top: 20, right: 90, bottom: 30, left: 200},
  // width = 960 - margin.left - margin.right,
  // height = 500 - margin.top - margin.bottom;
  width = 1600 - margin.left - margin.right,
  height = 900 - margin.top - margin.bottom;

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", "translate("
        + margin.left + "," + margin.top + ")");




var i = 0,
  duration = 750,
  root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);

// Assigns parent, children, height, depth
root = d3.hierarchy(treeData, function(d) { return d.children; });
root.x0 = height / 2;
root.y0 = 0;

// Collapse after the second level
root.children.forEach(collapse);

update(root);

// Collapse the node and all it's children
function collapse(d) {
if(d.children) {
  d._children = d.children
  d._children.forEach(collapse)
  d.children = null
}
}

function update(source) {

// Assigns the x and y position for the nodes
var treeData = treemap(root);

// Compute the new tree layout.
var nodes = treeData.descendants(),
    links = treeData.descendants().slice(1);

// Normalize for fixed-depth.
nodes.forEach(function(d){ d.y = d.depth * 100}); //original is 180

// ****************** Nodes section ***************************

// Update the nodes...
var node = svg.selectAll('g.node')
    .data(nodes, function(d) {return d.id || (d.id = ++i); });


// Enter any new modes at the parent's previous position.
var nodeEnter = node.enter().append('g')
    .attr('class', 'node')
    .attr("transform", function(d) {
      return "translate(" + source.y0 + "," + source.x0 + ")";
  })
  .on('click', click);


// Add Circle for the nodes
nodeEnter.append('circle')
    .attr('class', 'node')
    .attr('r', 1e-6)
    .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
      // return d._children ? "red" : "yellow";
    });

// Add labels for the nodes
nodeEnter.append('text')
    .attr("dy", ".5em")
    .attr("x", function(d) {
      //   return d.children || d._children ? -13 : 13;
        return d.children || d._children ? -13 : 13;

    })
    .attr("text-anchor", function(d) {
        return d.children || d._children ? "end" : "start";
    })
    .attr(  "word-break", "break-all"
    )
    .text(function(d) { return d.data.name; });

// UPDATE
var nodeUpdate = nodeEnter.merge(node);

// Transition to the proper position for the node
nodeUpdate.transition()
  .duration(duration)
  .attr("transform", function(d) { 
      return "translate(" + d.y + "," + d.x + ")";
   });

// Update the node attributes and style
nodeUpdate.select('circle.node')
  .attr('r', 5)
  .style("fill", function(d) {
      return d._children ? "lightsteelblue" : "yellow";
  })
  .attr('cursor', 'pointer');


// Remove any exiting nodes
var nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function(d) {
        return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();

// On exit reduce the node circles size to 0
nodeExit.select('circle')
  .attr('r', 1e-6);

// On exit reduce the opacity of text labels
nodeExit.select('text')
  .style('fill-opacity', 1e-6);
  // .style('fill-opacity', 2);

// ****************** links section ***************************

// Update the links...
var link = svg.selectAll('path.link')
    .data(links, function(d) { return d.id; });

// Enter any new links at the parent's previous position.
var linkEnter = link.enter().insert('path', "g")
    .attr("class", "link")
    .attr('d', function(d){
      var o = {x: source.x0, y: source.y0}
      return diagonal(o, o)
    });

// UPDATE
var linkUpdate = linkEnter.merge(link);

// Transition back to the parent element position
linkUpdate.transition()
    .duration(duration)
    .attr('d', function(d){ return diagonal(d, d.parent) });

// Remove any exiting links
var linkExit = link.exit().transition()
    .duration(duration)
    .attr('d', function(d) {
      var o = {x: source.x, y: source.y}
      return diagonal(o, o)
    })
    .remove();

// Store the old positions for transition.
nodes.forEach(function(d){
  d.x0 = d.x/2;
  d.y0 = d.y/2;
});

// Creates a curved (diagonal) path from parent to the child nodes
function diagonal(s, d) {

  path = `M ${s.y} ${s.x}
          C ${(s.y + d.y) / 2} ${s.x},
            ${(s.y + d.y) / 2} ${d.x},
            ${d.y} ${d.x}`

  return path
}

// Toggle children on click.
function click(d) {
  if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
  update(d);
}





}
  })
}

function buildPlot3(pokemon_abi) {
    var url = `https://pokeapi.co/api/v2/ability/${pokemon_abi}`;

    d3.json(url).then(function(data) {
        console.log(data)
        // Grab values from the response json object to build the plots
        var id = data.id
        var flavor= data.flavor_text_entries
        var description = ""
        for(i = 0; i < flavor.length; i++) {if(flavor[i].language.name === "en"){description = flavor[i]}}
        var effect_ls= data.effect_entries
        var effect = ""
        for(i = 0; i < effect_ls.length; i++) {if(effect_ls[i].language.name === "en"){effect = effect_ls[i].short_effect}}        console.log(effect)

        var poke_arr = data.pokemon
        var pokelis = []
        for(i = 0; i < poke_arr.length; i++) {pokelis.push(poke_arr[i].pokemon.name)}
        var abi_name=data.name
        // var pokel_im = poke_arr.url


        // var ctx = document.getElementById('myChart').getContext('2d');

// </style>

// <body>

// <!-- load the d3.js library -->	
// <script src="https://d3js.org/d3.v4.min.js"></script>
// <script>


function Chidren_1(list){
    var list_names = [];
    for (i=0;i<list.length;i++){
        list_names.push({"name":list[i].toUpperCase()});
    }
    return list_names;
}

var x = Chidren_1(pokelis)
console.log(x)


var treeData =
  {
    "name": abi_name.toUpperCase(),
    "children": [
        { 
            "name": "Description",
            "children": [
              { "name": description.flavor_text},
        //   { "name": "Daughter of A" }
        ]
      },
      
        {   "name": '' ,
            "children": x
        // { "name": pokelis},{},
      //   { "name": "Daughter of A" }
      }
      ,
      {   "name": "Effect" ,"children":[ {"name" : effect}]}
    ]
  };

//////https://stackoverflow.com/questions/14484787/wrap-text-in-javascript

//   function wordWrap(str, maxWidth) {
//     var newLineStr = "\n"; done = false; res = '';
//     while (str.length > maxWidth) {                 
//         found = false;
//         // Inserts new line at first whitespace of the line
//         for (i = maxWidth - 1; i >= 0; i--) {
//             if (testWhite(str.charAt(i))) {
//                 res = res + [str.slice(0, i), newLineStr].join('');
//                 str = str.slice(i + 1);
//                 found = true;
//                 break;
//             }
//         }
//         // Inserts new line at maxWidth position, the word is too long to wrap
//         if (!found) {
//             res += [str.slice(0, maxWidth), newLineStr].join('');
//             str = str.slice(maxWidth);
//         }

//     }

//     return res + str;
// }

// function testWhite(x) {
//     var white = new RegExp(/^\s$/);
//     return white.test(x.charAt(0));
// };
/////
// Set the dimensions and margins of the diagram
var margin = {top: 20, right: 90, bottom: 30, left: 200},
    // width = 960 - margin.left - margin.right,
    // height = 500 - margin.top - margin.bottom;
    width = 1600 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate("
          + margin.left + "," + margin.top + ")");

var i = 0,
    duration = 750,
    root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height, width]);

// Assigns parent, children, height, depth
root = d3.hierarchy(treeData, function(d) { return d.children; });
root.x0 = height / 2;
root.y0 = 0;

// Collapse after the second level
root.children.forEach(collapse);

update(root);

// Collapse the node and all it's children
function collapse(d) {
  if(d.children) {
    d._children = d.children
    d._children.forEach(collapse)
    d.children = null
  }
}

function update(source) {

  // Assigns the x and y position for the nodes
  var treeData = treemap(root);

  // Compute the new tree layout.
  var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

  // Normalize for fixed-depth.
  nodes.forEach(function(d){ d.y = d.depth * 100}); //original is 180

  // ****************** Nodes section ***************************

  // Update the nodes...
  var node = svg.selectAll('g.node')
      .data(nodes, function(d) {return d.id || (d.id = ++i); });

  // Enter any new modes at the parent's previous position.
  var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .on('click', click);

  // Add Circle for the nodes
  nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('r', 1e-6)
      .style("fill", function(d) {
          return d._children ? "lightsteelblue" : "#fff";
        // return d._children ? "red" : "yellow";
      });

  // Add labels for the nodes
  nodeEnter.append('text')
      .attr("dy", ".5em")
      .attr("x", function(d) {
        //   return d.children || d._children ? -13 : 13;
          return d.children || d._children ? -13 : 13;

      })
      .attr("text-anchor", function(d) {
          return d.children || d._children ? "end" : "start";
      })
      .attr(  "word-break", "break-all"
      )
      .text(function(d) { return d.data.name; });

  // UPDATE
  var nodeUpdate = nodeEnter.merge(node);

  // Transition to the proper position for the node
  nodeUpdate.transition()
    .duration(duration)
    .attr("transform", function(d) { 
        return "translate(" + d.y + "," + d.x + ")";
     });

  // Update the node attributes and style
  nodeUpdate.select('circle.node')
    .attr('r', 5)
    .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "yellow";
    })
    .attr('cursor', 'pointer');


  // Remove any exiting nodes
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) {
          return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

  // On exit reduce the node circles size to 0
  nodeExit.select('circle')
    .attr('r', 1e-6);

  // On exit reduce the opacity of text labels
  nodeExit.select('text')
    .style('fill-opacity', 1e-6);
    // .style('fill-opacity', 2);

  // ****************** links section ***************************

  // Update the links...
  var link = svg.selectAll('path.link')
      .data(links, function(d) { return d.id; });

  // Enter any new links at the parent's previous position.
  var linkEnter = link.enter().insert('path', "g")
      .attr("class", "link",)
      .attr('d', function(d){
        var o = {x: source.x0, y: source.y0}
        return diagonal(o, o)
      });

  // UPDATE
  var linkUpdate = linkEnter.merge(link);

  // Transition back to the parent element position
  linkUpdate.transition()
      .duration(duration)
      .attr('d', function(d){ return diagonal(d, d.parent) });

  // Remove any exiting links
  var linkExit = link.exit().transition()
      .duration(duration)
      .attr('d', function(d) {
        var o = {x: source.x, y: source.y}
        return diagonal(o, o)
      })
      .remove();

  // Store the old positions for transition.
  nodes.forEach(function(d){
    d.x0 = d.x/2;
    d.y0 = d.y/2;
  });

  // Creates a curved (diagonal) path from parent to the child nodes
  function diagonal(s, d) {

    path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

    return path
  }

  // Toggle children on click.
  function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
    update(d);
  }
}
    })}

/////// Moves Plots
function buildPlot2(pokemon_moves) {
        var url = `https://pokeapi.co/api/v2/move/${pokemon_moves}`;
    
        d3.json(url).then(function(data) {
            console.log(data)
            // Grab values from the response json object to build the plots
            // var id = data.id
            var flavor= data.flavor_text_entries
            console.log(flavor)

            var description = ""
            for(i = 0; i < flavor.length; i++) {if(flavor[i].language.name === "en"){description = flavor[i]}}
                        console.log(flavor)

            var effect_ls= data.effect_entries
            var effect = ""
            for(i = 0; i < effect_ls.length; i++) {if(effect_ls[i].language.name === "en"){effect = effect_ls[i].short_effect}}        console.log(effect)
    
            var pp = data.pp
            var accuracy = data.accuracy
            var power = data.power
            var damage = data.damage_class
            var target = data.target
            var type = data.type
            var chance=data.effect_chance
            var effect_chance = 0
            if (chance = "null") {effect_chance = 100;} else { effect_chance = chance;}
            var move_name=data.name
  
    
    
    var treeData =
      {
        "name": move_name.toUpperCase(),
        "children": [
            { 
                "name": "Description",
                "children": [
                  { "name": description.flavor_text},
                  { "name": "Pokemon Type =" + type.name.toUpperCase()},
                  { "name": "Damage Category =" + damage.name.toUpperCase()},

                  //   { "name": "Daughter of A" }
            ]
          },{ 
            "name": "Target",
            "children": [
           { "name": target.name.toUpperCase()},
    
    
              //   { "name": "Daughter of A" }
        ]},{ 
            "name": "Stats",
            "children": [
              { "name": "Accuracy :" + accuracy},
              { "name": "Power :" + power},
              { "name": "Use Limits :" + pp},
        ]
      }, { 
        "name": "Effect",
        "children": [
          { "name": effect}, { "name": "Chance :" + effect_chance},


          //   { "name": "Daughter of A" }
    ]}, 
      
          
           
        ]
      };
    
    //////https://stackoverflow.com/questions/14484787/wrap-text-in-javascript
    
    //   function wordWrap(str, maxWidth) {
    //     var newLineStr = "\n"; done = false; res = '';
    //     while (str.length > maxWidth) {                 
    //         found = false;
    //         // Inserts new line at first whitespace of the line
    //         for (i = maxWidth - 1; i >= 0; i--) {
    //             if (testWhite(str.charAt(i))) {
    //                 res = res + [str.slice(0, i), newLineStr].join('');
    //                 str = str.slice(i + 1);
    //                 found = true;
    //                 break;
    //             }
    //         }
    //         // Inserts new line at maxWidth position, the word is too long to wrap
    //         if (!found) {
    //             res += [str.slice(0, maxWidth), newLineStr].join('');
    //             str = str.slice(maxWidth);
    //         }
    
    //     }
    
    //     return res + str;
    // }
    
    // function testWhite(x) {
    //     var white = new RegExp(/^\s$/);
    //     return white.test(x.charAt(0));
    // };
    /////
    // Set the dimensions and margins of the diagram
    var margin = {top: 20, right: 90, bottom: 30, left: 200},
        // width = 960 - margin.left - margin.right,
        // height = 500 - margin.top - margin.bottom;
        width = 1600 - margin.left - margin.right,
        height = 900 - margin.top - margin.bottom;
    
    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate("
              + margin.left + "," + margin.top + ")");
    
    var i = 0,
        duration = 750,
        root;
    
    // declares a tree layout and assigns the size
    var treemap = d3.tree().size([height, width]);
    
    // Assigns parent, children, height, depth
    root = d3.hierarchy(treeData, function(d) { return d.children; });
    root.x0 = height / 2;
    root.y0 = 0;
    
    // Collapse after the second level
    root.children.forEach(collapse);
    
    update(root);
    
    // Collapse the node and all it's children
    function collapse(d) {
      if(d.children) {
        d._children = d.children
        d._children.forEach(collapse)
        d.children = null
      }
    }
    
    function update(source) {
    
      // Assigns the x and y position for the nodes
      var treeData = treemap(root);
    
      // Compute the new tree layout.
      var nodes = treeData.descendants(),
          links = treeData.descendants().slice(1);
    
      // Normalize for fixed-depth.
      nodes.forEach(function(d){ d.y = d.depth * 100}); //original is 180
    
      // ****************** Nodes section ***************************
    
      // Update the nodes...
      var node = svg.selectAll('g.node')
          .data(nodes, function(d) {return d.id || (d.id = ++i); });
    
      // Enter any new modes at the parent's previous position.
      var nodeEnter = node.enter().append('g')
          .attr('class', 'node')
          .attr("transform", function(d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on('click', click);
    
      // Add Circle for the nodes
      nodeEnter.append('circle')
          .attr('class', 'node')
          .attr('r', 1e-6)
          .style("fill", function(d) {
              return d._children ? "lightsteelblue" : "#fff";
            // return d._children ? "red" : "yellow";
          });
    
      // Add labels for the nodes
      nodeEnter.append('text')
          .attr("dy", ".5em")
          .attr("x", function(d) {
            //   return d.children || d._children ? -13 : 13;
              return d.children || d._children ? -13 : 13;
    
          })
          .attr("text-anchor", function(d) {
              return d.children || d._children ? "end" : "start";
          })
          .attr(  "word-break", "break-all"
          )
          .text(function(d) { return d.data.name; });
    
      // UPDATE
      var nodeUpdate = nodeEnter.merge(node);
    
      // Transition to the proper position for the node
      nodeUpdate.transition()
        .duration(duration)
        .attr("transform", function(d) { 
            return "translate(" + d.y + "," + d.x + ")";
         });
    
      // Update the node attributes and style
      nodeUpdate.select('circle.node')
        .attr('r', 5)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "yellow";
        })
        .attr('cursor', 'pointer');
    
    
      // Remove any exiting nodes
      var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d) {
              return "translate(" + source.y + "," + source.x + ")";
          })
          .remove();
    
      // On exit reduce the node circles size to 0
      nodeExit.select('circle')
        .attr('r', 1e-6);
    
      // On exit reduce the opacity of text labels
      nodeExit.select('text')
        .style('fill-opacity', 1e-6);
        // .style('fill-opacity', 2);
    
      // ****************** links section ***************************
    
      // Update the links...
      var link = svg.selectAll('path.link')
          .data(links, function(d) { return d.id; });
    
      // Enter any new links at the parent's previous position.
      var linkEnter = link.enter().insert('path', "g")
          .attr("class", "link")
          .attr('d', function(d){
            var o = {x: source.x0, y: source.y0}
            return diagonal(o, o)
          });
    
      // UPDATE
      var linkUpdate = linkEnter.merge(link);
    
      // Transition back to the parent element position
      linkUpdate.transition()
          .duration(duration)
          .attr('d', function(d){ return diagonal(d, d.parent) });
    
      // Remove any exiting links
      var linkExit = link.exit().transition()
          .duration(duration)
          .attr('d', function(d) {
            var o = {x: source.x, y: source.y}
            return diagonal(o, o)
          })
          .remove();
    
      // Store the old positions for transition.
      nodes.forEach(function(d){
        d.x0 = d.x/2;
        d.y0 = d.y/2;
      });
    
      // Creates a curved (diagonal) path from parent to the child nodes
      function diagonal(s, d) {
    
        path = `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`
    
        return path
      }
    
      // Toggle children on click.
      function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
          } else {
            d.children = d._children;
            d._children = null;
          }
        update(d);
      }
    }
        })}



// Add event listener for submit button
d3.select("#submit").on("click", handleSubmit);

// d3.select("#submit").on("keypress", function() {
//   if(d3.event.keyCode === 32 || d3.event.keyCode === 13)
// })

// if (d3.event.keyCode === 32 || d3.event.keyCode === 13) {
//   //  block of code to be executed if condition1 is true
// } else if (condition2) {
//   //  block of code to be executed if the condition1 is false and condition2 is true
// } 
// }
// </script>
// </body>