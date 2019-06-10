'use strict';
const fs = require('fs')


const graph = [
    [0, 5, 9, 7, 6],
    [5, 0, 3, 1, 5],
    [9, 3, 0, 2, 12],
    [7, 1, 2, 0, 4],
    [6, 5, 12, 4, 0]
]

/* const graph = [
    [0, 5, 9],
    [5, 0, 3],
    [9, 3, 0],
    
] */


//sort matrix by ascending the last elements of arrays
const ascending = arr => {
    for(let i = 0; i<= arr.length-2; i++){
        if(arr[i][2]>arr[i+1][2]){
            arr.splice(i+2, 0, arr[i]);
            arr.splice(i, 1);
            ascending(arr);
        };
    };
    
}

const sort = () => {
    const edges = [];
    for (let cell=0; cell<graph.length; cell++) {
        for (let collu=0; collu<graph.length; collu++) {
            if (graph[cell][collu]!==0) {
                const dist = graph[cell][collu];
                const edg = [cell +1, collu+1, dist];
                edges.push(edg)
            }
        }
    }
    ascending(edges)
    return edges
}

const used = [[sort()[0][0], sort()[0][1]]];

const check = arr => elem => {
    let flag = false;
    for (let cell of arr){
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

const exit = wrap(check)

const kraskal = () => {
    const usedK = [[sort()[0][0], sort()[0][1]]];

    const inUsed = check(usedK)
for (let i=1; i<sort().length; i++) {
    if (exit(usedK)===true){
        break
    };

    const start = sort()[i][0];
    const finish = sort()[i][1];
    if (inUsed(start)===true && inUsed(finish)===true){
        continue
    } else {
        usedK.push([start, finish])
    }
    
}
return usedK
}


const prim = () => { 
    const usedP = [[sort()[0][0], sort()[0][1]]];

    const inUsed = check(usedP)
for (let i=1; i<sort().length; i++) {
    if (exit(usedP)===true){
        break
    };
    for (let cell in sort()) {
    const start = sort()[cell][0];
    const finish = sort()[cell][1]
    if(inUsed(start)==true &&  inUsed(finish)==false){
        usedP.push([start, finish])
        break
    }
}
}
return usedP;
}


const test = (fn, name) => {
    let time = 0;
    let memory = 0;
    for (let i=0; i<10; i++){
        const startTime = process.hrtime();
        fn();
        const endTime = process.hrtime(startTime)
        time += endTime[1];
    }
    time = time/10;
    for (let i=0; i<10; i++){
        const startMem = process.memoryUsage().heapUsed;
        fn();
        const endMem = process.memoryUsage().heapUsed;
        const memoryResult = endMem - startMem;
        memory += memoryResult;
    }
    memory = memory/10;
    
    const res = fn()
    return {
        name: name,
        time: time/1000000 + ' ms',   //in ms
        memory: memory/1000 + ' KB',  //in KB
        result: res
    }
}

const testK = test(kraskal, 'kraskal');

const testP = test(prim, 'prim');



fs.writeFile('test.txt', [JSON.stringify(testP), JSON.stringify(testK)],
(error) => {
    if (error) throw error;
    console.log('Results : ')
    const data = fs.readFileSync('test.txt', 'utf8');
    console.log(data)
});

