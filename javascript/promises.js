function print(message){
    return new Promise((resolve, reject) =>{
        setTimeout(()=>{
            resolve(message)
        },1000)
    })  
}

print("hola").then((result)=>{
    console.log(result)
    return print("hola")
}).then((result)=>{
    console.log(result)
    return print("hola")
})