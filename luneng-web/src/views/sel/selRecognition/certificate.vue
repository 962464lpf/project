<template>
  <div class="certificate" ref="certificate" v-if="isLoad">
    <div class="certificate-item SimHei">
      <div class="logo">
        <img id="logoImg" :src="logoSrc" alt="">
      </div>
      <div class="left-text FangSong">
        为表彰在促进{{templateForm.unitName}}科学技术工作中作出重大贡献者，特颁发此证书，以资鼓励。
      </div>
    </div>

    <div class="white-box"></div>

    <div class="certificate-item">
      <div class="right-company SimHei">{{templateForm.unitName}}</div>
      <div class="award">{{selectDictLabel(awardsTypeOptions, form.awardsType)}}</div>
      <div class="zs SimHei">获奖证书</div>
      <div class="table-box">
        <table class=" FangSong">
          <tr>
            <td>项目名称：</td>
            <td>{{form.projectName}}</td>
          </tr>
          <tr>
            <td>奖励等级：</td>
            <td>{{selectDictLabel(awardOptions, form.reviewResult)}}</td>
          </tr>
          <tr>
            <td>获奖单位：</td>
            <td>{{form.mainUnit}}</td>
          </tr>
          <tr>
            <td style="letter-spacing: 5px;">获奖者：</td>
            <td>
              <span class="prize-winner" v-for="item in getPerson(form.mainPersons)">{{item}}</span>
            </td>
          </tr>
        </table>
      </div>
      <div class="watermark">
        <div class="watermark-text" style="letter-spacing: 4px;text-indent: 4px;">{{templateForm.unitName}}</div>
        <div class="watermark-date FangSong" style="letter-spacing: 1px;">{{dateFormat(form.certificateDate)}}</div>
        <img id="sealImg" class="cachet" :src="sealSrc" alt="">
      </div>
      <div class="serial-number FangSong">证书号：{{form.certificateCode}}</div>
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
      dateFormat(date) {
        const dateTem = new Date(date)
        const year = dateTem.getFullYear()
        const month = dateTem.getMonth() + 1
        const day = dateTem.getDate()
        return `${this.formatNumber(year)}年${this.formatNumber(month)}月${this.formatNumber(day)}日`
      },

      formatNumber(n) {
        n = n.toString()
        return n[1] ? n : `0${n}`
      }

      /*
      *
      * CNDateString(date) {
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
      }
      * */
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
    width: 1668px;
    padding: 20px;
    height: 1100px;
    box-sizing: border-box;
    color: #000000;
    font-weight: 700;
    display: flex;
    .white-box {
      width: 40px;
      height: 1090px;
    }
    .certificate-item {
      width: 794px;
      height: 1090px;
      background: url("../../../assets/image/certificate-bg.png");
      background-size: 794px 1090px;
      box-sizing: border-box;
      position: relative;
      .logo {
        position: static;
        text-align: center;
        width: 794px;
        box-sizing: border-box;
        padding: 200px 100px 110px 100px;
        & > img {
          width: 100%;
          height: auto;
        }
      }
      .left-text {
        width: 794px;
        box-sizing: border-box;
        padding: 20px 80px;
        font-size: 40px;
        line-height: 100px;
        text-indent: 90px;
        letter-spacing: 5px;
      }
      .right-company {
        width: 794px;
        box-sizing: border-box;
        padding: 110px 100px 30px 100px;
        text-align: center;
        font-size: 40px;
        line-height: 40px;
        letter-spacing: 4px;
      }
      .award {
        width: 794px;
        box-sizing: border-box;
        text-align: center;
        font-size: 34px;
        line-height: 34px;
        letter-spacing: 2px;
      }
      .zs {
        width: 794px;
        box-sizing: border-box;
        text-align: center;
        padding: 50px 50px 70px 50px;
        font-size: 64px;
        line-height: 64px;
        letter-spacing: 20px;
      }
      .table-box {
        width: 794px;
        box-sizing: border-box;
        padding: 0 70px 120px 70px;
        & > table {
          width: 100%;
          border-collapse: collapse;
          border-spacing: 0;
          td {
            height: 70px;
            line-height: 30px;
            font-size: 18px;
            font-family: FangSong;
            font-weight: 700;
            &:first-child {
              width: 100px;
            }
            .prize-winner {
              margin-right: 15px;
            }
          }
        }
      }
      .watermark {
        width: 794px;
        box-sizing: border-box;
        padding-right: 80px;
        text-align: right;
        font-size: 22px;
        line-height: 22px;
        font-weight: 700;
        position: relative;
        .watermark-text, .watermark-date {
          z-index: 10;
        }
        .watermark-date {
          margin-top: 70px;
          padding-right: 60px;
        }
        .cachet {
          width: 220px;
          position: absolute;
          top: 47%;
          right: 0;
          transform: translate(-50%, -50%);
          margin-top: 5px;
        }
      }
      .serial-number {
        width: 794px;
        box-sizing: border-box;
        position: absolute;
        bottom: 50px;
        left: 70px;
      }
    }
  }
</style>
