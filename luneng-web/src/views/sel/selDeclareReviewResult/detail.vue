<template>
  <div class="app-container">
    <el-button
      type="primary"
      style="margin-bottom: 15px;"
      @click="handleBack"
    >返回
    </el-button>
    <div v-if="awardsType === 1">
      <dec-project-com
        topBoxType="标题"
        :currId="currId"
        :currInfoId="infoId"
        :showScoreInfo="true"
        :showScoreInfoAll="true">
      </dec-project-com>
    </div>
    <div v-else>
      <dec-project-com
        topBoxType="标题"
        :currId="currId"
        :currInfoId="infoId"
        :showTabs="false">
      </dec-project-com>
    </div>
  </div>
</template>

<script>
import DecProjectCom from '@/views/components/DecProjectCom'

export default {
  name: "",
  data() {
    return {
      //当前申报项目id
      currId: null,
      //当前项目信息id
      infoId: null,
      //奖项类型
      awardsType: null
    };
  },
  created() {
    if (this.$route.query.id) {
      this.currId = this.$route.query.id * 1
    }
    if (this.$route.query.infoId) {
      this.infoId = this.$route.query.infoId * 1
    }
    if (this.$route.query.awardsType) {
      this.awardsType = this.$route.query.awardsType * 1
    }
  },
  components: {
    DecProjectCom
  },
  methods: {
    /** 返回 */
    handleBack() {
      this.closeView(this.$route.path, "/sel/selDeclareReviewResult", 0)
    }
  }
};
</script>
<style lang="scss" scoped>
  .app-container {
    width: 100%;
    padding:20px 40px 50px 20px;
  }
</style>
