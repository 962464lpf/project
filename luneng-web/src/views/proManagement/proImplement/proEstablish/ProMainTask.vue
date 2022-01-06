<template>
  <div class="app-container">
    <div class="header">
      <div class="pro-name">
        <div class="pro-name-text" v-if="this.proApprovalInfo.projectName">{{ this.proApprovalInfo.projectName }}</div>
        <div>
          <el-button
            v-if="this.proApprovalInfo.setupStatus === 0"
            type="primary"
            :disabled="this.proApprovalInfo.proStatus === 8"
            @click="startOrPauseProject(1)"
            v-hasPermi="['pro:proApprovalInfo:startApprovalPro']">
            启动
          </el-button>
          <el-button
            v-if="this.proApprovalInfo.setupStatus !== 0"
            type="primary"
            :disabled="this.proApprovalInfo.proStatus === 8"
            @click="startOrPauseProject(2)"
            v-hasPermi="['pro:proApprovalInfo:stopProject']">
            暂停
          </el-button>
          <el-button
            type="primary"
            @click="handleBack">返回
          </el-button>
        </div>
      </div>
      <div class="pro-steps" v-if="this.proApprovalInfo.setupStatus !== 0">
        <el-steps :active="activeValue" align-center>
          <el-step v-for="item in proStatusOptions" :title="item.dictLabel" :key="item.dictLabel"></el-step>
        </el-steps>
      </div>
      <div class="pro-steps" v-if="this.proApprovalInfo.setupStatus === 0">
        <el-steps align-center>
          <el-step v-for="item in proStatusOptions2" :title="item.dictLabel" :key="item.dictLabel"></el-step>
        </el-steps>
      </div>
    </div>
    <div class="main">
      <div class="left-box">
        <el-tabs tab-position="left" v-model="tabActiveName" @tab-click="tabChange">
          <el-tab-pane
            :label="item.label"
            :name="item.value"
            v-for="item in tabsInfoList"
            :key="item.value">
          </el-tab-pane>
        </el-tabs>
      </div>
      <b-scroll
        class="wrapper"
        ref="scroll"
        @bscroll="bScroll"
        :probe-type='3'>
        <div class="base-info" ref="baseInfo">
          <span>基本信息</span>
          <pro-base-info
            :formInfo="proApprovalInfo"
            :tab-active-name="tabActiveName"
            :pro-detail-flag="proDetailFlag"
          />
        </div>
        <div class="feasibility-study" ref="feasibilityStudy">
          <span>可研信息</span>
          <upload @change="refreshBScroll" v-model="proApprovalInfo.feasibleFilePaths" :edit="false"/>
        </div>
        <div class="pro-plan" ref="proPlan">
          <span>项目计划</span>
          <el-row :gutter="20">
            <!--  管理操作  -->
            <el-col :span="1.5">
              <el-button
                v-if="proApprovalInfo.planStatus === 2 || proApprovalInfo.planStatus === 3"
                @click="navReviewProPlan()"
                v-hasPermi="['pro:proPlanInfo:audit']"
                :type="proApprovalInfo.planStatus === 2 ? 'primary' : ''">
                {{ proApprovalInfo.planStatus === 2 ? '审核' : '详情' }}
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-if="proApprovalInfo.planStatus === 3"
                @click="navUpdateData()"
                v-hasPermi="['pro:proApprovalInfo:updateAuditPlan']"
                type="primary">修改
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-if="proApprovalInfo.planStatus === 3"
                @click="rejectProPlan()"
                v-hasPermi="['pro:proApprovalInfo:updateAuditStatus']"
                type="danger">退回
              </el-button>
            </el-col>
          <!--  普通操作  -->
            <el-col :span="1.5">
              <el-button
                :type="planStatusStyle(proApprovalInfo)"
                @click="navPlayPlan"
                v-hasPermi="['pro:proApprovalInfo:updateEstablishmentPlan']">
                {{ planStatusFormat(proApprovalInfo) }}
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-if="proApprovalInfo.planStatus === 1 || proApprovalInfo.planStatus === 5"
                @click="deletePlan()"
                v-hasPermi="['pro:proApprovalInfo:deleteEstablishmentPlan']"
                type="danger">删除
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-if="proApprovalInfo.planStatus === 2"
                @click="withdrawProPlan()"
                v-hasPermi="['pro:proApprovalInfo:reBackPlanInfo']"
                type="warning">撤回
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-if="proApprovalInfo.planStatus === 2"
                @click="abolishProPlan()"
                v-hasPermi="['pro:proApprovalInfo:invalidPlanInfo']"
                type="warning">作废
              </el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-if="proApprovalInfo.planStatus === 1 || proApprovalInfo.planStatus === 2 || proApprovalInfo.planStatus === 4"
                @click="navProPlanDetail()"
                v-hasPermi="['pro:proApprovalInfo:queryPlanDetail']">详情
              </el-button>
            </el-col>
          </el-row>
        </div>
        <div class="recruitment-plan" ref="recruitmentPlan">
          <span>招采资料</span>
          <pro-recruit
            :form-info="proApprovalInfo"
            :pro-detail-flag="proDetailFlag"
            :tab-active-name="tabActiveName"
            @refreshbs="refreshBScroll"
            @refreshList="refreshRecruitList"/>
          <!--          <span v-if="proApprovalInfo.planStatus != 3">请先完成当前阶段操作，再进行此阶段</span>-->
        </div>
        <div class="pro-fund" ref="proFund">
          <span>项目经费</span>
          <pro-fund :info-id="id" @refreshbs="refreshBScroll"/>
        </div>
        <div class="start-meeting" ref="startMeeting">
          <span>启动会资料</span>
          <pro-start-meeting
            :formInfo="proApprovalInfo"
            @refreshbs="refreshBScroll"
            :tab-active-name="tabActiveName"
            :pro-detail-flag="proDetailFlag"
            @refreshList="refreshRecruitList"
          />
          <!--          <span v-if="proApprovalInfo.planStatus != 3">请先完成当前阶段操作，再进行此阶段</span>-->
        </div>
        <div class="pro-implement" ref="proImplement">
          <span>项目实施</span>
          <pro-implement
            :info-id="id"
            :pro-detail-flag="proDetailFlag"
            :tab-active-name="tabActiveName"
            @refreshbs="refreshBScroll"/>
          <!--          <span v-if="proApprovalInfo.planStatus != 3">请先完成当前阶段操作，再进行此阶段</span>-->
        </div>
        <div class="research-results" ref="researchResults">
          <span>研究成果</span>
          <research-results :info-id="id"/>
        </div>
        <div class="pro-finalize" ref="proFinalize">
          <span>项目结题</span>
          <el-button
            v-if="proApprovalInfo.concludeStatus==1||proApprovalInfo.concludeStatus==4"
            :disabled="!(proApprovalInfo.proStatus==4||proApprovalInfo.proStatus==5||proApprovalInfo.proStatus==6)"
            type="primary"
            style="width: 15%"
            v-hasPermi="['conclude:researchResult:updateConcludeInfo']"
            @click="handleApplyConclude">申请结题
          </el-button>
          <PdfView v-if="proApprovalInfo.concludeStatus==2||proApprovalInfo.concludeStatus==3"
                   :src="concludeInfo.pdfUrl"/>
        </div>
        <div class="pro-acceptance" ref="proAcceptance">
          <span>项目验收</span>
          <el-button
            v-if="!proApprovalInfo.checkFilePath"
            :disabled="proApprovalInfo.concludeStatus!=3"
            type="primary"
            v-hasPermi="['conclude:researchResult:uploadCheckFile']"
            style="width: 15%"
            @click="handleUpload()">上传验收资料
          </el-button>
          <el-button
            v-if="proApprovalInfo.checkFilePath"
            :disabled="proApprovalInfo.concludeStatus!=3"
            type="primary"
            v-hasPermi="['conclude:researchResult:uploadCheckFile']"
            style="width: 15%"
            @click="handleUpload()">重传
          </el-button>
          <upload v-if="proApprovalInfo.checkFilePath"
                  v-model="proApprovalInfo.checkFilePath"
                  :edit="false"/>
        </div>
        <div class="lastDiv" ref="lastDiv"></div>
      </b-scroll>
    </div>
    <!-- 管理退回项目计划 -->
    <el-dialog
      :visible.sync="open2"
      width="600px"
      append-to-body
      :close-on-click-modal="false">
      <div class="dialog-center">
        <el-form ref="opinionForm2" :model="opinionForm2" :rules="opinionRules2" label-width="96px">
          <el-form-item label="操作说明" prop="reviewOpinion">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入操作说明"
              maxlength="200"
              show-word-limit
              v-model="opinionForm2.reviewOpinion"
              style="width: 100%; margin-bottom: 10px">
            </el-input>
          </el-form-item>
          <el-form-item label="附件" prop="auditFilePath">
            <upload v-model="opinionForm2.auditFilePath" :limit="100"/>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button style="width: 100px" type="primary" @click="submitForm">确 定</el-button>
        <el-button style="width: 100px" @click="cancelClose">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 上传验收资料 -->
    <el-dialog
      title="上传"
      :visible.sync="open"
      width="420px"
      append-to-body :close-on-click-modal="false">
      <el-form
        :model="proApprovalInfo"
        ref="uploadSignFrom"
        :inline="true">
        <el-form-item label="" prop="filePaths">
          <upload
            :limit="pdfLimit"
            v-model="checkForm.checkFilePath"/>
          <div class="el-upload__tip" style="color: red">
            分辨率300dpi彩色，仅限一个且不超过50M
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center" class="dialog-footer">
        <el-button type="primary" @click="submitCheckForm">提 交</el-button>
        <el-button @click="cancelUploadCheckForm">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import ProBaseInfo from './childCom/ProBaseInfo'
  import ProRecruit from './childCom/ProRecruit'
  import ProFund from './childCom/ProFund'
  import ProStartMeeting from "./childCom/ProStartMeeting"
  import ResearchResults from './childCom/ResearchResults'
  import ProImplement from './childCom/ProImplement'
  import BScroll from '@/components/BScroll'
  import PdfView from "@/components/PdfView";
  import {saveBiddingFilesHis} from "@/api/pro/proBiddingFilesHis"
  import {
    delProApprovalInfo,
    getProApprovalInfo,
    initEstablishmentPlan, invalidPlanInfo, reBackPlanInfo,
    saveProOptLog, startApprovalPro,
    updateProApprovalInfo
  } from "@/api/pro/proApprovalInfo";
  import {operation, getConcludeInfoByInfoId} from "@/api/conclude/result"
  import {auditPlanInfo, getProAuditInfo, saveProApprovalInfoRead} from "@/api/pro/proPlanReview";

  export default {
    name: "ProMainTask",
    data() {
      return {
        proStatusOptions: [],
        //项目进度包含暂停
        proStatusOptions2: [],
        tabActiveName: '1',
        tabsInfoList: [
          {
            value: '1',
            label: '基本信息'
          },
          {
            value: '2',
            label: '可研信息'
          },
          {
            value: '3',
            label: '项目计划'
          },
          {
            value: '4',
            label: '招采资料'
          },
          {
            value: '5',
            label: '项目经费'
          },
          {
            value: '6',
            label: '启动会资料'
          },
          {
            value: '7',
            label: '项目实施'
          },
          {
            value: '8',
            label: '研究成果'
          },
          {
            value: '9',
            label: '项目结题'
          },
          {
            value: '10',
            label: '项目验收'
          }
        ],
        proDetailFlag: null,
        id: null,
        proApprovalInfo: {},
        //上传文件相关配置
        pdfLimit: 1,
        open: false,
        // 结题详情
        concludeInfo: {},
        // 旧验收资料
        oldCheckFilePath: undefined,
        biddingFilesHis: {},
        checkForm: {},
        planStatusOptions: [],

        //管理退回项目计划
        open2: false,
        opinionForm2: {
          infoId: null,
          planId: null,
          planStatus: null,
          reviewOpinion: '',
          auditFilePath: '',
          permission: 1
        },
        opinionRules2: {
          reviewOpinion: [
            {required: true, message: "操作说明不能为空", trigger: "blur", pattern: '[^ \x22]+'}
          ]
        }
      }
    },
    created() {
      if (this.$route.query.proDetailFlag) {
        this.proDetailFlag = this.$route.query.proDetailFlag
      }
      this.id = this.$route.query.id * 1
      this.getProInfo(this.id)
      this.getDicts("draw_up_plan_status").then(response => {
        this.planStatusOptions = response.data;
      });
    },
    computed: {
      activeValue() {
        return this.proApprovalInfo.proStatus * 1 - 1
      },
      userName() {
        return this.$store.state.user.name
      },
      userId() {
        return this.$store.state.user.userId
      },
      planStatusFormat() {
        return (proApprovalInfo) => {
          if (proApprovalInfo.setupStatus === 0) {
            return '当前项目已暂停'
          } else {
            return this.selectDictLabel(this.planStatusOptions, proApprovalInfo.planStatus)
          }
        }
      },
      planStatusStyle() {
        return (proApprovalInfo) => {
          if (proApprovalInfo.planStatus === 5) {
            return 'danger'
          } else if (proApprovalInfo.planStatus === 3) {
            return ''
          } else {
            return 'primary'
          }
        }
      }
    },
    components: {
      ProBaseInfo,
      ProRecruit,
      ProFund,
      ProStartMeeting,
      ResearchResults,
      ProImplement,
      BScroll,
      PdfView
    },
    methods: {
      //获取项目信息
      getProInfo(id) {
        getProApprovalInfo(id).then(({data}) => {
          data.showBiddingMonth = !!data.biddingMonth;
          data.showBiddingType = !!data.biddingType;
          data.showBudgetAmount = !!data.budgetAmount;
          data.showActualAmount = !!data.actualAmount;
          data.showBiddingTime = !!data.biddingTime;
          data.showCalibrationTime = !!data.calibrationTime;
          this.proApprovalInfo = data;
          this.proStatusOptionsNew(data)
          if (this.proApprovalInfo.feasibleFilePaths) {
            let filePaths = [{
              fileName: this.proApprovalInfo.feasibleFilePaths,
              url: this.proApprovalInfo.feasibleFilePaths,
              name: '可行性研究报告.pdf',
              type: 'application/pdf'
            }];
            this.proApprovalInfo.feasibleFilePaths = JSON.stringify(filePaths);
          }
          this.refreshBScroll();
          if (this.proApprovalInfo.concludeStatus == 2 || this.proApprovalInfo.concludeStatus == 3) {
            this.getConcludeInfoByInfoId();
          }
        })
      },

      // 结题详情
      getConcludeInfoByInfoId() {
        getConcludeInfoByInfoId(this.id).then(res => {
          this.concludeInfo = res.data;
        })
      },

      //刷新招采列表
      refreshRecruitList() {
        this.getProInfo(this.id)
      },

      //获取项目状态信息
      proStatusOptionsNew(dataInfo) {
        this.getDicts("pro_establish_status").then(({data}) => {
          if (dataInfo && dataInfo.setupStatus === 0) {
            data.forEach((item, index) => {
              if ((dataInfo.proStatus * 1 - 1) === index) {
                item.dictLabel = '已暂停'
              }
            })
            this.proStatusOptions2 = data
          } else {
            this.proStatusOptions = data
          }
        });
      },

      //项目暂停启动
      startOrPauseProject(type) {
        this.$confirm(`是否${type === 1 ? '启动' : '暂停'}当前项目?`, "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          if (type === 1) {
            return startApprovalPro(this.id);
          } else if (type === 2) {
            return updateProApprovalInfo({
              id: this.id,
              setupStatus: 0
            })
          }
        }).then(() => {
          this.getProInfo(this.id)
          this.msgSuccess(`${type === 1 ? '启动' : '暂停'}成功`);
          saveProOptLog({
            infoId: this.id,
            operName: `${type === 1 ? '启动' : '暂停'}了该项目`,
            operUserName: this.userName,
            operType: 1
          }).then(() => {})
        }).catch(() => {})
      },

      //管理审核项目计划
      navReviewProPlan() {
        const {id, setupStatus, planStatus, userReadStatus} = this.proApprovalInfo
        const path = '/proManagement/proImplement/planReview/reviewProPlan'
        const query = {
          id: id,
          proDetailFlag: this.proDetailFlag,
          tabActiveName: this.tabActiveName
        }
        if (planStatus === 3) query.detailFlag = '0'
        if (setupStatus !== 0) {
          if (userReadStatus !== '1' && planStatus === 2) {
            const objTem = {
              infoId: id,
              userId: this.userId,
              type: 1
            }
            saveProApprovalInfoRead(objTem).then(() => {
              this.$router.push({
                path,
                query
              })
            })
            saveProOptLog({
              infoId: id,
              operName: '查看了该项目',
              operUserName: this.userName,
              operType: 2
            }).then(() => {})
          } else {
            this.$router.push({
              path,
              query
            })
          }
        } else {
          this.msgError('当前项目已暂停，不可操作')
        }
      },
      //管理修改项目计划
      navUpdateData() {
        const {id, proStatus} = this.proApprovalInfo
        if (proStatus < 5 ) {
          const path = '/proManagement/proImplement/drawUpPlan/editProPlan'
          this.$router.push({
            path,
            query: {
              id: id,
              proDetailFlag: this.proDetailFlag,
              tabActiveName: this.tabActiveName,
              reviewFlag: '1'
            }
          })
        } else {
          this.msgInfo('项目启动之后，不可再修改')
        }
      },
      //管理退回项目计划
      rejectProPlan() {
        const {id, proStatus} = this.proApprovalInfo
        if (proStatus < 5) {
          getProAuditInfo(id).then(({data}) => {
            this.opinionForm2.infoId = data.infoId
            this.opinionForm2.planId = data.PlanId
            this.opinionForm2.planStatus = 4
            this.open2 = true
          })
        } else {
          this.msgInfo('项目启动之后，不可再操作')
        }
      },
      //管理审核通过后退回项目计划提交
      submitForm() {
        this.$refs["opinionForm2"].validate(valid => {
          if (valid) {
            auditPlanInfo(this.opinionForm2).then(() => {
              this.open2 = false
              this.msgSuccess("退回成功")
              this.handleBack()
              saveProOptLog({
                infoId: this.opinionForm2.infoId,
                remark : this.opinionForm2.reviewOpinion,
                filePaths:this.opinionForm2.auditFilePath,
                operName: '退回了该项目计划书',
                operUserName: this.userName,
                operType: 2
              }).then(() => {})
            })
          }
        })
      },
      //管理审核通过后退回项目计划取消
      cancelClose() {
        this.open2 = false
        this.opinionForm2.reviewOpinion = ''
        this.opinionForm2.auditFilePath = ''
      },

      //项目计划编制
      navPlayPlan() {
        if (this.proApprovalInfo.planStatus === 3) {
          this.navProPlanDetail()
        } else {
          getProApprovalInfo(this.id).then(({data}) => {
            if (data.proStatus === 0) {
              this.msgInfo('该项目已被移至储备库，不能编制项目计划，如有疑问请联系科信部');
              this.getProInfo(this.id)
            } else {
              if ((data.setupStatus === 0 && data.proStatus === 2) || data.setupStatus !== 0) {
                if (data.planStatus === 0) {
                  this.navProPlanWrite()
                } else if (data.planStatus === 5) {
                  this.msgError('当前项目计划书已作废')
                } else if (data.planStatus === 2) {
                  this.msgError('当前项目计划书已提交')
                } else {
                  this.$router.push({
                    path: '/proManagement/proImplement/drawUpPlan/editProPlan',
                    query: {
                      id: this.proApprovalInfo.id,
                      proDetailFlag: this.proDetailFlag,
                      tabActiveName: this.tabActiveName
                    }
                  })
                }
              } else {
                this.msgError('当前项目已暂停，不可操作')
              }
            }
          })
        }
      },
      //删除项目计划
      deletePlan() {
        const {id, setupStatus, proStatus} = this.proApprovalInfo
        if ((setupStatus === 0 && proStatus === 2) || (setupStatus !== 0)) {
          this.$confirm('确定删除项目吗？删除后需手动选择编制计划项目', "系统提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            return delProApprovalInfo(id);
          }).then(() => {
            this.msgSuccess("删除成功");
            saveProOptLog({
              infoId: id,
              operName: '删除了编制的计划书',
              operUserName: this.userName,
              operType: 2
            }).then(() => {
              this.handleBack()
            })
          }).catch(() => {})
        } else {
          this.msgError('当前项目已暂停，不可操作')
        }
      },
      //撤回项目计划
      withdrawProPlan() {
        getProApprovalInfo(this.id).then(({data}) => {
          if(data.planStatus === 3) {
            this.msgInfo('该计划已经被审核通过，不能撤回');
          } else {
            if ((data.setupStatus === 0 && data.proStatus === 2) || (data.setupStatus !== 0)) {
              if (data.auditReadStatus !== '1') {
                const formObj = {
                  infoId: data.id,
                  planStatus: 1
                }
                this.$confirm('是否撤回当前项目计划?', "系统提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }).then(() => {
                  return reBackPlanInfo(formObj);
                }).then(() => {
                  this.msgSuccess("撤回成功");
                  this.getProInfo(data.id)
                  saveProOptLog({
                    infoId: data.id,
                    operName: '撤回了编制的计划书',
                    operUserName: this.userName,
                    operType: 2
                  }).then(() => {})
                }).catch(() => {})
              } else {
                this.msgInfo('该项目计划书已读，不可撤回');
              }
            } else {
              this.msgInfo('当前项目已暂停，不可操作')
            }
          }
        })
      },
      //作废项目计划
      abolishProPlan() {
        getProApprovalInfo(this.id).then(({data}) => {
          if ((data.setupStatus === 0 && data.proStatus === 2) || (data.setupStatus !== 0)) {
            if (data.auditReadStatus !== '1') {
              const formObj = {
                infoId: data.id,
                planStatus: 5
              }
              this.$confirm('是否作废当前项目计划?作废后可重新进行计划编制', "系统提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }).then(() => {
                return invalidPlanInfo(formObj);
              }).then(() => {
                this.msgSuccess("作废成功");
                this.getProInfo(data.id)
                saveProOptLog({
                  infoId: data.id,
                  operName: '作废了编制的计划书',
                  operUserName: this.userName,
                  operType: 2
                }).then(() => {})
              }).catch(() => {})
            } else {
              this.msgInfo('该项目计划书已读，不可作废');
            }
          } else {
            this.msgInfo('当前项目已暂停，不可操作')
          }
        })
      },
      //跳转编制计划
      navProPlanWrite() {
        initEstablishmentPlan(this.proApprovalInfo.id).then(() => {
          this.$router.push({
            path: '/proManagement/proImplement/drawUpPlan/editProPlan',
            query: {
              id: this.proApprovalInfo.id,
              proDetailFlag: this.proDetailFlag,
              tabActiveName: this.tabActiveName
            }
          })
        })
      },
      //项目计划编制详情
      navProPlanDetail() {
        this.$router.push({
          path: '/proManagement/proImplement/drawUpPlan/proPlanDetail',
          query: {
            id: this.proApprovalInfo.id,
            proDetailFlag: this.proDetailFlag,
            tabActiveName: this.tabActiveName
          }
        })
      },

      // 申请结题
      handleApplyConclude() {
        getProApprovalInfo(this.id).then(({data}) => {
          if ((data.setupStatus !== 0)) {
            operation({"infoId": this.id, "operation": "1"}).then(res => {
              if (res.code === 200) {
                this.$router.push({
                  path: "/proManagement/conclude/conclude/apply",
                  query: {
                    "infoId": this.id,
                    "type": "2",
                    "flag": "1",
                    "proDetailFlag": this.$route.query.proDetailFlag,
                    tabActiveName: this.tabActiveName
                  }
                })
              }
            })
          } else {
            this.msgError('当前项目已暂停，不可操作')
          }
        })
      },
      // 上传验收资料
      handleUpload() {
        this.open = true;
        this.checkForm = {}
        this.checkForm.id = this.proApprovalInfo.id;
        this.checkForm.checkFilePath = "";
        if (this.proApprovalInfo.checkFilePath) {
          this.oldCheckFilePath = this.proApprovalInfo.checkFilePath;
          // this.checkForm.checkFilePath = this.proApprovalInfo.checkFilePath;
          this.checkForm.checkFileCreateBy = this.proApprovalInfo.checkFileCreateBy;
          this.checkForm.checkFileCreateTime = this.proApprovalInfo.checkFileCreateTime;
        }
      },
      submitCheckForm() {
        if (this.oldCheckFilePath) {
          // 记录历史文件
          this.biddingFilesHis.infoId = this.checkForm.id;
          this.biddingFilesHis.hisFilePaths = this.oldCheckFilePath;
          this.biddingFilesHis.fileType = 11;
          this.biddingFilesHis.uploadBy = this.checkForm.checkFileCreateBy;
          this.biddingFilesHis.uploadTime = this.checkForm.checkFileCreateTime;
          saveBiddingFilesHis(this.biddingFilesHis).then(res => {

          })
        }
        this.checkForm.checkFileCreateBy = this.$store.getters.name;
        this.checkForm.checkFileCreateTime = this.parseTime(new Date(), "{y}-{m}-{d} {h}:{i}:{s}");
        this.checkForm.checkTime = this.parseTime(new Date(), "{y}-{m}-{d} {h}:{i}:{s}");
        updateProApprovalInfo(this.checkForm).then(() => {
          this.open = false;
          this.msgSuccess("上传成功！");
          this.getProInfo(this.id);
        })
      },
      cancelUploadCheckForm() {
        this.open = false;
      },

      handleBack() {
        if (this.proDetailFlag === '1') {
          this.closeView("/proManagement/proImplement/proEstablish/proMainTask", "/proManagement/proImplement/proEstablish", 0)
        } else if (this.proDetailFlag === '2') {
          this.closeView("/proManagement/proImplement/proEstablish/proMainTask", "/proManagement/proImplement/drawUpPlan", 0)
        } else if (this.proDetailFlag === '3') {
          this.closeView("/proManagement/proImplement/proEstablish/proMainTask", "/proManagement/proImplement/planReview", 0)
        } else if (this.proDetailFlag === '4') {
          this.closeView("/proManagement/proImplement/proEstablish/proMainTask", "/proManagement/proImplement/proRecruit", 0)
        } else if (this.proDetailFlag === '5') {
          this.closeView("/proManagement/proImplement/proEstablish/proMainTask", "/proManagement/proImplement/proLaunch", 0)
        } else if (this.proDetailFlag === '6') {
          this.closeView("/proManagement/proImplement/proEstablish/proMainTask", "/proManagement/proImplement/proImplementation", 0)
        } else if (this.proDetailFlag === '7') {
          this.closeView("/proManagement/proImplement/proEstablish/proMainTask", "/proManagement/conclude/result", 0)
        } else if (this.proDetailFlag === '8') {
          this.closeView("/proManagement/proImplement/proEstablish/proMainTask", "/proManagement/conclude/conclude", 0)
        } else if (this.proDetailFlag === '9') {
          this.closeView("/proManagement/proImplement/proEstablish/proMainTask", "/proManagement/conclude/audit", 0)
        } else if (this.proDetailFlag === '10') {
          this.closeView("/proManagement/proImplement/proEstablish/proMainTask", "/proManagement/conclude/check", 0)
        }
      },

      //监听滚动事件
      bScroll(position) {
        if (-position.y >= this.$refs.proAcceptance.offsetTop) {
          this.tabActiveName = '10'
        } else if (-position.y >= this.$refs.proFinalize.offsetTop) {
          this.tabActiveName = '9'
        } else if (-position.y >= this.$refs.researchResults.offsetTop) {
          this.tabActiveName = '8'
        } else if (-position.y >= this.$refs.proImplement.offsetTop) {
          this.tabActiveName = '7'
        } else if (-position.y >= this.$refs.startMeeting.offsetTop) {
          this.tabActiveName = '6'
        } else if (-position.y >= this.$refs.proFund.offsetTop) {
          this.tabActiveName = '5'
        } else if (-position.y >= this.$refs.recruitmentPlan.offsetTop) {
          this.tabActiveName = '4'
        } else if (-position.y >= this.$refs.proPlan.offsetTop) {
          this.tabActiveName = '3'
        } else if (-position.y >= this.$refs.feasibilityStudy.offsetTop) {
          this.tabActiveName = '2'
        } else {
          this.tabActiveName = '1'
        }
      },
      tabChange(value) {
        switch (value.name) {
          case '1':
            console.log(this.$refs.baseInfo.offsetTop)
            this.$refs.scroll.scrollTo(0, -this.$refs.baseInfo.offsetTop)
            break;
          case '2':
            console.log(this.$refs.feasibilityStudy.offsetTop)
            this.$refs.scroll.scrollTo(0, -this.$refs.feasibilityStudy.offsetTop)
            break;
          case '3':
            console.log(this.$refs.proPlan.offsetTop)
            this.$refs.scroll.scrollTo(0, -this.$refs.proPlan.offsetTop)
            break;
          case '4':
            console.log(this.$refs.recruitmentPlan.offsetTop)
            this.$refs.scroll.scrollTo(0, -this.$refs.recruitmentPlan.offsetTop)
            break;
          case '5':
            console.log(this.$refs.proFund.offsetTop)
            this.$refs.scroll.scrollTo(0, -this.$refs.proFund.offsetTop)
            break;
          case '6':
            console.log(this.$refs.startMeeting.offsetTop)
            this.$refs.scroll.scrollTo(0, -this.$refs.startMeeting.offsetTop)
            break;
          case '7':
            console.log(this.$refs.proImplement.offsetTop)
            this.$refs.scroll.scrollTo(0, -this.$refs.proImplement.offsetTop)
            break;
          case '8':
            console.log(this.$refs.researchResults.offsetTop)
            this.$refs.scroll.scrollTo(0, -this.$refs.researchResults.offsetTop)
            break;
          case '9':
            console.log(this.$refs.proFinalize.offsetTop)
            this.$refs.scroll.scrollTo(0, -this.$refs.proFinalize.offsetTop)
            break;
          case '10':
            console.log(this.$refs.proAcceptance.offsetTop)
            this.$refs.scroll.scrollTo(0, -this.$refs.proAcceptance.offsetTop)
            break;
        }
      },
      //刷新滚动
      refreshBScroll() {
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
          if (this.$route.query.tabActiveName) {
            this.tabActiveName = this.$route.query.tabActiveName
            this.tabChange({name: this.tabActiveName})
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .app-container {
    width: 100%;
    height: 100%;
    position: relative;
    padding: 20px 30px 40px 30px;
    display: flex;
    flex-direction: column;

    .header {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 20px;

      .pro-name {
        width: 100%;
        margin-bottom: 30px;
        display: flex;
        justify-content: space-between;
        .pro-name-text {
          width: 80%;
          font-size: 24px;
          font-weight: bold;
        }
      }
      .pro-steps {
        width: 90%;
      }
    }

    .main {
      width: 100%;
      display: flex;

      .left-box {
        width: 20%;
        margin-right: 20px;
      }

      .wrapper {
        width: 85%;
        height: 100%;
        position: absolute;
        top: 175px;
        bottom: 0;
        left: 14%;
        right: 0;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding-top: 10px;

        span {
          font-size: 18px;
          font-weight: 500;
          color: #000;
          margin-bottom: 10px;
        }

        .base-info,
        .feasibility-study,
        .pro-plan,
        .recruitment-plan,
        .pro-fund,
        .start-meeting,
        .pro-implement,
        .start-meeting,
        .research-results,
        .pro-finalize,
        .pro-acceptance {
          width: 100%;
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
        }

        .lastDiv {
          width: 100%;
          height: 550px;
        }
      }
    }
  }
</style>
