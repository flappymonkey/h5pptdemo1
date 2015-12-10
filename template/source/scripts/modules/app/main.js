/* 
*  app全局模块
* ----------------------------------
*  作者：xiaohan
*  联系：1415384560（qq）
************************************************************/

define(function (require, exports, module) {

    //引用功能库模块
    var $ = require('lib/zepto/zepto'), 				//zepto模块
		$ = require('lib/zepto/selector'); 			//选择器插件模块


    //引用app全局模块

    var globalAudio = require("units/globalAudio")
    //App类
    var App = function ($item) {
        console.log('app init');

        //定义属性对象
        this._$app = $item; 						//app容器包装对象
        this._$pages = this._$app.find('.page'); //app中所有的页面集合
        this.$currentPage = this._$pages.eq(0); 	//当前显示的页面
        this._isFirstShowPage = true; 			//是否第一次显示页面
        this._isInitComplete = false; 			//是否初始化已经完成
        this._isDisableFlipPage = false; 		//是否禁止翻页
        this._isDisableFlipPrevPage = false; 	//是否禁止向上翻页
        this._isDisableFlipNextPage = false; 	//是否禁止向下翻页
        this._first = false;
        //定义变量
        var theClass = this;
        var $win = $(window);

        //禁用不需要的浏览器默认行为
        (function () {
            //禁止ios的浏览器容器弹性
            $win.on('scroll.elasticity', function (e) {
                e.preventDefault();
            }).on('touchmove.elasticity', function (e) {
                e.preventDefault();
            }).on('doubleTap', function (e) {
                e.preventDefault();
            });

            //禁止拖动图片
            $win.delegate('img', 'mousemove', function (e) {
                e.preventDefault();
            });
        })();

        //初始化页面切换效果
        $win.on('load', function (e) {
            //定义临时变量
            var currentPage = null, activePage = null;
            var triggerLoop = true;
            var startX = 0, startY = 0, moveDistanceX = 0, moveDistanceY = 0, isStart = false, isNext = false, isFirstTime = true;
            //为theClass._$app添加事件
            theClass._$app.on('mousedown touchstart', function (e) {
                //动画正在运行时或禁止翻页时不进行下一轮切换
                if (theClass._isDisableFlipPage) {
                    return;
                }
                //获取当前显示的页面和将要显示的页面
                currentPage = theClass._$pages.filter('.z-current').get(0);
                activePage = null;
                //初始化切换变量、属性
                if (currentPage) {
                    isStart = true;
                    isNext = false;
                    isFirstTime = true;
                    moveDistanceX = 0;
                    moveDistanceY = 0;
                    if (e.type == 'mousedown') {
                        startX = e.pageX;
                        startY = e.pageY;
                    } else {
                        startX = e.touches[0].pageX;
                        startY = e.touches[0].pageY;
                    }
                    currentPage.classList.add('z-move');
                    currentPage.style.webkitTransition = 'none';
                }
            }).on('flipUp', function (e) {
                //获取下一页
                var $targetPage = app.$currentPage ? app.$currentPage.next() : $();
                //判断是否超出了最后一页
                if ($targetPage.length) {
                    //获取索引
                    var index = App._getPageIndex.call(this, $targetPage);

                    //如果存在则显示当前页面
                    if ($page && $page.length) {
                        app.go(index);
                    }
                }
                else {
                    app.go(0);
                }
            }).on('flipDown', function (e) {
                //获取上一页
                var $targetPage = app.$currentPage ? app.$currentPage.prev() : $();
                //判断是否超出了最后一页
                if ($targetPage.length) {
                    //获取索引
                    var index = App._getPageIndex.call(this, $targetPage);
                    //如果存在则显示当前页面
                    if ($page && $page.length) {
                        app.go(index);
                    }
                }
                else {
                    app.go(theClass._$pages.size() - 1);
                }
            }).on('mousemove touchmove', function (e) {
                //当启动新一轮切换并且将要显示的页面不为null或者为启动后第一次进入move事件
                if (isStart && (activePage || isFirstTime)) {
                    //获取移动距离
                    if (e.type == 'mousemove') {
                        moveDistanceX = e.pageX - startX;
                        moveDistanceY = e.pageY - startY;
                    } else {
                        moveDistanceX = e.touches[0].pageX - startX;
                        moveDistanceY = e.touches[0].pageY - startY;
                    }

                    //如果Y移动的距离大于X移动的距离，则进行翻页操作
                    if (Math.abs(moveDistanceY) > Math.abs(moveDistanceX)) {
                        //判断用户是向上还是向下拉
                        if (moveDistanceY > 0) {
                            //判断是否已经禁用向下翻页
                            if (!theClass._first && $(currentPage).index() == 0) {
                                return;
                            }
                            //判断是否已经禁用向下翻页
                            if (theClass._isDisableFlipPrevPage) {
                                return;
                            }
                            //向下拉：显示上一页
                            if (isNext || isFirstTime) {
                                //设置临时变量值
                                isNext = false;
                                isFirstTime = false;

                                //清除上次将要显示的页面
                                if (activePage) {
                                    activePage.classList.remove('z-active');
                                    activePage.classList.remove('z-move');
                                }
                                //获取当前将要显示的上一页
                                activePage = currentPage.previousElementSibling;
                                if (!activePage) {
                                    activePage = $(currentPage).siblings().last()[0];
                                }
                                if (activePage) {
                                    //获取成功：初始化上一页
                                    activePage.classList.add('z-active')
                                    activePage.classList.add('z-move');
                                    activePage.style.webkitTransition = 'none';
                                    activePage.style.webkitTransform = 'translateY(-100%)';
                                    $(activePage).trigger('active');
                                    currentPage.style.webkitTransformOrigin = 'bottom center';
                                } else {
                                    //获取失败：重置当前页
                                    currentPage.style.webkitTransform = 'translateY(0px)';
                                    activePage = null;
                                }
                            } else {
                                //移动时设置样式
                                currentPage.style.webkitTransform = 'translateY(' + (moveDistanceY) + 'px)';
                                activePage.style.webkitTransform = 'translateY(-' + (window.innerHeight - moveDistanceY) + 'px)';
                            }
                        } else if (moveDistanceY < 0) {
                            //判断是否已经禁用向上翻页
                            if (theClass._isDisableFlipNextPage) {
                                return;
                            }
                            //向上拉：显示下一页
                            if (!isNext || isFirstTime) {
                                //设置临时变量值
                                isNext = true;
                                isFirstTime = false;
                                if ($('#scene_is_loop').val() == "1") {
                                    if ($(currentPage).index() == theClass._$pages.size() - 1) {
                                        return;
                                    }
                                }
                                //清除上次将要显示的页面
                                if (activePage) {
                                    activePage.classList.remove('z-active');
                                    activePage.classList.remove('z-move');
                                }
                                //获取当前将要显示的下一页
                                activePage = currentPage.nextElementSibling;
                                if (!activePage) {
                                    activePage = $(currentPage).siblings().eq(0)[0];
                                }

                                if (activePage) {
                                    //获取成功：初始化下一页
                                    activePage.classList.add('z-active');
                                    activePage.classList.add('z-move');
                                    activePage.style.webkitTransition = 'none';
                                    activePage.style.webkitTransform = 'translateY(' + window.innerHeight + 'px)';
                                    $(activePage).trigger('active');
                                    currentPage.style.webkitTransformOrigin = 'top center';
                                } else {
                                    //获取失败：重置当前页
                                    currentPage.style.webkitTransform = 'translateY(0px)';
                                    activePage = null;
                                }
                            } else {
                                //移动时设置样式
                                currentPage.style.webkitTransform = 'translateY(' + moveDistanceY + 'px)';
                                activePage.style.webkitTransform = 'translateY(' + (window.innerHeight + moveDistanceY) + 'px)';
                            }
                        }
                    }
                }
            }).on('mouseup touchend', function (e) {
                if (isStart) {
                    //设置临时变量
                    isStart = false;
                    if (activePage) {
                        theClass._isDisableFlipPage = true;
                        //启动转场动画
                        currentPage.style.webkitTransition = '-webkit-transform 0.3s ease-out';
                        activePage.style.webkitTransition = '-webkit-transform 0.3s ease-out';
                        //判断移动距离是否超过100
                        if (Math.abs(moveDistanceY) > Math.abs(moveDistanceX) && Math.abs(moveDistanceY) > 10) {
                            //切换成功：设置当前页面动画
                            if (isNext) {
                                currentPage.style.webkitTransform = 'translateY(-' + window.innerHeight + 'px)';
                                activePage.style.webkitTransform = 'translateY(0px)';
                            } else {
                                currentPage.style.webkitTransform = 'translateY(' + window.innerHeight + 'px)';
                                activePage.style.webkitTransform = 'translateY(0px)';
                            }
                            //页面动画运行完成后处理
                            setTimeout(function () {
                                activePage.classList.remove('z-active');
                                activePage.classList.remove('z-move');
                                activePage.classList.add('z-current');
                                currentPage.classList.remove('z-current');
                                currentPage.classList.remove('z-move');
                                theClass._isDisableFlipPage = false;
                                //保存当前页面，并触发页面事件
                                $(currentPage).trigger('hide');
                                theClass.$currentPage = $(activePage).trigger('current');
                                if (!theClass._first && $(currentPage).index() == theClass._$pages.size() - 1) {
                                    theClass._first = true;
                                }
                            }, 500);
                        } else {
                            //切换取消：设置当前页面动画
                            if (isNext) {
                                currentPage.style.webkitTransform = 'translateY(0px)';
                                activePage.style.webkitTransform = 'translateY(100%)';
                            } else {
                                currentPage.style.webkitTransform = 'translateY(0px)';
                                activePage.style.webkitTransform = 'translateY(-100%)';
                            }
                            //页面动画运行完成后处理
                            setTimeout(function () {
                                $(currentPage).trigger('current');
                                activePage.classList.remove('z-active');
                                activePage.classList.remove('z-move');
                                theClass._isDisableFlipPage = false;
                            }, 500);
                        }
                    } else {
                        currentPage.classList.remove('z-move');
                        theClass._isDisableFlipPage = false;
                    }
                }
            });
        });
        //监听键盘事件
        $(window).on('keyup', function (e) {
            //判断keyCode
            switch (e.keyCode) {
                //上一页                
                case 38:
                    app.prev();
                    break;
                //下一页                
                case 40:
                    app.next();
                    break;
            }
        });
        /**
        * 获取页索引
        * 
        * @return {Number} 页索引
        */
        App._getPageIndex = function ($page_index) {
            //参数验证
            if (!$page_index || $page_index.length === 0) return -1;
            //返回索引
            return app._$pages.indexOf($page_index.get(0));
        };
        //为非最后页的页面添加手引标记
        $win.on('load', function (e) {
            var VisitCount = $('#VisitCount').val();
            var guideHtml = '<div class="u-guideWrap"><a href="javascript:void(0);" class="u-guideTop z-move"></a></div>';
            var gHtml = '<div style="position:fixed;bottom:0;right:0;color:#009900; height:50px;line-height:50px;font-size:20px;width:100%;padding-right:2%;background-color:rgba(0,0,0,.3);z-index:9999; text-align:right;"><span style="margin-left:2%;padding-left:2%;color:#fff;text-align:left;float:left;display:inline-block;">访问量:' + VisitCount + '</span><span style="color:#fff">Powered by</span> www.qiyiapp.com</div>';

            if ($('#CopyrightShow').val() == "0") {
                theClass._$pages.last().append(gHtml);
            }
            theClass._$pages.not(theClass._$pages.last()).append(guideHtml);
        });

        //初始化Loading组件
        $win.on('load', function (e) {
            //获取对象
            var $appLoading = $('#app-loading');
            //控制隐藏/移除
            $appLoading.addClass('z-hide');
            $appLoading.on('webkitTransitionEnd', function (e) {
                $appLoading.remove();
            });

            //指示初始化完成
            theClass._isInitComplete = true;
            //显示第一个页面
            theClass.showPage();
        });
    };
    /**
    * 根据索引跳转到指定页
    * 
    * @param  {Number} indexOrPageObj 页索引/页元素对象
    * @param  {Boolean} isShowAnimation 跳转时是否启用动画
    * @return {Boolean} 是否跳转成功
    */
    App.prototype.go = function (indexOrPageEle) {
        //获取跳转的页
        var $targetPage = isNaN(indexOrPageEle) ? $(indexOrPageEle) : this._$pages.eq(indexOrPageEle);
        if ($targetPage.length) {
            //获取索引
            //var index = app._getPageIndex.call(this, $targetPage);
            //判断是否超出了最后一页
            if ($targetPage.length === 0) {
                return;
            }
            //如果存在则显示当前页面
            if ($page && $page.length) {
                this._$pages.filter('.z-current').removeClass('z-current');
                this._$pages.eq(indexOrPageEle).css('-webkit-transform', 'none').addClass('z-current');
                this._$pages.eq(indexOrPageEle).trigger('current');
                this.$currentPage = this._$pages.eq(indexOrPageEle);
            }
        }
    };
    /**
    * 上一页
    *
    * @return {Boolean} 是否翻页成功
    */
    App.prototype.prev = function () {
        //触发flipDown事件翻上一页
        app._$app.trigger('flipDown');
    };

    /**
    * 下一页
    *
    * @return {Boolean} 是否翻页成功
    */
    App.prototype.next = function () {
        //触发flipUp事件翻下一页
        app._$app.trigger('flipUp');
    };
    //显示页面
    App.prototype.showPage = function (valpage) {
        var theClass = this;
        //获取方法
        window._app_showPage ? window._app_showPage : window._app_showPage = function (valpage) {
            //找到要显示的页面
            var type = typeof (valpage);
            var $page;
            switch (type) {
                case 'number':
                    $page = this._$pages.eq(valpage);
                    break;
                case 'string':
                    $page = this._$pages.filter(valpage).first();
                    break;
                case 'object':
                    $page = $(valpage);
                    break;
            }
            //判断是否为第一次显示页面并且没带页面参数，则当前页面为第一个页面
            if (this._isFirstShowPage && (!$page || !$page.length)) {
                $page = this.$currentPage;
                this._isFirstShowPage = false;
            }
            //如果存在则显示当前页面
            if ($page && $page.length) {
                this._$pages.filter('.z-current').removeClass('z-current');
                $page.css('-webkit-transform', 'none').addClass('z-current');
                $page.trigger('current');
                this.$currentPage = $page;
            }
        };

        //如果初始化已完成
        if (this._isInitComplete) {
            //直接调用
            window._app_showPage.apply(theClass, this._$pages.eq(0));
        } else {
            window._app_showPage.apply(theClass, this._$pages.eq(0));
            //等加载完成后再调用
            //            $(window).one('load', function () {
            //                window._app_showPage.apply(theClass, [page]);
            //            });
        }
    };

    //禁用翻页
    App.prototype.disableFlipPage = function () {
        //设置禁止翻页变量值
        this._isDisableFlipPage = true;
    };

    //启用翻页
    App.prototype.enableFlipPage = function () {
        //设置禁止翻页变量值
        this._isDisableFlipPage = false;
    };

    //设置翻页模式（mode：0:禁用翻页、1:启用上下翻页、2:仅启用向上翻页、3:仅启用向下翻页）
    App.prototype.setFlipPageMode = function (mode) {
        if (typeof (mode) != 'number' || mode < 0 || mode > 3) {
            throw 'App.setFlipPageMode 方法调用错误：请提供以下正确的参数（0:禁用翻页、1:启用上下翻页、2:仅启用向上翻页、3:仅启用向下翻页）';
        }
        //设置禁止翻页相关变量值
        switch (mode) {
            case 0:
                this._isDisableFlipPage = true;
                this._isDisableFlipPrevPage = true;
                this._isDisableFlipNextPage = true;
                break;
            case 1:
                this._isDisableFlipPage = false;
                this._isDisableFlipPrevPage = false;
                this._isDisableFlipNextPage = false;
                break;
            case 2:
                this._isDisableFlipPage = false;
                this._isDisableFlipPrevPage = false;
                this._isDisableFlipNextPage = true;
                break;
            case 3:
                this._isDisableFlipPage = false;
                this._isDisableFlipPrevPage = true;
                this._isDisableFlipNextPage = false;
                break;
        }
    };


    var app = new App($('body'));

    module.exports = app;
});