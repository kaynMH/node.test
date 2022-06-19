// 请求 url - > html（信息）  -> 解析html
const https = require('https');
const cheerio = require('cheerio');
const fs = require('fs');


https.get('~~',function(res){
    // console.log(res);
    // 分段返回的 自己拼接
    let html = '';
    // 有数据产生的时候 拼接
    res.on('data',function(chunk){
        html += chunk;
    })
    // 拼接完成
    res.on('end',function(){
        // console.log(html);
        const $ = cheerio.load(html);
        let pics = [];
        $('.pic img').each(function(){
            const pic = $(this).attr('src');
            // 存 数据库
            pics.push({
                pic
            })
        })
        console.log(pics)
        // 把数组写入json里面
        fs.writeFile('./text/json/pics4.json', JSON.stringify(pics),function(err){
            if(!err){
                console.log('文件写入完毕');
            }
        })
        // 图片下载一下
        downloadImage(pics);
    })
})

function downloadImage(pics) {
    // console.log("gewuqegquieti")
    for(let i=0; i<pics.length; i++){
        const picUrl = pics[i].pic;
        // 请求 -> 拿到内容
        // fs.writeFile('./xx.png','内容')
        https.get(picUrl,function(res){
            res.setEncoding('binary');
            let str = '';
            res.on('data',function(chunk){
                str += chunk;
            })
            res.on('end',function(){
                fs.writeFile(`./image1/${i}.png`,str,'binary',function(err){
                  if(err){
                     return console.log('写入文件失败！'+err.message)
                  }
                  console.log('写文件成功！')
                })
            })
        })
    }
}