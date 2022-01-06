<template>
  <div>
    <table class="detail-table">
      <tr>
        <td>项目名称</td>
        <td colspan="3">{{ form.projectName }}</td>
      </tr>
      <tr>
        <td>项目地点</td>
        <td>{{ form.projectAddr }}</td>
        <td style="width: 190px;">录入单位</td>
        <td>{{ form.inputUnit }}</td>
      </tr>
      <tr>
        <td>录入人</td>
        <td>{{ form.inputMan }}</td>
        <td>联系电话</td>
        <td>{{ form.tel }}</td>
      </tr>
      <tr>
        <td>邮箱</td>
        <td>{{ form.email }}</td>
        <td>环境影响报告编制单位</td>
        <td>{{ form.prepareUnit }}</td>
      </tr>
      <tr>
        <td>计划开工日期</td>
        <td>{{ parseTime(form.planBeginDate, '{y}-{m}-{d}') }}</td>
        <td>计划竣工日期</td>
        <td>{{ parseTime(form.planEndDate, '{y}-{m}-{d}') }}</td>
      </tr>
      <tr>
        <td>实际开工日期</td>
        <td>{{ parseTime(form.actualBeginDate, '{y}-{m}-{d}') }}</td>
        <td>实际竣工日期</td>
        <td>{{ parseTime(form.actualEndDate, '{y}-{m}-{d}') }}</td>
      </tr>
      <tr v-hasPermi="['hb:hbProjectInfo:edit']">
        <td colspan="4" align="center">
          <el-button v-hasPermi="['hb:hbProjectInfo:edit']" type="primary" @click="handleUpdate">编辑基本信息</el-button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { updateHbProjectInfo } from "@/api/hb/hbProjectInfo";

export default {
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    },
    edit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      form: {},
      // 表单校验
      rules: {
        projectName: [
          {required: true, message: "项目名称不能为空", trigger: "blur", pattern: '[^ \x22]+'}
        ],
        projectAddr: [
          {required: true, message: "项目地点不能为空", trigger: "blur", pattern: '[^ \x22]+'}
        ],
        inputUnit: [
          {required: true, message: "录入单位不能为空", trigger: "blur", pattern: '[^ \x22]+'}
        ],
        inputMan: [
          {required: true, message: "录入人不能为空", trigger: "blur", pattern: '[^ \x22]+'}
        ],
        tel: [
          {required: true, message: "联系电话不能为空", trigger: "blur"},
          {pattern: /(^0\d{2,3}-?\d{7,8}$)|(^1[3|4|5|6|7|8|9][0-9]\d{8}$)/, message: "请输入正确的联系电话", trigger: "blur"}
        ],
        email: [
          {required: true, message: "邮箱不能为空", trigger: "blur"},
          {
            pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])/,
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          }
        ],
        prepareUnit: [
          {required: true, message: "环境影响报告编制单不能为空", trigger: "blur", pattern: '[^ \x22]+'}
        ],
        planBeginDate: [
          {required: true, message: "计划开工时间不能为空", trigger: "blur"}
        ],
        planEndDate: [
          {required: true, message: "计划竣工时间不能为空", trigger: "blur"}
        ],
      },
    }
  },
  created() {
    this.form = this.value;
  },
  methods: {
    /** 修改按钮操作 */
    handleUpdate() {
      this.$router.push({
        path: '/buildEnvironment/environment/project/edit',
        query: {
          id: this.form.id,
          from: 'detail'
        }
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateHbProjectInfo(this.form).then(response => {
              if (response.code === 200) {
                // this.msgSuccess("修改成功");
              }
            });
          }
        }
      });
    }
  },
  watch: {
    value(newVal) {
      this.form = newVal;
    }
  }
}
</script>
