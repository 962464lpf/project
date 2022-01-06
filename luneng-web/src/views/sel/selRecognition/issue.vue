<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8" v-if="type == 'issue'">
      <div class="fr">
        <el-col :span="1.5">
          <el-button
            type="primary"

            @click="submitForm"
          >确认下发</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"

            @click="cancel"
          >取消</el-button>
        </el-col>
      </div>
    </el-row>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" v-if="type == 'issue'">
      <el-form-item label="颁奖日期" prop="certificateDate">
        <el-date-picker clearable
                        v-model="form.certificateDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择颁奖日期">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div style="overflow: auto;padding-bottom: 20px;">
      <certificate v-model="form" id="certificateContent" />
    </div>
    <div style="height: 0px;overflow: hidden;" ref="pdf"></div>
  </div>
</template>

<script>
import { getSelDeclareReviewResult, getReviewResultScoreInfo, updateSelDeclareReviewResult, batchRelease } from "@/api/sel/selDeclareReviewResult";
import { base64ToPDF } from "@/api/common/utils";
import certificate from './certificate';

export default {
  name: 'issue',
  components: {
    certificate
  },
  data () {
    return {
      form: {},
      templateForm: {},
      // 奖项类别字典
      awardsTypeOptions: [],
      // 获奖等级字典
      awardOptions: [],
      allData: {},
      // 表单校验
      rules: {
        certificateDate: [
          { required: true, message: "颁奖日期不能为空", trigger: "blur" }
        ]
      },
      type: 'detail'
    }
  },
  created() {
    if (this.$route.path == '/sel/selRecognition/issue') {
      this.type = 'issue'
    }
    if (this.$route.path == '/sel/selRecognition/detail') {
      this.type = 'detail'
    }
    this.init();
    this.getDicts("award_type").then(response => {
      this.awardsTypeOptions = response.data;
    });
    this.getDicts("sys_sel_award").then(response => {
      this.awardOptions = response.data;
    });
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      const id = this.$route.query.id;
      getReviewResultScoreInfo(id).then(response => {
        this.form = response.data.declareReviewResult;
        if(this.$route.query.code) this.form.certificateCode = this.$route.query.code;
        if(!this.form.certificateDate) this.form.certificateDate = this.parseTime(new Date(), '{y}-{m}-{d}');
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.status = '1';
          updateSelDeclareReviewResult(this.form).then(res => {
            if (res.code == 200) {
              this.$message.success("证书下发成功");
              this.closeView('/sel/selRecognition/issue', '/sel/selRecognition');
            }
          })
          return
          const id = this.$route.query.id;
          let certificate = document.getElementById('certificateContent').cloneNode(true);
          certificate.id = 'certificate';
          // certificate.style.transform = 'rotate(-90deg)';
          this.$refs.pdf.innerHTML = '';
          this.$refs.pdf.appendChild(certificate);
          this.exportPdf('certificate', '证书', (base64) => {
            base64ToPDF(base64).then((response) => {
              if (response.code === 200) {
                updateSelDeclareReviewResult({
                  id: id,
                  status: '1',
                  certificateUrl: response.url
                }).then(res => {
                  if (res.code == 200) {
                    this.$message.success("证书下发成功");
                    this.closeView('/sel/selRecognition/issue', '/sel/selRecognition');
                  }
                })
              }
            })
          })
        }
      });
    },
    // 取消按钮
    cancel() {
      this.closeView('/sel/selRecognition/issue', '/sel/selRecognition', 0);
    },
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  overflow-x: scroll;
  padding-bottom: 70px;
}
</style>
