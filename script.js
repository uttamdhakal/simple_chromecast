var session = null;

$( document ).ready(function(){
        var loadCastInterval = setInterval(function(){
                if (chrome.cast.isAvailable) {
                        console.log('Cast has loaded.');
                        clearInterval(loadCastInterval);
                        initializeCastApi();
                } else {
                        console.log('Unavailable');
                }
        }, 1000);
});

function initializeCastApi() {
        var applicationID = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
        var sessionRequest = new chrome.cast.SessionRequest(applicationID);
        var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
                sessionListener,
                receiverListener);
        chrome.cast.initialize(apiConfig, onInitSuccess, onInitError);
};

function sessionListener(e) {
        session = e;
        console.log('New session');
        if (session.media.length != 0) {
                console.log('Found ' + session.media.length + ' sessions.');
        }
}
 
function receiverListener(e) {
        if( e === 'available' ) {
                console.log("Chromecast was found on the network.");
        }
        else {
                console.log("There are no Chromecasts available.");
        }
}

function onInitSuccess() {
        console.log("Initialization succeeded");
}

function onInitError() {
        console.log("Initialization failed");
}

$('#castme').click(function(){
        launchApp();
});

function launchApp() {
        console.log("Launching the Chromecast App...");
        chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
}

function onRequestSessionSuccess(e) {
        console.log("Successfully created session: " + e.sessionId);
        session = e;
}

function onLaunchError() {
        console.log("Error connecting to the Chromecast.");
}

function onRequestSessionSuccess(e) {
        console.log("Successfully created session: " + e.sessionId);
        session = e;
        loadMedia();
}

function loadMedia() {
        if (!session) {
                console.log("No session.");
                return;
        }

        var mediaInfo = new
chrome.cast.media.MediaInfo('https://r5---sn-8vq54voxqx-cxge.googlevideo.com/videoplayback?itag=22&mn=sn-8vq54voxqx-cxge&mm=31&ip=88.78.143.68&mv=m&source=youtube&ms=au&signature=73A1321F9B4B3B3DCD7778759B1CDC012934B6F1.9E6D8B5D4BD5C190DF9F9DF7B4ADDA10246EF807&mime=video%2Fmp4&dur=248.151&pl=20&initcwndbps=1121250&id=o-APamSt1VWvwPB_guORcgrlAqNqphQjAa3Pb_o3TSxiUG&upn=yn5Tf4BPSOU&ei=OYSUWPqkGs3I1gKcgpSgCg&lmt=1485616753105196&expire=1486149785&sparams=dur%2Cei%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cupn%2Cexpire&ipbits=0&requiressl=yes&key=yt6&ratebypass=yes&mt=1486128146');
        mediaInfo.contentType = 'video/mp4';
  
        var request = new chrome.cast.media.LoadRequest(mediaInfo);
        request.autoplay = true;

        session.loadMedia(request, onLoadSuccess, onLoadError);
}

function onLoadSuccess() {
        console.log('Successfully loaded image.');
}

function onLoadError() {
        console.log('Failed to load image.');
}

$('#stop').click(function(){
        stopApp();
});

function stopApp() {
        session.stop(onStopAppSuccess, onStopAppError);
}

function onStopAppSuccess() {
        console.log('Successfully stopped app.');
}

function onStopAppError() {
        console.log('Error stopping app.');
}