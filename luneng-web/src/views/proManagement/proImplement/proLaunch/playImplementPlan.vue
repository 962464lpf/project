<template>
  <div class="play-implement-plan">
    <div class="header">
      <div class="pro-name">
        <span v-if="playPlanObj.projectName">{{playPlanObj.projectName}}</span>
      </div>
      <div class="opt-btn">
        <el-button
          type="primary"
          :disabled="planTopics.length === 0"
          @click="submitPlan">{{this.$route.query.playPlanStatus!=null? '提交' : '确定'}}
        </el-button>
        <el-button
          type="primary"
          @click="backPage">取消
        </el-button>
      </div>
    </div>
    <div class="main">
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
            <el-date-picker
              v-model="subItem.topicPeriod"
              :picker-options="timePickerOptions"
              @change="handleTimeRange(subItem.topicPeriod)"
              clearable
              style="width: 300px"
              type="daterange"
              range-separator="至"
              start-placeholder="请选择起始时间"
              end-placeholder="请选择完成时间"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </td>
          <td style="width: 400px">
            <el-input
              type="textarea"
              :rows="4"
              v-model="subItem.topicContent"
              placeholder=""
              maxlength="200"
            />
          </td>
          <td>
            <div
              class="plan-results-box"
              v-for="(subItem2, subIndex2) in subItem.planResults"
              :key="subIndex2">
              <div class="plan-results-box-item">
                <el-button
                  type="primary"
                  @click="deletePlanResult(subItem.planResults, subIndex2)"
                  icon="el-icon-minus">
                </el-button>
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
            <el-popover
              placement="bottom"
              width="400"
              trigger="click">
              <el-row type="flex" justify="center" :gutter="20">
                <el-col :span="5" style="display: flex;align-items: center">
                  <el-button
                    type="primary"
                    @click="addPlanResult(subItem, subItem.planResults)"
                    icon="el-icon-plus">
                  </el-button>
                </el-col>
                <el-col  :span="10" style="display: flex;align-items: center">
                  <el-select
                    v-model="form.resultType"
                    placeholder="请选择成果类型"
                    clearable>
                    <el-option
                      v-for="item in resultTypeOptions"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"/>
                  </el-select>
                </el-col>
                <el-col :span="9" style="display: flex;align-items: center">
                  <el-input
                    type="textarea"
                    :rows="2"
                    v-model="form.resultName"
                    placeholder="请输入名称"
                    maxlength="20"
                  />
                </el-col>
              </el-row>
              <el-button slot="reference"  type="primary" icon="el-icon-plus"></el-button>
            </el-popover>
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
  </div>
</template>

<script>
import {selectPlayPlanDeclare, updateLaunchPlayPlan} from "@/api/pro/proLaunch";
import {getProApprovalInfo} from "@/api/pro/proApprovalInfo";
import dayJs from 'dayjs'

