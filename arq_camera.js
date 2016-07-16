var isMouseDown = false;
var videoObj = document.getElementById('video_camera');
var imageObj = document.getElementById('image');
var mouseDownPos;
var currentTime;
var lastMousePos = 0;
var mouseSpeed;
var playBackRate = 1.0;
var freeRotationTime = 0;
var setIntervalID;
var opacityIntervalID;
var reversePlayIntervalID;
var gNormalPlaySpeed = 30.0;
var reversePlaySpeed;
var reversePlayTimeoutID;
var gPlayThreshold = 10;
var bIsFirstClick = true;
/*
//-- Define an "Object Type" -- 
function arcspinVideo(videoObj, isMouseDown, mouseDownPos, lastMousePos, mouseSpeed, currentTime, playBackRate,
    freeRotationTime, setIntervalID, opacityIntervalID) {
    this.videoObj = videoObj;
    this.isMouseDown = isMouseDown;
    this.mouseDownPos = mouseDownPos;
    this.lastMousePos = lastMousePos;
    this.mouseSpeed = mouseSpeed;
    this.currentTime = currentTime;
    this.playBackRate = playBackRate;
    this.freeRotationTime = freeRotationTime;
    this.setIntervalID = setIntervalID;
    this.opacityIntervalID = opacityIntervalID;
}

var videoChicken = new arcspinVideo(document.getElementById('video_chicken'), false, 0, 0, 0, 0, 1.0, 0, 0, 0);
*/

function onMouseDown(event) {
    isMouseDown = true;
    videoObj.pause();
    mouseDownPos = event.pageX;
    currentTime = videoObj.currentTime;
    clearInterval(setIntervalID);
    clearInterval(reversePlayIntervalID);
    clearTimeout(reversePlayTimeoutID);
    freeRotationTime = 0;
}

function onMouseUp() {
    if (isMouseDown) {
        isMouseDown = false;
        //console.log(mouseSpeed);
        //-- If the mouse moves slow then the video keep pausing --
        if (mouseSpeed > gPlayThreshold) {
            videoObj.play();
            videoObj.playbackRate = mouseSpeed;
            playBackRate = videoObj.playbackRate;
            setIntervalID = setInterval(SetPlayBackSpeed, 100);
        }
        else if (mouseSpeed < -gPlayThreshold) {
            videoObj.play();
            videoObj.playbackRate = 1.0;
            //clearInterval(setIntervalID);
            //reversePlaySpeed = -2 * mouseSpeed;
            //ReversePlayOneFrame();
        }
    }
}

function onMouseOut() {
    //console.log(mouseSpeed);
    if (isMouseDown) {
        isMouseDown = false;
        if (mouseSpeed > gPlayThreshold) {
            videoObj.play();
            videoObj.playbackRate = mouseSpeed;
            playBackRate = videoObj.playbackRate;
            setIntervalID = setInterval(SetPlayBackSpeed, 100);
        }
        else if (mouseSpeed < -gPlayThreshold) {
            videoObj.play();
            videoObj.playbackRate = 1.0;
            //clearInterval(setIntervalID);
            //reversePlaySpeed = -2 * mouseSpeed;
            //ReversePlayOneFrame();
        }
    }
}

function SetPlayBackSpeed() {
    var damping = 0.5;
    var maxPlayBackRate = 10;
    if (playBackRate > 1.2) {
        freeRotationTime += 0.1;
        playBackRate = playBackRate * Math.exp(- damping * freeRotationTime);
    }
    else {
        playBackRate = 1.0;
        freeRotationTime = 0;
        clearInterval(setIntervalID);
    }
    videoObj.playbackRate = playBackRate;
}

function SetCurTime(event) {

    var videoWidth = videoObj.videoWidth;
    var videoDuration = videoObj.duration;
    var baseTime = videoDuration * 1000;
    mouseSpeed = event.pageX - lastMousePos;
    lastMousePos = event.pageX;

    if (isMouseDown) {
        //-- baseTime is used to avoid moduling negative numbers --
        console.log(videoObj.currentTime);
        videoObj.currentTime = (baseTime + currentTime + (event.pageX - mouseDownPos) / videoWidth * videoDuration) % videoDuration;
    }
}

function HideImageAndShowVideo() {
    if(bIsFirstClick)
    {
        videoObj.play();
        document.getElementById('embed_play').style.display = "none";
        bIsFirstClick = false;
    }
}

function ChangeOpacity() {
    imageObj.style.opacity -= 0.1;
    videoObj.style.opacity += 1.0;
    //console.log("opacity");
    if (imageObj.style.opacity == 0) {
        clearInterval(opacityIntervalID);
    }
}

function ReversePlayOneFrame() {
    var videoDuration = videoObj.duration;
    var baseTime = videoDuration * 1000;
    var damping = 0.02;
    //console.log("init speed: "+ reversePlaySpeed.toString());
    videoObj.currentTime = (videoObj.currentTime + videoDuration - 1.0 / gNormalPlaySpeed) % videoDuration;
    freeRotationTime += 0.1;
    reversePlaySpeed = Math.min(reversePlaySpeed, 170);

    if (reversePlaySpeed * Math.exp(-damping * freeRotationTime) > gNormalPlaySpeed) {
        reversePlayTimeoutID = setTimeout(function () { ReversePlayOneFrame(); }, 1000.0 / (reversePlaySpeed * Math.exp(-damping * freeRotationTime)));
    }
    else {
        //clearTimeout(reversePlayTimeoutID);
        //console.log('normal speed');
        reversePlayTimeoutID = setTimeout(function () { ReversePlayOneFrame(); }, 1000 / gNormalPlaySpeed);
    }
}

if (videoObj) {
    videoObj.addEventListener("mousedown", onMouseDown, false);
    videoObj.addEventListener("mouseup", onMouseUp, false);
    videoObj.addEventListener("mousemove", SetCurTime, false);
    videoObj.addEventListener("mouseout", onMouseOut, false);
    //videoObj.addEventListener("click", function(){videoObj.play();}, false);
}







