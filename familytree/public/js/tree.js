
let nodes=[]
let edges=[]
let parent_nodes=[]
        $.ajax({
            url:"/nodes",
            method:"GET",
            success:function(res){
                res.forEach(address=>{
                    nodes.push(address)
                })
                
    $.ajax({
    url:"/get-connection",
    method:"GET",
    
    success:function(res){
       
       parent_nodes = res.all
       console.log(parent_nodes[0][0])
       let names=res.names
       let nodes_data =[]
for(let i=0;i<nodes.length;i++){
    let [ac,nm] = names[i]
    
    let str={id:nodes[i],name:nm}
    nodes_data.push(str)
}
for(let j=0;j<parent_nodes.length;j++){
    let str={from:parent_nodes[j][0],to:parent_nodes[j][1].father}
edges.push(str)
 str={from:parent_nodes[j][0],to:parent_nodes[j][1].mother}
edges.push(str)
}
let data = {nodes:nodes_data,edges:edges}
var chart = anychart.graph(data);
chart.nodes().tooltip().useHtml(true)
chart.nodes().tooltip().format(
  "<span>{%id}</span>"
);
chart.nodes().labels().enabled(true);

chart.nodes().labels().format("{%name}");
chart.nodes().labels().fontSize(12);
chart.nodes().labels().fontWeight(600);
chart.nodes().normal().height(38)
// set the container id
chart.container("container");

// initiate drawing the chart
chart.draw();
let btn_in = document.getElementById("in")
let out = document.getElementById("out")
let fit = document.getElementById("Fit")
btn_in.addEventListener("click",()=>{
    chart.zoomIn()
})
out.addEventListener("click",()=>{
    chart.zoomOut()
})
fit.addEventListener("click",()=>{
    chart.fit()
})

    }

})
            }
        })
