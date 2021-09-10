var express = require('express');
const { render } = require('../app');
var router = express.Router();

const fs=require('fs');

/* GET currentTime of audio and response subtitle. */
router.post('/', function(req, res, next) {
    //当前音频时间
    const currentTime=req.body.curTime.replace(/[l|n]/,'');
    const snInfo=req.body.curTime.match(/[l|n]/g);
    var subInfo=[];

    //fs.readFileSync同步不用回调
    const content=fs.readFileSync('./public/CoolLearning/speech/2019年12月第二套.srt','utf-8');
    var subArray=parseSrtSubtitles(content);
    subInfo=readSubtitle(subArray);
    // fs.writeFile('./public/CoolLearning/speech/srt.txt',JSON.stringify(subArray),err=>{
    //     console.log(err);
    // })
   if(subInfo!==undefined)
    res.send(subInfo);
    else
    res.send('');
    //处理字幕文件
        //algorithm idea from http://qtdebug.com/fe-srt/
        /**
         * 把 SRT 格式的字幕文件解析为字幕的对象数组，格式为:
         * [
         *      {sn: "0", startTime: 0.89, endTime: 7.89, content: "这里是一系列与Hadoop↵有关的其他开源项目："},
         *      {sn: "1", startTime: 8.38, endTime: 14.85, content: "Eclipse是一个IBM贡献到开源社区里的集成开发环境（IDE）。"}
         * ]
         *
         * @param  string srt 字幕文件的内容
         * @return 字幕的对象数组
         */
    function parseSrtSubtitles(srt) {
        var subtitles = [];
        var textSubtitles = srt.split('\n\n'); // 每条字幕的信息，包含了序号，时间，字幕内容

        for (var i = 0; i < textSubtitles.length; ++i) {
            var textSubtitle = textSubtitles[i].split('\n');

            if (textSubtitle.length >= 2) {
                var sn = textSubtitle[0]; // 字幕的序号
                var subtitleTime=textSubtitle[1].trim();
                var startTime = toSeconds(subtitleTime.split(' --> ')[0]); // 字幕的开始时间
                var endTime   = toSeconds(subtitleTime.split(' --> ')[1]); // 字幕的结束时间
                var ch=textSubtitle[2];
                var en=textSubtitle[3];

                // 字幕对象
                var subtitle = {
                    sn: sn,
                    startTime: startTime,
                    endTime: endTime,
                    ch:ch,
                    en:en
                };

                subtitles.push(subtitle);
            }
        }

        return subtitles;
    }//end of parseSubtitles

    /**
     * 把字符串格式的字幕时间转换为浮点数
     *
     * @param  string t 字符串格式的时间
     * @return 浮点数格式的时间
     */
    function toSeconds(t) {
        var s =Number();

        if (t) {
            var p = t.split(':');
            for (i = 0; i < p.length; i++) {
                s = s * 60 + parseFloat(p[i].replace(',','.'));
            }
        }

        return s;
    }//end of toSeconds
    function readSubtitle(data){
        var subtitle=[];
        for(let i=0;i<data.length;i++){
            if((currentTime>data[i].startTime)&&(currentTime<data[i].endTime)){
                if(snInfo=='l'&&(data[i].sn!==0)){
                    //上一句
                    subtitle=data[i-1];
                }else if(snInfo=='n'&&(data[i].sn!==data.length)){
                    //下一句
                    subtitle=data[i+1];
                }
                else{
                    subtitle=data[i];
                }
                break;
            }
        }  //end of for loop  
        
        return subtitle
    }//end of readSubtitle
});

module.exports = router;
