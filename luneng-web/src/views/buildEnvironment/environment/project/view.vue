<template>
  <div class="app-container">
    <el-row class="mb10">
      <el-col :span="1.5">
        <el-button
          type="primary"
          @click="handleBack"
        >返回</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
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
        </table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { getHbProjectInfo } from "@/api/hb/hbProjectInfo";

  export default {
    name: "hb-hbProjectInfo-detail",
    data() {
      return {
        // 表单参数
        form: {}
      };
    },
    computed: {
      id: function () {
        return this.$route.query.id
      }
    },
    activated() {
      this.init();
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        const id = this.$route.query.id
        getHbProjectInfo(id).then(response => {
          this.form = response.data;
        });
      },
      /** 返回 */
      handleBack() {
        let path = "/buildEnvironment/environment/project"
        this.$router.push({"path": path})
      }
    }
  };
</script>
