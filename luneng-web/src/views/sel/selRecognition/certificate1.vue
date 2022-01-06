<template>
  <div class="certificate" ref="certificate" v-if="isLoad">
    <div class="certificate-item tc SimHei">
      <div class="logo">
        <img id="logoImg" :src="logoSrc" alt="">
      </div>
      <div>
        <div class="company" style="letter-spacing: 14px;text-indent: 10px;">{{templateForm.unitName}}有限公司</div>
        <div class="company" style="letter-spacing: 4px;">都城伟业集团有限公司</div>
        <div class="award" style="letter-spacing: 4px;">{{selectDictLabel(awardsTypeOptions, form.awardsType)}}</div>
        <div class="zs">证书</div>
      </div>
    </div>
    <div class="certificate-item">
      <div class="serial-number FangSong">证书编号：{{form.certificateCode}}</div>
      <div class="text FangSong" style="letter-spacing: 2px;">为表彰{{templateForm.unitName}}（都城伟业集团）有限公司科学技术奖获得者，特颁发此证书。</div>
      <table class="FangSong">
        <tr>
          <td>项目名称：</td>
          <td>{{form.projectName}}</td>
        </tr>
        <tr>
          <td>获奖等级：</td>
          <td>{{selectDictLabel(awardOptions, form.reviewResult)}}</td>
        </tr>
        <tr>
          <td>获奖单位：</td>
          <td>{{form.mainUnit}}</td>
        </tr>
        <tr>
          <td style="letter-spacing: 5px;">获奖者：</td>
          <td>
