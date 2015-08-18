window.addEventListener('load', eventWindowLoaded, false);

var videoElement;
var videoDiv;
function eventWindowLoaded() {
	
    videoElement = document.createElement("video");
    videoDiv = document.createElement('div');
    document.body.appendChild(videoDiv);
    videoDiv.appendChild(videoElement);
    videoDiv.setAttribute("style", "display:none;");
    var videoType = supportedVideoFormat(videoElement);
    if (videoType == "") {
        alert("no video support");
        return;
    }
    videoElement.setAttribute("src", "1." + videoType);
    videoElement.setAttribute("loop", "true");
    videoElement.addEventListener("canplaythrough", videoLoaded, false);


}

function supportedVideoFormat(video) {
    var returnExtension = "";
    if (video.canPlayType("video/mp4") == "probably" || video.canPlayType("video/mp4") == "maybe") {
        returnExtension = "mp4";
    } else if (video.canPlayType("video/webm") == "probably" || video.canPlayType("video/webm") == "maybe") {
        returnExtension = "webm";
    } else if (video.canPlayType("video/ogg") == "probably" || video.canPlayType("video/ogg") == "maybe") {
        returnExtension = "ogg";
    }

    return returnExtension;

}


function canvasSupport() {
    return Modernizr.canvas;
}




function videoLoaded() {
    canvasApp();

}

