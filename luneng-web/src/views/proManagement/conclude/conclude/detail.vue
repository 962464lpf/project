<template>
  <div class="app-container">
    <el-row class="mb10">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-back"
          @click="handleCancel"
          v-if="!edit"
        >返回
        </el-button>
      </el-col>
      <div class="fr" v-if="edit">
        <el-button
          type="primary"
          @click="handleSubmit()"
          :disabled="!isSubmit"
        >提交
        </el-button>
        <el-button
          type="warning"
          @click="handleCancel()"
        >取消
        </el-button>
      </div>
    </el-row>
    <div class="detail-title" style="padding-bottom: 20px;">{{ form.projectName }}</div>
    <el-form v-if="edit" :rules="rules" ref="form" :model="form">
      <table class="pdf-show-table" style="text-align: center">
        <tbody>
        <tr>
          <td colspan="4">科技项目验收申请表</td>
        </tr>
        <tr>
          <td style="width:15%;min-width: 80px;"><span style="color: red">*</span>项目名称</td>
          <td colspan="3">
            <el-form-item prop="projectName" v-if="edit">
              <el-input v-model="form.projectName" @blur="submit" maxlength="30"/>
            </el-form-item>
            <span v-if="!edit">{{ form.projectName }}</span>
          </td>
        </tr>
        <tr>
          <td style="width:15%;min-width: 80px;"><span style="color: red">*</span>项目编号</td>
          <td style="min-width: 360px;width:35%;">
            <el-form-item prop="projectCode" v-if="edit">
              <el-input v-model="form.projectCode" maxlength="20" show-word-limit/>
            </el-form-item>
            <span v-if="!edit">{{ form.projectCode }}</span>
          </td>
          <td style="width:15%;min-width: 80px;">申请验收时间</td>
          <td style="min-width: 360px;width:35%;">
            <el-form-item prop="checkDate" v-if="edit">
              <el-date-picker
                @change="submit"
                v-model="form.checkDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <span v-if="!edit">{{ form.checkDate }}</span>
          </td>
        </tr>
        <tr>
          <td>承担单位</td>
          <td colspan="3">
            <el-form-item prop="gender" v-if="edit">
              <el-input v-model="form.undertakeUnit" @blur="submit" show-word-limit maxlength="30"/>
            </el-form-item>
            <span v-if="!edit">{{ form.undertakeUnit }}</span>
          </td>
        </tr>
        <tr>
          <td>联系人</td>
          <td>
            <el-form-item prop="contactsName" v-if="edit">
              <el-input v-model="form.contactsName" @blur="submit" show-word-limit maxlength="10"/>
            </el-form-item>
            <span v-if="!edit">{{ form.contactsName }}</span>
          </td>
          <td>联系电话</td>
          <td>
            <el-form-item prop="contactsPhone" v-if="edit">
              <a-input type="phone" v-model="form.contactsPhone" @blur="submit" show-word-limit maxlength="11"/>
            </el-form-item>
            <span v-if="!edit">{{ form.contactsPhone }}</span>
          </td>
        </tr>
        <tr>
          <td>提供验收的技术文件清单</td>
          <td align="left" colspan="8">
            <el-form-item prop="fileList" v-if="edit">
              <el-input type="textarea" v-model="form.fileList" @blur="submit" rows="6" show-word-limit
                        maxlength="500"/>
            </el-form-item>
            <span v-if="!edit">{{ form.fileList }}</span>
          </td>
        </tr>
        <tr>
          <td>申请验收单位意见</td>
          <td align="left" colspan="8">
            <el-form-item prop="concludeOpinion" v-if="edit">
              <el-input type="textarea" v-model="form.concludeOpinion" @blur="submit" rows="6" show-word-limit
                        maxlength="500"/>
            </el-form-item>
            <span v-if="!edit">{{ form.concludeOpinion }}</span>
          </td>
        </tr>
        </tbody>
      </table>
      <el-form-item prop="pdfUrl" v-if="edit">
        <div class="red-placeholder" style="padding-top: 10px;" v-if="edit">
          <preview-pdf :id="form.id" type="conclude"/>
          <div>
            <upload accept=".pdf" v-model="form.pdfUrl" @change="submit" @remove="submit"/>
            <div class="el-upload__tip red-hint">只能上传PDF格式的文件，分辨率为300dpi彩色，且文件不超过5M</div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div v-if="!edit">
      <el-radio-group v-model="tabIndex" style="margin-bottom: 20px;">
        <el-radio-button label="1">验收申请表</el-radio-button>
        <el-radio-button label="2">成果文件</el-radio-button>
      </el-radio-group>
      <PdfView v-if="tabIndex==1" :src="form.pdfUrl" from="upload"/>
      <div v-if="tabIndex==2">
        <table class="pdf-show-table">
          <template v-for="item in auditOpinions">
            <tr>
              <td style="width: 200px;">{{ item.resultTypeName }}</td>
              <td align="left">
                <template v-for="acceptFilePaths in item.acceptFilePaths">
                  <upload :value="acceptFilePaths" :edit="false" hint="" style="display: inline-block;"/>
                </template>
                <template v-for="formalFilePaths in item.formalFilePaths">
                  <upload :value="formalFilePaths" :edit="false" hint="" style="display: inline-block;"/>
                </template>
              </td>
              <td>
                <el-button
                  type="primary"
                  @click="getHistoryFile(item)"
                >历史版本
                </el-button>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <span>{{ item.auditOpinion }}</span>
              </td>
            </tr>
          </template>
        </table>
      </div>
    </div>
    <el-tabs v-model="tableIndex" v-if="!edit">
      <el-tab-pane label="操作日志" name="1">
        <el-table ref="table" :data="logList">
          <el-table-column prop="operUserName" label="操作人"/>
          <el-table-column prop="operName" label="操作事件"/>
          <el-table-column prop="createTime" label="时间"></el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getLogList"
        />
      </el-tab-pane>
    </el-tabs>
    <!-- 历史版本对话框 -->
    <el-dialog :visible.sync="historyOpen" width="700px" append-to-body :close-on-click-modal="false">
      <div>
        <el-table ref="table" :data="historyList">
          <el-table-column prop="acceptFilePaths" label="文件">
            <template slot-scope="scope">
              <div style="display: inline-block;">
                <upload :value="scope.row.hisFilePaths" :edit="false" hint=""/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="时间" width="150px"/>
        </el-table>
        <pagination
          v-show="historyTotal > 0"
          :total="historyTotal"
          :page.sync="historyQueryParams.pageNum"
          :limit.sync="historyQueryParams.pageSize"
          @pagination="getHistoryFile"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="historyOpen=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getLogList,
  operation,
  getConcludeInfoByInfoId,
  updateConcludeInfo,
  getAuditOpinions,
  getHistoryFile
} from "@/api/conclude/result"
import {
  validProjectCode
} from "@/api/pro/proApprovalInfo";
import PdfView from "@/components/PdfView";
import {concludePreview} from "@/api/conclude/result";

