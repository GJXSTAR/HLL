
function extractFramesFromVideo(videoUrl, i) {
    return new Promise(async (resolve) => {
        var fps = 25;

//        var videoBlob = await fetch(videoUrl).then(r => r.blob());
//        var videoObjectUrl = URL.createObjectURL(videoBlob);
        var videoObjectUrl = videoUrl

        var video = document.createElement("video");

        var seekResolve;
        video.addEventListener('seeked', async function() {
            if(seekResolve) seekResolve();
        });

        video.addEventListener('loadeddata', async function() {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            var [w, h] = [video.videoWidth, video.videoHeight]
            canvas.width =  w;
            canvas.height = h;

            var frames = [];
            var interval = 1 / fps;
            var currentTime = 0;
            var duration = video.duration;

            //while(currentTime < duration) {
                video.currentTime = currentTime;
                await new Promise(r => seekResolve=r);

                context.drawImage(video, 0, 0, w, h);
                var base64ImageData = canvas.toDataURL();

var img = document.getElementById("img" + i);
img.style.backgroundImage = "url("+base64ImageData+")";

                frames.push(base64ImageData);

                currentTime += interval;
            //}

            resolve(frames);
        });

        video.src = videoObjectUrl;

    });

}


//var frames_data = extractFramesFromVideo(
//    "./HLL/78753466299/0b3bdb7434598c1e7a32e33e487270ca.mp4"
//    );
//
//frames_data.then(value => {
//    var img = document.getElementById('thumbnail_img');
//    img.setAttribute('src', value[0]);
//    })
