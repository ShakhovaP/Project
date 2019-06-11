'use strict'
const fs = require('fs')


const graph = [
    [0, 5, 9, 7, 6],
    [5, 0, 3, 1, 5],
    [9, 3, 0, 2, 12],
    [7, 1, 2, 0, 4],
    [6, 5, 12, 4, 0]
]

//Unfolding graph: returns matrix with start and finish vertices and distances between 
const unfoldGraph = () => {
    const edges = [];
    graph.forEach((arr) => {
        const strategy = elem => elem !== 0;
        arr.filter(strategy).forEach((elem) => {
            const edgAdd = [graph.indexOf(arr)+1, arr.indexOf(elem)+1, elem];
            edges.push(edgAdd);
        })
        
    })
    const ascending = (x, y) => (x[2]>y[2] ? 1 : -1);
    edges.sort(ascending);
    return edges
}
const sortEdges = unfoldGraph()

//Check : return true if elem is in mat
const check = mat => elem => {
    let flag = false;
    for (let cell of mat){
        for (let i of cell){
            if (i===elem){
                flag = true;
            }
        }
    }
    return flag
}


const wrap = fn => (arr) => {
    let flag = true;
    for (let vert=1; vert<=graph.length; vert++){
        if(fn(arr)(vert)===false){
            flag = false
        }
    }
    return flag
}
//Exit: return true if all vertices are in matrix
const exit = wrap(check)

const kraskal = () => {
    const usedK = [[sortEdges[0][0], sortEdges[0][1]]];

    const inUsed = check(usedK);
    for (let i=1; i<sortEdges.length; i++) {        
        if (exit(usedK)===true){
            break
        }
        const start = sortEdges[i][0];
        const finish = sortEdges[i][1];

        if (inUsed(start)===true && inUsed(finish)===true){
            continue
        } else {
            usedK.push([start, finish])
        }
    }
    return usedK
}

const prim = () => { 
    const usedP = [[sortEdges[0][0], sortEdges[0][1]]];

    const inUsed = check(usedP);
    for (let i=1; i<sortEdges.length; i++) {
        if (exit(usedP)===true){
            break
        }
        const strategy = (elem) => inUsed(elem[0])===true && inUsed(elem[1])===false
        const edge = sortEdges.find(strategy);
        usedP.push([edge[0], edge[1]])
    }
    return usedP
}


//Test: 
const test = (fn, name) => {
    const middle = arr => {
        return arr.reduce((acc, val) => acc + val)/arr.length
    }
    const time = []
    const memory = []
    for (let i=0; i<10; i++){
        const startTime = process.hrtime();
        fn()
        const endTime = process.hrtime(startTime);
        time.push(endTime[1]);
    }
    const timeMs = middle(time)/1000000

    for (let i=0; i<10; i++){
        const startMem = process.memoryUsage().heapUsed;
        fn();
        const endMem = process.memoryUsage().heapUsed;
        const memoryResult = endMem - startMem;
        memory.push(memoryResult);
    }
    const memoryKb = middle(memory)/1000;
    const res = fn();
    return {
        name: name,
        time: timeMs + ' ms',   //in ms
        memory: memoryKb + ' KB',  //in KB
        result: res
    }
}


//Kraskal test
const testK = test(kraskal, 'kraskal');
console.dir(testK);

//Prim test
const testP = test(prim, 'prim');
console.dir(testP);


//
fs.writeFile('test.txt', [JSON.stringify(testP), JSON.stringify(testK)],
    (error) => {
        if (error) throw error
        console.log('Results : ')
        const data = fs.readFileSync('test.txt', 'utf8')
        console.log(data)
    })



