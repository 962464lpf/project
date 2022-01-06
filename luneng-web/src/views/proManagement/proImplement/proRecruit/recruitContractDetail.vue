<template>
  <div class="recruit-contract-detail">
    <div class="back-btn">
      <el-button
        type="primary"
        icon="el-icon-back"
        @click="handleBack">返回
      </el-button>
    </div>
    <recruit-contract-info-detail
      v-for="(item, index) in recruitContractInfoList"
      :key="index"
      :pro-contract-info="item"
    />
  </div>
</template>

<script>
import recruitContractInfoDetail from './childCom/recruitContractInfoDetail'
import {getContractInfo} from "@/api/pro/proRecruit";

export default {
  name: "recruitContractDetail",
  data() {
    return {
      recruitContractInfoList: []
    }
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id * 1
      this.getContractInfoDetail(this.id)
    }
  },
  components: {
    recruitContractInfoDetail
  },
  methods: {
    //获取招采合同信息
    getContractInfoDetail(id) {
      getContractInfo(id).then(({data}) => {
        this.recruitContractInfoList = data
      })
    },
    handleBack() {
      this.closeView('/proManagement/proImplement/proRecruit/recruitContractDetail', '/proManagement/proImplement/proRecruit', 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.recruit-contract-detail {
  width: 100%;
  padding: 20px 30px 50px 30px;
  display: flex;
  flex-direction: column;
  .back-btn {
    width: 100%;
    display: flex;
    margin-bottom: 20px;
  }
}

</style>
