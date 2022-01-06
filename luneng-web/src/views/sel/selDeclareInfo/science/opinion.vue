<template>
  <div>
    <el-row>
      <el-col :span="20">
        <table class="pdf-show-table">
          <tbody>
            <tr>
              <td>申报意见</td>
              <td colspan="6">
                <el-form-item prop="declareOpinions">
                  <ueditor
                    v-model="form.declareOpinions"
                    class-name="red-placeholder"
                    @change="updateData"
                    placeholder="申报单位意见由申报单位填写，加盖申报单位公章。内容应包括：根据项目创造性特点、科学技术水平和应用情况，参照公司科学技术进步奖励条件，写明申报理由和结论性意见。"
                  />
<!--                  <el-input-->
<!--                    v-model="form.declareOpinions"-->
<!--                    type="textarea" rows="12"-->
<!--                    placeholder="申报单位意见由申报单位填写，加盖申报单位公章。内容应包括：根据项目创造性特点、科学技术水平和应用情况，参照公司科学技术进步奖励条件，写明申报理由和结论性意见。填写内容不得超过 500 字"-->
<!--                    maxlength="500" show-word-limit @blur="updateData" -->
<!--                  />-->
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>声明</td>
              <td colspan="6">
                <div style="text-align: left;text-indent: 2em;">
                  我单位按照申报要求，对本申报书及其附件进行了审查，确认该项目符合申报条件，申报材料全部内容属实，所提供材料不存在任何违反《中华人民共和国保守国家秘密法》和《科学技术保密规定》等有关法律法规及侵犯他人知识产权的情形，并对其真实性负责。如有不符，我单位愿意承担相关后果。且确认上一栏目中所列对该项目的申报意见及申报等级。
                </div>
                <div style="text-align: right;padding-top: 20px;" class="hint-text">
                  <span>申报单位（公章）：</span><span style="width: 200px;display: inline-block;"></span>
                  <div>
                    <span>日期</span>
                    <el-form-item prop="statementDate" style="display: inline-block;" class="gray-placeholder">
                      <el-date-picker clearable  style="width: 200px"
                        v-model="form.statementDate"
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
        <preview-pdf :id="form.infoId" :page="9" />
        <div>
          <upload accept=".pdf" v-model="form.declareFilePaths" @change="updateData" @remove="updateData" />
          <div class="el-upload__tip red-hint">只能上传PDF格式的文件，分辨率为300dpi彩色，且文件不超过5M</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { updateSelDeclareScience } from "@/api/sel/selDeclareScience";
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
      updateSelDeclareScience(this.form);
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
