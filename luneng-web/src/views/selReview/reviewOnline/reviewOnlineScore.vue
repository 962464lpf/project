<template>
  <div class="app-container">
    <div class="header">
      <div class="titles-box">
        <span>项目名称</span>
        <span>{{declareInfo.projectName2}}</span>
      </div>
      <div class="titles-box">
        <span>单位名称</span>
        <span>{{declareInfo.mainUnits2}}</span>
      </div>
      <div class="titles-box">
        <span>奖项类别</span>
        <span>{{selectDictLabel(decRewardOptions, declareInfo.awardsType)}}</span>
      </div>
    </div>
    <div class="table-box">
      <el-form
        :model="scoreForm"
        ref="scoreForm">
        <table class="proj-table">
          <tr>
            <td rowspan="11" style="width: 100px">指标类型</td>
            <td style="min-width: 100px">序号</td>
            <td style="min-width: 170px">评分指标</td>
            <td style="min-width: 250px">参考元素</td>
            <td style="min-width: 370px" colspan="3">评分等级</td>
            <td style="min-width: 130px">得分</td>
          </tr>
          <tr>
            <td rowspan="2">1</td>
            <td rowspan="2">创新程度</td>
            <td rowspan="2">{{ innovationText }}</td>
            <td>较高</td>
            <td>一般</td>
            <td>较弱</td>
            <td rowspan="2">
              <el-form-item prop="innovationScore" style="margin-bottom: 0">
                <el-input-number
                  v-model="scoreForm.innovationScore"
                  :precision="2"
                  style="width: 100%;"
                  :min="3"
                  :max="10"
                  @change="sum"
                  placeholder="请打分"/>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>10-8</td>
            <td>7-5</td>
            <td>5-3</td>
          </tr>
          <tr>
            <td rowspan="2">2</td>
            <td rowspan="2">知识产权情况</td>
            <td rowspan="2">研究或实施的专业性、难易程度</td>
            <td>2个以上</td>
            <td>1个</td>
            <td>无</td>
            <td rowspan="2">
              <el-form-item prop="technologyScore" style="margin-bottom: 0">
                <el-input-number
                  style="width: 100%;"
                  v-model="scoreForm.technologyScore"
                  :min="3"
                  :max="10"
                  :precision="2"
                  @change="sum"
                  placeholder="请打分"/>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>10</td>
            <td>5</td>
            <td>3</td>
          </tr>
          <tr>
            <td rowspan="2">3</td>
            <td rowspan="2">难易或复杂程度</td>
            <td rowspan="2">{{ complexText }}</td>
            <td>很难</td>
            <td>一般</td>
            <td>简单</td>
            <td rowspan="2">
              <el-form-item prop="complexScore" style="margin-bottom: 0">
                <el-input-number
                  v-model="scoreForm.complexScore"
                  style="width: 100%;"
                  :min="3"
                  :max="10"
                  :precision="2"
                  @change="sum"
                  placeholder="请打分"/>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>10-8</td>
            <td>7-5</td>
            <td>5-3</td>
          </tr>
          <tr>
            <td rowspan="2">4</td>
            <td rowspan="2">应用情况及经济效益</td>
            <td rowspan="2">{{ benefitsText }}</td>
            <td>很大</td>
            <td>中等</td>
            <td>一般</td>
            <td rowspan="2">
              <el-form-item prop="benefitsScore" style="margin-bottom: 0">
                <el-input-number
                  v-model="scoreForm.benefitsScore"
                  style="width: 100%;"
                  :min="3"
                  :max="10"
                  :precision="2"
                  @change="sum"
                  placeholder="请打分"/>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>10-8</td>
            <td>7-5</td>
            <td>5-3</td>
          </tr>
          <tr>
            <td rowspan="2">5</td>
            <td rowspan="2">可推广应用性</td>
            <td rowspan="2">是否具有推广、示范、转化的价值</td>
            <td>建议推广</td>
            <td>待完善后</td>
            <td>无推广价值</td>
            <td rowspan="2">
              <el-form-item prop="generalizationScore" style="margin-bottom: 0">
                <el-input-number
                  v-model="scoreForm.generalizationScore"
                  style="width: 100%;"
                  :min="3"
                  :max="10"
                  :precision="2"
                  @change="sum"
                  placeholder="请打分"/>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>10-8</td>
            <td>7-5</td>
            <td>5-3</td>
          </tr>
          <tr>
            <td>合计</td>
            <td colspan="6">总计</td>
            <td>
              <el-form-item prop="countScore" style="margin-bottom: 0">
                <el-input-number
                  v-model="scoreForm.countScore"
                  style="width: 100%;"
                  disabled
                  placeholder="请打分"/>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td style="height: 160px">评审意见</td>
            <td colspan="7">
              <el-form-item prop="remark" style="margin-bottom: 0">
                <el-input
                  type="textarea"
                  :rows="6"
                  placeholder="请填写评审意见，字数不超过100"
                  maxlength="100"
                  show-word-limit
                  v-model="scoreForm.remark"
                  style="width: 100%;"/>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>
    <div class="use-desc-box">
      <span>评分表使用说明:</span>
      <span>1.评审打分采用不记名方式，请根据项目汇报和介绍资料情况打分，每项目一份。</span>
      <span>2.本表的评分指标共分5类(序号1-5)，每指标打分分为三个区间等级，各专业评审专家在认真审查材料的同时，进行定量或定性评价，每项最高10分，最低3分，多者作废，少者则按漏评指标最低级处理。</span>
      <span>3.各专业评审专家要根据自己的评审意见，在每项指标后的"得分"栏目中，填相应分数，打分结束后保存，并在评审界面点击提交即可完成评审。</span>
    </div>
    <div class="opt-btns">
      <el-button type="primary" @click="confirmScore">提 交</el-button>
      <el-button @click="cancelScore">取 消</el-button>
    </div>

    <!-- 单个评审结束弹窗提示 -->
    <el-dialog
      :title="singleReviewDialog.title"
      :visible.sync="singleReviewDialog.open"
      width="420px"
      append-to-body :close-on-click-modal="false">
      <div style="text-align: center">
        <span>该项目评审已结束，不可再打分</span>
      </div>
    </el-dialog>
    <!-- 全部评审结束弹窗提示 -->
    <el-dialog
      :title="allReviewDialog.title"
      :visible.sync="allReviewDialog.open"
      @close="closeAllReview"
      width="550px"
      append-to-body :close-on-click-modal="false">
      <div>
        <div style="text-align: center;color: #333;font-size: 18px;margin-bottom: 20px">
          <span>{{declareInfo.declareYear}}年{{ decRewardFormatter }}评审评分汇总{{'('+ industryTypeFormatter+ '产业)'}}</span>
        </div>
        <div style="text-align: center">
          <el-table
            ref="table"
            height="250"
            :data="scoreSumTable">
            <el-table-column
              min-width="80"
              label="序号"
              align="center"
              type="index"/>
            <el-table-column
              min-width="230"
              label="项目名称"
              align="center"
              prop="projectName"/>
            <el-table-column
              min-width="230"
              label="申报单位"
              align="center"
              prop="declareUnit"/>
            <el-table-column
              min-width="120"
              label="评审得分"
              align="center"
              prop="score"/>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {saveScore} from '@/api/selReview/review'
  import {getSelDeclareInfo} from '@/api/sel/selDeclareInfo'
  import {listSelDeclareReviewResult} from "@/api/sel/selDeclareReviewResult";

  export default {
    name: '',
    data() {
      return {
        scoreForm: {},
        declareInfo: {},
        decRewardOptions: [],
        //单个评审结束弹窗
        singleReviewDialog: {
          title: "提示",
          open: false
        },
        //全部评审状态
        allReviewDialog: {
          title: "评分汇总",
          open: false
        },
        //评审汇总
        scoreSumTable: [],
        //字典
        awardsTypeOptions: [],
        industryTypeOptions: [],

        innovationText: `
          1.项目自身创新先进性\n
          2.国内外技术对比先进性`,
        complexText: `
          1.研究成果情况\n
          2.已获奖励情况`,
        benefitsText: `
          1.是否已应用验证\n
          2.经济效益是否客观`
      }
    },
    created() {
      if (this.$route.query.infoId) {
        this.infoId = this.$route.query.infoId * 1
      }
      this.getDeclareInfo()
      //申报奖项字典
      this.getDicts("dec_reward_type").then(response => {
        this.decRewardOptions = response.data;
      });
      this.getDicts("industry_type").then(response => {
        this.industryTypeOptions = response.data;
      });
      this.getDicts("award_type").then(response => {
        this.awardsTypeOptions = response.data;
      });
    },
    computed: {
      webSocketMessage() {
        return this.$store.state.user.webSocketMessage
      },
      decRewardFormatter() {
        return this.selectDictLabel(this.awardsTypeOptions, this.declareInfo.awardsType)
      },
      industryTypeFormatter() {
        return this.selectDictLabel(this.industryTypeOptions, this.declareInfo.industryType)
      }
    },

    watch: {
      webSocketMessage(newValue, oldValue) {
        if(newValue && newValue.data != null) {
          const dataTem = JSON.parse(newValue.data)
          if (dataTem.key === 'declare_end') {
            if (dataTem.value == '1') { //单个评审结束
              if (dataTem.data.indexOf(this.infoId) !== -1) {
                this.singleReviewDialog.open = true
                setTimeout(() => {
                  this.singleReviewDialog.open = false
                  this.closeView("/selReview/reviewOnline/rewardReview/reviewOnlineScore", "/selReview/reviewOnline", 0)
                }, 3000)
              }
            } else if (dataTem.value == '2') {
              if (dataTem.data.indexOf(this.infoId) !== -1) {
                listSelDeclareReviewResult({
                  pageNum: 1,
                  industryType: this.declareInfo.industryType,
                  awardsType: this.declareInfo.awardsType
                }).then(response => {
                  this.allReviewDialog.open = true
                  this.scoreSumTable = response.rows
                  console.log(response.rows)
                });
              }
            }
          }
        }
      }
    },

    mounted() {
      this.scoreForm.expertId = this.$route.query.expertId;
      this.scoreForm.infoId = this.$route.query.infoId;
      this.scoreForm.status = 1;
      console.log(this.scoreForm)
    },

    methods: {
      /*********************** 数据获取及处理 ***********************/
      //获取项目补充资料信息
      getDeclareInfo() {
        const infoId = this.$route.query.infoId
        getSelDeclareInfo(infoId).then(res => {
          this.declareInfo = res.data;
          console.log(this.declareInfo)
        })
      },
      //重置表单
      reset() {

      },
      //关闭全部评审弹窗
      closeAllReview() {
        this.closeView("/selReview/reviewOnline/rewardReview/reviewOnlineScore", "/selReview/reviewOnline", 0)
      },

      /*********************** 交互操作 ****************************/
      //提交打分表单
      confirmScore() {
        this.$confirm('提交后打分将不可修改，请确认是否提交？', "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          saveScore(this.scoreForm).then(res => {
            if (res.code == 200) {
              this.msgSuccess(res.msg);
              this.closeView("/selReview/reviewOnline/rewardReview/reviewOnlineScore", "/selReview/reviewOnline")
            } else {
              this.msgError(res.msg);
            }
          })
        })
      },
      //取消打分
      cancelScore() {
        this.closeView("/selReview/reviewOnline/rewardReview/reviewOnlineScore", "/selReview/reviewOnline/rewardReview?expertId=" + this.$route.query.expertId + "&infoId=" + this.$route.query.infoId)
      },
      sum() {
        this.scoreForm.countScore = 0;
        if (this.scoreForm.innovationScore) {
          this.scoreForm.countScore += this.scoreForm.innovationScore;
        }
        if (this.scoreForm.technologyScore) {
          this.scoreForm.countScore += this.scoreForm.technologyScore;
        }
        if (this.scoreForm.complexScore) {
          this.scoreForm.countScore += this.scoreForm.complexScore;
        }
        if (this.scoreForm.benefitsScore) {
          this.scoreForm.countScore += this.scoreForm.benefitsScore;
        }
        if (this.scoreForm.generalizationScore) {
          this.scoreForm.countScore += this.scoreForm.generalizationScore;
        }
        console.log(this.scoreForm)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-container {
    width: 100%;
    padding: 20px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .header {
      width: 100%;
      display: flex;
      flex-direction: column;
      font-size: 18px;
      color: #606266;

      .titles-box {
        display: flex;

        span:nth-child(1) {
          margin-right: 20px;
          margin-bottom: 15px;
        }
      }
    }

    .table-box {
      width: 100%;

      .proj-table {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        color: #606266;
        font-size: 18px;
        line-height: 20px;
        table-layout: fixed;

        td {
          border: 1px solid #E6E9F0;
          padding: 15px 10px;
          word-wrap: break-word;
          text-align: center;
          white-space: pre-line;
        }
      }
    }

    .use-desc-box {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      margin-bottom: 30px;

      span {
        font-size: 16px;
        color: #ff0000;
        margin-bottom: 5px;
      }
    }

    .opt-btns {
      width: 20%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
  }
</style>
