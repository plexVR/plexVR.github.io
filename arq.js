var isMouseDown = false;
var videoObj = document.getElementById('spin');
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
var reversePlayNormalSpeed = 30.0;
var reversePlaySpeed;
var reversePlayTimeoutID;
var playThreshold = 10;

function onMouseDown(event) {
    isMouseDown = true;
    videoObj.pause();
    mouseDownPos = event.x;
    currentTime = videoObj.currentTime;
    clearInterval(setIntervalID);
    clearInterval(reversePlayIntervalID);
    clearTimeout(reversePlayTimeoutID);
    freeRotationTime = 0;
}

function onMouseUp() {
    if (isMouseDown) {
        isMouseDown = false;
        console.log(mouseSpeed);
        //-- If the mouse moves slow then the video keep pausing --
        if (mouseSpeed > playThreshold) {
            videoObj.play();
            videoObj.playbackRate = mouseSpeed;
            playBackRate = videoObj.playbackRate;
            setIntervalID = setInterval(SetPlayBackSpeed, 100);
        }
        else if (mouseSpeed < -playThreshold) {
            videoObj.play();
            //reversePlaySpeed = -2 * mouseSpeed;
            //ReversePlayOneFrame();
        }
    }
}

function onMouseOut() {
    console.log(mouseSpeed);
    if (isMouseDown) {
        isMouseDown = false;
        if (mouseSpeed > playThreshold) {
            videoObj.play();
            videoObj.playbackRate = mouseSpeed;
            playBackRate = videoObj.playbackRate;
            setIntervalID = setInterval(SetPlayBackSpeed, 100);
        }
        else if(mouseSpeed < -playThreshold)
        {
            videoObj.play();
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
    mouseSpeed = event.x - lastMousePos;
    lastMousePos = event.x;

    if (isMouseDown) {
        //-- baseTime is used to avoid moduling negative numbers --
        videoObj.currentTime = (baseTime + currentTime + (event.x - mouseDownPos) / videoWidth * videoDuration) % videoDuration;
    }
}

if (videoObj) {
    videoObj.addEventListener("mousedown", onMouseDown, false);
    videoObj.addEventListener("mouseup", onMouseUp, false);
    videoObj.addEventListener("mousemove", SetCurTime, false);
    videoObj.addEventListener("mouseout", onMouseOut, false);
}

function HideImageAndShowVideo() {
    //videoObj.style.display = "block";
    videoObj.currentTime = 2.6;
    videoObj.play();
    //imageObj.style.display = "none";
    document.getElementById('embed_play').style.display = "none";
    opacityIntervalID = setInterval(ChangeOpacity, 30);
}

function ChangeOpacity() {
    imageObj.style.opacity -= 0.1;
    videoObj.style.opacity += 1.0;
    console.log("opacity");
    if (imageObj.style.opacity == 0) {
        clearInterval(opacityIntervalID);
    }
}

function ShowVideo(video) {
    video.style.display = "block";
}

function PlayVideo(video) {
    video.currentTime = 2.6;
    if (video.paused) {
        video.play();
    }
    else {
        video.pause();
    }
}

function ReversePlayOneFrame() {
    var videoDuration = videoObj.duration;
    var baseTime = videoDuration * 1000;
    var damping = 0.02;
    console.log("init speed: "+ reversePlaySpeed.toString());
    videoObj.currentTime = (videoObj.currentTime + videoDuration - 1.0 / reversePlayNormalSpeed) % videoDuration;
    freeRotationTime += 0.1;
    reversePlaySpeed = Math.min(reversePlaySpeed, 170);

    if(reversePlaySpeed * Math.exp(-damping * freeRotationTime) > reversePlayNormalSpeed)
    {
        reversePlayTimeoutID = setTimeout(function(){ReversePlayOneFrame();}, 1000.0/(reversePlaySpeed * Math.exp(-damping * freeRotationTime)));
    }
    else
    {
        //clearTimeout(reversePlayTimeoutID);
        console.log('normal speed');
        reversePlayTimeoutID = setTimeout(function(){ReversePlayOneFrame();}, 1000/reversePlayNormalSpeed);
    }
    
}








