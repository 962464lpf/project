<template>
  <div class="app-container">
    <div class="header">
      <div class="pro-name">
        <div>{{form.projectName}}</div>
        <div class="pro-name-subtitle">{{form.createBy ? form.createBy : ''}}申报于{{parseTime(form.declareTime, '{y}-{m}-{d}')}}</div>
      </div>
      <div class="option-btn">
        <div class="option-btn-item">
          <el-button
            type="primary"
            @click="handleBack"
          >返回
          </el-button>
          <el-button
            type="primary"
            v-hasPermi="['project:projectStorageAudit:update']"
            @click="handleToEdit"
          >编辑
          </el-button>
          <el-button
            v-show="form.status === '2'"
            type="primary"
            v-hasPermi="['project:projectStorageAudit:updateStatus']"
            @click="handleUpdateOpinion('1')"
          >同意
          </el-button>
          <el-button
            v-show="form.status === '2'"
            type="warning"
            v-hasPermi="['project:projectStorageAudit:updateStatus']"
            @click="handleUpdateOpinion('2')"
          >退回
          </el-button>
          <el-button
            v-show="form.status === '2'"
            type="danger"
            v-hasPermi="['project:projectStorageAudit:updateStatus']"
            @click="handleUpdateOpinion('3')"
          >拒绝
          </el-button>

          <el-button
            v-show="form.status === '4' || form.status === '5'"
            type="primary"
            v-hasPermi="['project:projectStorageAudit:updateStatus']"
            @click="handleUpdateOpinion('7')"
          >同意
          </el-button>
          <el-button
            v-show="form.status === '3' || form.status === '5' || form.status === '6'"
            type="warning"
            v-hasPermi="['project:projectStorageAudit:updateStatus']"
            @click="handleUpdateOpinion('8')"
          >退回
          </el-button>
          <el-button
            v-show="form.status === '3' || form.status === '4' || form.status === '6'"
            type="danger"
            v-hasPermi="['project:projectStorageAudit:updateStatus']"
            @click="handleUpdateOpinion('9')"
          >拒绝
          </el-button>
        </div>
      </div>
    </div>
    <template v-if="form.additionalInformation == '1'">
      <el-radio-group v-model="tabIndex" style="margin-bottom: 20px;"
                      v-show="form.submitType == '0' && form.additionalInformation == '1'">
        <el-radio-button label="1">项目建议书</el-radio-button>
        <el-radio-button label="2">项目可研报告</el-radio-button>
      </el-radio-group>
    </template>
    <el-form v-if="tabIndex === '1'">
      <PdfView :src="form.adviceUrl"/>
    </el-form>
    <div v-if="tabIndex === '2'">
      <PdfView :src="form.feasibleUrl"/>
      <reportDetail v-model="form" :edit="false"/>
    </div>

    <el-tabs v-model="activeName" style="margin-top: 20px;">
      <el-tab-pane label="操作日志" name="操作日志">
        <el-table ref="table" :data="logList">
          <el-table-column prop="operUserName" label="操作人"/>
          <el-table-column prop="operName" label="操作事件">
            <template slot-scope="scope">
              <span>{{ scope.row.operName }}</span>
              <div v-if="scope.row.filePaths && scope.row.filePaths !== 'null'">
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
      <el-tab-pane label="历史版本" name="2">
        <el-table ref="table" :data="historyVersions">
          <el-table-column prop="createBy" label="操作人"></el-table-column>
          <el-table-column prop="createTime" label="操作时间"></el-table-column>
          <el-table-column prop="version" label="版本号"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleDetail(scope.row)">查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="historyTotal > 0"
          :total="historyTotal"
          :page.sync="historyQueryParams.pageNum"
          :limit.sync="historyQueryParams.pageSize"
          @pagination="getHistoryList"
        />
      </el-tab-pane>
      <el-tab-pane label="审批历史" name="3">
        <el-table ref="table" :data="approvalHis">
          <el-table-column prop="operUserName" label="操作人"></el-table-column>
          <el-table-column prop="operName" label="审批意见"></el-table-column>
          <el-table-column prop="createTime" label="时间"/>
        </el-table>
        <pagination
          v-show="approvalTotal > 0"
          :total="approvalTotal"
          :page.sync="approvalParams.pageNum"
          :limit.sync="approvalParams.pageSize"
          @pagination="getHistoryList"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- 审批操作对话框 -->
    <el-dialog :visible.sync="opinionOpen" width="600px" append-to-body :close-on-click-modal="false">
      <el-form ref="opinionForm" :model="opinionForm" :rules="opinionRules" label-width="96px">
        <el-form-item label="审批意见" prop="remark">
          <el-input v-model="opinionForm.remark" type="textarea" placeholder="请输入审批意见" rows="4" maxlength="500"
                    show-word-limit/>
        </el-form-item>
        <el-form-item label="附件" prop="filePaths">
          <upload v-model="opinionForm.filePaths" :limit="5"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitOpinionForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getProjectStorageInfo, listProjectStorageInfo} from "@/api/storage/projectStorageInfo";
  import {listProjectStorageAdvice} from "@/api/storage/projectStorageAdvice";
  import {operation} from "@/api/storage/audit";
  import {listOperLog} from "@/api/storage/operLog";
  import PdfView from "@/components/PdfView";
  import proposalContent from '../projectStorageInfo/proposal/index';
  import reportDetail from '../projectStorageInfo/report-detail';

  export default {
    name: "proManagement-storage-audit-detail",
    components: {
      PdfView, proposalContent, reportDetail
    },
    data() {
      return {
        // 表单参数
        form: {},
        src: '',
        detail: false,
        // 审批意见弹出层
        opinionOpen: false,
        //审批意见表单
        opinionForm: {},
        //审批意见表单校验
        opinionRules: {
          remark: [
            {required: true, message: "审批意见不能为空", trigger: "blur", pattern: '[^ \x22]+'}
          ]
        },
        declareStatus: undefined,
        // 操作日志查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          infoId: undefined
        },
        approvalParams: {
          pageNum: 1,
          pageSize: 10,
          infoId: undefined,
          type: "1"
        },
        // 审核历史总条数
        approvalTotal: 0,
        //操作日志总数
        total: 0,
        // 历史版本总条数
        historyTotal: 0,
        // 历史版本查询条件
        historyQueryParams: {
          pageNum: 1,
          pageSize: 10,
          infoId: undefined
        },
        //操作日志列表
        logList: [],
        // 历史版本
        historyVersions: [],
        activeName: '操作日志',
        tabIndex: '1',
        approvalHis: []
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
    },
    methods: {
      init() {
        const id = this.$route.query.id;
        if (this.$route.path == '/proManagement/storage/audit/detail') {
          this.detail = true;
        }
        getProjectStorageInfo(id).then(response => {
          this.form = response.data;
          if (this.form.submitType == '0') {
            this.tabIndex = '1';
          } else {
            this.tabIndex = '2';
          }
        });
        this.getList();
        this.getHistoryList();
      },
      getList() {
        this.queryParams.infoId = this.$route.query.id;
        listOperLog(this.queryParams).then(response => {
          this.logList = response.rows;
          this.total = response.total;
        });
        this.approvalParams.infoId = this.$route.query.id;
        listOperLog(this.approvalParams).then(response => {
          this.approvalHis = response.rows;
          this.approvalTotal = response.total;
        });
      },
      getHistoryList() {
        this.historyQueryParams.infoId = this.$route.query.id;
        listProjectStorageInfo(this.historyQueryParams).then(res => {
          this.historyVersions = res.rows;
          this.historyTotal = res.total;
        })
      },
      handleDetail(row) {
        let path = "/proManagement/storage/projectStorageInfo/historyDetail"
        let id = row.id;
        this.$router.push({
          "path": path,
          "query": {"id": id, "type": 2}
        })
      },
      handleToEdit() {
        operation({"infoId": this.id, "operation": "4"}).then(res => {
          if (res.code == 200) {
            this.$router.push({
              path: '/proManagement/storage/projectStorageInfo/report',
              query: {
                id: this.id,
                type: 2,
                edit: true
              }
            })
          }
        })
      },
      handleUpdateOpinion(declareStatus) {
        this.opinionOpen = true;
        this.reset();
        this.opinionForm.operation = declareStatus;
      },
      /** 审批意见提交按钮 */
      submitOpinionForm: function () {
        this.$refs["opinionForm"].validate(valid => {
          if (valid) {
            this.opinionOpen = false;
            this.opinionForm.infoId = this.id;
            operation(this.opinionForm).then(response => {
              if (response.code === 200) {
                this.closeView('/proManagement/storage/audit/detail', '/proManagement/storage/audit', 0);
                this.msgSuccess(response.msg);
              } else {
                this.msgInfo(response.msg);
              }
            });
          }
        });
      },
      // 取消按钮
      cancel() {
        this.opinionOpen = false;
        this.opinionForm = {
          remark: undefined
        }
        this.reset();
      },
      // 表单重置
      reset() {
        this.opinionForm = {
          remark: undefined,
          filePaths: undefined
        };
        this.resetForm("opinionForm");
      },
      /** 返回 */
      handleBack() {
        this.closeView('/proManagement/storage/audit/detail', '/proManagement/storage/audit', 0);
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
      width: 60%;
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

  iframe {
    width: 100%;
    height: 100%;
  }
</style>
