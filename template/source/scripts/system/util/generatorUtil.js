/* 
 *  数据生成器工具模块
 * ----------------------------------
 *  作者：Charles
 *  时间：2014-05-05
 *  准则：CMD 规范
 *  联系：1103547917（qq）
 ************************************************************/
 
define(function(require, exports, module){

	var incrementList = {};

	//generatorUtil模块
	var generatorUtil = {
		//获取自动增量值
		getIncrement : function (key) {
			if(!incrementList[key]){
				incrementList[key] = 0;
			}
			return incrementList[key] ++;
		}
	};

	//输出模块
	module.exports = generatorUtil;	
});