<template>
  <div class="play-plan-detail">
    <div class="header">
      <el-row>
        <el-col>
          <el-button
            type="primary"
            @click="backPage">返回
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="main">
      <implement-plan-detail :info-id="id"/>
    </div>
  </div>
</template>

<script>
import implementPlanDetail from './childCom/implementPlanDetail'

export default {
  name: "playPlanDetailDeclare",
  data() {
    return {
      proDetailFlag: null,
      tabActiveName: null,
      id: null
    }
  },
  created() {
    if (this.$route.query.proDetailFlag) {
      this.proDetailFlag = this.$route.query.proDetailFlag
    }
    if (this.$route.query.tabActiveName) {
      this.tabActiveName = this.$route.query.tabActiveName
    }
    if (this.$route.query.id) {
      this.id = this.$route.query.id * 1
    }
  },
  components: {
    implementPlanDetail
  },
  methods: {
    //返回
    backPage() {
      if (this.proDetailFlag) {
        this.closeView("/proManagement/proImplement/proLaunch/playPlanDetailDeclare", "/proManagement/proImplement/proEstablish/proMainTask?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag + '&tabActiveName=' + this.tabActiveName, 0)
      } else {
        this.closeView("/proManagement/proImplement/proLaunch/playPlanDetailDeclare", "/proManagement/proImplement/proLaunch", 0)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.play-plan-detail {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 30px 50px 30px;
  .header {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }
  .main {
    width: 100%;
    margin: 20px 0;
  }
}
</style>
