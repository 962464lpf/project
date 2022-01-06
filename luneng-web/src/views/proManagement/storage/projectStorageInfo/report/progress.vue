<template>
  <div>
    <table class="pdf-show-table">
      <tr>
        <td style="min-width: 60px;">序号</td>
        <td style="min-width: 300px;">时间段</td>
        <td style="min-width: 500px;">内容</td>
        <td>
          <el-button
            type="primary"
            icon="el-icon-plus"

            @click="submitForm({feasibleId: form.id})"
          >新增</el-button>
        </td>
      </tr>
      <tr v-for="(item, index) in list">
        <td>{{index+1}}</td>
        <td class="gray-placeholder">
          <el-input v-model="item.periodTime" type="textarea" @blur="submitForm(item, index)" maxlength="50"/>
        </td>
        <td>
          <el-input v-model="item.content" type="textarea" @blur="submitForm(item, index)" maxlength="300"/>
        </td>
        <td>
          <el-button
            type="danger"
            icon="el-icon-delete"

            @click="handleDelete(item)"
          >删除</el-button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { listProjectStorageFeasibleProgress, delProjectStorageFeasibleProgress, addProjectStorageFeasibleProgress, updateProjectStorageFeasibleProgress } from "@/api/storage/projectStorageFeasibleProgress";

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 表格数据
      list: [],
      // 表单参数
      form: {}
    };
  },
  props: {
    value: {
      default: ''
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      if (!this.form.id || !this.form.isUpdate) return;
      listProjectStorageFeasibleProgress({
        feasibleId: this.form.id,
      }).then(response => {
        this.list = response.rows;
        // if(this.list.length < 1) {
        //   this.submitForm({ feasibleId: this.form.id });
        // }
        // if(this.list.length > 10) {
        //   this.list.length = 10;
        // }
        this.$emit('change', this.list);
      });
    },
    /** 提交按钮 */
    submitForm: function(item, index) {
      if (item.id != undefined) {
        updateProjectStorageFeasibleProgress(item);
      } else {
        // if (this.list.length >= 10) {
        //   this.msgError('最多只能添加10条！')
        //   return
        // }
        addProjectStorageFeasibleProgress(item).then(response => {
          this.form.isUpdate = true;
          this.getList();
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除?', "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delProjectStorageFeasibleProgress(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
  },
  watch:{
    value (newVal, oldVal) {
      this.form = newVal;
      this.getList();
    }
  }
};
</script>
