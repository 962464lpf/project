<template>
  <div class="app-container">
    <el-row class="mb10" :gutter="20">
      <el-col :span="1.5">
        <el-button
          v-if="form.publishStatus === 0"
          type="primary"
          @click="handleUpdate(form)"
          v-hasPermi="['system:sysWorkAccount:edit']">修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-if="form.publishStatus === 0"
          type="danger"
          @click="handleDelete(form)"
          v-hasPermi="['system:sysWorkAccount:remove']">删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          @click="handleBack"
        >返回</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <table class="detail-table">
          <tr>
            <td>台账标题</td>
            <td colspan="3">{{ form.accountTitle }}</td>
          </tr>
          <tr>
            <td>工作类型</td>
            <td>{{ form.workType }}</td>
            <td>相关项目</td>
            <td>{{ form.projectName ? form.projectName : '暂无' }}</td>
          </tr>
          <tr>
            <td>开始时间</td>
            <td>{{ parseTime(form.workBeginDate, '{y}-{m}-{d}') ? parseTime(form.workBeginDate, '{y}-{m}-{d}') : '暂无' }}</td>
            <td>结束时间</td>
            <td>{{ parseTime(form.workEndDate, '{y}-{m}-{d}') ? parseTime(form.workEndDate, '{y}-{m}-{d}') : '暂无' }}</td>
          </tr>
          <tr>
            <td>相关地点</td>
            <td colspan="3">{{ form.workAddress ? form.workAddress : '暂无' }}</td>
          </tr>
          <tr>
            <td>工作内容</td>
            <td colspan="3">
              <div v-html="form.workContent"></div>
            </td>
          </tr>
          <tr>
            <td>附件路径</td>
            <td colspan="3"><upload v-model="form.filePaths" :edit="false" /></td>
          </tr>
        </table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {delSysWorkAccount, getSysWorkAccount} from "@/api/sys/sysWorkAccount";

  export default {
    name: "workAccount-detail",
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
        getSysWorkAccount(id).then(response => {
          this.form = response.data;
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.$router.push({
          path: '/other/workAccount/edit',
          query: {
            id: row.id
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id
        this.$confirm('是否确认删除?', "系统提示", {
          confirmButtonText: "确取消定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          return delSysWorkAccount(ids);
        }).then(() => {
          this.handleBack()
          this.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 返回 */
      handleBack() {
        this.$router.push({
          path: '/other/workAccount'
        });
      }
    }
  };
</script>
