let canvas,
    canvasPos,
    ctx;

let hoverCanvas,
    hoverCanvasPos,
    hoverCtx;

let canvasButton = document.querySelector('.createCanvas'),
    canvasWidth,
    canvasHeight;

let paintArea,
    zoomIn,
    zoomOut,
    moveLeft,
    moveRight,
    moveUp,
    moveDown,
    leftValue=0,
    topValue=0,
    undo,
    redo,
    undoHistory = [],
    undoCounter = 0,
    colors,
    red,
    yellow,
    green,
    cyan,
    blue,
    purple,
    black,
    white;

let flag = false;

let chosenColor = 'black';

let zoom = 8;

//-----------------------------------------------------//

//create canvas
canvasButton.addEventListener('click', createCanvas);

function createCanvas(){
    let dimensionsInterface = document.querySelector('.getDimensions');
    let interface = document.querySelector('.interface');

    //get dimensions
        canvasWidth = document.querySelector('.width').value,
        canvasHeight = document.querySelector('.height').value;

    //remove dimensions input, clean up
        canvasButton.removeEventListener('click', createCanvas);
        dimensionsInterface.remove();

    //render canvas
    interface.innerHTML =
        `<div class='app'>
            <div class='container'>
                <canvas class='canvas' width='${canvasWidth}' height='${canvasHeight}'></canvas>
                <canvas class='hoverCanvas' width='${canvasWidth}' height='${canvasHeight}'></canvas>
            </div>
            
            <div class='wrapper'>
                <div class='menu'>
                    <div class='colors'>
                        <button class="red"></button>
                        <button class="yellow"></button>
                        <button class="green"></button>
                        <button class="cyan"></button>
                        <button class="blue"></button>
                        <button class="purple"></button>
                        <button class="black"></button>
                        <button class="white"></button>
                    </div>

                    <div class='toolbar'>
                        <button class="undo">↶</button>
                        <button class="redo">↷</button>
                        <button class="zoomIn">+</button>
                        <button class="zoomOut">-</button>
                        <button class="left">←</button>
                        <button class="right">→</button>
                        <button class="up">↑</button>
                        <button class="down">↓</button>
                    </div>
            </div>
        </div>`;
        let container = document.querySelector('.container');
        container.style.left="calc(50vw - "+canvasWidth*zoom/2+"px)";
        container.style.top="calc(50vh - "+canvasHeight*zoom/2+"px)";
        paintArea = document.querySelectorAll('canvas');
        setPaintAreaSize();

    //setup canvas variables
        canvas = document.querySelector('.canvas');
        canvasPos = canvas.getBoundingClientRect();
        ctx = canvas.getContext('2d');

        hoverCanvas = document.querySelector('.hoverCanvas');
        hoverCanvasPos = hoverCanvas.getBoundingClientRect();
        hoverCtx = hoverCanvas.getContext('2d');
        
        addCanvasListeners();

    //setup toolbar variables
        colors = document.querySelector('.colors');

        red = document.querySelector('.red');
        yellow = document.querySelector('.yellow');
        green = document.querySelector('.green');
        cyan = document.querySelector('.cyan');
        blue = document.querySelector('.blue');
        purple = document.querySelector('.purple');
        black = document.querySelector('.black');
        white = document.querySelector('.white');

        undo = document.querySelector('.undo');
        redo = document.querySelector('.redo');
        zoomIn = document.querySelector('.zoomIn');
        zoomOut = document.querySelector('.zoomOut');
        moveLeft = document.querySelector('.left');
        moveRight = document.querySelector('.right');
        moveUp = document.querySelector('.up');
        moveDown = document.querySelector('.down');

        addToolBarListeners();

        window.addEventListener('resize', adjustCanvasRectPosition);
}

function addCanvasListeners(){
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mousedown', function(e){
        if (undoCounter<undoHistory.length){
            undoHistory.splice(undoCounter,undoHistory.length);
        }
        undoHistory[undoCounter] = canvas.toDataURL();
        undoCounter++;
        flag = true;
        draw(e);
    });
    document.addEventListener('mouseup', ()=>{
        if (flag==true){
            flag = false;
        }
    });
    canvas.addEventListener('mousemove', hover);

    //mobile version
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchstart', function(e){
        undoHistory[undoCounter] = canvas.toDataURL();
        undoCounter++;
        flag = true;
        draw(e);
    });
    document.addEventListener('touchend', ()=>{
        if (flag==true){
            flag = false;
        }
    });
}

function addToolBarListeners(){
    undo.addEventListener('click', ()=>{
        if (undoCounter>0){
            undoHistory[undoCounter] = canvas.toDataURL();
            let tempCanvas = new Image();
            tempCanvas.src = undoHistory[undoCounter-1];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            tempCanvas.onload = function(){ctx.drawImage(tempCanvas, 0, 0)};
            undoCounter--;
        }
    });

    redo.addEventListener('click', ()=>{
        if (undoCounter<undoHistory.length-1){
            let tempCanvas = new Image();
            tempCanvas.src = undoHistory[undoCounter+1];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            tempCanvas.onload = function(){ctx.drawImage(tempCanvas, 0, 0)};
            undoCounter++;
        }
    });

    zoomIn.addEventListener('click', () =>{
        zoom=zoom+1;
        setPaintAreaSize();
    });
    zoomOut.addEventListener('click', ()=>{
        zoom=zoom-1;
        setPaintAreaSize();
    });

    moveLeft.addEventListener('click', ()=>{
        leftValue=leftValue+20;

        paintArea.forEach(element => element.style.left=leftValue+"px");

        adjustCanvasRectPosition();
    });

    moveRight.addEventListener('click', ()=>{
        leftValue=leftValue-20;

        paintArea.forEach(element => element.style.left=leftValue+"px");
        
        adjustCanvasRectPosition();
    });

    moveUp.addEventListener('click', ()=>{
        topValue=topValue+20;

        paintArea.forEach(element => element.style.top=topValue+"px");
        
        adjustCanvasRectPosition();
    });

    moveDown.addEventListener('click', ()=>{
        topValue=topValue-20;

        paintArea.forEach(element => element.style.top=topValue+"px");
        
        adjustCanvasRectPosition();
    });

    colors.addEventListener('click', (e)=>{
        if(e.target.className=="colors") return;
        else{
            chosenColor = e.target.className;
        }

    });
}

function setPaintAreaSize(){
    paintArea.forEach(element => {
        element.style.width=canvasWidth*zoom+"px";
        element.style.height=canvasHeight*zoom+"px";
    });
}

function adjustCanvasRectPosition(){
    canvasPos = canvas.getBoundingClientRect();
    hoverCanvasPos = hoverCanvas.getBoundingClientRect();
}

function draw(e){
    if (flag == true && e.target.className=='canvas'){
        ctx.fillStyle = chosenColor;
        ctx.fillRect(Math.round((e.clientX-canvasPos.left)/zoom-1),Math.round((e.clientY-canvasPos.top)/zoom-1),1,1);
    }
}

function hover(e){
    hoverCtx.clearRect(0, 0, hoverCanvas.width, hoverCanvas.height);
    hoverCtx.fillStyle = 'rgba(255, 165, 0, 0.5)';
    hoverCtx.fillRect(Math.round((e.clientX-canvasPos.left)/zoom-1),Math.round((e.clientY-canvasPos.top)/zoom-1),1,1);
}