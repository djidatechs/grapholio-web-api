/*
 * Main test runner
 */

import {Parser} from "./Parser";
import {Tokenizer} from "./Tokenizer";

const tokenizer = new Tokenizer();
const parser = new Parser();

const program = `
// INITIALIZATION
let A = add_node();
print ("Finding The shortest way using dikjstra on graph : [ ", this_graph("name") , "]");
for (let i = 1; i < 20; i += 1) {
    let A = new_node(); 
    A.label = "Alpha" ; 
    //let E = new_edge(source:A , target : new_node(label : "F") , attribute : 5 ); // you can add as many attributes
    // for the visual element :  size , color, position(x,y) .. and all visual attribtues will be set automaticaly if not provided 
    // in case source or target are not provided they will  be set to  random nodes 
    // in case weight is not provided it will be set to 1 
    
    
    let N = all_nodes(); // reference
    let E = all_edges(); //reference 
    let P = this_graph(); //reference 
    P.adjecencyList(); // custom console 
    P = copy (P); //value duplication
    let list_of_nodes = copy (all_nodes());  // copy 
    
    let X = filter ( list_of_nodes ,
     mapeach (element) {
     return element.display_name == "esi" ; 
     });
     
     let Y = filter ( all_edges() , mapeach (element) { return element.weight < 0 ;  } );
     if (Y.isempty) return Toast("Negative Elements Exist");
     
     
    let T = copy(N);
    // X = length(filter(copy(T),lambda element : element.display_name == "esi"));
    def Kruskal () {}
    def Dijkstra () {}
    print ("error", "ok");
}
while (X > 5) {
    print("xxxxxx");
};

do {
print("xxxxxx");
} while(X>5);

A.label = "Thanks" ; 

foreach (let edge in all_edges()) {
  print(edge.isDirected); 
}
def DIJKSTRA (s){
   if (typeof(s) != 'node') return ;
   foreach(let edge in edges) {
    if (edge.weight < 0 ) return Toast("Graph has negative weights ");
   }
   s.distance = 0 ; 
   T = copy(all_nodes); 
   foreach (let v in all_nodes() ) {
        if (v != s){
        v.distance = true ;  //true <=> +infinity 
        }
   }
   let min = T.first() ;
   while (T.empty() == false){
       foreach (let y in T) {
           min = Math.min( min.distance , y.distance );
           T.remove(min);
           //for v ∈ T ∩ Au do d(v) ← min(d(v),d(u) + wuv) od
           foreach (let k in T.intersection(min.neighbors())){
            let es = edges_between(min,k); //returns a set SET<EDGE> iterative and all methodes are initialised in compile time 
            k.distance = Math.min(k.distance , min.distance +  es.length ); 
           }
       }
   }
} 
let A = add_node(label="source",color="#F1F1F1");
//add random nodes
for (let i = 1 ; i < 20 ; i+=1) {
   let K = add_node(label="node"+i , color="#FFFFFF");
}
//add random edges 
for (let i = 1 ; i < 30 ; i+=1) {
    add_edge(weight=i) ; //if target or source are not provided they will be set automaticaly and randomaly 
} 
//run DIJKSTRA
let D =  DIJKSTRA(A);
foreach (let node in all_nodes()){
    node.showAttribute("distance");
    node.updateTextSize("30px");
}


print("please take a look at the visual graphs to see changes");

let N = 100 ; 
let T = empty_set() ; 
def MINTREE(){
 for (i=1; i<=N ; i+=1 ) {
    addNode(key=i,label=i);
 }
 for (k=1 ; k < N ; k+=1 ) {
    let A = get_node();
    let B ; 
    let Smallestweight = all_edges()
    filter(all_nodes(except=A) , mapeach (Node) { 
        if (A.weight < Node.weight) {
            B = null ;  
        }
    });
 }
}

`;

console.log("==================================");
// ----------------------------
// print all tokens
tokenizer.init(program);
let token = tokenizer.getNextToken();
while (token != null) {
    console.log(token);
    token = tokenizer.getNextToken();
}
console.log("==================================");


const ast = parser.parse(program);
console.log(JSON.stringify(ast, null, 2));



