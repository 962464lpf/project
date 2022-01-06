<template>
  <div class="pro-base-info">
    <table class="detail-table">
      <tr>
        <td>项目名称</td>
        <td colspan="3">{{ formInfo.projectName }}</td>
      </tr>
      <tr>
        <td>项目编码</td>
        <td>{{ formInfo.projectCode }}</td>
        <td>申报单位</td>
        <td>{{ formInfo.declareUnit }}</td>
      </tr>
      <tr>
        <td>项目类别</td>
        <td colspan="3">{{ formInfo.projectType }}</td>
      </tr>
      <tr>
        <td>项目属性</td>
        <td>{{ selectDictLabel(projectAttrOptions, formInfo.projectAttr) }}</td>
        <td>研究领域</td>
        <td>{{ selectDictLabel(researchFieldOptions, formInfo.researchField) }}</td>
      </tr>
      <tr>
        <td>主要研究内容</td>
        <td colspan="3">{{ formInfo.mainContent }}</td>
      </tr>
      <tr>
        <td>预期目标</td>
        <td colspan="3">{{ formInfo.expectedTarget }}</td>
      </tr>
      <tr>
        <td>承担单位</td>
        <td>{{ formInfo.undertakeUnit }}</td>
        <td>起止时间</td>
        <td>{{ projectTime }}</td>
      </tr>
      <tr>
        <td>项目负责人</td>
        <td>{{ formInfo.headName }}</td>
        <td>项目负责人职务</td>
        <td>{{ formInfo.headDuty }}</td>
      </tr>
      <tr>
        <td>联系人姓名</td>
        <td>{{ formInfo.linkMan }}</td>
        <td>联系人职务</td>
        <td>{{ formInfo.linkDuty }}</td>
      </tr>
      <tr>
        <td>联系人电话</td>
        <td colspan="3">{{ formInfo.linkPhone }}</td>
      </tr>
      <tr>
        <td>项目总投入(成本性)</td>
        <td colspan="3">{{ formInfo.totalInvestment }}</td>
      </tr>
      <tr>
        <td>下年投入计划(成本性)</td>
        <td colspan="3">{{ formInfo.planInvestment }}</td>
      </tr>
      <tr>
        <td>备注</td>
        <td colspan="3">{{ formInfo.remark }}</td>
      </tr>
      <tr>
        <td colspan="4">
          <el-button
            type="primary"
            style="width: 15%"
            @click="editProject"
            v-hasPermi="['pro:proApprovalInfo:edit']">
            编辑基本信息
          </el-button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>

export default {
  name: "ProBaseInfo",
  props: {
    formInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    proDetailFlag: {
      type: String,
      default: ''
    },
    tabActiveName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      projectTypeOptions: [],
      projectAttrOptions: [],
      researchFieldOptions: []
    }
  },
  created() {
    //获取字典信息
    this.getDicts("project_storage_attri").then(response => {
      this.projectAttrOptions = response.data;
    });
    this.getDicts("project_storage_area").then(response => {
      this.researchFieldOptions = response.data;
    });
  },
  computed: {
    projectTime() {
      if (this.formInfo.proBeginDate && this.formInfo.proEndDate) {
        return this.parseTime(this.formInfo.proBeginDate, '{y}-{m}') + '-' + this.parseTime(this.formInfo.proEndDate, '{y}-{m}')
      } else {
        return ''
      }
    }
  },
  methods: {
    //编辑项目
    editProject() {
      if ((this.formInfo.proStatus * 1) < 8) {
        const id = this.formInfo.id
        const path = '/proManagement/proImplement/proEstablish/editProInfo'
        this.$router.push({
          'path': path,
          'query': {
            id,
            proDetailFlag: this.proDetailFlag,
            tabActiveName: this.tabActiveName
          }
        })
      } else {
        this.msgInfo('当前项目已验收，不可操作')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pro-base-info {
  width: 100%;
  .detail-table {
    width: 100%;
    table-layout: fixed;
    font-size: 18px;
    color: #000;
    margin: 0;
    tr td:nth-child(2n+1) {
      width: 150px;
      text-align: center;
      color: #666;
      background-color: #f8f8f9;
    }
  }
}
</style>
