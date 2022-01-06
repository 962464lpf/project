<template>
  <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="90px">
    <el-form-item label="项目名称" prop="projectName">
      <el-input
        v-model="queryParams.projectName"
        placeholder="请输入项目名称"
        clearable
        @keyup.enter.native="handleQuery"
      />
    </el-form-item>
    <el-form-item label="环境影响报告编制单位" prop="prepareUnit" label-width="200px">
      <el-input
        v-model="queryParams.prepareUnit"
        placeholder="请输入环境影响报告编制单位"
        clearable
        @keyup.enter.native="handleQuery"
        style="width: 280px;"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
      <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    name: 'tableSearch',
    props: {
      value: {
        default: function() {
          return {}
        }
      }
    },
    data() {
      return {
        queryParams: {}
      }
    },
    created() {
      this.queryParams = this.value;
    },
    methods: {
      handleQuery() {
        this.$emit('input', this.queryParams);
        this.$emit('query');
      },
      resetQuery() {
        this.resetForm("queryForm");
        this.$emit('reset');
      }
    },
    watch: {
      value(newVal) {
        this.queryParams = newVal;
      }
    }
  }
</script>

<style scoped>

</style>
