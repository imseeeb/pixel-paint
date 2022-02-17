const canvas = document.querySelector('.canvas');
var canvasPos = canvas.getBoundingClientRect();
var ctx = canvas.getContext('2d');

const hoverCanvas = document.querySelector('.hoverCanvas');
var hoverCanvasPos = hoverCanvas.getBoundingClientRect();
var hoverCtx = hoverCanvas.getContext('2d');

var flag = false;

document.addEventListener('mousemove', draw);
document.addEventListener('mousedown', function(e){flag = true; draw(e)});
document.addEventListener('mouseup', ()=> flag = false);
document.addEventListener('mousemove', hover);

function draw(e){
    
    if (flag == true){
        ctx.fillRect(Math.round((e.clientX-canvasPos.left)/8),Math.round((e.clientY-canvasPos.top)/8),1,1);
    }
    //console.log(e.clientX);
}

function hover(e){
    hoverCtx.clearRect(0, 0, hoverCanvas.width, hoverCanvas.height);
    hoverCtx.fillStyle = 'rgba(255, 165, 0, 0.5)';
    hoverCtx.fillRect(Math.round((e.clientX-canvasPos.left)/8),Math.round((e.clientY-canvasPos.top)/8),1,1);
}