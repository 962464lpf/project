<template>
  <div class="app-container">
    <div class="header">
      <div class="pro-name">
        <span v-if="proApprovalInfo.projectName">{{proApprovalInfo.projectName}}任务书</span>
        <div class="pro-name-subtitle">
          <span v-if="proApprovalInfo.createBy">{{ proApprovalInfo.createBy }}</span>
          <span>编制于</span>
          <span v-if="proApprovalInfo.createTime">{{ proApprovalInfo.createTime | proCreateTime }}</span>
        </div>
      </div>
      <div class="option-btn">
        <div class="option-btn-item2">
          <el-button
            v-if="detailFlag === '0'"
            type="primary"
            @click="backPage">返回
          </el-button>
        </div>
        <div class="option-btn-item" v-if="detailFlag !== '0'">
          <el-button
            type="primary"
            @click="backPage">返回
          </el-button>
          <el-button
            type="primary"
            v-hasPermi="['pro:proApprovalInfo:updateAuditPlan']"
            @click="navUpdateData">修改
          </el-button>
          <el-button
            type="success"
            v-hasPermi="['pro:proPlanInfo:audit']"
            @click="submitConfirm">同意
          </el-button>
          <el-button
            type="warning"
            v-hasPermi="['pro:proPlanInfo:audit']"
            @click="withdrawProPlan">退回
          </el-button>
        </div>
      </div>
    </div>
    <div class="main">
      <iframe
        v-if="proApprovalInfo.planInfoUrl"
        :src="proApprovalInfo.planInfoUrl"
        frameborder="0"
        style="width: 100%;height: calc(100vh - 170px);">
      </iframe>
    </div>
    <div class="footer">
      <el-tabs v-model="activeName">
        <el-tab-pane label="操作日志" name="0">
          <el-table ref="table" :data="optLogDataList">
            <el-table-column width="300" prop="operUserName" label="操作人" align="center"/>
            <el-table-column prop="operName" label="操作事件" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.operName }}</span>
<!--                <span v-if="scope.row.remark">({{ scope.row.remark }})</span>-->
<!--                <div v-if="scope.row.filePaths">-->
<!--                  <upload v-model="scope.row.filePaths" :edit="false"></upload>-->
<!--                </div>-->
              </template>
            </el-table-column>
            <el-table-column width="300" prop="createTime" label="操作时间" align="center"/>
          </el-table>
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </el-tab-pane>
        <el-tab-pane label="审核意见" name="1">
          <el-table ref="table2" :data="optLogDataList2">
            <el-table-column width="200" prop="operUserName" label="审批人" align="center"/>
            <el-table-column prop="remark" label="意见" align="center" show-overflow-tooltip/>
            <el-table-column width="300" prop="filePaths" label="附件" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.filePaths" style="display: flex; justify-content: center">
                  <upload v-model="scope.row.filePaths" :edit="false"></upload>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="300" prop="createTime" label="审批时间" align="center"/>
          </el-table>
          <pagination
            v-show="total1 > 0"
            :total="total1"
            :page.sync="queryParams1.pageNum"
            :limit.sync="queryParams1.pageSize"
            @pagination="getList1"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      :visible.sync="open"
      width="600px"
      append-to-body :close-on-click-modal="false">
      <div class="dialog-center">
        <el-form ref="opinionForm" :model="opinionForm" :rules="opinionRules" label-width="96px">
          <el-form-item label="审批意见" prop="reviewOpinion">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入该审批的流转意见"
              maxlength="200"
              show-word-limit
              v-model="opinionForm.reviewOpinion"
              style="width: 100%; margin-bottom: 10px">
            </el-input>
          </el-form-item>
          <el-form-item label="附件" prop="auditFilePath">
            <upload v-model="opinionForm.auditFilePath" :limit="100"/>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button style="width: 100px" type="primary" @click="submitForm">确 定</el-button>
        <el-button style="width: 100px" @click="cancelClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {auditPlanInfo, getProAuditInfo, listProOperLog, planPreview} from "@/api/pro/proPlanReview";
import {saveProOptLog, updateProApprovalInfo,getProApprovalInfo} from "@/api/pro/proApprovalInfo";

