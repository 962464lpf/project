<template>
  <div>
    <el-row>
      <el-col :span="20">
        <table class="pdf-show-table">
          <tbody>
            <tr>
              <td style="width: 160px;">申报意见</td>
              <td colspan="6">
                <el-form-item prop="declareOpinions">
                  <ueditor v-model="form.declareOpinions" class-name="red-placeholder" @change="updateData" placeholder="由具有申报资格的申报单位填写，内容包括申报理由和结论性意见等，建议高度概括地陈述专利的用途、核心创新、主要保护措施、主要应用及效益、对提高市场竞争力的贡献以及对行业技术进步的意义，并在以上陈述的基础上，提出申报等级等结论性意见" />
<!--                  <el-input v-model="form.declareOpinions" type="textarea" rows="8"  placeholder="由具有申报资格的申报单位填写，内容包括申报理由和结论性意见等，建议高度概括地陈述专利的用途、核心创新、主要保护措施、主要应用及效益、对提高市场竞争力的贡献以及对行业技术进步的意义，并在以上陈述的基础上，提出申报等级等结论性意见" maxlength="400" show-word-limit @blur="updateData" />-->
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>申报单位盖章签字</td>
              <td colspan="6">
                <div style="text-align: left;">
                  <div>各单位/部门</div>
                  <div>
                    <span>主管专利工作部门负责人签字</span>
                    <el-input disabled value="请打印签名后上传证明文件" style="display: inline-block;width: 200px;" />
                  </div>
                </div>
                <div style="text-align: right;padding-top: 20px;" class="hint-text">
                  <span>公章</span><span style="width: 205px;display: inline-block;"></span>
                  <div class="gray-placeholder">
                    <span>日期</span>
                    <el-form-item prop="declareOpinionsDate" style="display: inline-block;">
                      <el-date-picker clearable  style="width: 200px"
                        v-model="form.declareOpinionsDate"
                        type="date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        @blur="updateData"
                        placeholder="选择日期">
                      </el-date-picker>
                    </el-form-item>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <preview-pdf :id="form.infoId" :page="7" />
        <div>
          <upload accept=".pdf" v-model="form.opinionFilePaths" @change="updateData" @remove="updateData" />
          <div class="el-upload__tip red-hint">只能上传PDF格式的文件，分辨率为300dpi彩色，且文件不超过5M</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { updateSelDeclarePatent } from "@/api/sel/selDeclarePatent";
import ueditor from "@/components/Ueditor"
export default {
  data() {
    return {
      // 表单参数
      form: {},
      dateRange: []
    };
  },
  props: {
    value: {
      default: {}
    }
  },
  created() {
  },
  components: {
    ueditor
  },
  methods: {
    /** 保存操作 */
    updateData() {
      updateSelDeclarePatent(this.form);
      this.$emit('opinionform', this.form)
    },
  },
  watch:{
    value (newVal, oldVal) {
      this.form = newVal;
    }
  }
};
</script>

<style scoped>
  .red, .red-hint {
    color: #EC808D;
  }

  .hint-text {
    font-size: 14px;
    line-height: 40px;
    color: #333333;
  }
</style>
