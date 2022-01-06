// 导出页面为PDF格式
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// // 引入pdf.js
// const s = document.createElement('script');
// s.type = 'text/javascript';
// s.src = '/js/pdf.js';
// document.body.appendChild(s);

export function exportPdf(elementId, pdfName, callback, crosswise) {
  var ele = document.getElementById(elementId);
  window.scrollTo(0, 0);
  let eleW = ele.offsetWidth;// 获得该容器的宽
  let eleH = ele.offsetHeight;// 获得该容器的高
  let eleOffsetTop = ele.offsetTop;  // 获得该容器到文档顶部的距离
  let eleOffsetLeft = ele.offsetLeft; // 获得该容器到文档最左的距离
  let scaleBy = 3;
  var canvas = document.createElement("canvas");
  var abs = 0;

  let win_in = document.documentElement.clientWidth || document.body.clientWidth; // 获得当前可视窗口的宽度（不包含滚动条）
  let win_out = window.innerWidth; // 获得当前窗口的宽度（包含滚动条）

  if (win_out > win_in) {
    // abs = (win_o - win_i)/2;    // 获得滚动条长度的一半
    abs = (win_out - win_in) / 2;    // 获得滚动条宽度的一半
    // console.log(a, '新abs');
  }
  canvas.width = eleW * scaleBy;    // 将画布宽&&高放大两倍
  canvas.height = eleH * scaleBy;

  var context = canvas.getContext("2d");

  context.scale(scaleBy, scaleBy);
  context.translate(-eleOffsetLeft - abs, -eleOffsetTop);
  // 这里默认横向没有滚动条的情况，因为offset.left(),有无滚动条的时候存在差值，因此
  // translate的时候，要把这个差值去掉
  html2canvas(ele, {
    dpi: 300,
    scale: scaleBy,
    // height: canvas.height,
    // width: canvas.width,
    // allowTaint: true,  //允许 canvas 污染， allowTaint参数要去掉，否则是无法通过toDataURL导出canvas数据的
    useCORS: true  //允许canvas画布内 可以跨域请求外部链接图片, 允许跨域请求。
  }).then((canvas) => {
    let width = 595.28;
    let height = 841.89;
    if(crosswise) {
      width = 841.89;
      height = 595.28;
    }

    var contentWidth = canvas.width;
    var contentHeight = canvas.height;
    //一页pdf显示html页面生成的canvas高度;
    var pageHeight = contentWidth / width * height;
    //未生成pdf的html页面高度
    var leftHeight = contentHeight;
    //页面偏移
    var position = 0;
    //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
    var imgWidth = width;
    // var imgWidth = 595.28 - 80*2;
    var imgHeight = imgWidth / contentWidth * contentHeight;
    // imgWidth = parseFloat(parseFloat(imgWidth).toFixed(2));
    // imgHeight = parseFloat(parseFloat(imgHeight).toFixed(2));
    var pageData = canvas.toDataURL('image/JPEG', 1);

    var pdf = new jsPDF(crosswise ? 'l' : '', 'pt', 'a4');
    //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
    //当内容未超过pdf一页显示的范围，无需分页
    // console.log('处理完画布高度：'+ contentHeight)
    // console.log('每页高度：'+ pageHeight)
    if (leftHeight < pageHeight) {
      //在pdf.addImage(pageData, 'JPEG', 左，上，宽度，高度)设置在pdf中显5示；
      pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
      // pdf.addImage(pageData, 'JPEG', 20, 40, imgWidth, imgHeight);
    } else {    // 分页
      while (leftHeight > 10) {
        pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
        leftHeight -= pageHeight;
        position -= height;
        //避免添加空白页
        if (leftHeight > 10) {
          pdf.addPage();
        }
      }
    }
    //可动态生成
    if(callback) {
      var datauri = pdf.output('dataurlstring');
      //去掉前面的字符串后，就是文件的加密字符串
      var base64 = datauri.substring(28);
      callback(base64)
    } else {
      pdf.save(pdfName);
    }
  })
}


// import PDFJS from 'pdfjs-dist'
// PDFJS.disableWorker = true
// let PDFJS = require('pdfjs-dist');
// PDFJS.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker');
export function pdfToImg(url, imgId) {
  // var url = '/js/pd.pdf';
  // PDFJS.GlobalWorkerOptions.workerSrc = 'http://www.anpengcheng.top/hot-dog/pdf.worker.js';
  // PDFJS.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.min');
  PDFJS.workerSrc  = '/js/pdf.worker.js'
  PDFJS.getDocument(url).then((pdf) => {
    let pages = pdf.numPages;
    let pageDom = document.getElementById(imgId)
    for(let i = 1; i <= 16; i++) {
      pdf.getPage(i).then((page) => {
        var scale = 1;
        var canvas = document.createElement("canvas");
        var viewport = page.getViewport(scale);
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        var renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext);
      })
    }
  });
}
