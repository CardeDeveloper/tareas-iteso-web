console.log("antes de todo")

let myPromise= new Promise(function(resolve, rejected){
    setTimeout(()=>{
        console.log('timeout')
        resolve('ok')
    },2000)
})

console.log('despues del promise')

myPromise.then(console.log)