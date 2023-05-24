function randomRange(end:number): number{
    return Math.floor(Math.random()*end+1)
}

function sumArray(arr: number[]): number {
    return arr.reduce((pre, cur) => pre+cur, 0)
}

export {
    randomRange,
    sumArray
}