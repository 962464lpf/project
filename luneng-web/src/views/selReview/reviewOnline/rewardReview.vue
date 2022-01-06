<template>
  <div class="app-container">
    <div class="header">
      <el-button
        type="primary"
        @click="navReviewScore">开始打分
      </el-button>
      <el-button
        type="primary"
        @click="avoidScore">回 避
      </el-button>
      <span style="color: red">{{topTipText}}</span>
    </div>
    <dec-project-com
      :showHeader="false"
      topBoxType="标题"
      :currInfoId="infoId"
      :currExpertId="currExpertId"
      @sendDeclareInfo="getDeclareInfo">
    </dec-project-com>

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
            v-loading="loading"
            :data="scoreSumTable">
            <el-table-column
              min-width="60"
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
              min-width="120px"
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
  import DecProjectCom from '@/views/components/DecProjectCom'
  import {listSelDeclareReviewResult} from "@/api/sel/selDeclareReviewResult";

  export default {
    name: '',
    data() {
      return {
        //加载等待
        loading: false,
        topTipText: '评选项目若为本单位项目，请点击回避，不计入总分',
        //当前申报项目id
        infoId: null,
        //当前申报项目专家id
        currExpertId: null,
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

        declareInfo: {},
        //字典
        awardsTypeOptions: [],
        industryTypeOptions: []
      }
    },

    created() {
      if (this.$route.query.infoId) {
        this.infoId = this.$route.query.infoId * 1
      }
      if (this.$route.query.expertId) {
        this.currExpertId = this.$route.query.expertId * 1
      }

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
            if (dataTem.value === '1') { //单个评审结束
              if (dataTem.data.indexOf(this.infoId) !== -1) {
                this.singleReviewDialog.open = true
                setTimeout(() => {
                  this.singleReviewDialog.open = false
                  this.closeView("/selReview/reviewOnline/rewardReview", "/selReview/reviewOnline", 0)
                }, 3000)
              }
            } else if (dataTem.value === '2') {
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

    components: {
      DecProjectCom
    },

    methods: {
      /******************* 获取及处理数据 *******************/
      //获取申报信息
      getDeclareInfo(data) {
        this.declareInfo = data
      },

      /******************* 交互操作 *******************/
      //跳转打分页面(id)
      navReviewScore() {
        this.closeView("/selReview/reviewOnline/rewardReview", "/selReview/reviewOnline/rewardReview/reviewOnlineScore?expertId=" + this.currExpertId + "&infoId=" + this.infoId, 0)
      },
      //回避打分
      avoidScore() {
        this.$confirm('是否确认回避?', "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          const scoreInfo = {
            infoId: this.infoId,
            expertId: this.currExpertId,
            status: 0
          }
          return saveScore(scoreInfo);
        }).then(res => {
          if (res.code == 200) {
            this.closeView("/selReview/reviewOnline/rewardReview", "/selReview/reviewOnline", 400);
          } else {
            this.msgError(res.message);
          }
        })
      },
      //关闭全部评审弹窗
      closeAllReview() {
        this.allReviewDialog.open = false
        this.closeView("/selReview/reviewOnline/rewardReview", "/selReview/reviewOnline", 0)
      }

    }
  }
</script>

<style lang="scss" scoped>
  .app-container {
    width: 100%;
    padding: 20px 40px;

    .header {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;

      span {
        font-size: 16px;
        color: #c0c4cc;
        margin-left: 5px;
      }
    }
  }
</style>
