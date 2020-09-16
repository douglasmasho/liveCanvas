const socket = io();

socket.emit("hello", "some data");


// window.addEventListener("load", ()=>{
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    // document
    //resizing
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    // window.addEventListener("resize", ()=>{
    //     canvas.height = window.innerHeight;
    //     canvas.width = window.innerWidth;
    // })

    //square
    // ctx.strokeStyle = "red";
    // ctx.lineWidth = 2;
    // ctx.strokeRect(50,50,200,200);
    // ctx.strokeStyle = "yellow";
    // ctx.strokeRect(100,100,200,200);
    // ctx.scale(2,2)
    // ctx.beginPath();
    // // ctx.moveTo(100,100);  //point where the pen is supposed to move
    // ctx.lineTo(200, 50);
    // ctx.lineTo(200, 500);
    // ctx.lineTo(300, 500);

    // // ctx.beginPath();
    // // ctx.lineTo(200, 500);

    // ctx.closePath();
    // ctx.stroke();

    // ctx.beginPath();
    // ctx.moveTo(100,100);  //point where the pen is supposed to move

    // ctx.lineTo(500, 900);
    // ctx.stroke();

    
    //variables
    let painting = false;
    let tool = "draw";
    let color = "black"

    const setTool = (string)=>{
        tool = string;
        if(tool === "erase"){
            socket.emit("erase")
        }else{
            socket.emit("unerase")
        }
    }

    const clear = ()=>{
        ctx.clearRect(0,0,canvas.width,canvas.height);
        socket.emit("clear")
    }

    const setColor = string=>{
        color = string;
    }



    const startPosition =(x,y,peerColor)=>{
        console.log(tool)
        ctx.lineCap = 'round';
        ctx.moveTo(x, y);
        ctx.beginPath();
        switch(tool){
            case "erase":
                ctx.lineWidth = 20;
                painting = true;
                ctx.strokeStyle = "black";
                ctx.globalCompositeOperation = 'destination-out';
             break;
             case "draw":
                ctx.globalCompositeOperation = 'source-over';
                if(peerColor){
                    ctx.strokeStyle = peerColor;
                }else{
                    ctx.strokeStyle = color;
                }
                painting = true;
                draw(x,y);
                ctx.lineWidth = 6;
             break;
             default: //do nothing   

        }
    }



    const finishedPosition = ()=>{
        painting = false;
    }

    const draw = (x,y)=>{
         if(!painting) return;
        //  if(erase){

        //  }
         ctx.lineTo(x, y);
         ctx.lineCap = "round";
         ctx.stroke()
    }


    const drawFunc = (e)=>{
        // console.log(e)
        const x = e.clientX;
        const y = e.clientY;
        let type;
        switch(e.type){
            case "mousedown": type = "start";
             break;
            case "mouseup": type ="stop";
            break;
            case "mousemove": type="draw";
            default: //
        }

        if(painting || type === "start")
        socket.emit("draw", {x,y,type,color});

        switch(type){
            case "start": startPosition(x,y,false);
            break;
            case "stop": finishedPosition();
            break;
            case "draw": draw(x,y)
        }
    }


    socket.on("draw", data=>{
        const {x,y,type, color} = data;
        console.log(x,y,type,color);
        switch(type){
            case "start": startPosition(x,y,color);
            break;
            case "stop": finishedPosition();
            break;
            case "draw": draw(x,y)
        }

    })

    socket.on("erase", ()=>{
        tool = "erase"
    })

    socket.on("unerase", ()=>{
        tool = "draw"
    })
    socket.on("clear", ()=>{
        ctx.clearRect(0,0,canvas.width,canvas.height);
    })




    //event listeners
     document.getElementById("draw").addEventListener("click", ()=>{
        setTool("draw")
     });

    document.getElementById("erase").addEventListener("click", ()=>{
        setTool("erase")
    });
    document.querySelectorAll(".colors").forEach(el=>{
        el.addEventListener("click", (e)=>{
            setColor(e.currentTarget.style.backgroundColor);
            // console.log(e.currentTarget.style.backgroundColor);
        })
    })
    document.getElementById("clear").addEventListener("click", clear)
    canvas.addEventListener("mousedown", drawFunc);
    canvas.addEventListener("mouseup", drawFunc);
    canvas.addEventListener("mousemove", drawFunc);

// })





