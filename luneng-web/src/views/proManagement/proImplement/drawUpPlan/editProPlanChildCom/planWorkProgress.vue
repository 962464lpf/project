<template>
  <div class="plan-work-progress">
    <div>
      <h3>(一)项目进度计划</h3>
      <table class="pdf-show-table tc">
        <tr>
          <td>序号</td>
          <td>课题名称</td>
          <td>起止时间</td>
        </tr>
        <tr v-if="planTopics.length > 0" v-for="(item, index) of planTopics" :key="index">
          <td style="width: 100px">{{ index + 1 }}</td>
          <td>
            <el-input v-model="item.topicName" placeholder="" @blur="submitPlanTopicsForm(item)" maxlength="30"/>
          </td>
          <td style="width: 300px">
            <el-date-picker
              clearable
              v-model="item.topicPeriod"
              type="monthrange"
              range-separator="至"
              start-placeholder="请选择起始时间"
              end-placeholder="请选择完成时间"
              :picker-options="timePickerOptions"
              @change="submitPlanTopicsForm(item)"
              value-format="yyyy-MM">
            </el-date-picker>
          </td>
        </tr>
        <tr v-if="planTopics.length === 0">
          <td colspan="3">您暂未设置课题</td>
        </tr>
      </table>
    </div>
    <div>
      <h3>(二)课题进度计划及考核要求</h3>
      <table class="pdf-show-table tc" style="border-bottom: 0">
        <tr>
          <td style="width: 100px"></td>
          <td style="width: 335px">起止时间</td>
          <td>研究内容</td>
          <td>考核指标</td>
        </tr>
      </table>
      <table
        class="pdf-show-table tc"
        v-if="planTopics.length > 0"
        v-for="(item, index) of planTopics"
        :key="index"
        style="border-top: 0; border-bottom: 0">
        <tr v-for="(subItem, subIndex) of item.planTopicContents" :key="subIndex">
          <td
            rowspan="5"
            v-if="subIndex === 0"
            style="width: 100px; word-break: break-all">
            {{ item.topicName }}
          </td>
          <td style="width: 335px">
            <el-date-picker
              clearable
              v-model="subItem.topicPeriod"
              type="monthrange"
              range-separator="至"
              start-placeholder="请选择起始时间"
              end-placeholder="请选择完成时间"
              @focus="pickerTimeInput(item)"
              :picker-options="timePickerOptions2"
              @change="submitPlanTopicsForm1(subItem)"
              value-format="yyyy-MM">
            </el-date-picker>
          </td>
          <td>
            <el-input type="textarea" :rows="2" v-model="subItem.topicContent" placeholder=""
                      @blur="submitPlanTopicsForm1(subItem)" maxlength="200"/>
          </td>
          <td>
            <el-input type="textarea" :rows="2" v-model="subItem.topicLevel" placeholder=""
                      @blur="submitPlanTopicsForm1(subItem)" maxlength="100"/>
          </td>
        </tr>
      </table>
      <table v-if="planTopics.length === 0" class="pdf-show-table tc" style="border-bottom: 0">
        <tr>
          <td colspan="4">您暂未设置课题</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import {updateEstablishmentPlan} from "@/api/pro/proApprovalInfo";

  export default {
    name: "planWorkProgress",
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
        planTopicsForm: {
          updateType: 0
        },
        planTopics: [],
        approvalInfo: {},
        timePickerOptions2: {}
      }
    },
    computed: {
      userName() {
        return this.$store.state.user.name
      },
      timePickerOptions() {
        // const proBeginDate = new Date(this.approvalInfo.proBeginDate + '-1').getTime()
        const proEndDate = new Date(this.approvalInfo.proEndDate + '-1').getTime()
        return {
          disabledDate(date) {
            return date.getTime() > proEndDate
          }
        }
      }
    },
    watch: {
      value(newVal) {
        this.approvalInfo = newVal.approvalInfo
        this.planTopics = []
        newVal.planTopics.forEach(item => {
          if (item.topicName || item.topicPerson || item.topicUnit) {
            if (item.topicPeriod) {
              item.topicPeriod = JSON.parse(item.topicPeriod)
            }
            item.planTopicContents.forEach(subItem => {
              if (subItem.topicPeriod) {
                subItem.topicPeriod = JSON.parse(subItem.topicPeriod)
              }
            })
          }
        })
        this.planTopics = newVal.planTopics
      }
    },
    methods: {
      submitPlanTopicsForm(item) {
        let planTopicsTem = []
        if (item.topicPeriod) {
          item.topicPeriod = JSON.stringify(item.topicPeriod)
        } else {
          item.topicPeriod = "";
        }
        planTopicsTem.push(item)
        this.planTopicsForm.planTopics = JSON.stringify(planTopicsTem)
        console.log(item);
        updateEstablishmentPlan(this.planTopicsForm).then(() => {
          item.topicPeriod = JSON.parse(item.topicPeriod)
        })
      },
      submitPlanTopicsForm1(subItem) {
        console.log(subItem);
        let planTopicContentsTem = []
        if (subItem.topicPeriod) {
          subItem.topicPeriod = JSON.stringify(subItem.topicPeriod)
        } else {
          subItem.topicPeriod = "";
        }
        planTopicContentsTem.push(subItem)
        this.planTopicsForm.planTopicContents = JSON.stringify(planTopicContentsTem)
        console.log(this.planTopicsForm);
        updateEstablishmentPlan(this.planTopicsForm).then(() => {
          subItem.topicPeriod = JSON.parse(subItem.topicPeriod)
        })
      },
      pickerTimeInput(item) {
        const topicPeriodEnd = item.topicPeriod[1]
        const topicPeriodEndTem = new Date(topicPeriodEnd + '-1').getTime()
        this.timePickerOptions2 = {
          disabledDate(date) {
            return date.getTime() > topicPeriodEndTem
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
