<template>
  <div class="plan-cover">
    <span>国家电网公司总部科技项目任务书</span>
    <el-form-item prop="projectName" label="项目名称:" label-width="120px">
      <el-input v-model="approvalInfo.projectName" placeholder="" @blur="submitForm" maxlength="30" />
    </el-form-item>
    <el-form-item prop="undertakeUnit" label="主要承担单位:" label-width="120px">
      <el-input v-model="approvalInfo.undertakeUnit" placeholder="" @blur="submitForm" maxlength="20" />
    </el-form-item>
    <el-form-item prop="projectNameCn" label="主要出资单位:" label-width="120px">
      <el-input v-model="planInfo.mainUnit2" placeholder="" @blur="submitPlanInfoForm" maxlength="20" />
    </el-form-item>
    <el-form-item prop="dateRange" label="起止时间:" label-width="120px">
      <el-date-picker
        clearable
        v-model="dateRange"
        type="monthrange"
        range-separator="至"
        start-placeholder="请选择起始时间"
        end-placeholder="请选择完成时间"
        @change="submitForm"
        value-format="yyyy-MM">
      </el-date-picker>
    </el-form-item>
  </div>
</template>

<script>

import {saveProOptLog, updateEstablishmentPlan} from "@/api/pro/proApprovalInfo";

export default {
  name: "planCover",
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  created() {

  },
  data() {
    return {
      approvalInfoForm: {
        updateType: 0
      },
      planInfoForm: {
        updateType: 0
      },
      approvalInfo: {},
      planInfo: {},
      dateRange: []
    }
  },
  computed: {
    userName() {
      return this.$store.state.user.name
    }
  },
  watch: {
    value (newVal) {
      this.approvalInfo = newVal.approvalInfo
      this.planInfo = newVal.planInfo
      if(this.approvalInfo.proBeginDate && this.approvalInfo.proEndDate) {
        //const proBeginDate = this.parseTime(this.approvalInfo.proBeginDate, '{y}-{m}')
        //const proEndDate = this.parseTime(this.approvalInfo.proEndDate, '{y}-{m}')
        this.dateRange = [this.approvalInfo.proBeginDate, this.approvalInfo.proEndDate];
      }
      // if (!this.planInfo.mainUnit2) {
      //   this.planInfo.mainUnit2 = this.approvalInfo.undertakeUnit
      // }
    }
  },
  methods: {
    submitForm() {
      if (this.approvalInfoForm.updateType === 0) {
        if (!this.approvalInfo.projectName) {
          return this.msgError('项目名称不能为空')
        }
        if (this.dateRange && this.dateRange.length > 0) {
          this.approvalInfo.proBeginDate = this.dateRange[0]
          this.approvalInfo.proEndDate = this.dateRange[1]
        }
        this.approvalInfoForm.approvalInfo = this.approvalInfo
        updateEstablishmentPlan(this.approvalInfoForm).then(()=>{
          saveProOptLog({
            infoId: this.approvalInfo.id,
            operName: '编辑了计划书的封面',
            operUserName: this.userName
          }).then(() => {})
        })
      }
    },
    submitPlanInfoForm() {
      if (this.planInfoForm.updateType === 0) {
        this.planInfoForm.planInfo = this.planInfo
        updateEstablishmentPlan(this.planInfoForm).then(()=>{
          saveProOptLog({
            infoId: this.approvalInfo.id,
            operName: '编辑了计划书的基本信息',
            operUserName: this.userName
          }).then(() => {})
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.plan-cover {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 6% 29%;
  span {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 30px;
    align-self: center;
  }
}
</style>
