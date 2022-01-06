<template>
  <div>
    <table class="pdf-show-table">
      <tbody>
      <tr>
        <td colspan="9"><span v-if="form.createTime">{{parseFloat(parseTime(form.createTime, '{y}'))+1}}</span>年研究开发项目建议书</td>
      </tr>
      <tr>
        <td style="width: 144px;min-width: 120px;">项目名称</td>
        <td colspan="8">
          <el-form-item prop="projectName" v-if="edit">
            <el-input v-model="form.projectName" @blur="submitForm" maxlength="50" />
          </el-form-item>
          <span v-if="!edit">{{form.projectName}}</span>
        </td>
      </tr>
      <tr>
        <td rowspan="2">项目负责人</td>
        <td style="min-width: 80px;">姓名</td>
        <td style="min-width: 180px;width: 180px;">
          <el-form-item prop="headName" v-if="edit">
            <el-input v-model="form.headName" @blur="submitForm" maxlength="10" show-word-limit />
          </el-form-item>
          <span v-if="!edit">{{form.headName}}</span>
        </td>
        <td style="min-width: 120px;">单位</td>
        <td colspan="5">
          <el-form-item prop="headUnit" v-if="edit">
            <el-input v-model="form.headUnit" @blur="submitForm" maxlength="30" show-word-limit />
          </el-form-item>
          <span v-if="!edit">{{form.headUnit}}</span>
        </td>
      </tr>
      <tr>
        <td>性别</td>
        <td>
          <el-form-item prop="gender" v-if="edit">
            <el-select v-model="form.gender" @change="submitForm">
              <el-option value="0" label="男" key="0" />
              <el-option value="1" label="女" key="1" />
            </el-select>
          </el-form-item>
          <span v-if="!edit">{{form.gender === "0" ? "男" : ""}} {{form.gender === "1" ? "女" : ""}}</span>
        </td>
        <td>年龄</td>
        <td style="min-width: 120px;width: 120px;">
          <el-form-item prop="age" v-if="edit">
            <a-input type="age" v-model="form.age" @blur="submitForm" maxlength="3" />
          </el-form-item>
          <span v-if="!edit">{{form.age}}</span>
        </td>
        <td style="min-width: 120px;width: 120px;">专业</td>
        <td style="min-width: 200px;">
          <el-form-item prop="professional" v-if="edit">
            <el-input v-model="form.professional" @blur="submitForm" maxlength="10" show-word-limit />
          </el-form-item>
          <span v-if="!edit">{{form.professional}}</span>
        </td>
        <td style="min-width: 80px;width: 80px;">职称</td>
        <td style="min-width: 200px;">
          <el-form-item prop="jobLevel" v-if="edit">
            <el-input v-model="form.jobLevel" @blur="submitForm" maxlength="10" show-word-limit />
          </el-form-item>
          <span v-if="!edit">{{form.jobLevel}}</span>
        </td>
      </tr>
      <tr>
        <td>总投入（万元）</td>
        <td colspan="2">
          <el-form-item prop="totalInvestment" v-if="edit">
            <m-input v-model="form.totalInvestment" inputType="wanYuan" @blur="submitForm" />
          </el-form-item>
          <span v-if="!edit">{{form.totalInvestment}}</span>
        </td>
        <td>研究起止年月</td>
        <td>
          <el-form-item prop="projectBeginTime" v-if="edit">
            <el-date-picker
              style="width: 220px;"
              v-model="dateRange"
              type="monthrange"
              align="right"

              @change="submitForm"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"/>
          </el-form-item>
          <div v-if="!edit" style="width: 130px;">{{parseTime(form.beginDate, '{y}-{m}')}} 至 {{parseTime(form.endDate, '{y}-{m}')}}</div>
        </td>
        <td><span v-if="form.createTime">{{parseFloat(parseTime(form.createTime, '{y}'))+1}}</span>年投入计划（万元）</td>
        <td colspan="3">
          <el-form-item prop="planInvestment" v-if="edit">
            <m-input v-model="form.planInvestment" inputType="wanYuan" @blur="submitForm" />
          </el-form-item>
          <span v-if="!edit">{{form.planInvestment}}</span>
        </td>
      </tr>
      <tr>
        <td>项目必要性</td>
        <td align="left" colspan="8">
          <el-form-item prop="necessary" v-if="edit">
            <el-input type="textarea" v-model="form.necessary" @blur="submitForm" rows="6" maxlength="500" show-word-limit />
          </el-form-item>
          <span v-if="!edit">{{form.necessary}}</span>
        </td>
      </tr>
      <tr>
        <td>国内外研究概况</td>
        <td align="left" colspan="8">
          <el-form-item prop="profile" v-if="edit">
            <el-input type="textarea" v-model="form.profile" @blur="submitForm" rows="6" maxlength="500" show-word-limit />
          </el-form-item>
          <span v-if="!edit">{{form.profile}}</span>
        </td>
      </tr>
      <tr>
        <td>主要研究内容</td>
        <td align="left" colspan="8">
          <el-form-item prop="content" v-if="edit">
            <el-input type="textarea" v-model="form.content" @blur="submitForm" rows="6" maxlength="500" show-word-limit />
          </el-form-item>
          <span v-if="!edit">{{form.content}}</span>
        </td>
      </tr>
      <tr>
        <td>预期目标</td>
        <td align="left" colspan="8">
          <el-form-item prop="target" v-if="edit">
            <el-input type="textarea" v-model="form.target" @blur="submitForm" rows="4" maxlength="200" show-word-limit />
          </el-form-item>
          <span v-if="!edit">{{form.target}}</span>
        </td>
      </tr>
      <tr>
        <td>已具备的研究条件</td>
        <td align="left" colspan="8">
          <el-form-item prop="conditions" v-if="edit">
            <el-input type="textarea" v-model="form.conditions" @blur="submitForm" rows="6" maxlength="500" show-word-limit />
          </el-form-item>
          <span v-if="!edit">{{form.conditions}}</span>
        </td>
      </tr>
      <tr>
        <td>合作意向</td>
        <td align="left" colspan="8">
          <el-form-item prop="intention" v-if="edit">
            <el-input type="textarea" v-model="form.intention" @blur="submitForm" rows="6" maxlength="500" show-word-limit />
          </el-form-item>
          <span v-if="!edit">{{form.intention}}</span>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { updateProjectStorageFeasible } from "@/api/storage/projectStorageFeasible";
