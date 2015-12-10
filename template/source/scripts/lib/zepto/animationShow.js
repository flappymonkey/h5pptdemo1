
define(function (require, exports, module) {
    var Zepto = require('./zepto');
    module.exports = Zepto;

    ; (function ($) {

        $.fn.animationShow = function (callback) {
            this.each(function (i, item) {
                var $item = $(item);
                $item.show().removeClass('z-hide').addClass('animationShow').off('webkitAnimationEnd').on('webkitAnimationEnd', function (e) {
                    if (e.target == item) {
                        $item.addClass('z-show').removeClass('animationShow');
                        if (callback) {
                            callback();
                        }
                    }
                });
            });
        };

        $.fn.animationHide = function (callback) {
            this.each(function (i, item) {
                var $item = $(item);
                $item.removeClass('z-show').addClass('animationHide').off('webkitAnimationEnd').on('webkitAnimationEnd', function (e) {
                    if (e.target == item) {
                        $item.addClass('z-hide').removeClass('animationHide').hide();
                        if (callback) {
                            callback();
                        }
                    }
                });
            });
        };

    })(Zepto)

});