

define(function (require, exports, module) {

    //引用相关模块
    var $ = require('lib/zepto/zepto');
    //获取页面模块jQuery对象
    var $indexPages = $('.page .deviceor');

    //对外提供接口
    module.exports = {
        //初始化
        init: function () {
            var $app = $('body');
            //初始化首页模块
            $indexPages.each(function (i, item) {
                console.log('deviceor init');
                //获取当前page页
                var $page = $(item);
                $page.on('deviceor', function (e) {

                    window.addEventListener('deviceorientation', this.ondeviceorientation, false); //方向感应器  
                    window.addEventListener('MozOrientation', this.ondeviceorientation, false); //方向感应器 for firefox      
                    window.addEventListener('devicemotion', this.ondeviceorientation, false);
                    var imgPag = $page, elimgL = imgPag.length;
                    var fullImgWidth = imgPag.width();
                    var moveX = (moveX = fullImgWidth - 640) > 0 ? moveX : 0;
                    var moveX = moveX * 0.5;
                    imgPag.css({ left: -moveX });
                    var let = parseInt(imgPag.css('left'));

                    /* 重力感应*/
                    window.ondeviceorientation = function (e) {
                        var ang, KEY = {};
                        var o = window.orientation;  //获取设备方向
                        if (o == 90) {
                            ang = e.beta;  //设备横向1
                        } else if (o == -90) {
                            ang = -e.beta;  //设备横向2
                        } else if (o == 0) {
                            ang = e.gamma;    //设备纵向
                        }

                        if (ang > 5) {
                            //图片如果超出屏幕宽度
                            if (ang < 30) {
                                dlagr = moveX / (30 / ang);
                                imgPag.css({ "left": let - dlagr + "px" });
                            }
                        } else if (ang < -5) {
                            if (ang > -30) {
                                dlagr = moveX / (30 / ang);
                                imgPag.css({ "left": let - dlagr + "px" });
                            }
                        } else {
                            KEY.RIGHT = false;
                            KEY.LEFT = false;
                        }
                    }

                });



            });
        }
    }
});