export default {
  name: "playImplementPlan",
  data() {
    return {
      id: null,
      playPlanObj: {},
      planTopics: [],
      resultTypeOptions: [],
      form: {
        resultType: null,
        resultName: null
      },
      proDetailFlag: null,
      tabActiveName: null,
      playPlanStatus: null,
      proApprovalInfo: {}
    }
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.queryPlayPlanDeclare(this.id)
      this.getProInfo(this.id)
      this.getDicts("pro_result_type").then(response => {
        this.resultTypeOptions = response.data;
      });
    }
    if (this.$route.query.proDetailFlag) {
      this.proDetailFlag = this.$route.query.proDetailFlag
    }
    if (this.$route.query.tabActiveName) {
      this.tabActiveName = this.$route.query.tabActiveName
    }
    if (this.$route.query.playPlanStatus) {
      this.playPlanStatus = this.$route.query.playPlanStatus
    }
  },
  computed: {
    timePickerOptions() {
      const proEndDateTem = dayJs(this.proApprovalInfo.proEndDate).add(1, 'month')
      const proEndDate = dayJs(proEndDateTem).valueOf()
      return {
        disabledDate(date) {
          return date.getTime() > proEndDate
        }
      }
    }
  },
  methods: {
    getProInfo(id) {
      getProApprovalInfo(id).then(({data}) => {
        this.proApprovalInfo = data;
      })
    },
    //申报查询实施计划
    queryPlayPlanDeclare(id) {
      selectPlayPlanDeclare(id).then(({data}) => {
        this.playPlanObj = data
        let planTopicsTem = []
        data.planTopics.forEach(item => {
          if (item.topicName) {
            item.playPlans.forEach(subItem => {
              subItem.topicPeriod = JSON.parse(subItem.topicPeriod)
            })
            planTopicsTem.push(item)
          }
        })
        this.planTopics = planTopicsTem
      })
    },
    //处理时间选择限制三个月之内
    handleTimeRange(value) {
      let beginTime = value[0]
      let endTime = value[1]
      const beginTimeTem = dayJs(beginTime).add(3, "month").valueOf()
      const endTimeTem = dayJs(endTime).valueOf()
      if (beginTimeTem < endTimeTem) {
        this.msgError('起始时间之差不能超过三个月')
        value.splice(0, 2)
      }
    },
    //增加阶段成果文件
    addPlanResult(subItem, planResults) {
      if (this.form.resultType && this.form.resultName) {
        const objTem = {
          infoId: subItem.infoId,
          planId: subItem.id,
          resultType: this.form.resultType,
          resultName: this.form.resultName
        }
        planResults.push(objTem)
        this.form.resultType = null
        this.form.resultName = null
      } else {
        this.msgError('请先输入增加的内容')
      }
    },
    //删除阶段成果文件
    deletePlanResult(planResults, subIndex2) {
      planResults.splice(subIndex2, 1)
    },
    //提交实施计划
    submitPlan() {
      const planTopicsTem = this.planTopics
      let isUpdate = 0
      if (this.$route.query.playPlanStatus == 1 || this.$route.query.playPlanStatus == 2) {//同意时编辑或不同意时编辑，编辑状态isUpdate都为1，初始化后的编辑，编辑状态isUpdate为0
        isUpdate = 1
      }
      const playPlansObj = {
        planTopics: planTopicsTem,
        isUpdate: isUpdate
      }
      updateLaunchPlayPlan(playPlansObj).then(() => {
        this.msgSuccess('提交成功')
        if (this.proDetailFlag) {
          this.closeView("/proManagement/proImplement/proLaunch/playImplementPlan", "/proManagement/proImplement/proEstablish/proMainTask?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag + '&tabActiveName=' + this.tabActiveName, 0)
        } else {
          this.closeView("/proManagement/proImplement/proLaunch/playImplementPlan", "/proManagement/proImplement/proLaunch", 0)
        }
      })
    },
    //取消
    backPage() {
      if (this.proDetailFlag) {
        this.closeView("/proManagement/proImplement/proLaunch/playImplementPlan", "/proManagement/proImplement/proEstablish/proMainTask?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag + '&tabActiveName=' + this.tabActiveName, 0)
      } else {
        this.closeView("/proManagement/proImplement/proLaunch/playImplementPlan", "/proManagement/proImplement/proLaunch", 0)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.play-implement-plan {
  width: 100%;
  padding: 20px 30px 50px 30px;
  display: flex;
  flex-direction: column;
  .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
    .pro-name {
      width: 70%;
      span {
        font-size: 24px;
        font-weight: bold;
      }
    }
    .opt-btn {
      width: 30%;
      height: 30px;
      display: flex;
      justify-content: flex-end;
    }
  }
  .main {
    width: 100%;
    display: flex;
    flex-direction: column;
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
      .plan-results-box-item{
        width: 20%;
      }
      .plan-results-box-item2{
        width: 40%;
      }
      .plan-results-box-item3{
        width: 40%;
        word-break: break-all;
      }
    }
  }
}
</style>
