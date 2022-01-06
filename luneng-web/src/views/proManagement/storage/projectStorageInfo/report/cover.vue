<template>
  <div>
    <el-form-item prop="projectName" label="项目名称" label-width="100px">
      <el-input v-model="form.projectName" placeholder="" @blur="submitForm" maxlength="30" />
    </el-form-item>
    <el-form-item prop="declareUnit" label="申请单位" label-width="100px">
      <el-input v-model="form.declareUnit" placeholder="" @blur="submitForm" maxlength="30" />
    </el-form-item>
    <el-form-item prop="projectNameCn" label="起止时间" label-width="100px">
      <el-date-picker clearable  style="width: 400px"
                      v-model="dateRange"
                      type="monthrange"
                      range-separator="至"
                      start-placeholder="请选择起始时间"
                      end-placeholder="请选择完成时间"
                      @change="submitForm"
                      value-format="yyyy-MM-dd HH:mm:ss">
      </el-date-picker>
    </el-form-item>
    <el-form-item prop="headName" label="项目负责人" label-width="100px">
      <el-input v-model="form.headName" placeholder="" @blur="submitForm" maxlength="30" />
    </el-form-item>
    <el-form-item prop="address" label="通信地址" label-width="100px">
      <el-input v-model="form.address" placeholder="" @blur="submitForm" maxlength="30" />
    </el-form-item>
    <el-form-item prop="zipCode" label="邮政编码" label-width="100px">
      <a-input type="mail" v-model="form.zipCode" placeholder="" @blur="submitForm" maxlength="6" />
    </el-form-item>
    <el-form-item prop="phone" label="联系电话" label-width="100px">
      <a-input type="phone" v-model="form.phone" placeholder="" @blur="submitForm" maxlength="30" />
    </el-form-item>
    <el-form-item prop="fax" label="传真" label-width="100px">
      <a-input type="fax" v-model="form.fax" placeholder="" @blur="submitForm" maxlength="12" />
    </el-form-item>
    <el-form-item prop="projectNameCn" label="申请日期" label-width="100px">
      <el-date-picker clearable  style="width: 200px"
                      v-model="form.declareTime"
                      type="month"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      @change="submitForm"
                      placeholder="选择申请日期">
      </el-date-picker>
    </el-form-item>
  </div>
</template>

<script>
import { updateProjectStorageFeasible } from "@/api/storage/projectStorageFeasible";

export default {
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
  },
  created() {
    this.form = this.value;
  },
  methods: {
    /** 提交按钮 */
    submitForm: function() {
      if (this.form.id != undefined) {
        updateProjectStorageFeasible(this.addDateRange(this.form, this.dateRange)).then(res => {
          this.$emit('update');
        });
      }
    },
    // 添加日期范围
    addDateRange(params, dateRange) {
      var search = params;
      search.startDate = '';
      search.endDate = '';
      if (null != dateRange && '' != dateRange) {
        search.startDate = dateRange[0];
        search.endDate = dateRange[1];
      }
      return search;
    }
  },
  watch:{
    value (newVal, oldVal) {
      this.form = newVal;
      if (this.form.startDate && this.form.endDate) {
        this.dateRange = [this.form.startDate, this.form.endDate];
      }
    }
  }
};
</script>
