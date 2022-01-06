<template>
  <div class="app-container">
    <div class="header">
      <div class="backBtn">
        <el-button
          type="primary"
          @click="handleBack">返回
        </el-button>
      </div>
      <span v-if="form.industryType && form.awardsType">{{totalTitle + ' '}}专家签到表</span>
      <span v-if="form.uploadUser && form.uploadTime">{{form.uploadUser +' '}}上传于{{' ' + form.uploadTime}}</span>
    </div>
    <div class="main">
      <iframe
        v-if="form.filePaths"
        :src="signFilePath"
        frameborder="0"
        style="width: 100%;height: calc(100vh - 170px);">
      </iframe>
    </div>
  </div>
</template>

<script>
  import { getExpertReview } from "@/api/expert/expertReview"
  export default {
    name: '',
    data () {
      return {
        form: {},
        industryTypeOptions: [],
        decRewardOptions: []
      }
    },
    created() {
      this.init()
      //产业类别字典
      this.getDicts("industry_type").then(response => {
        this.industryTypeOptions = response.data;
      });
      //申报奖项字典
      this.getDicts("dec_reward_type").then(response => {
          this.decRewardOptions = response.data;
      });
    },
    activated() {
      this.init()
    },
    computed: {
      signFilePath() {
        return JSON.parse(this.form.filePaths)[0].url
      },
      totalTitle() {
        return this.selectDictLabel(this.industryTypeOptions, this.form.industryType) + ' ' + this.selectDictLabel(this.decRewardOptions, this.form.awardsType)
      }
    },
    methods: {
      init() {
        const id = this.$route.query.id
        getExpertReview(id).then(response => {
          this.form = response.data
        });
      },

      //返回
      handleBack() {
        this.closeView("/sel/expertReview/expertSignDetail", "/sel/expertReview", 0)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-container {
    width: 100%;
    padding: 30px 30px 50px 30px;
    .header {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
      .backBtn {
        margin-bottom: 20px;
      }
      span:nth-of-type(1) {
        font-size: 24px;
        font-weight: bold;
        color: #333;
        margin-bottom: 20px;
      }
      span:nth-of-type(2) {
        font-size: 16px;
        color: #666;
      }
    }
    .main {
      width: 100%;
    }
  }
</style>
