<template>
  <div class="app-container">
    <div class="header">
      <div class="option-btn">
        <el-row :gutter="10">
          <el-col :span="1.5">
            <el-button
              v-if="reviewFlag !== '0' && reviewFlag !== '1'"
              type="primary"
              style="margin: 0"
              v-hasPermi="['pro:proApprovalInfo:edit']"
              @click="updateData">{{showBtnStatus ? '保存为草稿' : '保存'}}
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-if="reviewFlag !== '0' && reviewFlag !== '1'"
              type="primary"
              style="margin: 0"
              @click="submitForm"
              v-hasPermi="['pro:proApprovalInfo:edit']">提交
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <preview-pdf
              type="proImplement"
              :id="id"
              :hint="false"
              btnText="预览"
              style="padding: 0;"
            />
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              style="margin: 0"
              @click="dialogShow">下载
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-if="reviewFlag === '0' || reviewFlag === '1'"
              type="primary"
              style="margin: 0"
              v-hasPermi="['pro:proApprovalInfo:backupApprovalInfo']"
              @click="submitForm">确认修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              style="margin: 0"
              @click="cancel">取消
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="pro-name">
        <span v-if="projectName">{{projectName}}</span>
      </div>
    </div>
    <div class="main">
      <el-form ref="form" :model="form" label-width="130px">
        <el-radio-group v-model="tabIndex" style="margin-bottom: 20px;" @change="handleRadio">
          <el-radio-button label="1">封面</el-radio-button>
          <el-radio-button label="2">基本信息</el-radio-button>
          <el-radio-button label="3">研究内容及考核指标</el-radio-button>
          <el-radio-button label="4">工作进度安排及考核要求</el-radio-button>
          <el-radio-button label="5">经费预算安排</el-radio-button>
          <el-radio-button label="6">出资方案及支付计划</el-radio-button>
          <el-radio-button label="7">研究人员</el-radio-button>
          <el-radio-button label="8">联系方式</el-radio-button>
          <el-radio-button label="9">有关问题说明</el-radio-button>
        </el-radio-group>
        <div class="declare-tab-content" ref="declareTabContent" style="height: calc(100vh - 266px);">
          <plan-cover v-show="tabIndex === '1'" v-model="form"/>
          <plan-base-info v-show="tabIndex === '2'" v-model="form"/>
          <plan-research-content v-show="tabIndex === '3'" v-model="form"/>
          <plan-work-progress v-show="tabIndex === '4'" v-model="form"/>
          <plan-fund v-show="tabIndex === '5'" v-model="form"/>
          <plan-contribution v-show="tabIndex === '6'" v-model="form"/>
          <plan-research-person v-show="tabIndex === '7'" v-model="form"/>
          <plan-contact-way v-show="tabIndex === '8'" v-model="form"/>
          <plan-problem v-show="tabIndex === '9'" v-model="form"/>
        </div>
      </el-form>
    </div>
    <!-- 下载 -->
    <el-dialog title="下载" :visible.sync="open" width="400px" append-to-body class="el-dialog-center" :close-on-click-modal="false">
      <div style="text-align: center;" ref="downLoading">
        <el-radio v-model="downloadType" :label="1">PDF</el-radio>
        <el-radio v-model="downloadType" :label="2">WORD</el-radio>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="download">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import planCover from './editProPlanChildCom/planCover'
import planBaseInfo from './editProPlanChildCom/planBaseInfo'
import planResearchContent from './editProPlanChildCom/planResearchContent'
import planWorkProgress from './editProPlanChildCom/planWorkProgress'
import planFund from './editProPlanChildCom/planFund'
import planContribution from './editProPlanChildCom/planContribution'
import planResearchPerson from './editProPlanChildCom/planResearchPerson'
import planContactWay from './editProPlanChildCom/planContactWay'
import planProblem from './editProPlanChildCom/planProblem'
import { Loading } from 'element-ui';
import {downLoadPreviewPlan, getProApprovalInfo} from "@/api/pro/proApprovalInfo";

import {
  backupApprovalInfo,
  saveProOptLog,
  selectEstablishmentPlanById,
  updateProApprovalInfo
} from "@/api/pro/proApprovalInfo";

