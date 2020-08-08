
var videoFormats = ['mp4', '3gp', 'rm', 'rmvb', 'mov', 'm4v', 'ogg', 'avi', 'wmv', 'mkv', 'flv'];


var viewVideo = {

	$: function(selector){
		return document.querySelectorAll(selector);
	},

	addListener: function(target, type, handler) {
		if (target.addEventListener) {
			target.addEventListener(type,handler,false);
		} else if (target.attachEvent) {
			target.attachEvent("on"+type,handler);
		} else {
			target["on"+type] = handler;
		}
	},

	removeListener: function(target, type, handler) {
		if (target.removeEventListener) {
			target.removeEventListener(type, handler, false);
		} else if (target.detachEvent) {
			target.detachEvent("on" + type, handler);
		} else {
			target["on"+type] = handler;
		}
	},

	startup: function() {
        this.load();
        this.bind();
        this.init();
	},

	load: function() {
		this.videos = [
			["./HLL/92425985392/c325a0753a08b36496aa28b07ef1a522.mp4","test"],
		];
		this.showNumber = 0;
		this.total = this.videos.length;
		this.frames_number = 0;
	},

	bind: function() {
		var that = this;

		// 适应窗口变化
		window.onresize = function() {
		}

		// 打开文件choosefiles
        var input_f = document.getElementById("choosefiles");
        input_f.addEventListener(
            "change",
            function(e) {
                that.videos = [];
                that.total  = 0;
                var videos = [];
                var file;
                var files = e.target.files;

                if (files.length > 0) {
                    filecounter = 0;
                    for (var i = 0, file; file = files[i]; i++) {
                        var filename = file.name;
                        var webkitpath = file.webkitRelativePath;
                        var subpathcount = webkitpath.split("/").length - 1;

                        var ext = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
                        if (videoFormats.indexOf(ext) == -1) {
                            continue;
                        }

                        var fileUrl = window.URL.createObjectURL(file);
                        videos.push([fileUrl, filename]);

                        filecounter++;
                    }

                    if (videos.length > 0) {
                        that.videos = videos;
                        that.total  = videos.length;
                        that.updateThumpList();
                        that.showNumber = 0;
                        that.frames_number = 0;
                        that.showBigVideo();
                        that.updateThumpPositionBySingle();
                        that.updateActiveThump();
                        that.draw();
                    }
                }
            },
            false
        );


		// 打开文件夹
        var input = document.getElementById("chooseFolder");
        input.addEventListener(
            "change",
            function(e) {
                that.videos = [];
                that.total  = 0;
                var videos = [];
                var file;
                var files = e.target.files;

                var parsesubfolder = $("input[name='parsesubfolders']:checked").val() == 'on';

                if (files.length > 0) {
                    filecounter = 0;
                    for (var i = 0, file; file = files[i]; i++) {
                        var filename = file.name;
                        var webkitpath = file.webkitRelativePath;
                        var subpathcount = webkitpath.split("/").length - 1;
                        if (false == parsesubfolder && subpathcount > 1) {
                            continue;
                        }
                        var ext = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
                        if (videoFormats.indexOf(ext) == -1) {
                            continue;
                        }
                        var fileUrl = window.URL.createObjectURL(file);

                        videos.push([fileUrl, filename]);

                        filecounter++;
                    }

                    if (videos.length > 0) {
                        that.videos = videos;
                        that.total  = videos.length;
                        that.updateThumpList();
                        that.showNumber = 0;
                        that.frames_number = 0;
                        that.showBigVideo();
                        that.updateThumpPositionBySingle();
                        that.updateActiveThump();
                        that.draw();
                    }
                }
            },
            false
        );


        // 选择
		viewVideo.addListener(
		    viewVideo.$(".gallery-thumb-list")[0],
		    "click",
		    function(event) {
			    var ele = event.target || event.srcElement;
			    var index = ele.parentNode.getAttribute("data-index") || ele.getAttribute("data-index");

			    if (index) {
				    that.showNumber = parseInt(index);
				    that.showBigVideo();
				    that.updateThumpPositionBySingle();
				    that.updateActiveThump();
				    that.draw();
			    }

                $(".play").hide();
			    $(".play").addClass("hidden");
			    viewVideo.$(".video")[0].autoplay = "autoplay";
		    }
		);

	},

	init: function() {
		this.showNumber = 0;
		this.frames_number = 0;
		this.initBigVideo();
		this.initThump();
		this.draw();
	},

	initBigVideo: function() {
		if (this.videos.length > 0) {
			this.showBigVideo();
		}
	},

	showBigVideo: function() {
		viewVideo.$(".video")[0].src = this.videos[this.showNumber][0];
	    $('#showtitle p.title').html(this.videos[this.showNumber][1]);
	},

	initThump: function() {
		var that = this;

		// 初次初始化 thump list
		that.updateThumpList();
		that.showNumber = 0;
		that.updateThumpPositionBySingle();
		that.updateActiveThump();

	},

	updateThumpList: function() {
		var that = this;

        $(".gallery-thumb-item").remove();
		// 增加 thump
        var addThumpList = "";
        for (var i = 0; i < this.total; i++) {
            addThumpList +=
            '<div class="gallery-thumb-item" data-index="' + i + '">' +
                '<div id="img' + i + '" class="gallery-thumb-item-img">' +
                '</div>' +
                '<div class="gallery-thumb-item-border"></div>' +
            '</div>';
        }

        this.$(".gallery-thumb-list")[0].innerHTML = addThumpList;

        viewVideo.$(".gallery-thumb-list")[0].style.height = this.total*130+"px" || (window.innerHeight-100*2-130) + "px";

	},

	// 更换时，thump list 位置
	updateThumpPositionBySingle: function(index) {
		index = index || this.showNumber;
	    var top = 130*index - ((window.innerHeight-100*2-130)/2);
	    var shtop = $('.gallery-thumb-box')[0].scrollHeight - $('.gallery-thumb-box')[0].clientHeight;

	    if (top <= 0){
	        $('.gallery-thumb-box').scrollTop(0);
	        viewVideo.$(".gallery-thumb-list")[0].style.top = (- top) +"px";
	    } else {
	        $('.gallery-thumb-box').scrollTop(top);
	        viewVideo.$(".gallery-thumb-list")[0].style.top = "0px";
	    }
	},

	// 更新 thump 图的当前选中状态
	updateActiveThump: function(index) {
		// 取消过去选中的
		if (viewVideo.$(".gallery-thumb-item-focus").length > 0) {
			var tmpStr = viewVideo.$(".gallery-thumb-item-focus")[0].className;
			viewVideo.$(".gallery-thumb-item-focus")[0].className = tmpStr.split("gallery-thumb-item-focus").join("").trim();
		}

		// 使当前选中的显示蓝色边框
		viewVideo.$("[data-index='"+this.showNumber+"']")[0].className += " gallery-thumb-item-focus";
	},

    draw: function() {
        var that = this;
        that = viewVideo;

        if (that.frames_number >= that.total) return;

        for (var i = 0; i < 7; i++) {
            var index = i + that.frames_number;
            if (index >= that.total) break;
            var videoUrl = that.videos[index][0];
            var frames_data = extractFramesFromVideo(videoUrl, index);

        }

        that.frames_number += 7;

    },

    mousewheel: function() {
//        console.log("mousewheel");
        var that = this;
        that = viewVideo;

        that.showBigVideo();
        that.updateThumpPositionBySingle();
        that.updateActiveThump();
        that.draw();
    },
};