function canvasApp() {

    if (!canvasSupport()) {
        return;
    }

    function createNode(row,col,number){
        if (arguments.length == 2) {
	        number = 0;
        }
        var result = {};
        result.row = row;
        result.col = col; 
        result.number = number;

        result.backgoundColor = '#000000';
        result.getBackgoundColor = function () {
            switch(this.number){
                case 2:
                    return '#4B0091'//白色
                case 4:
                    return '#4F4F4F'//灰色
                case 8:
                    return '#EAC100'//棕色
                case 16:
return '#AD5A5A'//棕色
                case 32:
return '#7373B9'//棕色
                case 64:
return '#9F4D95'//棕色
                case 128:
return '#00DB00'//棕色
                case 256:
return '#7B7B7B'//棕色
                default:
                    return '#5CADAD'//黄色
            }
            return;
        }

        result.fontColor = '#FFFFFF';
        result.getFontColor = function () {
            switch (this.backgoundColor) {
                case '#FFFFFF':
                    return '#000000'; //白色
                default:
                    return '#FFFFFF'//黑色
            }
        }
       
result.backgoundColor = result.getBackgoundColor();
        return result;
    }

    function drawScreen(board) {

        //Background
        context.fillStyle = '#303030';
        context.fillRect(0, 0, theCanvas.width, theCanvas.height);
        //Box
        context.strokeStyle = '#FFFFFF';
        context.strokeRect(5, 5, theCanvas.width - 10, theCanvas.height - 10);
        context.font = "30px Verdana";
        
        for (var c = 0; c < M; c++) {
            for (var r = 0; r < N; r++) {
                var tempPiece = board[c][r];
                var placeX = r * blockWidth + r * xPad + startXOffset;
                var placeY = c * blockHeight + c * yPad + startYOffset;
                //context.drawImage(videoElement, tempPiece.finalCol * blockWidth, tempPiece.finalRow * blockHeight, blockWidth, blockHeight, placeX, placeY, blockWidth, blockHeight);
                context.fillStyle = tempPiece.backgoundColor;//这个块的颜色
                context.fillRect(placeX, placeY, blockWidth, blockHeight);
                context.fillStyle = tempPiece.fontColor;
                //将文字画上去
                context.font = "italic 40px sans-serif";
                context.textBaseline = 'middle';
                if (tempPiece.number != 0) {
                    var text = tempPiece.number.toString();
                    var length = context.measureText(text).width;


                    var gradient = context.createLinearGradient(placeX + (blockWidth - length) / 2, placeY, placeY + blockHeight / 2, placeY + blockHeight);
                    gradient.addColorStop("0", tempPiece.fontColor + "");
                    gradient.addColorStop("0.5", "blue");
                    gradient.addColorStop("1.0", tempPiece.fontColor + "");
                    context.fillStyle = gradient;
                    context.fillText(text, placeX + (blockWidth - length) / 2, placeY + blockHeight / 2);
                }

                //context.fillText(text, placeX + (blockWidth - length) / 2, placeY + blockHeight / 2);
            }
        }

    }

    function randomizeNumber() {
        var res = Math.random();
        if (res > 0.5)
            return 4;
        return 2;
    }

    function computeEmptyNum(board) {
        var sum = 0;
        for (var i = 0; i < M; i++)
            for (var j = 0; j < N; j++)
                if (board[i][j].number == 0)
                    sum++;
        return sum;
    }

    function printBoard(board) {
        for (var i = 0; i < M; i++) {
            var s = "";
            for (var j = 0; j < N; j++)
                s = s + board[i][j].number + "  ";
            console.log(s);
        }
    }

    function randomizeNumOnEmptyBoard(board) {
        var emptyNum = computeEmptyNum(board);
        var number = randomizeNumber();
        var indexOfEmptyBoard = Math.floor(Math.random() * emptyNum) + 1;
        var count = 0;
        for(var i = 0;i < M;i++){
            for(var j = 0;j < N;j++){
                if(board[i][j].number == 0)
                    count++;
                if(count == indexOfEmptyBoard){
                    var temp = board[i][j];
                    temp.number = number;
                    temp.backgoundColor = temp.getBackgoundColor();
                    temp.fontColor = temp.getFontColor();
                    emptyNum--;
                    return board;
                }
            }
        }
        
        
    }

    var theCanvas = document.getElementById('mycanvas');
    var context = theCanvas.getContext('2d');
    theCanvas.addEventListener('onmousedown', mouseDown(event), false); theCanvas.addEventListener('onmouseup', mouseUp(event), false);
    var mouseX0 = 0,mouseY0 = 0;
    function mouseDown(e) {
        mouseX0 = e.clientX;
        mouseY0 = e.clientY;
    }
    function mouseUp(e) {
        var dir = 0;//1右，2左，3上，4下
        if (e.clientX > mouseX0)
            dir = 1;
        else if (e.clientX < mouseX0)
            dir = 2;
        else if (e.clientY < mouseY0)
            dir = 3;
        else if (e.clientY < mouseY0)
            dir = 4;
        board = computeDirection(dir, board);
        var emptyNum = computeResult(board);
        if (emptyNum == 0)
            return;
        board = randomizeNumOnEmptyBoard(board);
        drawScreen(board);
    }
    function computeResult(borad) {
        var maxNumber = 2048;
        if (board == undefined)
            return -1;
        var emptyNum = 0;
        var flag = false;
        for (var i = 0; i < M; i++) 
            for (var j = 0; j < N; j++) {
                if (board[i][j].number >= maxNumber)
                    flag = true;
                if (board[i][j].number == 0)
                    emptyNum++;
            }
        if (flag)
            alert("你这么吊，你爸妈知道吗?");
        if (emptyNum == 0) 
            alert("笨蛋，你输了！");
        return emptyNum;
    }


    document.onkeypress = showKeyPress;
    function showKeyPress(e) {
        e = (e) ? e : window.event
        var direction;
        if (e.keyCode == 97 || e.keyCode == 37) { //a
            direction = 'a';
        }
        else if (e.keyCode == 100 || e.keyCode == 39) { //d
            direction = 'd';
        }
        else if (e.keyCode == 115 || e.keyCode == 40) { //s
            direction = 's';
        }
        else if (e.keyCode == 119 || e.keyCode == 38) { //w
            direction = 'w';
        }
        
       
        board = computeDirection(direction, board);

        var emptyNum = computeResult(board);
        if (emptyNum == 0)
            return;

        board = randomizeNumOnEmptyBoard(board);
        printBoard(board);
        drawScreen(board);
    }

    function computeDirection(dir, board) {
        if (dir == 'w') {//上
            for (var j = 0; j < N; j++) {
                var pos = 0;
                var next = 0;
                var pos1;
                while (pos < M) {
                    while ( pos < M&&board[pos][j].number == 0 )
                        pos++;
                    if(pos != M){
                        pos1 = pos + 1;
                        while (pos1 < M&&board[pos1][j].number == 0)
                            pos1++;
                        if (pos1 >= M) {
                            board[next][j].number = board[pos][j].number;
                            board[next][j].backgoundColor = board[next][j].getBackgoundColor();
                            board[next][j].fontColor = board[next][j].getFontColor();
                            next = next + 1;
                            pos = pos1;
                        }
                       else if (board[pos][j].number == board[pos1][j].number) {
                        board[next][j].number = board[pos][j].number * 2;
                        board[next][j].backgoundColor = board[next][j].getBackgoundColor();
                        board[next][j].fontColor = board[next][j].getFontColor();
                        next = next + 1;
                        pos = pos1 + 1;
                    }
                    else if (board[pos][j].number != board[pos1][j].number ) {
                        board[next][j].number = board[pos][j].number ;
                        board[next][j].backgoundColor = board[next][j].getBackgoundColor();
                        board[next][j].fontColor = board[next][j].getFontColor();
                        next = next + 1;
                        pos = pos1;
                    }
                    }
                    
                }
                for (var k = next; k < M; k++) {
                    board[k][j].number = 0;
                    board[k][j].backgoundColor = board[k][j].getBackgoundColor();
                    board[k][j].fontColor = board[k][j].getFontColor();
                }

            }

        }
        else if (dir == 's') {//下
            for (var j = 0; j < N; j++) {
                var pos = M - 1;
                var next = M - 1;
                var pos1;
                while (pos >= 0) {
                    while ( pos >= 0 && board[pos][j].number == 0 )
                        pos--;
                    if(pos >= 0){
                        pos1 = pos - 1;
                        while (pos1 >= 0&&board[pos1][j].number == 0)
                            pos1--;
                        if (pos1 < 0 ) {
                            board[next][j].number = board[pos][j].number;
                            board[next][j].backgoundColor = board[next][j].getBackgoundColor();
                            board[next][j].fontColor = board[next][j].getFontColor();
                            next = next - 1;
                            pos = pos1;
                        }
                       else if (board[pos][j].number == board[pos1][j].number) {
                        board[next][j].number = board[pos][j].number * 2;
                        board[next][j].backgoundColor = board[next][j].getBackgoundColor();
                        board[next][j].fontColor = board[next][j].getFontColor();
                        next = next - 1;
                        pos = pos1 - 1;
                    }
                    else if (board[pos][j].number != board[pos1][j].number ) {
                        board[next][j].number = board[pos][j].number ;
                        board[next][j].backgoundColor = board[next][j].getBackgoundColor();
                        board[next][j].fontColor = board[next][j].getFontColor();
                        next = next - 1;
                        pos = pos1;
                    }
                    }
                    
                }
                for (var k = next; k >= 0; k--) {
                    board[k][j].number = 0;
                    board[k][j].backgoundColor = board[k][j].getBackgoundColor();
                    board[k][j].fontColor = board[k][j].getFontColor();
                }

            }

        }
        else if (dir == 'a') { //左
            for (var i = 0; i < M; i++) {
                var pos = 0;
                var next = 0;
                var pos1;
                while (pos < N) {
                    while (pos < N && board[i][pos].number == 0)
                        pos++;
                    if(pos != N){
                        pos1 = pos + 1;
                        while (pos1 < N&&board[i][pos1].number == 0)
                            pos1++;
                        if (pos1 >= N) {
                            board[i][next].number = board[i][pos].number;
                            board[i][next].backgoundColor = board[i][next].getBackgoundColor();
                            board[i][next].fontColor = board[i][next].getFontColor();
                            next = next + 1;
                            pos = pos1;
                        }
                        else if (board[i][pos].number == board[i][pos1].number) {
                            board[i][next].number = board[i][pos].number * 2;
                            board[i][next].backgoundColor = board[i][next].getBackgoundColor();
                            board[i][next].fontColor = board[i][next].getFontColor();
                            next = next + 1;
                            pos = pos1 + 1;
                        }
                        else if (board[i][pos].number != board[i][pos1].number ) {
                            board[i][next].number = board[i][pos].number ;
                            board[i][next].backgoundColor = board[i][next].getBackgoundColor();
                            board[i][next].fontColor = board[i][next].getFontColor();
                            next = next + 1;
                            pos = pos1;
                        }
                    }
                }
                for (var k = next; k < N; k++) {
                    board[i][k].number = 0;
                    board[i][k].backgoundColor = board[i][k].getBackgoundColor();
                    board[i][k].fontColor = board[i][k].getFontColor();
                }
            }

        }
        else if (dir == 'd') {//右
            for (var i = 0; i < M; i++) {
                var pos = N - 1;
                var next = N - 1;
                var pos1;
                while (pos >= 0 ) {
                    while (pos >= 0 && board[i][pos].number == 0)
                        pos--;
                    if (pos >= 0) {
                        pos1 = pos - 1;
                        while (pos1 >= 0 && board[i][pos1].number == 0)
                            pos1--;
                        if (pos1 < 0) {
                            board[i][next].number = board[i][pos].number;
                            board[i][next].backgoundColor = board[i][next].getBackgoundColor();
                            board[i][next].fontColor = board[i][next].getFontColor();
                            next = next - 1;
                            pos = pos1;
                        }
                        else if (board[i][pos].number == board[i][pos1].number) {
                            board[i][next].number = board[i][pos].number * 2;
                            board[i][next].backgoundColor = board[i][next].getBackgoundColor();
                            board[i][next].fontColor = board[i][next].getFontColor();
                            next = next - 1;
                            pos = pos1 - 1;
                        }
                        else if (board[i][pos].number != board[i][pos1].number) {
                            board[i][next].number = board[i][pos].number;
                            board[i][next].backgoundColor = board[i][next].getBackgoundColor();
                            board[i][next].fontColor = board[i][next].getFontColor();
                            next = next - 1;
                            pos = pos1;
                        }
                    }
                }
                for (var k = next; k >= 0; k--) {
                    board[i][k].number = 0;
                    board[i][k].backgoundColor = board[i][k].getBackgoundColor();
                    board[i][k].fontColor = board[i][k].getFontColor();
                }

            }

        }
        return board;
    }
    //var videoElement = document.getElementsByTagName("video");
    videoElement.loop = true;
    videoElement.play();
    //Puzzle Settings

    var M = 4;
    var N = 4;
    //各个块之间的间隙
    var xPad = 10;
    var yPad = 10;
    //第一个块在canvas的位置
    var startXOffset = 10;
    var startYOffset = 10;
    //块的宽度，高度
    var blockWidth = 60;
    var blockHeight = 60;
    //用于判断游戏是否输赢
    var maxNumber = 32;
    theCanvas.width = 2 * startXOffset + (N - 1) * xPad + N * blockWidth;
    theCanvas.height = 2 * startYOffset + (M - 1) * yPad + M * blockHeight;
    var board = new Array();

    //Initialize Board 
    for (var i = 0; i < M; i++) {
        board[i] = new Array();
        for (var j = 0; j < N; j++) {
            board[i][j] = createNode(i,j,0);
        }
    }
    var emptyNum = M * N;
    
    board = randomizeNumOnEmptyBoard(board);
    drawScreen(board);


}