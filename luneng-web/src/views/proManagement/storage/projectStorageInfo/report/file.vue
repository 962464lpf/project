<template>
  <div class="red-placeholder">
    <ueditor v-model="form.fileDescribe" @change="submitForm" class-name="red-placeholder" placeholder="各承担单位业务主管对项目的意见； <br/>依托工程单位对项目的意见；<br/>自筹经费来源及保证证明；<br/>协作单位意见及盖章。" />

    <table class="pdf-show-table" style="margin-top: 20px;">
      <tr>
        <td align="center" colspan="2">证明文件</td>
      </tr>
      <tr>
        <td style="width: 300px;">各承担单位业务主管对项目的意见</td>
        <td><upload v-model="form.leadershipOpinionUrl" @change="submitForm" @remove="submitForm" /></td>
      </tr>
      <tr>
        <td style="width: 300px;">依托工程单位对项目的意见</td>
        <td><upload v-model="form.engineeringUnitUrl" @change="submitForm" @remove="submitForm" /></td>
      </tr>
      <tr>
        <td style="width: 300px;">自筹经费来源及保证证明</td>
        <td><upload v-model="form.selfRaisedUrl" @change="submitForm" @remove="submitForm" /></td>
      </tr>
      <tr>
        <td style="width: 300px;">协作单位意见及盖章</td>
        <td><upload v-model="form.cooperativeUnitUrl" @change="submitForm" @remove="submitForm" /></td>
      </tr>
    </table>
  </div>
</template>
<script>
import { updateProjectStorageFeasible } from "@/api/storage/projectStorageFeasible";
import ueditor from "@/components/Ueditor";

export default {
  components: {
    ueditor
  },
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
