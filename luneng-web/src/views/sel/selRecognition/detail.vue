<template>
  <div class="app-container">
    <el-row class="mb10">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-back"

          @click="handleBack"
        >返回</el-button>
      </el-col>
    </el-row>
    <iframe v-if="form.certificateUrl" :src="form.certificateUrl" frameborder="0" style="width: 100%;height: calc(100vh - 170px);"></iframe>
  </div>
</template>

<script>
import { getReviewResultScoreInfo } from "@/api/sel/selDeclareReviewResult";

export default {
  name: 'detail',
  data () {
    return {
      form: {}
    }
  },
  created() {
    this.init();
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      const id = this.$route.query.id;
      getReviewResultScoreInfo(id).then(response => {
        this.form = response.data.declareReviewResult;
      })
    },
    /** 返回 */
    handleBack() {
      let path = "/sel/selRecognition";
      this.$router.push({"path": path})
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
        line-height: 60px;
        font-size: 16px;
        &:first-child {
          width: 100px;
        }
        .prize-winner {
          margin-right: 4px;
        }
      }
    }
    .watermark {
      display: inline-block;
      text-align: center;
      font-size: 16px;
      line-height: 20px;
      margin-top: 10px;
      margin-right: 5px;
      position: relative;
      .watermark-date {
        margin-top: 12px;
      }
      .cachet {
        width: 220px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: -1;
        margin-top: 5px;
      }
    }
    .logo {
      text-align: center;
      padding: 100px 0 55px;
      img {
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
