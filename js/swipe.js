
var el = document.querySelector(".swiper-wrapper");

var ticking = false;
var timer;
var evt;

var mc = new Hammer.Manager(el);

mc.add(new Hammer.Swipe());
mc.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });

mc.on("swipe", onSwipe);


function updateElementTransform() {

    var direction = evt.direction;
    var distance = evt.distance;

    if (viewVideo.total <= 1) {
        return
    }

    if (direction == 8 && distance > 177){
        if (viewVideo.showNumber >= viewVideo.total -1) {
            return
        }

        viewVideo.showNumber -= -1;
        viewVideo.mousewheel();

    } else if (direction == 16 && distance > 177) {
        if (viewVideo.showNumber <= 0) {
            return
        }

        viewVideo.showNumber -= 1;
        viewVideo.mousewheel();

    }


    $(".play").hide();
    $(".play").addClass("hidden");
    $(".video")[0].autoplay = "autoplay";

}

function requestElementUpdate() {

    if(!ticking) {

        ticking = true;

        setTimeout(function () {
            updateElementTransform();
        }, 111);
        setTimeout(function () {
            ticking = false;
        }, 111);

    }

}


function onSwipe(ev) {
//    console.log(ev.direction, ev.distance);

    evt = ev;
    clearTimeout(timer);
    timer = setTimeout(function () {
        requestElementUpdate();
    }, 444);

}
