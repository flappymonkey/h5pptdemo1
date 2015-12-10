/* 
*  字符串工具模块
* ----------------------------------
*  作者：Charles
*  时间：2014-05-05
*  准则：CMD 规范
*  联系：1415384560（qq）
************************************************************/

define(function (require, exports, module) {

    //stringUtil模块
    var stringUtil = {
        //获取字符串字节长度
        getBytesLength: function (str) {
            var cArr = str.match(/[^\x00-\xff]/ig);
            return str.length + (cArr == null ? 0 : cArr.length);
        }
    };

    //输出模块
    module.exports = stringUtil;
});