export default {
  name: "reviewProPlan",
  data() {
    return {
      detailFlag: null,
      proDetailFlag: null,
      tabActiveName: null,
      open: false,
      openType: 1,
      id: null,
      proApprovalInfo: {},
      activeName: '0',
      optLogDataList: [],
      optLogDataList2: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        infoId: null,
        operType: 2
      },
      total1: 0,
      queryParams1: {
          pageNum: 1,
          pageSize: 10,
          infoId: null,
          operType: 2,
          type: 1
      },
      opinionForm: {
        infoId: null,
        planId: null,
        planStatus: null,
        reviewOpinion: '',
        auditFilePath: '',
        permission: 0
      },
      opinionRules: {
        reviewOpinion: [
          {required: true, message: "审批意见不能为空", trigger: "blur", pattern: '[^ \x22]+'}
        ]
      }
    }
  },
  created() {
    if (this.$route.query.detailFlag) {
      this.detailFlag = this.$route.query.detailFlag
    }
    if (this.$route.query.proDetailFlag) {
      this.proDetailFlag = this.$route.query.proDetailFlag
    }
    if (this.$route.query.tabActiveName) {
      this.tabActiveName = this.$route.query.tabActiveName
    }
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getProAuditInfoDetail(this.id)
      this.getList()
      this.getList1()
    }
  },
  computed: {
    userName() {
      return this.$store.state.user.name
    }
  },
  filters: {
    proCreateTime(value) {
      if (value) {
        return value.toString().substr(0, 10)
      }
    }
  },
  methods: {
    //获取项目信息
    getProAuditInfoDetail(id) {
      getProAuditInfo(id).then(({data}) => {
        this.proApprovalInfo = data
      })
    },
    //获取日志操作
    getList() {
      this.queryParams.infoId = this.id
      listProOperLog(this.queryParams).then(({rows, total}) => {
        this.optLogDataList = rows
      })
    },
    getList1() {
        this.queryParams1.infoId = this.id
        listProOperLog(this.queryParams1).then(({rows, total}) => {
            this.optLogDataList2 = rows
        })
    },
    //获取预览信息
    // getPlayPlanReview() {
    //   planPreview().then((res) => {
    //     console.log(res)
    //   })
    // },
    //跳转修改计划书按钮
    navUpdateData() {
      const id = this.id
      const path = '/proManagement/proImplement/drawUpPlan/editProPlan'
      this.$router.push({
        'path': path,
        'query': {
          id,
          reviewFlag: '0'
        }
      })
    },
    //同意计划书
    submitConfirm() {
      this.open = true
      this.openType = 1
    },
    //退回计划书
    withdrawProPlan() {
      this.open = true
      this.openType = 2
    },
    submitForm() {
        getProApprovalInfo(this.id).then(({data}) => {
            if(data.proStatus==0){
                this.msgInfo('该计划所属项目已移至储备库，不能审核');
            }else {
                if(data.planStatus==3){
                    this.msgInfo('该计划已经被审核通过，不能重复审核')
                }else if(data.planStatus==4){
                    this.msgInfo('该计划已经被退回，不能重复审核')
                }else if(data.planStatus==5){
                    this.msgInfo('该计划已经被作废，不能审核')
                }else if(data.planStatus==2){
                    this.opinionForm.infoId = this.proApprovalInfo.infoId
                    this.opinionForm.planId = this.proApprovalInfo.PlanId
                    this.$refs["opinionForm"].validate(valid => {
                      if (valid) {
                        if (this.openType === 1) {
                          this.opinionForm.planStatus = 3
                          auditPlanInfo(this.opinionForm).then(()=>{
                            this.msgSuccess("审核成功")
                            this.closeView("/proManagement/proImplement/planReview/reviewProPlan", "/proManagement/proImplement/planReview", 0)
                            saveProOptLog({
                              infoId: this.id,
                              remark: this.opinionForm.reviewOpinion,
                              filePaths: this.opinionForm.auditFilePath,
                              operName: '审核同意了该项目计划书',
                              operUserName: this.userName,
                              operType: 2
                            }).then(() => {})
                          })
                        } else {
                          this.opinionForm.planStatus = 4
                          auditPlanInfo(this.opinionForm).then(()=>{
                            this.msgSuccess("退回成功");
                            this.closeView("/proManagement/proImplement/planReview/reviewProPlan", "/proManagement/proImplement/planReview", 0)
                            saveProOptLog({
                              infoId: this.id,
                              remark: this.opinionForm.reviewOpinion,
                              filePaths: this.opinionForm.auditFilePath,
                              operName: '退回了该项目计划书',
                              operUserName: this.userName,
                              operType: 2
                            }).then(() => {})
                          })
                        }
                      }
                    })
                }
            }
        })
    },
    cancelClose() {
      this.open = false
      this.opinionForm.reviewOpinion = ''
      this.opinionForm.auditFilePath = ''
    },
    backPage() {
      this.closeView("/proManagement/proImplement/planReview/reviewProPlan", "/proManagement/proImplement/proEstablish/proMainTask?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag + '&tabActiveName=' + this.tabActiveName, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 30px 50px 30px;
  .header {
    width: 100%;
    display: flex;
    margin-bottom: 20px;
    .option-btn {
      width: 30%;
      display: flex;
      height: 40px;
      .option-btn-item {
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
      .option-btn-item2 {
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
    }
    .pro-name {
      width: 70%;
      display: flex;
      flex-direction: column;
      font-size: 24px;
      font-weight: bold;
      .pro-name-subtitle {
        margin-top: 20px;
        font-size: 18px;
        color: #666;
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
  .dialog-center {
    display: flex;
    flex-direction: column;
  }
}
</style>
