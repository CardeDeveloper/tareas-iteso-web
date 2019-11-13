

    setTimeout(()=>{
        console.log("Hola")
        setTimeout(()=>{
            console.log("Hola")
            setTimeout(()=>{
                console.log("Hola")
                setTimeout(()=>{
                    console.log("Hola")
                    setTimeout(()=>{
                        console.log("Hola")
                    },5000)
                },4000)
            },3000)
        },2000)
    },1000)

    var time=1000;
    for(let i=0;i<6;i++){
        setTimeout(()=>{
            console.log(time*i)
        },time*i)
    }




