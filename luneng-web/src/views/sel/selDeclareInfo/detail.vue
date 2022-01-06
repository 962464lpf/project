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
              @click="handleBack">返回
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              @click="handleUpdate(form)"
              v-if="form.declareStatus === 1 || form.declareStatus === 3"
              v-hasPermi="['sel:selDeclareInfo:update']"
            >编辑</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              @click="handleDelete(form)"
              v-if="form.declareStatus === 1 || form.declareStatus === 3 || form.declareStatus === 11"
              v-hasPermi="['sel:selDeclareInfo:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              @click="changeDeclareStatus(form, 1)"
              v-if="form.declareStatus === 2"
              v-hasPermi="['sel:selDeclareInfo:back']"
            >撤回</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              @click="changeDeclareStatus(form, 11)"
              v-hasPermi="['sel:selDeclareInfo:invalid']"
              v-if="form.declareStatus === 2"
            >作废</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              @click="handleAdditionalData(form)"
              v-hasPermi="['sel:selDeclareInfo:supplement']"
              :disabled="form.uploadFlag === 0"
              v-if="(form.declareStatus === 4 || form.declareStatus === 12 || form.declareStatus === 14) && form.awardsType == '1'"
            >补充资料</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-if="releaseFlag === '1'"
              type="primary"
              @click="handleCooperation"
              v-hasPermi="['achie:achieDisplayInfo:apply']"
            >申请合作
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
    <el-tabs v-if="!releaseFlag" v-model="activeName">
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
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
      :show-close="false"
      :close-on-click-modal="false">
      <div style="padding: 0 40px 0 20px">
        <el-form
          ref="applyForm"
          :model="applyForm"
          :rules="applyRules"
          label-width="65px"
          label-position="left">
          <div style="font-size: 15px; line-height: 18px; color: #666; text-indent: 32px; margin-bottom: 20px">
            申请合作需要进行审核，您可以在下方留下您合作的意愿，待审核通过后即可查看成果所属单位的信息！
          </div>
          <el-form-item label="留言：" prop="message">
            <el-input
              v-model="applyForm.message"
              type="textarea"
              :rows="6"
              placeholder="请填写留言，字数不超过500"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {delSelDeclareInfo, getCountById, getSelDeclareInfo, updateSelDeclareInfo} from "@/api/sel/selDeclareInfo";
  import {addSelOperLog, listSelOperLog} from "@/api/sel/selOperLog";
  import projectBrief from '../../components/projectBrief';
  import {releaseRules} from "@/utils/el_validate";
  import {applyCooperation} from "@/api/achie/achieCooperationIntention";

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
        awardTypeOptions: [],
        //对话框
        applyForm: {
          infoId: null,
          message: null
        },
        applyRules: {
          message: [
            {required: true, message: "留言不能为空", trigger: "blur"},
            {max: 500, message: "最多500字", trigger: "blur"}
          ]
        },
        title: '申请合作',
        open: false
      };
    },
    computed: {
      id: function () {
        return this.$route.query.id
      },
      //成果展示申请标记
      releaseFlag() {
        return this.$route.query.releaseFlag ? this.$route.query.releaseFlag : null
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
        const id = this.$route.query.id
        getSelDeclareInfo(id).then(response => {
          this.form = response.data;
          let pptFilePaths = this.form.pptFilePaths;
          if (pptFilePaths) {
            pptFilePaths = JSON.parse(pptFilePaths);
            pptFilePaths = pptFilePaths[0].fileName;
            this.form.pptFilePaths = pptFilePaths;
          }
        });
        if (!this.releaseFlag) {
          this.getList();
          this.getApprovalLogList();
        }
      },

      getList() {
        listSelOperLog(this.queryParams).then(response => {
          this.logList = response.rows;
          this.total = response.total;
        });
      },
      getApprovalLogList(){
        listSelOperLog(this.approvalQueryParams).then(response => {
          this.approvalLogList = response.rows;
          this.approvalTotal = response.total;
        });
      },

      /** 修改按钮操作 */
      handleUpdate(row) {
        const id = row.id
        let path = '/sel/selDeclareInfo/science';
        let query = { id: id };
        if(row.awardsType == '1') {
          path = '/sel/selDeclareInfo/science';
        }
        if(row.awardsType == '2') {
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

      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id
        this.$confirm('是否确认删除?', "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          return delSelDeclareInfo(ids);
        }).then(() => {
          this.handleBack();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },

      //改变评审状态
      changeDeclareStatus(row, status) {
        const id = row.id
        let statusName = '';
        if(status == 1){
          statusName = '撤回'
        }else{
          statusName = '作废'
        }
        getSelDeclareInfo(id).then(response => {
          if(response.data.declareStatus!=2){//如果状态不是初审中，不能撤回或作废
            this.msgInfo('该记录已审核，不能'+statusName);
          } else {
            getCountById(id).then(response => {
              if(response.data > 0){
                this.msgInfo('该记录正在被审核，不能'+statusName);
              }else {
                this.$confirm('确认要'+statusName+'吗？', "系统提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                }).then(() => {
                  updateSelDeclareInfo({
                    id: id,
                    declareStatus: status
                  }).then(() => {
                    const log = {}
                    log.infoId = id;
                    log.operName = statusName + '申报'
                    addSelOperLog(log);
                    this.handleBack();
                    this.msgSuccess("操作成功");
                  })
                }).catch(function() {});
              }
            });
          }
        });
      },

      //跳转资料补充
      handleAdditionalData(row) {
        const path="/sel/selDeclareInfo/additionalData"
        const id=row.id;
        this.$router.push({
          "path": path,
          "query": {"id":id}
        })
      },

      //申请合作
      handleCooperation() {
        if (this.releaseFlag === '1') {
          this.open = true
        }
      },
      submitForm() {
        this.$refs["applyForm"].validate(valid => {
          if (valid) {
            this.applyForm.infoId = this.id
            applyCooperation(this.applyForm).then(() => {
              this.msgSuccess('申请成功')
              this.cancel()
              this.closeView('/sel/selDeclareInfo/detail', '/achievement/cooperation', 0)
            })
          }
        })
      },
      cancel() {
        this.open = false
        this.$refs["applyForm"].resetFields();
      },
      /** 返回 */
      handleBack() {
        if (this.releaseFlag === '1') {
          this.closeView('/sel/selDeclareInfo/detail', '/achievement/display', 0);
        } else {
          let path = "/sel/selDeclareInfo"
          this.closeView('/sel/selDeclareInfo/detail', path, 0);
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .option-btn {
      width: 50%;
      display: flex;
      justify-content: flex-end;
    }

    .pro-name {
      width: 50%;
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
