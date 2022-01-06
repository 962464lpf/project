<template>
  <div class="tabs-box-container">
    <table class="detail-table">
      <tr>
        <td>项目名称</td>
        <td colspan="3">{{ buildProForm.projectName }}</td>
      </tr>
      <tr>
        <td>项目地点</td>
        <td>{{ buildProForm.projectAddr }}</td>
        <td>设计单位</td>
        <td>{{ buildProForm.designUnit }}</td>
      </tr>
      <tr>
        <td>绿建咨询单位</td>
        <td>{{ buildProForm.advisoryUnit }}</td>
        <td>绿建标准</td>
        <td>{{ selectDictLabel(criterionOptions, buildProForm.criterion) }}</td>
      </tr>
      <tr>
        <td>绿建星级</td>
        <td>{{ selectDictLabel(levelOptions, buildProForm.level) }}</td>
        <td>计划取得认证时间</td>
        <td>{{ buildProForm.attestationTime }}</td>
      </tr>
      <tr>
        <td>责任单位</td>
        <td>{{ buildProForm.enterUnit }}</td>
        <td>责任人</td>
        <td>{{ buildProForm.personName }}</td>
      </tr>
      <tr>
        <td>联系电话</td>
        <td>{{ buildProForm.personPhone }}</td>
        <td>邮箱</td>
        <td>{{ buildProForm.personEmail }}</td>
      </tr>
      <tr>
        <td>计划开工日期</td>
        <td>{{ buildProForm.planStartDate }}</td>
        <td>计划竣工日期</td>
        <td>{{ buildProForm.planEndDate }}</td>
      </tr>
      <tr>
        <td>实际开工日期</td>
        <td>{{ buildProForm.startDate }}</td>
        <td>实际竣工日期</td>
        <td>{{ buildProForm.endDate }}</td>
      </tr>
      <tr v-hasPermi="['build:buildInfo:baseEdit']">
        <td colspan="4">
          <el-button
            type="primary"
            style="width: 15%"
            @click="editProject"
            v-hasPermi="['build:buildInfo:baseEdit']">
            编辑基本信息
          </el-button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import {getBuildInfo} from "@/api/build/buildInfo";

export default {
  name: "TabsBoxOne",
  props: {
    buildProForm: {
      type: Object,
      default() {
        return {}
      }
    },
    levelOptions :{
      type: Array,
      default() {
        return []
      }
    },
    criterionOptions :{
      type: Array,
      default() {
        return []
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
      greenBuildProForm: {}
    }
  },
  created() {
    this.greenBuildProForm = this.buildProForm
  },
  watch :{
    buildProForm(newValue) {
      this.greenBuildProForm = newValue
    }
  },
  methods: {
    //编辑项目
    editProject() {
      getBuildInfo(this.buildProForm.id).then(({data}) => {
        if (data.finish === 0) {
          if (data.approvalStatus !== 3 || data.approvalStatus !== 4) {
            const id = this.buildProForm.id
            const path = '/buildEnvironment/build/buildProject/editProInfo'
            this.$router.push({
              'path': path,
              'query': {
                id,
                proDetailFlag: this.proDetailFlag,
                tabActiveName: this.tabActiveName
              }
            })
          } else {
            this.msgError('当前项目正在审核或已审核通过，不可操作')
          }
        } else {
          this.msgError('当前项目已归档，不可操作')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs-box-container {
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
      color: #333;
      background-color: #f8f8f9;
    }
  }
}
</style>
