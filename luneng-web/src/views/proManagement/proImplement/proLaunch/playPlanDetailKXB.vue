<template>
  <div class="play-plan-detail-kxb">
    <div class="header">
      <div class="option-btn">
        <el-button
          type="primary"
          @click="backPage">返回
        </el-button>
        <div class="option-btn-item" v-if="detailFlag === '1'">
          <el-button
            type="success"
            v-hasPermi="['pro:proPlanInfo:audit']"
            @click="submitConfirm">同意
          </el-button>
          <el-button
            type="warning"
            v-hasPermi="['pro:proPlanInfo:audit']"
            @click="withdrawPlayPlan">退回
          </el-button>
        </div>
      </div>
    </div>
    <div class="main">
      <implement-plan-detail :info-id="id" :is-audit-status="isAuditStatus"/>
    </div>
    <div class="footer">
      <el-tabs v-model="activeName">
        <el-tab-pane label="操作日志" name="0">
          <el-table ref="table" :data="optLogDataList">
            <el-table-column prop="operUserName" label="操作人"/>
            <el-table-column prop="operName" label="操作事件">
              <template slot-scope="scope">
                <span>{{ scope.row.operName }}</span>
                <span v-if="scope.row.remark">({{ scope.row.remark }})</span>
                <div v-if="scope.row.filePaths">
                  <upload v-model="scope.row.filePaths" :edit="false"></upload>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="时间"/>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import implementPlanDetail from './childCom/implementPlanDetail'
import {auditLaunchPlayPlan} from "@/api/pro/proLaunch";
import {saveProOptLog,getProApprovalInfo} from "@/api/pro/proApprovalInfo";
import {listProOperLog} from "@/api/pro/proPlanReview";

export default {
  name: "playPlanDetailKXB",
  data() {
    return {
      proDetailFlag: null,
      tabActiveName: null,
      detailFlag: null,
      id: null,
      activeName: '0',
      optLogDataList: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created() {
    if (this.$route.query.proDetailFlag) {
      this.proDetailFlag = this.$route.query.proDetailFlag
    }
    if (this.$route.query.detailFlag) {
      this.detailFlag = this.$route.query.detailFlag
    }
    if (this.$route.query.tabActiveName) {
      this.tabActiveName = this.$route.query.tabActiveName
    }
    if (this.$route.query.id) {
      this.id = this.$route.query.id * 1
      this.getList()
    }
  },
  computed: {
    isAuditStatus() {
      if (this.detailFlag === '1') {
        return 1
      } else {
        return 0
      }
    },
    userName() {
      return this.$store.state.user.name
    }
  },
  components: {
    implementPlanDetail
  },
  methods: {
    //获取日志操作
    getList() {
      this.queryParams.infoId = this.id
      listProOperLog(this.queryParams).then(({rows, total}) => {
        this.optLogDataList = rows
        this.total = total
      })
    },
    //返回
    backPage() {
      if (this.proDetailFlag) {
        this.closeView("/proManagement/proImplement/proLaunch/playPlanDetailKXB", "/proManagement/proImplement/proEstablish/proMainTask?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag + '&tabActiveName=' + this.tabActiveName, 0)
      } else {
        this.closeView("/proManagement/proImplement/proLaunch/playPlanDetailKXB", "/proManagement/proImplement/proLaunch", 0)
      }
    },
    //同意
    submitConfirm() {
        getProApprovalInfo(this.id).then(response => {
            if(response.data.playPlanStatus == 1){
                this.msgInfo('该实施计划已被审核通过，不能重复审核')
            }else if(response.data.playPlanStatus == 2){
                this.msgInfo('该实施计划已被退回，不能重复审核')
            }else if(response.data.playPlanStatus != 3){
                this.msgInfo('该实施计划状态异常，请联系管理员')
            }else if(response.data.playPlanStatus == 3){
                const objTem = {
                  infoId: this.id,
                  status: 1
                }
                auditLaunchPlayPlan(objTem).then(() => {
                  if (this.proDetailFlag) {
                    this.closeView("/proManagement/proImplement/proLaunch/playPlanDetailKXB", "/proManagement/proImplement/proEstablish/proMainTask?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag + '&tabActiveName=' + this.tabActiveName, 200)
                  } else {
                    this.closeView("/proManagement/proImplement/proLaunch/playPlanDetailKXB", "/proManagement/proImplement/proLaunch", 200)
                  }
                  saveProOptLog({
                    infoId: this.id,
                    operName: '同意了该实施计划',
                    operUserName: this.userName,
                    operType: 5
                  }).then(() => {})
                })
            }
        })

    },
    //退回
    withdrawPlayPlan() {
      getProApprovalInfo(this.id).then(response => {
          if(response.data.playPlanStatus == 1){
              this.msgInfo('该实施计划已被审核通过，不能重复审核')
          }else if(response.data.playPlanStatus == 2){
              this.msgInfo('该实施计划已被退回，不能重复审核')
          }else if(response.data.playPlanStatus != 3){
              this.msgInfo('该实施计划状态异常，请联系管理员')
          }else if(response.data.playPlanStatus == 3){
              const objTem = {
                  infoId: this.id,
                  status: 2
              }
              auditLaunchPlayPlan(objTem).then(() => {
                  if (this.proDetailFlag) {
                      this.closeView("/proManagement/proImplement/proLaunch/playPlanDetailKXB", "/proManagement/proImplement/proEstablish/proMainTask?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag + '&tabActiveName=' + this.tabActiveName, 200)
                  } else {
                      this.closeView("/proManagement/proImplement/proLaunch/playPlanDetailKXB", "/proManagement/proImplement/proLaunch", 200)
                  }
                  saveProOptLog({
                      infoId: this.id,
                      operName: '退回了该实施计划',
                      operUserName: this.userName,
                      operType: 5
                  }).then(() => {})
              })
          }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.play-plan-detail-kxb {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 30px 50px 30px;
  .header {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    .option-btn {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      .option-btn-item {
        margin-left: 20px;
      }
    }
  }
  .main {
    width: 100%;
    margin: 20px 0;
  }
  .footer {
    width: 100%;
  }
}
</style>