viewVideo.startup();






$(function(){
    $(':input').labelauty();
    });

$(function() {

	// fade overlay with controls, fade container to display titles, changed Andreas Meyer
	if ($("#overlay").hasClass('hidden')) {
	    $('#overlay').fadeTo('fast', 0.00);
	} else {
	    $('#overlay').fadeTo('fast', 1);
	}

	$('#showtitle').fadeTo('fast', 0.00);
	$('#showtitle').hover(
		function () {
			$(this).fadeTo('fast', 1.00);
		},
		function () {
			$(this).fadeTo('fast', 0.00);
		}
	);

	// add hoven fading for overlay, Andreas Meyer
	$('#overlay').hover(
		function () {
			$(this).fadeTo('fast', 1);
		},
		function () {
			if ($("#overlay").hasClass('hidden')) {
			    $('#overlay').fadeTo('fast', 0.00);
			} else {
			    $('#overlay').fadeTo('fast', 1);
			}
			$(this).fadeTo('slow', 0.01);
		}
	);


});


$(function(){

	//点击某个视频的播放按钮，如果正在播放则暂停，如果暂停则播放
	$(".gallery").on("click", ".swiper-slide .video", function(e) {

		if ($(".play").hasClass('hidden')) {
			$(".play").removeClass("hidden");
			$(".play").show();
		} else {
			$(".play").hide();
			$(".play").addClass("hidden");
		}
	})

});



function mousewheel_wrapper(event, delta) {

    if (viewVideo.total <= 1) {
//            console.log("return");
        return
    }

    if (delta < 0){
        if (viewVideo.showNumber >= viewVideo.total -1) {
            return
        }

        viewVideo.showNumber -= delta;
        viewVideo.mousewheel();

    } else if (delta > 0) {
        if (viewVideo.showNumber <= 0) {
            return
        }

        viewVideo.showNumber -= delta;
        viewVideo.mousewheel();

    }


    $(".play").hide();
    $(".play").addClass("hidden");
    $(".video")[0].autoplay = "autoplay";


    event.stopPropagation();
    event.preventDefault();
}



//var debounced = _.debounce(viewVideo.draw, 777);

//var debounced = _.debounce(
//    viewVideo.draw,
//    300,
//    {
//        'leading': true,
//        'trailing': true
//    }
//);

var debounced = _.debounce(viewVideo.draw, 777, { 'maxWait': 1000 });
$('.gallery-thumb-box').on('mousewheel', debounced);
var debounced2 = _.debounce(mousewheel_wrapper, 777, { 'maxWait': 1000 });
$('.swiper-wrapper').on('mousewheel', debounced2);


//var throttled = _.throttle(viewVideo.draw, 777);
//var throttled = _.throttle(viewVideo.draw, 1000, { 'trailing': true });
//$('.gallery-thumb-box').on('mousewheel', throttled);