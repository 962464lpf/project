<template>
  <div class="app-container">
    <div class="header">
      <div class="pro-name">
        <div class="detail-title">{{form.projectName}} {{selectDictLabel(awardTypeOptions, form.awardsType)}}</div>
        <div class="pro-name-subtitle">申报信息：{{form.declareUnit ? form.declareUnit : ''}}&nbsp;{{form.createUserName}}申报于{{parseTime(form.declareTime, '{y}-{m}-{d}')}}
        </div>
      </div>
      <div class="option-btn">
        <el-row :gutter="15">
          <el-col :span="1.5">
            <el-button
              type="primary"
              @click="handleBack"
            >返回
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              @click="handleUpdate(form)"
              v-if="form.declareStatus === 4 || form.declareStatus === 15 || form.declareStatus === 6 || form.declareStatus === 7 || form.declareStatus === 8"
              v-hasPermi="['sel:selDeclareInfo:update']"
            >编辑
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-if="form.declareStatus === 2 || form.declareStatus === 13"
              type="primary"
              v-hasPermi="['sel:selDeclareInfo:editDeclareStatus']"
              @click="handleUpdateOpinion(1)"
            >同意
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-if="form.declareStatus === 2 || form.declareStatus === 13"
              type="warning"
              v-hasPermi="['sel:selDeclareInfo:editDeclareStatus']"
              @click="handleUpdateOpinion(2)"
            >退回
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-if="form.declareStatus === 2 || form.declareStatus === 13"
              type="warning"
              v-hasPermi="['sel:selDeclareInfo:editDeclareStatus']"
              @click="handleUpdateOpinion(3)"
            >拒绝
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              @click="handleEditDeclareStatus(form, 1)"
              v-if="form.canChangeStatus && (form.declareStatus === 10 || form.declareStatus === 16)"
              v-hasPermi="['sel:selDeclareInfo:editDeclareStatus']"
            >同意
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              @click="handleEditDeclareStatus(form, 2)"
              v-if="form.canChangeStatus && (form.declareStatus === 10 || form.declareStatus === 16 || form.declareStatus === 4 || form.declareStatus === 15)"
              v-hasPermi="['sel:selDeclareInfo:editDeclareStatus']"
            >退回
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              @click="handleEditDeclareStatus(form, 3)"
              v-if="form.canChangeStatus && (form.declareStatus === 4 || form.declareStatus === 15)"
              v-hasPermi="['sel:selDeclareInfo:editDeclareStatus']"
            >拒绝
            </el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="pro-name-subtitle" style="color: red" v-if="form.declareStatus==3||form.declareStatus==4||form.declareStatus==10">
      评审意见：{{form.auditIdea}}
    </div>
    <div class="pro-name-subtitle" style="color: red" v-if="form.declareStatus==14||form.declareStatus==15||form.declareStatus==16">
      评审意见：{{form.reAuditIdea}}
    </div>
    <!-- 审批操作对话框 -->
    <el-dialog :visible.sync="opinionOpen" width="600px" append-to-body :close-on-click-modal="false">
      <el-form ref="opinionForm" :model="opinionForm" :rules="opinionRules" label-width="96px">
        <el-form-item label="审核意见" prop="auditIdea">
          <el-input v-model="opinionForm.auditIdea" type="textarea" placeholder="请输入审核意见" rows="4" maxlength="500"
                    show-word-limit/>
        </el-form-item>
        <el-form-item label="附件" prop="filePaths">
          <upload v-model="opinionForm.filePaths"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitOpinionForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-radio-group v-if="form.submitPdfFilePaths && form.pptFilePaths" v-model="tabIndex" style="margin-bottom: 15px;">
      <el-radio-button label="1">申报手册</el-radio-button>
      <el-radio-button label="2">项目简介</el-radio-button>
      <el-radio-button label="3">PPT</el-radio-button>
    </el-radio-group>
    <iframe v-if="form.submitPdfFilePaths && tabIndex == '1'" :src="form.submitPdfFilePaths" frameborder="0"
            style="width: 100%;height: calc(100vh - 170px);"></iframe>
    <projectBrief v-if="tabIndex == '2'" :form="form"/>
    <iframe v-if="form.pptFilePaths && tabIndex == '3'" :src="form.pptFilePaths" frameborder="0"
            style="width: 100%;height: calc(100vh - 170px);"></iframe>

    <div class="detail-hint" style="padding-top: 20px;" v-if="form.selDeclareScience">附件</div>
    <table class="detail-table" v-if="form.selDeclareScience">
      <tr>
        <td>知识产权证明</td>
        <td>
          <upload v-model="form.selDeclareScience.prove1FilePaths" :edit="false"/>
        </td>
      </tr>
      <tr>
        <td>应用证明</td>
        <td>
          <upload v-model="form.selDeclareScience.prove2FilePaths" :edit="false"/>
        </td>
      </tr>
      <tr>
        <td>技术评价证明</td>
        <td>
          <upload v-model="form.selDeclareScience.prove3FilePaths" :edit="false"/>
        </td>
      </tr>
      <tr>
        <td>其他证明</td>
        <td>
          <upload v-model="form.selDeclareScience.prove4FilePaths" :edit="false"/>
        </td>
      </tr>
    </table>
    <el-tabs v-model="activeName">
      <el-tab-pane label="操作日志" name="操作日志">
        <el-table ref="table" :data="logList">
          <el-table-column prop="userName" label="操作人"></el-table-column>
          <el-table-column prop="operName" label="操作事件"></el-table-column>
          <el-table-column prop="createTime" label="时间"></el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-tab-pane>
      <el-tab-pane label="审核历史" name="审核历史">
        <el-table ref="table2" :data="approvalLogList">
          <el-table-column width="200" prop="operUserName" label="审核人" align="center"/>
          <el-table-column prop="remark" label="审核意见" align="center" show-overflow-tooltip/>
          <el-table-column width="300" prop="filePaths" label="附件" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.filePaths" style="display: flex; justify-content: center">
                <upload v-model="scope.row.filePaths" :edit="false"></upload>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="300" prop="createTime" label="审核时间" align="center"/>
        </el-table>
        <pagination
          v-show="approvalTotal > 0"
          :total="approvalTotal"
          :page.sync="approvalQueryParams.pageNum"
          :limit.sync="approvalQueryParams.pageSize"
          @pagination="getApprovalLogList"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {getSelDeclareInfo, updateSelDeclareInfo, auditSubmit, saveUserInfo} from "@/api/sel/selDeclareInfo";
  import {listSelOperLog, addSelOperLog, approvalList} from "@/api/sel/selOperLog";
  import projectBrief from '../../components/projectBrief';

  export default {
    name: "sel-selDeclareInfo-detail",
    components: {
      projectBrief
    },
    data() {
      return {
        // 表单参数
        form: {},
        src: '',
        detail: false,
        // 审批意见弹出层
        opinionOpen: false,
        opinionOpenType: 1,
        //审批意见表单
        opinionForm: {},
        //审批意见表单校验
        opinionRules: {
          auditIdea: [
            {required: true, message: "审核意见不能为空", trigger: "blur", pattern: '[^ \x22]+'}
          ]
        },
        declareStatus: undefined,
        // 操作日志查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          infoId: this.$route.query.id
        },
        //操作日志总数
        total: 0,
        //操作日志列表
        logList: [],
        // 操作日志查询参数
        approvalQueryParams: {
          pageNum: 1,
          pageSize: 10,
          infoId: this.$route.query.id,
          type: 1
        },
        //操作日志总数
        approvalTotal: 0,
        //操作日志列表
        approvalLogList: [],
        activeName: '操作日志',
        tabIndex: '1',
        awardTypeOptions: []
      };
    },
    computed: {
      id: function () {
        return this.$route.query.id
      }
    },
    activated() {
      this.init();
    },
    created() {
      this.init();
      //申报奖项字典
      this.getDicts("award_type").then(response => {
        this.awardTypeOptions = response.data;
      });
    },
    methods: {
      init() {
        const id = this.$route.query.id;
        if (this.$route.path == '/sel/awardAudit/detail') {
          this.detail = true;
        }
        this.opinionForm.id = id;
        getSelDeclareInfo(id).then(response => {
          this.form = response.data;
          let pptFilePaths = this.form.pptFilePaths;
          if (pptFilePaths) {
            pptFilePaths = JSON.parse(pptFilePaths);
            pptFilePaths = pptFilePaths[0].fileName;
            this.form.pptFilePaths = pptFilePaths;
          }
        });
        this.getList();
        this.getApprovalLogList();
        saveUserInfo(id);
      },
      getList() {
        listSelOperLog(this.queryParams).then(response => {
          this.logList = response.rows;
          this.total = response.total;
        });
      },
      getApprovalLogList() {
        listSelOperLog(this.approvalQueryParams).then(response => {
          this.approvalLogList = response.rows;
          this.approvalTotal = response.total;
        });
      },

      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id;
        let path = '/sel/selDeclareInfo/science';
        let query = {id: id, kxbEdit: 1};
        if (row.awardsType == '1') {
          path = '/sel/selDeclareInfo/science';
        }
        if (row.awardsType == '2') {
          path = '/sel/selDeclareInfo/patent';
        }
        const log = {}
        log.infoId = row.id;
        log.operName = '编辑申报'
        addSelOperLog(log);
        this.$router.push({
          path: path,
          query: query
        })
      },

      handleUpdateOpinion(status) {
        this.opinionOpenType = 1
        let declareStatus = -999;
        if(this.$route.query.auditType == 1){ //申报审核
          if(status == 1){//同意
              declareStatus = 4;
          }else if(status == 2){//退回
              declareStatus = 3;
          }else if(status == 3){//拒绝
              declareStatus = 10;
          }
        }else if(this.$route.query.auditType == 2){//补充资料审核
          if(status == 1){
              declareStatus = 15
          }else if(status == 2){
              declareStatus = 14;
          }else if(status == 3){
              declareStatus = 16;
          }
        }else {
            this.msgError('审核页面异常，请重新进入')
            return;
        }
        if(declareStatus != -999){
            this.opinionOpen = true;
            this.resetForm("opinionForm");
            this.opinionForm.declareStatus = declareStatus;
        }
      },

      handleEditDeclareStatus(row, status) {
        this.opinionOpenType = 2
        let preStatus = row.declareStatus;
        let operName = '';
        if (status == 3) {
          operName = '拒绝';
        } else if (status == 2) {
          operName = '退回';
        } else if (status == 1) {
          operName = '同意';
        }
        let declareStatus = -999;
        if (preStatus == 4) { //申报审核同意时
          if (status == 2) { //退回
            declareStatus = 3;
          } else if (status == 3) {//拒绝
            declareStatus = 10;
          }
        } else if (preStatus == 15) { //资料补充审核同意时
          if (status == 2) {
            declareStatus = 14;
          } else if (status == 3) {
            declareStatus = 16;
          }
        } else if (preStatus == 10) { //申报审核拒绝时
          if (status == 1) {
            declareStatus = 4;
          } else if (status == 2) {
            declareStatus = 3;
          }
        } else if (preStatus == 16) { //资料补充审核拒绝时
          if (status == 1) {
            declareStatus = 15;
          } else if (status == 2) {
            declareStatus = 14;
          }
        }
        if (declareStatus != -999) {
          this.$confirm('确认要' + operName + '吗?', "系统提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.opinionOpen = true;
            this.resetForm("opinionForm");
            this.opinionForm.id = row.id;
            this.opinionForm.declareStatus = declareStatus;
            this.opinionForm.preStatus = preStatus;
          }).catch(function () {
          });
        } else {
          this.msgError('参数错误，请刷新页面后重试')
        }
      },

      /** 审批意见提交按钮 */
      submitOpinionForm: function () {
        if (this.opinionOpenType === 1) {
          getSelDeclareInfo(this.opinionForm.id).then(response => {
            if (response.data.declareStatus == 1) {//已撤回
              this.msgInfo('该记录已被提交者撤回！');
            } else if (response.data.declareStatus == 11) {//已作废
              this.msgInfo('该记录已被提交者作废！');
            } else if (response.data.declareStatus != 2 && response.data.declareStatus != 13) {//已审核
              this.msgInfo('该记录已被其他审核人审核！');
            } else {
              this.$refs["opinionForm"].validate(valid => {
                if (valid) {
                  this.opinionOpen = false;
                  auditSubmit(this.opinionForm).then(response => {
                    if (response.code === 200) {
                      let result = '';
                      let auditName = this.$route.query.auditType == 1 ? '提交申报审核结果' : '提交补充资料审核结果';
                      if (this.opinionForm.declareStatus == 4 || this.opinionForm.declareStatus == 15) {
                        result = '同意';
                      } else if (this.opinionForm.declareStatus == 3 || this.opinionForm.declareStatus == 14) {
                        result = '退回';
                      } else if (this.opinionForm.declareStatus == 10 || this.opinionForm.declareStatus == 16) {
                        result = '拒绝';
                      }
                      const log = {};
                      log.infoId = this.opinionForm.id;
                      log.operName = auditName + '(' + result + '，' + this.opinionForm.auditIdea + ')';
                      log.filePaths = this.opinionForm.filePaths;
                      log.remark = this.opinionForm.auditIdea;
                      addSelOperLog(log);
                      this.msgSuccess(response.msg);
                      this.closeView('/sel/awardAudit/detail', '/sel/awardAudit', 0);
                    } else {
                      this.msgError(response.msg);
                    }
                  });
                }
              });
            }
          });
        } else {
          getSelDeclareInfo(this.opinionForm.id).then(response => {
            if (response.data.declareStatus != this.opinionForm.preStatus) {
              this.msgInfo('该记录审核状态已改变，请刷新页面后重试');
            } else {
              this.$refs["opinionForm"].validate(valid => {
                if (valid) {
                  auditSubmit(this.opinionForm).then(response => {
                    this.opinionOpen = false;
                    if (response.code === 200) {
                      let result = '';
                      let auditName = this.opinionForm.preStatus < 11 ? '变更申报审核状态' : '变更补充资料审核状态';
                      if (this.opinionForm.declareStatus == 4 || this.opinionForm.declareStatus == 15) {
                        result = '同意';
                      } else if (this.opinionForm.declareStatus == 3 || this.opinionForm.declareStatus == 14) {
                        result = '退回';
                      } else if (this.opinionForm.declareStatus == 10 || this.opinionForm.declareStatus == 16) {
                        result = '拒绝';
                      }
                      const log = {};
                      log.infoId = this.opinionForm.id;
                      log.operName = auditName + '(' + result + '，' + this.opinionForm.auditIdea + ')';
                      log.filePaths = this.opinionForm.filePaths;
                      log.remark = this.opinionForm.auditIdea;
                      addSelOperLog(log);
                      this.msgSuccess('操作成功');
                      this.closeView('/sel/awardAudit/detail', '/sel/awardAudit', 0);
                    } else {
                      this.msgError('操作失败');
                    }
                  });
                }
              });
            }
          });
        }
      },
      // 取消按钮
      cancel() {
        this.opinionOpen = false;
        this.opinionForm = {
          auditIdea: undefined
        }
        this.resetForm("opinionForm");
      },
      /** 返回 */
      handleBack() {
        this.closeView('/sel/awardAudit/detail', '/sel/awardAudit', 0);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .header {
    width: 100%;
    display: flex;
    margin-bottom: 20px;

    .option-btn {
      width: 40%;
      display: flex;
      justify-content: flex-end;
    }

    .pro-name {
      width: 70%;
      display: flex;
      flex-direction: column;
      font-size: 24px;
      .pro-name-subtitle {
        font-size: 18px;
        color: #666;
      }
    }
  }

  iframe {
    width: 100%;
    height: 100%;
  }
  .detail-title {
    font-size: 24px;
    color: #333;
    font-weight: bold;
  }
</style>
