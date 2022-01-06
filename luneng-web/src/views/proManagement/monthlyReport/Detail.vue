<template>
  <div class="app-container">
    <div class="header">
      <div class="pro-name">
        <span v-if="detail.projectName">{{detail.projectName}}</span>
        <div class="pro-name-subtitle">
          <span v-if="detail.filledBy">{{ detail.filledBy }}</span>
          <span>编制于</span>
          <span v-if="detail.submitTime">{{ detail.submitTime | proCreateTime }}</span>
        </div>
      </div>

      <div class="option-btn">
        <el-button
          v-if="detailFlag === '1'"
          type="warning"
          @click="submitWithdraw">退回
        </el-button>
        <el-button
          type="primary"
          @click="backPage">返回
        </el-button>
      </div>
    </div>
    <div class="main">
      <pdf-view :src="detail.reportFilePaths" />
    </div>
    <el-dialog
      :visible.sync="open"
      width="600px"
      append-to-body
      :close-on-click-modal="false">
      <div class="dialog-center">
        <el-form ref="opinionForm" :model="opinionForm" :rules="opinionRules" label-width="96px">
          <el-form-item label="退回缘由：" prop="backReason">
            <el-input
              type="textarea"
              placeholder="请输入退回缘由"
              maxlength="200"
              show-word-limit
              v-model="opinionForm.backReason"
              :rows="3"
              style="width: 100%; margin-bottom: 10px">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button style="width: 100px" type="primary" @click="submitForm">确 定</el-button>
        <el-button style="width: 100px"  @click="cancelClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  previewProMonthReportRecord,
  changeStatusReportRecord, getProMonthReportRecord
} from "@/api/pro/proMonthReportRecord";
import PdfView from "@/components/PdfView";

export default {
  name: "Detail",
  data() {
    return {
      detail: {},
      pdfUrl: '',
      open: false,
      opinionForm: {
        id: null,
        reportStatus: null,
        backReason: ''
      },
      opinionRules: {
        backReason: [
          {required: true, message: "退回缘由不能为空", trigger: "blur", pattern: '[^ \x22]+'}
        ]
      },
      fromFullPath: ''
    }
  },
  components: {
    PdfView
  },
  created() {
    this.init()
  },
  computed: {
    userName() {
      return this.$store.state.user.name
    },
    id() {
      return this.$route.query.id || null
    },
    detailFlag() {
      return this.$route.query.detailFlag || null
    }
  },
  filters: {
    proCreateTime(value) {
      if (value) {
        return value.toString().substr(0, 10)
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fromFullPath = from.fullPath
    })
  },
  methods: {
    //获取详情
    init() {
      getProMonthReportRecord(this.id).then(({data}) => {
          this.detail = data
      })
      // previewProMonthReportRecord({ id: this.id }).then(({data}) => {
      //   this.pdfUrl = data
      // })
    },

    //退回计划书
    submitWithdraw() {
      this.opinionForm.id = this.id
      this.opinionForm.reportStatus = 3
      this.open = true
    },
    //提交审批
    submitForm() {
      changeStatusReportRecord(this.opinionForm).then(() => {
        this.msgSuccess('退回成功')
        this.open = false
        this.backPage()
      })
    },
    cancelClose() {
      this.open = false
    },
    backPage() {
      this.closeView(this.$route.path, this.fromFullPath, 0)
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
    .option-btn {
      width: 30%;
      display: flex;
      justify-content: flex-end;
      height: 40px;
    }
  }
  .main {
    width: 100%;
    margin: 20px 0;
  }
  .dialog-center {
    display: flex;
    flex-direction: column;
  }
}
</style>
