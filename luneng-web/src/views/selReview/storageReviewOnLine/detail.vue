<template>
  <div class="app-container">
    <el-row class="mb10">
      <el-col :span="1.5">
        <el-button
          type="primary"
          @click="handleBack"
        >返回
        </el-button>
      </el-col>
      <div class="fr" v-if="expertId">
        <el-button
          type="primary"
          @click="handleUpdateOpinion(0)"
        >同意
        </el-button>
        <el-button
          type="warning"
          @click="handleUpdateOpinion(1)"
        >不同意
        </el-button>
      </div>
    </el-row>
    <div class="detail-title">{{form.projectName}}</div>
    <div class="detail-hint">{{form.createBy ? form.createBy : ''}}申报于{{parseTime(form.declareTime,
      '{y}-{m}-{d}')}}
    </div>
    <el-radio-group v-model="tabIndex" style="margin-bottom: 20px;" v-if="form.submitType == '0' && form.additionalInformation == '1'">
      <el-radio-button label="1">项目建议书</el-radio-button>
      <el-radio-button label="2">项目可研报告</el-radio-button>
    </el-radio-group>
    <template v-if="form.submitType == '0'">
      <el-form v-show="tabIndex === '1'">
        <PdfView :src="form.adviceUrl" />
      </el-form>
    </template>
    <div v-show="tabIndex === '2'">
      <PdfView :src="form.feasibleUrl" />
      <reportDetail v-model="form" :edit="false" />
    </div>

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
  import {getProjectStorageInfo} from "@/api/storage/projectStorageInfo";
  import {operation} from "@/api/storage/storageReviewOnLine";
  import {listProjectStorageAdvice} from "@/api/storage/projectStorageAdvice";
  import PdfView from "@/components/PdfView";
  import proposalContent from '../../proManagement/storage/projectStorageInfo/proposal/index';
  import reportDetail from '../../proManagement/storage/projectStorageInfo/report-detail';

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
          infoId: this.$route.query.id
        },
        //操作日志总数
        total: 0,
        //操作日志列表
        logList: [],
        activeName: '操作日志',
        tabIndex: '1',
        proposalForm: {}
      };
    },
    computed: {
      id: function () {
        return this.$route.query.id
      },
      expertId: function () {
        return this.$route.query.expertId
      },
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
          if (this.form.submitType == 0) {
            this.tabIndex = '1';
          } else {
            this.tabIndex = '2';
          }
          // listProjectStorageAdvice({
          //   infoId: id
          // }).then(response => {
          //   if (response.rows.length > 0) {
          //     this.proposalForm = response.rows[0];
          //   }
          // });
        });
      },
      handleUpdateOpinion(declareStatus) {
        this.opinionOpen = true;
        this.resetForm("opinionForm");
        this.opinionForm.operation = declareStatus;
      },
      /** 审批意见提交按钮 */
      submitOpinionForm: function () {
        this.$refs["opinionForm"].validate(valid => {
          if (valid) {
            this.opinionOpen = false;
            this.opinionForm.infoId = this.id;
            this.opinionForm.expertId = this.expertId;
            operation(this.opinionForm).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg);
                this.closeView('/selReview/storageReviewOnLine/review', '/selReview/storageReviewOnLine');
              } else {
                this.msgError(response.msg);
              }
            });
          }
        });
      },
      // 取消按钮
      cancel() {
        this.opinionOpen = false;
        this.opinionForm = {
          remark: undefined,
          filePaths: undefined
        }
        this.resetForm("opinionForm");
      },
      /** 返回 */
      handleBack() {
        this.closeView(this.$route.path, '/selReview/storageReviewOnLine', 0);
      }
    }
  };
</script>

<style scoped>
  iframe {
    width: 100%;
    height: 100%;
  }
</style>
