<template>
  <div class="plan-base-info">
    <table class="pdf-show-table tc">
      <tr>
        <td colspan="2" style="width: 150px">项目名称</td>
        <td colspan="7">
          <el-input v-model="approvalInfo.projectName" placeholder="" @blur="submitForm" maxlength="30"/>
        </td>
      </tr>
      <tr>
        <td rowspan="2">项目</td>
        <td style="width: 160px">总经费</td>
        <td colspan="3" style="width: 120px">
          <m-input v-model="planInfo.totalAmount" placeholder="" @blur="submitPlanInfoForm" inputType="yuan"/>
        </td>
        <td style="width: 160px">实施期限</td>
        <td colspan="3">
          <el-date-picker
            clearable
            v-model="implPeriodTem"
            type="monthrange"
            range-separator="至"
            start-placeholder="请选择起始时间"
            end-placeholder="请选择完成时间"
            @change="submitPlanInfoForm"
            value-format="yyyy-MM">
          </el-date-picker>
        </td>
      </tr>
      <tr>
        <td>主要承担单位</td>
        <td colspan="4">
          <el-input v-model="approvalInfo.undertakeUnit" placeholder="" @blur="submitForm" maxlength="20"/>
        </td>
        <td style="width: 160px">承担单位数</td>
        <td colspan="2">
          <m-input v-model="planInfo.unitCount" placeholder="" @blur="submitPlanInfoForm" maxlength="2"
                   inputType="number"/>
        </td>
      </tr>
      <tr>
        <td rowspan="2">项目负责人</td>
        <td style="width: 100px">姓名</td>
        <td colspan="2" style="width: 200px">
          <el-input v-model="planInfo.personName" placeholder="" @blur="submitPlanInfoForm" maxlength="10"/>
        </td>
        <td style="width: 100px">单位</td>
        <td colspan="4">
          <el-input v-model="planInfo.personUnit" placeholder="" @blur="submitPlanInfoForm" maxlength="20"/>
        </td>
      </tr>
      <tr>
        <td>性别</td>
        <td>
          <el-select
            v-model="planInfo.personSex"
            @change="submitPlanInfoForm"
            style="width: 100px"
            placeholder="请选择性别">
            <el-option
              v-for="dict in genderOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue">
            </el-option>
          </el-select>
        </td>
        <td>年龄</td>
        <td>
          <m-input v-model="planInfo.personAge" placeholder="" @blur="submitPlanInfoForm" maxlength="3"
                   inputType="number"/>
        </td>
        <td>专业</td>
        <td>
          <el-input v-model="planInfo.personMajor" placeholder="" @blur="submitPlanInfoForm" maxlength="10"/>
        </td>
        <td>职称</td>
        <td>
          <el-input v-model="planInfo.personTitle" placeholder="" @blur="submitPlanInfoForm" maxlength="10"/>
        </td>
      </tr>
      <tr>
        <td rowspan="2">研究人员</td>
        <td>总人数</td>
        <td colspan="2">高级职称</td>
        <td colspan="2">中级职称</td>
        <td colspan="2">初级职称</td>
        <td>研究生</td>
      </tr>
      <tr>
        <td>
          <m-input v-model="planInfo.countTotal" placeholder="" @blur="submitPlanInfoForm"
                   maxlength="4" inputType="number"/>
        </td>
        <td colspan="2">
          <m-input v-model="planInfo.countSeniorTitle" placeholder="" @blur="submitPlanInfoForm" maxlength="4"
                   inputType="number"/>
        </td>
        <td colspan="2">
          <m-input v-model="planInfo.countMidTitle" placeholder="" @blur="submitPlanInfoForm" maxlength="4"
                   inputType="number"/>
        </td>
        <td colspan="2">
          <m-input v-model="planInfo.countJuniorTitle" placeholder="" @blur="submitPlanInfoForm" maxlength="4"
                   inputType="number"/>
        </td>
        <td>
          <m-input v-model="planInfo.countPostgraduate" placeholder="" @blur="submitPlanInfoForm" maxlength="4"
                   inputType="number"/>
        </td>
      </tr>
      <tr>
        <td rowspan="3">承担单位</td>
        <td>序号</td>
        <td colspan="5">承担单位</td>
        <td colspan="2">经费(万元)</td>
      </tr>
      <tr>
        <td>1</td>
        <td colspan="5">
          <el-input v-model="planInfo.mainUnit" placeholder="" @blur="submitPlanInfoForm" maxlength="30"/>
        </td>
        <td colspan="2">
          <m-input v-model="planInfo.mainAmount" placeholder="" @blur="submitPlanInfoForm" inputType="wanYuan"/>
        </td>
      </tr>
      <tr>
        <td>2</td>
        <td colspan="5">
          <el-input v-model="planInfo.otherUnit" placeholder="" @blur="submitPlanInfoForm" maxlength="30"/>
        </td>
        <td colspan="2">
          <m-input v-model="planInfo.otherAmount" placeholder="" @blur="submitPlanInfoForm" inputType="wanYuan"/>
        </td>
      </tr>
      <tr>
        <td rowspan="3">出资单位</td>
        <td>序号</td>
        <td colspan="5">出资单位</td>
        <td colspan="2">经费(万元)</td>
      </tr>
      <tr>
        <td>1</td>
        <td colspan="5">
          <el-input v-model="planInfo.mainUnit2" placeholder="" @blur="submitPlanInfoForm" maxlength="30"/>
        </td>
        <td colspan="2">
          <m-input v-model="planInfo.mainAmount2" placeholder="" @blur="submitPlanInfoForm" inputType="wanYuan"/>
        </td>
      </tr>
      <tr>
        <td>2</td>
        <td colspan="5">
          <el-input v-model="planInfo.otherUnit2" placeholder="" @blur="submitPlanInfoForm" maxlength="30"/>
        </td>
        <td colspan="2">
          <m-input v-model="planInfo.otherAmount2" placeholder="" @blur="submitPlanInfoForm" inputType="wanYuan"/>
        </td>
      </tr>
      <tr>
        <td rowspan="6">课题设置</td>
        <td>序号</td>
        <td colspan="4">课题名称</td>
        <td>负责人</td>
        <td colspan="2">单位</td>
      </tr>
      <tr v-for="(item, index) in planTopics" :key="index">
        <td>{{index + 1}}</td>
        <td colspan="4">
          <el-input v-model="item.topicName" placeholder="" @blur="submitPlanTopicsForm(item)" maxlength="30"/>
        </td>
        <td>
          <el-input v-model="item.topicPerson" placeholder="" @blur="submitPlanTopicsForm(item)" maxlength="10"/>
        </td>
        <td colspan="2">
          <el-input v-model="item.topicUnit" placeholder="" @blur="submitPlanTopicsForm(item)" maxlength="20"/>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  import {updateEstablishmentPlan} from "@/api/pro/proApprovalInfo";

  export default {
    name: "planBaseInfo",
    props: {
      value: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        approvalInfoForm: {
          updateType: 0
        },
        planInfoForm: {
          updateType: 0
        },
        planTopicsForm: {
          updateType: 0
        },
        approvalInfo: {},
        planInfo: {},
        planTopics: [],
        genderOptions: [],
        implPeriodTem: []
      }
    },
    created() {
      //性别
      this.getDicts("sys_user_sex").then(response => {
        this.genderOptions = response.data;
      })
    },
    computed: {
      userName() {
        return this.$store.state.user.name
      }
    },
    watch: {
      value(newVal) {
        this.approvalInfo = newVal.approvalInfo
        this.planInfo = newVal.planInfo
        if (this.planInfo.implPeriod) {
          this.implPeriodTem = JSON.parse(this.planInfo.implPeriod)
        }
        this.planInfo.personName = this.approvalInfo.headName
        // if (this.planInfo.countTotal == 0) {
        //   this.planInfo.countTotal = ''
        // }
        // if (this.planInfo.countSeniorTitle == 0) {
        //   this.planInfo.countSeniorTitle = ''
        // }
        // if (this.planInfo.countMidTitle == 0) {
        //   this.planInfo.countMidTitle = ''
        // }
        // if (this.planInfo.countJuniorTitle == 0) {
        //   this.planInfo.countJuniorTitle = ''
        // }
        // if (this.planInfo.countPostgraduate == 0) {
        //   this.planInfo.countPostgraduate = ''
        // }
        this.planTopics = newVal.planTopics
      }
    },
    methods: {
      submitForm() {
        if (!this.approvalInfo.projectName) {
          return this.msgError('项目名称不能为空')
        }
        this.approvalInfoForm.approvalInfo = this.approvalInfo
        updateEstablishmentPlan(this.approvalInfoForm).then(() => {
          this.planInfo.mainUnit = this.approvalInfo.undertakeUnit;
        })
      },
      submitPlanInfoForm() {
        if (this.implPeriodTem) {
          let implPeriod = [...this.implPeriodTem]
          this.planInfo.implPeriod = JSON.stringify(implPeriod)
        } else {
          this.planInfo.implPeriod = "";
        }
        // this.planInfo.countTotal = this.countStudyTotal(this.planInfo)
        this.planInfoForm.planInfo = this.planInfo
        updateEstablishmentPlan(this.planInfoForm).then(() => {
          this.approvalInfo.undertakeUnit = this.planInfo.mainUnit;
        })
      },
      submitPlanTopicsForm(item) {
        let planTopicsTem = []
        planTopicsTem.push(item)
        this.planTopicsForm.planTopics = JSON.stringify(planTopicsTem)
        updateEstablishmentPlan(this.planTopicsForm).then(() => {
        })
      },
      //计算研究人员总人数
      // countStudyTotal({countSeniorTitle, countMidTitle, countJuniorTitle, countPostgraduate}) {
      //   return (countSeniorTitle * 1 + countMidTitle * 1 + countJuniorTitle * 1 + countPostgraduate * 1)
      // }
    }
  }
</script>

<style lang="scss" scoped>
  .plan-base-info {
    width: 100%;
  }
</style>
