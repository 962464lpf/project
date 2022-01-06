<template>
  <div class="recruit-file">
    <div class="header">
      <div class="back-btn">
        <el-button
          type="primary"
          icon="el-icon-back"
          @click="handleBack">返回
        </el-button>
      </div>
      <div class="pro-name">
        <span>{{ form.projectName }}</span>
      </div>
    </div>
    <div>
      <recruit-file-table :form="form"/>
    </div>
  </div>
</template>

<script>
import recruitFileTable from './childCom/recruitFileTable'
import {getProApprovalInfo} from "@/api/pro/proApprovalInfo";

export default {
  name: "recruitFile",
  data() {
    return {
      id: null,
      form: {}
    }
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getRecruitFile(this.id)
    }
  },
  components: {
    recruitFileTable
  },
  methods: {
    getRecruitFile(id) {
      getProApprovalInfo(id).then(({data}) => {
        this.form = data
      })
    },
    handleBack() {
      this.closeView('/proManagement/proImplement/proRecruit/recruitFile', '/proManagement/proImplement/proRecruit', 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.recruit-file {
  width: 100%;
  padding: 20px 30px 50px 30px;
  .header {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    .back-btn {
      width: 100%;
      display: flex;
      margin-bottom: 20px;
    }
    .pro-name {
      width: 100%;
      margin-bottom: 20px;
      span {
        font-size: 24px;
        font-weight: bold;
      }
    }
  }
}
</style>
