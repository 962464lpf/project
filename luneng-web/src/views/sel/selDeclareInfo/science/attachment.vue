<template>
  <div>
    <el-row>
      <el-col :span="20">
        <table class="pdf-show-table">
          <tbody>
            <tr>
              <td style="width: 200px;">知识产权证明</td>
              <td style="text-align: left;">
                <el-form-item prop="prove1FilePaths">
<!--                  上传本页盖章扫描件-->
                  <upload accept=".pdf" :size="50" v-model="form.prove1FilePaths" @change="updateData" @remove="updateData" :limit="100" :name="form.projectNameCn+'科学进步奖知识产权'" />
                  <div class="el-upload__tip red-hint">
                    <div>仅支持PDF格式的文件，多页文件请合并为一份上传，</div>
                    <div>分辨率为300dpi彩色，文件大小不超过50M</div>
                  </div>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td style="width: 200px;">应用证明</td>
              <td style="text-align: left;">
                <el-form-item prop="prove2FilePaths">
                  <upload accept=".pdf" :size="50" v-model="form.prove2FilePaths" @change="updateData" @remove="updateData" :limit="100" :name="form.projectNameCn+'科学进步奖应用证明'" />
                  <div class="el-upload__tip red-hint">
                    <div>仅支持PDF格式的文件，多页文件请合并为一份上传，</div>
                    <div>分辨率为300dpi彩色，文件大小不超过50M</div>
                  </div>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td style="width: 200px;">技术评价证明</td>
              <td style="text-align: left;">
                <el-form-item prop="prove3FilePaths">
                  <upload accept=".pdf" :size="50" v-model="form.prove3FilePaths" @change="updateData" @remove="updateData" :limit="100" :name="form.projectNameCn+'科学进步奖技术评价'" />
                  <div class="el-upload__tip red-hint">
                    <div>仅支持PDF格式的文件，多页文件请合并为一份上传，</div>
                    <div>分辨率为300dpi彩色，文件大小不超过50M</div>
                  </div>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td style="width: 200px;">其他证明</td>
              <td style="text-align: left;">
                <el-form-item prop="prove4FilePaths">
                  <upload accept=".pdf" :size="50" v-model="form.prove4FilePaths" @change="updateData" @remove="updateData" :limit="100" :name="form.projectNameCn+'科学进步奖其他证明'" />
                  <div class="el-upload__tip red-hint">
                    <div>仅支持PDF格式的文件，多页文件请合并为一份上传，</div>
                    <div>分辨率为300dpi彩色，文件大小不超过50M</div>
                  </div>
                </el-form-item>
              </td>
            </tr>
          </tbody>
        </table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { updateSelDeclareScience } from "@/api/sel/selDeclareScience";
export default {
  data() {
    return {
      // 表单参数
      form: {},
      dateRange: [],
      fileList: [],
    };
  },
  props: {
    value: {
      default: {}
    }
  },
  created() {
    this.form = this.value;
  },
  methods: {
    /** 保存操作 */
    updateData() {
      updateSelDeclareScience(this.form);
    }
  },
  watch:{
    value (newVal, oldVal) {
      this.form = newVal;
    }
  }
};
</script>

<style scoped>
  .red, .red-hint, .hint-text.red-hint {
    color: #EC808D;
    line-height: 18px;
  }
</style>
