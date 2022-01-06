<template>
  <div class="app-container">
    <div class="header">
      <el-row :gutter="20">
        <el-col :span="1.5">
          <el-button
            type="primary"
            @click="handleBack">返回
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            @click="handleUpdate(form)"
            v-hasPermi="['expert:expert:edit']">修改
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            @click="handleDelete(form)"
            v-hasPermi="['expert:expert:remove']">删除
          </el-button>
        </el-col>
      </el-row>
    </div>

    <div class="main">
      <div class="basic-info">
        <div class="title-text">基本信息</div>
        <div class="content">
          <table class="detail-table">
            <tr>
              <td>专家姓名</td>
              <td>{{ form.name }}</td>
              <td>性别</td>
              <td>{{ selectDictLabel(genderOptions,form.gender) }}</td>
            </tr>
            <tr>
              <td>出生日期</td>
              <td>{{ parseTime(new Date(form.birthday).getTime(), '{y}-{m}-{d}')}}</td>
              <td>民族</td>
              <td>{{ selectDictLabel(nationalityOptions,form.nationality) }}</td>
            </tr>
            <tr>
              <td>手机号码</td>
              <td>{{ form.phone }}</td>
              <td>固定电话</td>
              <td>{{ form.cell }}</td>
            </tr>
            <tr>
              <td>电子邮箱</td>
              <td>{{ form.email }}</td>
              <td>登录帐号</td>
              <td>{{ form.userName }}</td>
            </tr>
            <tr>
              <td>专家属性</td>
              <td>{{ selectDictLabel(exertGroupTypes,form.attribute) }}</td>
              <td>状态</td>
              <td>{{ selectDictLabel(statusOptions,form.status) }}</td>
            </tr>
          </table>
        </div>
      </div>

      <div class="job-title-info">
        <div class="title-text">职称信息</div>
        <div class="content">
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
              <td>主要成就及其他</td>
              <td colspan="3">{{ form.remark }}</td>
            </tr>
          </table>
        </div>
      </div>

      <div class="image-info">
        <div class="title-text">照片</div>
        <div class="content">
          <img :src="avatarUrl" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {delExpert, getExpert} from "@/api/expert/expert";
import {delExpertExpertGroup} from "@/api/expert/expertExpertGroup";

export default {
  name: "",
  data() {
    return {
      // 性别字典
      genderOptions: [],
      // 民族字典
      nationalityOptions: [],
      // 专业领域字典
      exportAreaOptions: [],
      //专家个人状态
      statusOptions: [],
      //专家在专家库中的组别
      exertGroupTypes: [],
      // 表单参数
      form: {},

      //路由传入
      //专家ID
      expertId: undefined,
      expertGroupId: undefined
    }
  },
  created() {
    if(this.$route.query.id !== undefined) {
      this.expertId = this.$route.query.id
      //获取专家的个人信息
      this.init(this.expertId)
    }
    if (this.$route.query.expertGroupId !== undefined) {
      this.expertGroupId = this.$route.query.expertGroupId
    }

    //获取字典信息
    //性别
    this.getDicts("sys_user_sex").then(response => {
      this.genderOptions = response.data;
    });
    //民族
    this.getDicts("sys_nationality").then(response => {
      this.nationalityOptions = response.data;
    });
    //专家领域
    this.getDicts("sys_expert_area").then(response => {
      this.exportAreaOptions = response.data;
    });
    //专家的个人状态
    this.getDicts("expert_status").then(response => {
      this.statusOptions = response.data
    });
    //专家在专家库里的组别
    this.getDicts("expert_group").then(response => {
      this.exertGroupTypes = response.data
    });
  },
  computed: {
    avatarUrl() {
      return process.env.VUE_APP_BASE_API + this.form.fileUrl
    },
    exportArea() {
      if(this.form.exportArea) {
        const exportAreaArr = this.form.exportArea.split(',').map(item => {
          return this.selectDictLabel(this.exportAreaOptions, item)
        })
        return exportAreaArr.join()
      }
    }
  },
  methods: {
    //获取专家个人信息
    init(id) {
      getExpert(id).then(response => {
        this.form = response.data
      })
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      const path = "/expert/expert/updateExpert"
      const query = {
        id: row.id
      }
      if (this.expertGroupId) query.expertGroupId = this.expertGroupId
      this.$router.push({
        "path": path,
        "query": query
      })
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id;
      this.$confirm('是否确认删除?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        if (this.expertGroupId) {
          return delExpertExpertGroup({
            expertGroupId: this.expertGroupId,
            expertIds: [ids]
          })
        } else {
          return delExpert(ids);
        }
      }).then(() => {
        this.handleBack()
        this.msgSuccess("删除成功");
      }).catch(function () {
      });
    },

    /** 返回 */
    handleBack() {
      if (this.expertGroupId) {
        this.closeView("/expert/expert/expertDetail", "/expert/expertGroup/manageMember?expertGroupId=" + this.expertGroupId, 0)
      } else {
        this.closeView("/expert/expert/expertDetail", "/expert/expert", 0)
      }
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
        width: 100%;
        display: flex;
        flex-direction: column;
      .basic-info, .job-title-info, .image-info{
        width: 100%;
      }
      .title-text {
        border-bottom: 1px solid #bdc2c9;
        color: #000000;
        font-size: 18px;
        font-weight: bold;
        padding-bottom: 10px;
        padding-left: 10px;
      }
      .content {
        width: 100%;
        padding: 20px 60px;
        .detail-table {
          width: 90%;
          table-layout: fixed;
          font-size: 18px;
          color: #000;
          tr td:nth-child(2n+1) {
            text-align: center;
            width: 170px;
            color: #333;
          }
        }
        img {
          width: 120px;
          border-radius: 50%;
        }
      }
    }
  }
</style>
