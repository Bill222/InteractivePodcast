/** 
 * This function initialises the page with the time tags of the illustrations
 * and it's content.
 * */
function initPage(times, images, audioSrc) {

    /* Variables */
    var currentTagIndex = 0;
    var allTags = [];

    // initialise all tags 
    // each tag is an object {time: time, image: (link to the image)}
    for (i=0; i < times.length; i++) {
        allTags.push({
            time: times[i],
            image: images[i]
        });
    }
    // safety to check the array is ordered correctly
    allTags.sort(function(a, b) {
        var t_1 = a.time,
            t_2 = b.time;
        if (typeof(t_1) !== "number") t_1 = Number.parseInt(t_1);
        if (typeof(t_2) !== "number") t_2 = Number.parseInt(t_2);
        return t_1 - t_2;
    });

    var audio = document.getElementById("sound");

    var mainButton = document.getElementById("mainButton");
    var backButton = document.getElementById("backButton");
    var forwardButton = document.getElementById("forwardButton");
    var timeline = document.getElementById("timeline");

    var timer;

    /* Events */
    mainButton.addEventListener("click", handleMainButtonClick);
    backButton.addEventListener("click", handleSkipBackward);
    forwardButton.addEventListener("click", handleSkipForward);
    timeline.addEventListener("click", handleTimelineClick);

    /* Event Handler */
    function handleMainButtonClick() {
        if (audio.paused) {
            play();
        }
        else {
            pause();
        }
    }

    function handleSkipBackward() {
        // check if it is the first index, if true, don't do anything
        if (currentTagIndex < 1) return;

        var newTag = allTags[currentTagIndex - 1]
        audio.currentTime = newTag.time;
        updateIllustrationContent(newTag.image);
        currentTagIndex = currentTagIndex - 1;
        updateProgressBar();
    }

    function handleSkipForward() {
        if (currentTagIndex >= allTags.length - 1) return;
        var newTag = allTags[currentTagIndex + 1]
        audio.currentTime = newTag.time;
        updateIllustrationContent(newTag.image);
        currentTagIndex = currentTagIndex + 1;
        updateProgressBar();
    }

    function handleTimelineClick(e) {

        var newTime = (e.layerX/e.target.clientWidth) * audio.duration;
        var newIndex = getIndexFromTime(newTime);

        audio.currentTime = newTime;

        if (newIndex !== currentTagIndex) {
            currentTagIndex = newIndex;
            updateIllustrationContent(allTags[newIndex].image);
        }
        updateProgressBar();
    }

    /* Functions */
    function updateTime() {
        updateProgressBar();
        if (currentTagIndex >= allTags.length - 1) return;
        var nextTag = allTags[currentTagIndex + 1]
        if (audio.currentTime > nextTag.time) {
            updateIllustrationContent(nextTag.image);
            currentTagIndex = currentTagIndex + 1;
        }
    }

    function play() {
        audio.play();
        mainButton.classList.remove("play");
        mainButton.classList.add("pause");
        // update the time every two seconds
			timer = setInterval(updateTime, 2000);
 
		
    }

    function pause() {
        audio.pause();
        mainButton.classList.remove("pause");
        mainButton.classList.add("play");
        clearInterval(timer);
    }

    function updateProgressBar() {
        var percentage = (audio.currentTime/audio.duration) * 100;
        var playhead = document.getElementById("playhead");
        playhead.style.left = percentage + "%";
		var playwidth = document.getElementById("playwidth");
        playwidth.style.width = percentage + "%";
		
    }

    function updateIllustrationContent(content) {
        var container = document.getElementById("illustration-content");
        container.src = content;
    }

    function getIndexFromTime(time) {
        for (var i = 0; i < allTags.length - 1; i++) {
            if (allTags[i+1].time > time) return i;
        }
    }


	
	
	
    /* Initialize Content */
    
    // set illustrated content
    var container = document.getElementById("illustration-content");
    container.src = allTags[0].image;
    // set audio source
    audio.src = audioSrc;
}