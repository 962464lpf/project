<template>
  <div class="implement-plan-detail">
    <div class="pro-name">
      <span v-if="playPlanObj.projectName">{{playPlanObj.projectName}}</span>
    </div>
    <table class="pdf-show-table tc" style="border-bottom: 0">
      <tr>
        <td style="width: 200px; color: #666; background-color: #f8f8f9;"></td>
        <td style="width: 335px; color: #666; background-color: #f8f8f9;">起止时间</td>
        <td style="width: 400px; color: #666; background-color: #f8f8f9;">研究内容</td>
        <td style="color: #666; background-color: #f8f8f9;">阶段成果</td>
      </tr>
    </table>
    <table
      v-if="planTopics.length > 0"
      class="pdf-show-table tc"
      style="border-top: 0; border-bottom: 0"
      v-for="(item, index) in planTopics"
      :key="index">
      <tr
        v-for="(subItem, subIndex) in item.playPlans"
        :key="subIndex">
        <td
          rowspan="5"
          v-if="subIndex === 0"
          style="width: 200px">
          <span>{{item.topicName}}</span>
        </td>
        <td style="width: 335px">
          <span>{{subItem.topicPeriod | timeFormatter}}</span>
        </td>
        <td style="width: 400px">
          <span>{{subItem.topicContent}}</span>
        </td>
        <td>
          <div
            class="plan-results-box"
            v-if="subItem.planResults!=null"
            v-for="(subItem2, subIndex2) in subItem.planResults"
            :key="subIndex2">
            <div class="plan-results-box-item">
              {{subIndex2 + 1}}
            </div>
            <div class="plan-results-box-item2">
              <span>
                {{ selectDictLabel(resultTypeOptions, subItem2.resultType) }}
              </span>
            </div>
            <div class="plan-results-box-item3">
              <span>{{subItem2.resultName}}</span>
            </div>
          </div>
          <div
            class="plan-results-box"
            v-if="subItem.hisPlanResults!=null"
            v-for="(subItem2, subIndex2) in subItem.hisPlanResults"
            :key="subIndex2">
            <div class="plan-results-box-item">
              {{subIndex2 + 1}}
            </div>
            <div class="plan-results-box-item2">
              <span>
                {{ selectDictLabel(resultTypeOptions, subItem2.resultType) }}
              </span>
            </div>
            <div class="plan-results-box-item3">
              <span>{{subItem2.resultName}}</span>
            </div>
          </div>
        </td>
      </tr>
    </table>
    <table
      v-if="planTopics.length === 0"
      class="pdf-show-table tc"
      style="border-top: 0; border-bottom: 0">
      <tr>
        <td>
          <span>暂无数据</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import {selectPlayPlanDetail, selectPlayPlanKXB} from "@/api/pro/proLaunch";

export default {
  name: "implementPlanDetail",
  props: {
    infoId: {
      type: Number,
      default: null
    },
    isAuditStatus: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      playPlanObj: {},
      planTopics: [],
      resultTypeOptions: [],
    }
  },
  created() {
    if (this.isAuditStatus === 0) {
      this.getPlayPlanDetail(this.infoId)
    } else {
      this.getPlayPlanDetailKXB(this.infoId)
    }
    this.getDicts("pro_result_type").then(response => {
      this.resultTypeOptions = response.data;
    });
  },
  filters: {
    timeFormatter(value) {
      if (value) {
        let valueArr = JSON.parse(value)
        return valueArr[0] + ' - ' + valueArr[1]
      } else {
        return '--'
      }
    }
  },
  methods: {
    //获取实施计划详情
    getPlayPlanDetail(id) {
      selectPlayPlanDetail(id).then(({data}) => {
        this.playPlanObj = data
        this.planTopics = []
        data.planTopics.forEach(item => {
          if (item.topicName) {
            this.planTopics.push(item)
          }
        })
      })
    },
    //科信部获取实施计划详情审核
    getPlayPlanDetailKXB(id) {
      selectPlayPlanKXB(id).then(({data}) => {
        this.playPlanObj = data
        this.planTopics = data.planTopics
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.implement-plan-detail {
  width: 100%;
  display: flex;
  flex-direction: column;
  .pro-name {
    width: 100%;
    margin-bottom: 20px;
    span {
      font-size: 24px;
      font-weight: bold;
    }
  }
  .pdf-show-table {
    table-layout: fixed;
    font-size: 18px;
    color: #000;
    margin: 0;
  }
  .plan-results-box {
    width: 100%;
    display: flex;
    margin-bottom: 10px;
    align-items: center;
    .plan-results-box-item {
      width: 10%;
    }
    .plan-results-box-item2 {
      width: 40%;
    }
    .plan-results-box-item3 {
      width: 50%;
      word-break: break-all;
    }
  }
}
</style>
