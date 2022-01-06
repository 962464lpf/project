<template>
  <div class="red-placeholder" style="padding-top: 10px;">
    <el-input v-model="form.leadershipOpinion" type="textarea" @blur="submitForm" rows="8" maxlength="500" show-word-limit placeholder="（对经费预算是否合理，有无其他经费来源，能否偿还贷款，能否保证研究计划实施所需的人力，工作时间等基本条件提出具体意见）" />
    <preview-pdf :id="form.id" type="storage" page="2"/>
    <div>
      <upload accept=".pdf" v-model="form.declareUnitUrl" @change="submitForm" @remove="submitForm" />
      <div class="el-upload__tip red-hint">只能上传PDF格式的文件，分辨率为300dpi彩色，且文件不超过5M</div>
    </div>
  </div>
</template>

<script>
import { updateProjectStorageFeasible } from "@/api/storage/projectStorageFeasible";

export default {
  data() {
    return {
      // 表单参数
      form: {}
    };
  },
  props: {
    value: {
      default: {}
    },
  },
  created() {
    this.form = this.value;
  },
  methods: {
    /** 提交按钮 */
    submitForm: function() {
      if (this.form.id != undefined) {
        updateProjectStorageFeasible(this.form);
        this.$emit('opinionform', this.form)
      }
    },
  },
  watch:{
    value (newVal, oldVal) {
      this.form = newVal;
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
