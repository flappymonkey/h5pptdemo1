/* 
*  轻App程序入口
* ----------------------------------
*  作者：1415384560
*  联系：1415384560（qq）
************************************************************/

define(function (require, exports, module) {
    //初始化App模块
    window.app = require('modules/app/main');
    require('modules/mask/main').init();
    require('modules/link/main').init();
    require('modules/index/deviceor').init();
});