<!--            {{getPerson(form.mainPersons)}}-->
            <span class="prize-winner" v-for="item in getPerson(form.mainPersons)">{{item}}</span>
          </td>
        </tr>
        <tr>
          <td>奖励年度：</td>
          <td style="letter-spacing: 1px;">{{form.declareYear}}年</td>
        </tr>
      </table>
      <div class="tr">
        <div class="watermark">
          <div class="watermark-text" style="letter-spacing: 4px;text-indent: 4px;">{{templateForm.unitName}}有限公司</div>
          <div class="watermark-text">都城伟业集团有限公司</div>
          <div class="watermark-date FangSong" style="letter-spacing: 1px;">{{CNDateString(form.certificateDate)}}</div>
          <img id="sealImg" class="cachet" :src="sealSrc" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { listSysTemplate } from "@/api/system/sysTemplate";
  export default {
    name: 'certificate',
    props: {
      value: {
        default: {}
      }
    },
    data() {
      return {
        form: {},
        templateForm: {},
        // 奖项类别字典
        awardsTypeOptions: [],
        // 获奖等级字典
        awardOptions: [],
        logoSrc: '/images/logo.jpg',
        sealSrc: '/images/cachet.png',
        isLoad: false
      }
    },
    created() {
      this.form = this.value;
      this.init();
      this.getDicts("award_type").then(response => {
        this.awardsTypeOptions = response.data;
      });
      this.getDicts("sys_sel_award").then(response => {
        this.awardOptions = response.data;
      });
    },
    methods: {
      init() {
        listSysTemplate({
          searchType: 1
        }).then(response => {
          this.isLoad = true;
          if(response.rows.length == 0) return;
          this.templateForm = response.rows[0];
          if(this.templateForm.logoFilePaths) this.logoSrc = JSON.parse(this.templateForm.logoFilePaths)[0].url;
          if(this.templateForm.sealFilePaths) this.sealSrc = JSON.parse(this.templateForm.sealFilePaths)[0].url;
          // let logoImg = document.getElementById('logoImg');
          // let sealImg = document.getElementById('sealImg');
          // this.getImgBase64(this.logoSrc).then(res => {
          //   logoImg.src = res;
          // })
          // this.getImgBase64(this.sealSrc).then(res => {
          //   sealImg.src = res;
          // })
        })
      },
      image2Base64(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL;
      },
      getImgBase64(src) {
        return new Promise((resolve, reject) => {
          var base64 = "" ;
          var img = new Image();
          img.setAttribute('crossOrigin', 'anonymous');
          img.src = src;
          img.onload = () => {
            base64 = this.image2Base64(img);
            resolve(base64);
          }
        })
      },
      getPerson(person) {
        if(!person) return
        return person.split('，');
      },
      CNDateString(date) {
        if(!date) return
        date = new Date(date);
        var cn = ["〇","一","二","三","四","五","六","七","八","九"];
        var s = [];
        var YY = date.getFullYear().toString();
        for (var i=0; i<YY.length; i++)
          if (cn[YY.charAt(i)])
            s.push(cn[YY.charAt(i)]);
          else
            s.push(YY.charAt(i));
        s.push("年");
        var MM = date.getMonth()+1;
        if (MM<10) {
          s.push(cn[MM]);
        } else if (MM<20) {
          if (MM% 10 == 0) {
            s.push("十");
          } else {
            s.push("十" + cn[MM% 10]);
          }
        }
        s.push("月");
        var DD = date.getDate();
        if (DD<10) {
          s.push(cn[DD]);
        } else if (DD<20) {
          if (DD% 10 == 0) {
            s.push("十");
          } else {
            s.push("十" + cn[DD% 10]);
          }
        } else if (DD<30) {
          if (DD% 10 == 0) {
            s.push("二十");
          } else {
            s.push("二十" + cn[DD% 10]);
          }
        } else {
          if (DD% 10 == 0) {
            s.push("三十");
          } else {
            s.push("三十" + cn[DD% 10]);
          }
        }
        s.push("日");
        return s.join('');
      },
    },
    watch: {
      value(newVal) {
        this.form = newVal;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tc {
    text-align: center;
  }
  .tr {
    text-align: right;
  }
  .FangSong {
    font-family: FangSong;
  }
  .SimHei {
    font-family: SimHei;
  }
  .KaiTi {
    font-family: KaiTi;
  }
  .certificate {
    -moz-user-select:none; /* Firefox私有属性 */
    -webkit-user-select:none; /* WebKit内核私有属性 */
    -ms-user-select:none; /* IE私有属性(IE10及以后) */
    -khtml-user-select:none; /* KHTML内核私有属性 */
    -o-user-select:none; /* Opera私有属性 */
    user-select:none; /* CSS3属性 */
    width: 1000px;
    height: 707px;
    box-sizing: border-box;
    color: #000000;
    background: url("../../../assets/image/certificate-bg.png");
    background-size: cover;
    font-weight: 700;
    .certificate-item {
      width: 50%;
      float: left;
      &:nth-child(2) {
         padding-left: 46px;
         padding-right: 50px;
       }
      .company {
        font-size: 30px;
        line-height: 30px;
        margin-bottom: 10px;
      }
      .award {
        font-size: 34px;
        line-height: 34px;
        padding: 10px 0 38px;
      }
      .zs {
        font-size: 64px;
        line-height: 64px;
      }
    }

    .serial-number {
      margin: 64px 0 50px;
      font-size: 14px;
      line-height: 14px;
      font-width: 400;
    }
    .text {
      font-size: 20px;
      line-height: 36px;
      text-indent: 2em;
      padding-left: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      /*font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;*/
      td {
        height: 60px;
        line-height: 30px;
        font-size: 16px;
        &:first-child {
           width: 100px;
         }
        .prize-winner {
          margin-right: 15px;
        }
      }
    }
    .watermark {
      display: inline-block;
      text-align: center;
      font-size: 16px;
      line-height: 20px;
      margin-top: 10px;
      margin-right: 15px;
      position: relative;
      .watermark-text, .watermark-date {
        position: relative;
        z-index: 10;
      }
      .watermark-date {
        margin-top: 12px;
      }
      .cachet {
        width: 220px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin-top: 5px;
      }
    }
    .logo {
      position: static;
      text-align: center;
      padding: 100px 0 55px;
      img, .img-box {
        display: inline-block;
        width: 200px;
        height: 200px;
      }
    }
  }
  .certificate /deep/ .el-form-item {
    margin-bottom: 0;
  }
</style>
