<template>
  <div class="re-experts-detail">
    <el-row :gutter="20">
      <el-col class="name-style">
        <span>{{form.name}}</span>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col class="part-text">
        <span>基本信息</span>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <table class="detail-table">
          <tr>
            <td>专家姓名</td>
            <td>{{ form.name }}</td>
            <td>性别</td>
            <td>{{ selectDictLabel(genderOptions, form.gender) }}</td>
          </tr>
          <tr>
            <td>出生日期</td>
            <td>{{ form.birthday }}</td>
            <td>民族</td>
            <td>{{ selectDictLabel(nationalityOptions, form.nationality) }}</td>
          </tr>
          <tr>
            <td>最高学位</td>
            <td>{{ form.education }}</td>
            <td>所学专业</td>
            <td>{{ form.major }}</td>
          </tr>
          <tr v-if="form.auditStatus === 3">
            <td>手机号码</td>
            <td>{{ form.phone }}</td>
            <td>电子邮箱</td>
            <td>{{ form.email }}</td>
          </tr>
          <tr v-if="form.auditStatus === 3">
            <td>固定电话</td>
            <td>{{ form.cell }}</td>
            <td>专家属性</td>
            <td>{{ selectDictLabel(exertGroupTypes, form.attribute) }}</td>
          </tr>
          <tr v-if="form.auditStatus === 3">
            <td>生成账号</td>
            <td>{{ form.userName }}</td>
            <td>默认密码</td>
            <td>{{ form.password }}</td>
          </tr>
        </table>
      </el-col>
    </el-row >
    <el-divider></el-divider>
    <el-row :gutter="20">
      <el-col class="part-text">
        <span>职称信息</span>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <table class="detail-table">
          <tr>
            <td>工作单位</td>
            <td>{{ form.workUnit }}</td>
            <td>现任职务</td>
            <td>{{ form.job }}</td>
          </tr>
          <tr>
            <td>技术职称</td>
            <td>{{ form.jobLevel }}</td>
            <td>专业领域</td>
            <td>{{ exportArea }}</td>
          </tr>
          <tr>
            <td>主要成就</td>
            <td colspan="3">{{ form.zycj }}</td>
          </tr>
          <tr>
            <td>评审经历</td>
            <td colspan="3">{{ form.reviewExperience }}</td>
          </tr>
        </table>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row :gutter="20">
      <el-col class="part-text">
        <span>推荐单位意见</span>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <table class="detail-table">
          <tr>
            <td>推荐单位意见</td>
            <td colspan="3">{{ form.unitIdea }}</td>
          </tr>
        </table>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row :gutter="20">
      <el-col class="part-text">
        <span>照片</span>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <img :src="form.filePaths" alt="暂无">
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "reExpertsDetail",
  props: {
    reExpertInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    genderOptions: {
      type: Array,
      default() {
        return []
      }
    },
    nationalityOptions: {
      type: Array,
      default() {
        return []
      }
    },
    exportAreaOptions: {
      type: Array,
      default() {
        return []
      }
    },
    exertGroupTypes:  {
      type: Array,
      default() {
        return []
      }
    },
  },
  computed: {
    form() {
      return this.reExpertInfo
    },
    exportArea() {
      if(this.form.exportArea) {
        let exportAreaTem = JSON.parse(this.form.exportArea)
        const exportAreaArr = exportAreaTem.map(item => {
          return this.selectDictLabel(this.exportAreaOptions, item)
        })
        return exportAreaArr.join()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.re-experts-detail {
  width: 100%;
  .name-style {
    font-size: 22px;
    color: #000;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .part-text {
    font-size: 18px;
    color: #000;
    font-weight: bold;
    padding-bottom: 10px;
  }
  .detail-table {
    width: 90%;
    table-layout: fixed;
    font-size: 18px;
    color: #000;
    tr td:nth-child(2n+1) {
      text-align: center;
      width: 160px;
      color: #333;
    }
  }
  img {
    width: 120px;
    border-radius: 50%;
    margin-bottom: 20px;
  }
}
</style>
