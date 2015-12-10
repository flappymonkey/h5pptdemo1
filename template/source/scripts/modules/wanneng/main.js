
define(function (require, exports, module) {

    //引用相关模块
    var $ = require('lib/zepto/zepto');
    //获取页面模块jQuery对象
    var $wannengPages = $('.page-wanneng');



    //对外提供接口
    module.exports = {
        //初始化
        init: function () {
            //初始化联系我们模块
            $wannengPages.each(function (i, item) {
                console.log('wn init');
                $page = $(item);
                var layout_id = $(this).data('layout-id');

                var acn = "wanneng";
                var params = {
                    selectorClassName: "page-wanneng",
                    animationClassName: acn,
                    animationElm: $("." + acn)
                };

                $ans = $('.' + params.animationClassName);
                var cssText = "";

                $ans.each(function () {
                    var obj = $(this);
                    var _className = obj.attr('data-item');
                    var _animation = obj.attr('data-animation');
                    var _duration = ((obj.attr('data-duration') / 1000) || 1) + 's';
                    var _timing = obj.attr('data-timing-function') || 'ease';
                    var _delay = ((obj.attr('data-delay') || 0) / 1000) + 's';
                    var _count = obj.attr('data-iteration-count') || 1;

                    var _t = '.' + params.selectorClassName + ' .' + _className;
                    cssText += _t + '{' +
						'display : block !important ;' +
						'-webkit-animation-name :' + _animation + ';' +
						'-webkit-animation-duration :' + _duration + ';' +
						'-webkit-animation-timing-function :' + _timing + ';' +
					    '-webkit-animation-delay :' + _delay + ';' +
						'-webkit-animation-fill-mode:both;' +
						'-webkit-animation-iteration-count :' + _count + ';' +
						'}';
                });


                var rule = cssText;
                var head = document.head || document.getElementsByTagName('head')[0];
                var style;
                if (!!head.getElementsByTagName('style').length) {
                    style = head.getElementsByTagName('style')[0];

                    if (style.styleSheet) {
                        style.styleSheet.cssText = rule;
                    } else {
                        style.innerHTML = '';
                        style.appendChild(document.createTextNode(rule));
                    }
                } else {
                    style = document.createElement('style');

                    style.type = 'text/css';
                    if (style.styleSheet) {
                        style.styleSheet.cssText = rule;
                    } else {
                        style.appendChild(document.createTextNode(rule));
                    }
                    head.appendChild(style);
                }
                $page.on('active', function (e) {
                    console.log('wn active');
                    //$(".wn").hide()
                }).on('current', function (e) {
                    console.log('wn current');
                });
            });
        }
    }
});