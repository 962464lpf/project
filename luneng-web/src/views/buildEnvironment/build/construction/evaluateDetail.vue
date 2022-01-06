<template>
  <div class="app-container">
    <div class="header">
      <el-row :gutter="15">
        <el-col :span="1.5">
          <el-button
            type="primary"
            @click="handleUpdate(form)"
            v-hasPermi="['build:buildAppraise:edit']"
          >修改
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            @click="handleDelete(form)"
            v-hasPermi="['build:buildAppraise:remove']"
          >删除
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            @click="handleBack">返回
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="main">
      <table class="detail-table">
        <tr>
          <td >项目名称</td>
          <td colspan="3">{{form.projectName}}</td>
        </tr>
        <tr>
          <td >绿建星级</td>
          <td colspan="3">{{selectDictLabel(levelOptions, form.level)}}</td>
        </tr>
        <tr>
          <td >评价时间</td>
          <td colspan="3">{{form.time}}</td>
        </tr>
        <tr>
          <td >地点</td>
          <td colspan="3">{{form.address}}</td>
        </tr>
        <tr>
          <td >经办人</td>
          <td colspan="3">{{form.operator}}</td>
        </tr>
        <tr>
          <td >评价内容</td>
          <td colspan="3">
            <div v-html="form.remark"></div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>

import {delBuildAppraise, getBuildAppraise} from "@/api/build/buildAppraise";
import {getBuildInfo} from "@/api/build/buildInfo";

export default {
  name: "evaluateDetail",
  data() {
    return {
      //绿建等级字典
      levelOptions: [],
      // 表单参数
      form: {},
      id: null,
      eId: null
    }
  },
  created() {
    if(this.$route.query.id) {
      this.id = this.$route.query.id
    }
    if(this.$route.query.eId) {
      this.eId = this.$route.query.eId * 1
      this.init(this.eId)
    }
    this.getDicts("national_standard_level").then(response => {
      this.levelOptions = response.data;
    })
  },
  methods: {
    init(id) {
      getBuildAppraise(id).then(response => {
        this.form = response.data
      })
    },
    //处理修改
    handleUpdate(row) {
      getBuildInfo(this.id).then(({data}) => {
        if (data.finish === 0) {
          const id = this.id
          const path = '/buildEnvironment/build/construction/editEvaluate'
          const eId = row.id
          this.$router.push({
            'path': path,
            'query': {
              eId,
              id
            }
          })
        } else {
          this.msgError('当前项目已归档，不可操作')
        }
      })
    },
    //处理删除
    handleDelete(row) {
      getBuildInfo(this.id).then(({data}) => {
        if (data.finish === 0) {
          const ids = row.id;
          this.$confirm(`是否确认删除当前的项目评价?`, "系统提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            return delBuildAppraise(ids);
          }).then(() => {
            this.handleBack();
            this.msgSuccess("删除成功");
          }).catch(function () {
          });
        } else {
          this.msgError('当前项目已归档，不可操作')
        }
      })
    },
    /** 返回 */
    handleBack() {
      this.closeView("/buildEnvironment/build/construction/evaluateDetail", "/buildEnvironment/build/construction/workEvaluate?id=" + this.id, 0)
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 30px 50px 30px;
  .header {
    margin-bottom: 20px;
  }
  .main {
    width: 80%;
    display: flex;
    flex-direction: column;
    .detail-table {
      width: 100%;
      table-layout: fixed;
      font-size: 18px;
      color: #000;
      margin: 0;
      tr td:nth-child(2n+1) {
        width: 200px;
        text-align: center;
        color: #333;
        background-color: #f8f8f9;
      }
    }
  }
}
</style>