export default {
  name: "EditProPlan",
  data() {
    return {
      tabIndex: '1',
      form: {},
      proDetailFlag: null,
      reviewFlag: null,
      tabActiveName: null,
      id: null,
      open: false,
      downloadType: 1,
      loading: null
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getPlayProPlanInfo(this.id)
    if (this.$route.query.proDetailFlag) {
      this.proDetailFlag = this.$route.query.proDetailFlag
    }
    if (this.$route.query.reviewFlag) {
      this.reviewFlag = this.$route.query.reviewFlag
    }
    if (this.$route.query.tabActiveName) {
      this.tabActiveName = this.$route.query.tabActiveName
    }
  },
  computed: {
    userName() {
      return this.$store.state.user.name
    },
    projectName() {
      if (this.form && this.form.approvalInfo && this.form.approvalInfo.projectName) {
        return this.form.approvalInfo.projectName
      }
    },
    showBtnStatus() {
      if (this.form && this.form.approvalInfo && this.form.approvalInfo.planStatus == 4) {
        return false
      }
    }
  },
  components: {
    planCover,
    planBaseInfo,
    planResearchContent,
    planWorkProgress,
    planFund,
    planContribution,
    planResearchPerson,
    planContactWay,
    planProblem
  },
  methods: {
    /*********************** 交互操作 ***********************/
    //保存为草稿
    updateData() {
        //先查询立项项目状态，如果已被移至储备库，则给提示
        getProApprovalInfo(this.id).then(response => {
            if(response.data.proStatus==0) {
                this.msgInfo('该项目已被移至储备库，不能提交编制计划，如有疑问请联系科信部');
            } else if(response.data.planStatus == 2){
                this.msgInfo('该计划已提交至科信部审核，不能保存编辑');
            }else if(response.data.planStatus == 3){
                this.msgInfo('该计划已被审核通过，不能保存编辑');
            }else if(response.data.planStatus == 5){
                this.msgInfo('该计划已作废，不能保存编辑');
            }else {
              let dataTem = {
                id: this.id,
                action: 1,
                type: 1
              }
              downLoadPreviewPlan(dataTem).then(({data}) => {
                updateProApprovalInfo({
                  id: this.id,
                  planInfoUrl: data
                }).then(() => {
                  this.msgSuccess("保存成功")
                  if (this.proDetailFlag === '1') {
                    this.closeView("/proManagement/proImplement/drawUpPlan/editProPlan", "/proManagement/proImplement/proEstablish/proMainTask?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag + '&tabActiveName=' + this.tabActiveName, 0)
                  } else {
                    this.closeView("/proManagement/proImplement/drawUpPlan/editProPlan", "/proManagement/proImplement/drawUpPlan", 0)
                  }
                })
              })
            }
        });
    },
    //提交
    submitForm() {
      //先查询立项项目状态，如果已被移至储备库，则给提示
      getProApprovalInfo(this.id).then(response => {
        if (response.data.setupStatus !== 0) {
          if(response.data.proStatus==0) {
            this.msgInfo('该项目已被移至储备库，不能提交编制计划，如有疑问请联系科信部');
          } else if(response.data.planStatus == 2 && this.reviewFlag !== '0' && this.reviewFlag !== '1'){
            this.msgInfo('该计划已提交至科信部审核，不能重复提交');
          }else if(response.data.planStatus == 3 && this.reviewFlag !== '0' && this.reviewFlag !== '1'){
            this.msgInfo('该计划已被审核通过，不能重复提交');
          }else if(response.data.planStatus == 5){
            this.msgInfo('该计划已作废，请重新编制计划');
          }else {
            let dataTem = {
              id: this.id,
              action: 1,
              type: 1
            }
            downLoadPreviewPlan(dataTem).then(({data}) => {
              if (this.reviewFlag !== '0' && this.reviewFlag !== '1') {
                updateProApprovalInfo({
                  id: this.id,
                  planStatus: 2,
                  planInfoUrl: data
                }).then(() => {
                  this.msgSuccess("提交成功")
                  if (this.proDetailFlag) {
                    this.closeView("/proManagement/proImplement/drawUpPlan/editProPlan", "/proManagement/proImplement/proEstablish/proMainTask?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag, 200)
                  } else {
                    this.closeView("/proManagement/proImplement/drawUpPlan/editProPlan", "/proManagement/proImplement/drawUpPlan", 200)
                  }
                  saveProOptLog({
                    infoId: this.id,
                    operName: '提交了编制的计划书',
                    operUserName: this.userName,
                    operType: 2
                  }).then(() => {})
                })
              } else {
                updateProApprovalInfo({
                  id: this.id,
                  planInfoUrl: data
                }).then(() => {
                  backupApprovalInfo(this.id).then(()=>{
                    this.msgSuccess("修改成功")
                    if (this.reviewFlag === '0') {
                      this.closeView("/proManagement/proImplement/drawUpPlan/editProPlan", "/proManagement/proImplement/planReview/reviewProPlan?id="+this.id, 100)
                    } else if (this.reviewFlag === '1'){
                      this.closeView("/proManagement/proImplement/drawUpPlan/editProPlan", "/proManagement/proImplement/planReview", 100)
                    }
                    saveProOptLog({
                      infoId: this.id,
                      operName: '修改了编制的计划书',
                      operUserName: this.userName,
                      operType: 2
                    }).then(() => {})
                  })
                })
              }
            })
          }
        } else {
          this.msgError('当前项目已暂停，不可操作')
        }
      });
    },
    //取消
    cancel() {
      let dataTem = {
        id: this.id,
        action: 1,
        type: 1
      }
      downLoadPreviewPlan(dataTem).then(({data}) => {
        updateProApprovalInfo({
          id: this.id,
          planInfoUrl: data
        }).then(() => {
          if (this.reviewFlag !== '0') {
            if (this.proDetailFlag) {
              this.closeView("/proManagement/proImplement/drawUpPlan/editProPlan", "/proManagement/proImplement/proEstablish/proMainTask?id=" + this.id + '&proDetailFlag=' + this.proDetailFlag, 0)
            } else {
              this.closeView("/proManagement/proImplement/drawUpPlan/editProPlan", "/proManagement/proImplement/drawUpPlan", 0)
            }
          } else {
            this.closeView("/proManagement/proImplement/drawUpPlan/editProPlan", "/proManagement/proImplement/planReview/reviewProPlan?id=" + this.id, 0)
          }
        })
      })
    },
    //处理tab切换事件
    handleRadio(value) {
      this.getPlayProPlanInfo(this.id)
      this.$refs.declareTabContent.scrollTop = 0;
    },
    //查询项目基本信息
    getPlayProPlanInfo(id) {
      selectEstablishmentPlanById(id).then(({data}) => {
        this.form = data
      })
    },
    //打开下载弹窗
    dialogShow() {
      if(this.loading) this.loading.close();
      this.open = true;
    },
    //下载
    download() {
      this.loading = null;
      this.loading = Loading.service({target: this.$refs.downLoading, text: '正在下载请稍后...'});
      let data = {
        id: this.form.approvalInfo.id,
        action: 2,
        type: this.downloadType
      }
      let name = '项目任务书'
      if(this.downloadType == 1) { //pdf
        downLoadPreviewPlan(data).then((response) => {
          this.open = false;
          this.loading.close();
          location.href = process.env.VUE_APP_BASE_API + '/common/download/resource?name=' + encodeURIComponent(name) + '.pdf&&fileName=' + response.data;
        })
      }
      if(this.downloadType == 2) { //word
        downLoadPreviewPlan(data).then(response => {
          this.open = false;
          this.loading.close();
          location.href = process.env.VUE_APP_BASE_API+'/common/download/resource?name=' + encodeURIComponent(name) + '.doc&&fileName=' + response.data;
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 30px 60px 30px;
  .header {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    align-items: flex-end;
    .option-btn {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }
    .pro-name {
      width: 100%;
      display: flex;
      font-size: 24px;
      font-weight: bold;
    }
  }
  .main {
    width: 100%;
  }
}
</style>
