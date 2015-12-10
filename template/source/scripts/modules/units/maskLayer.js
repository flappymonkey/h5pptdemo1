

define(function (require, exports, module) {

    //引用相关模块
    var $ = require('lib/zepto');

    //定义MaskLayer插件对象
    var MaskLayer = function ($item, options) {
        var theClass = this;
        //定义属性
        this._$maskLayer = $item.addClass('u-maskLayer'); 		//目标容器
        this.state = this._$maskLayer.is('.z-show') ? 'show' : 'hide'; //显示状态

        //默认设置参数
        this.settings = {
            clickHideMode: 1, //0:禁用点击隐藏/ 1:启用遮罩区点击隐藏/ 2:启用所有区域点击隐藏
            closeButton: "has", // 有按钮值为1，"none"
            onShow: function () { },
            onHide: function () { }
        };

        // 根据传递参数 重置默认参数
        for (var i in options) {
            this.settings[i] = options[i] || this.settings[i];
        }


        //事件集合
        this._events = {
            show: [],
            hide: []
        };

        //注册事件
        this._events.show.push(this.settings.onShow);
        this._events.hide.push(this.settings.onHide);

        //初始化关闭按钮
        if (this.settings.closeButton == 'has') {
            //添加关闭按钮
            var $closeButton = $('<a href="javascript:void(0);" class="u-maskLayer-close"></a>');
            theClass._$maskLayer.append($closeButton);
            //注册点击事件
            $closeButton.on($.isPC ? 'click' : 'tap', function (e) {
                e.preventDefault();
                theClass.hide();
            });
        }

        //应用显示状态
        this.state == 'show' ? theClass.show('_init') : theClass.hide('_init');

        //判断是否点击自动隐藏
        if (this.settings.clickHideMode) {
            //点击隐藏
            theClass._$maskLayer.on($.isPC ? 'click' : 'tap', function (e) {
                //隐藏
                theClass.hide();
            });

            //判断是否为模式1（启用遮罩区点击隐藏），如果是则阻止子元素事件冒泡
            if (theClass.settings.clickHideMode == 1) {
                theClass._$maskLayer.children().on($.isPC ? 'click' : 'tap', function (e) {
                    //阻止子元素事件冒泡
                    e.stopPropagation();
                });
            }
        }
    };

    //事件注册
    MaskLayer.prototype.on = function (eventName, fn) {
        if (this._events[eventName] && fn) {
            this._events[eventName].push(fn);
        }
    };

    //事件触发
    MaskLayer.prototype.trigger = function (eventName) {
        if (this._events[eventName]) {
            var callbacks = this._events[eventName];
            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i]();
            }
        }
    };

    //显示
    MaskLayer.prototype.show = function () {
        var theClass = this;
        if (arguments[0] == '_init') {
            this._$maskLayer.addClass('z-show').show();
        } else {
            this._$maskLayer.show().removeClass('z-hide').addClass('z-showing');
            setTimeout(function () {
                theClass._$maskLayer.addClass('z-show').removeClass('z-showing');
                theClass.state = 'show';
                //触发显示事件
                theClass.trigger('show');
            }, 500);
        }
    };

    //隐藏
    MaskLayer.prototype.hide = function () {
        var theClass = this;
        if (arguments[0] == '_init') {
            this._$maskLayer.addClass('z-hide').hide();
        } else {
            this._$maskLayer.removeClass('z-show').addClass('z-hideing');
            setTimeout(function () {
                theClass._$maskLayer.addClass('z-hide').removeClass('z-hideing').hide();
                theClass.state = 'hide';
                //触发隐藏事件
                theClass.trigger('hide');
            }, 500);
        }
    };

    module.exports = MaskLayer;
});