export default {
  components: {
    PdfView
  },
  data() {
    return {
      form: {},
      edit: true,
      infoId: undefined,
      logList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        infoId: undefined
      },
      total: 0,
      tableIndex: "1",
      isSubmit: true,
      rules: {
        projectName: [
          {required: true, message: "项目名称不能为空", trigger: "blur", pattern: '[^ \x22]+'}
        ],
        projectCode: [
          {required: true, message: "项目编号不能为空", trigger: "blur"},
          {
            pattern: /^52[\dA-Za-z]{10}$/,
            message: "项目编号格式为52开头后跟10位数字或字母",
            trigger: "blur"
          }
        ]
      },
      tabIndex: "1",
      auditOpinions: [],
      historyOpen: false,
      historyList: [],
      historyQueryParams: {
        pageNum: 1,
        pageSize: 10,
        infoId: undefined
      },
      historyTotal: 0,
    }
  },
  activated() {
    this.init();
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.edit = this.$route.query.type == "2";
      this.infoId = this.$route.query.infoId;
      this.queryParams.infoId = this.infoId;
      if (this.$route.query.type == "1") {
        this.getLogList();
        this.getAuditOpinions();
      }
      this.getConcludeInfoByInfoId();
    },
    getHistoryFile(row) {
      this.historyOpen = true;
      this.historyQueryParams.infoId = row.infoId;
      this.historyQueryParams.resultType = row.resultType;
      getHistoryFile(this.historyQueryParams).then(res => {
        this.historyList = res.rows;
        this.historyTotal = res.total;
      })
    },
    getAuditOpinions() {
      getAuditOpinions(this.infoId).then(res => {
        this.auditOpinions = res.data;
      })
    },
    // 获取操作日志
    getLogList() {
      getLogList(this.queryParams).then(res => {
        this.logList = res.rows;
        this.total = res.total;
      })
    },
    // 获取立项详情
    getConcludeInfoByInfoId() {
      getConcludeInfoByInfoId(this.infoId).then(res => {
        this.form = res.data;
      })
    },
    submit() {
      updateConcludeInfo(this.form);
    },
    // 提交方法
    handleSubmit() {
      if (!this.form.pdfUrl) {
        this.msgError("需要盖章的pdf文件上传不能为空");
        return;
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          validProjectCode(this.form).then(response => {
            if (!response.data) {
              this.msgError('项目编码已存在！')
            } else {
              this.isSubmit = false;
              if ((this.form.pdfUrl)) {
                operation({"infoId": this.infoId, "operation": 2}).then(res => {
                  this.isSubmit = true;
                  this.msgSuccess("操作成功！");
                  if (this.$route.query.flag == 1) {
                    this.closeView("/proManagement/conclude/conclude/apply", "/proManagement/proImplement/proEstablish/proMainTask?id=" + this.$route.query.infoId + "&proDetailFlag=" + this.$route.query.proDetailFlag + "&tabActiveName=" + this.$route.query.tabActiveName, 0);
                  } else {
                    this.closeView("/proManagement/conclude/conclude/apply", "/proManagement/conclude/conclude", 0);
                  }
                }).catch(() => {
                  this.isSubmit = true;
                })
              } else {
                concludePreview({id: this.form.id}).then(res => {
                  this.form.pdfUrl = res.msg;
                  updateConcludeInfo(this.form).then(res => {
                    operation({"infoId": this.infoId, "operation": 2}).then(res => {
                      this.isSubmit = true;
                      this.msgSuccess("操作成功！");
                      console.log(this.$route.query.flag);
                      if (this.$route.query.flag == 1) {
                        this.closeView("/proManagement/conclude/conclude/apply", "/proManagement/proImplement/proEstablish/proMainTask?id=" + this.$route.query.infoId + "&proDetailFlag=" + this.$route.query.proDetailFlag + "&tabActiveName=" + this.$route.query.tabActiveName, 0);
                      } else {
                        this.closeView("/proManagement/conclude/conclude/apply", "/proManagement/conclude/conclude", 0);
                      }
                    }).catch(() => {
                      this.isSubmit = true;
                    })
                  }).catch(() => {
                    this.isSubmit = true;
                  })
                }).catch(() => {
                  this.isSubmit = true;
                })
              }
            }
          })
        }
      })
    },
    // 取消
    handleCancel() {
      if (this.$route.query.flag == 1) {
        this.closeView("/proManagement/conclude/conclude/apply", "/proManagement/proImplement/proEstablish/proMainTask?id=" + this.$route.query.infoId + "&proDetailFlag=" + this.$route.query.proDetailFlag + "&tabActiveName=" + this.$route.query.tabActiveName, 0);
      } else {
        if (this.$route.query.type == 1) {
          this.closeView("/proManagement/conclude/conclude/detail", "/proManagement/conclude/conclude", 0);
        } else if (this.$route.query.type == 2) {
          this.closeView("/proManagement/conclude/conclude/apply", "/proManagement/conclude/conclude", 0);
        }
      }
    }

  }
}
</script>