import { listProjectStorageAdvice, getProjectStorageAdvice, delProjectStorageAdvice, addProjectStorageAdvice, updateProjectStorageAdvice, exportProjectStorageAdvice } from "@/api/storage/projectStorageAdvice";
import MInput from "@/components/MInput";

export default {
  components: {
    MInput
  },
  data() {
    return {
      // 表单参数
      form: {},
      dateRange: [],
      taskSourceOptions: [],
      pickerOptions: {}
    };
  },
  props: {
    value: {
      default: {}
    },
    edit: {
      default: true
    }
  },
  created() {
    this.form = this.value;
  },
  methods: {
    /** 提交按钮 */
    submitForm: function() {
      if (this.form.id != undefined) {
        updateProjectStorageAdvice(this.addDateRange(this.form, this.dateRange)).then(res => {
          this.$emit('update');
        });
      }
    },
    // 添加日期范围
    addDateRange(params, dateRange) {
      var search = params;
      search.beginDate = '';
      search.endDate = '';
      if (null != dateRange && '' != dateRange) {
        search.beginDate = dateRange[0];
        search.endDate = dateRange[1];
      }
      return search;
    }
  },
  watch:{
    value (newVal, oldVal) {
      this.form = newVal;
      if (this.form.beginDate && this.form.endDate) {
        this.dateRange = [this.form.beginDate, this.form.endDate];
      }
    }
  }
};
</script>
