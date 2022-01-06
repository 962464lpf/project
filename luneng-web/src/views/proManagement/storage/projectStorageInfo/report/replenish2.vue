<template>
  <div>
    <div style="margin-bottom: 15px;">
      <div class="replenish-table-title" style="margin-bottom: 10px;">补充2：任务及经费分解方案</div>
      <div style="margin-bottom: 10px;">根据研究内容，对研究任务进行分解，明确任务分工。</div>
      <div class="replenish-table-title tc" style="text-align: center;">
        表：项目（或独立课题）任务及经费分解表
        <span class="annexed-table-unit fr">单位：万元</span>
      </div>
    </div>
    <table class="pdf-show-table tc">
      <tbody>
      <tr>
        <td style="min-width: 200px;">研究任务</td>
        <td style="min-width: 200px;">承担单位</td>
        <td style="min-width: 80px;">研究经费</td>
        <td>
          <el-button
            type="primary"
            icon="el-icon-plus"

            @click="submitForm({feasibleId: form.id})"
          >新增</el-button>
        </td>
      </tr>
      <tr v-for="(item, index) in list">
        <td>
          <el-input v-model="item.taskName" type="textarea" @blur="submitForm(item, index)" maxlength="30"/>
        </td>
        <td>
          <el-input v-model="item.unit" type="textarea" @blur="submitForm(item, index)" maxlength="20"/>
        </td>
        <td>
          <m-input type="textarea" inputType="wanYuan" :showText="false" v-model="item.cost" @blur="submitForm(item, index)" />
        </td>
        <td>
          <el-button
            type="danger"
            icon="el-icon-delete"

            @click="handleDelete(item)"
          >删除</el-button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { listProjectStorageFeasibleDecomposition, delProjectStorageFeasibleDecomposition, addProjectStorageFeasibleDecomposition, updateProjectStorageFeasibleDecomposition } from "@/api/storage/projectStorageFeasibleDecomposition";

export default {
  data() {
    return {
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
      listProjectStorageFeasibleDecomposition({
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
        updateProjectStorageFeasibleDecomposition(item);
      } else {
        // if (this.list.length >= 10) {
        //   this.msgError('最多只能添加10条！')
        //   return
        // }
        addProjectStorageFeasibleDecomposition(item).then(response => {
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
          return delProjectStorageFeasibleDecomposition(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    getTotalColumn(key) {
      const list = this.list;
      if (list.length === 0) return;
      let total = null;
      list.map(item => {
        if(item[key]) {
          if(!total) total = 0;
          total += parseFloat(item[key]);
        }
      })
      return total;
    }
  },
  watch:{
    value (newVal, oldVal) {
      this.form = newVal;
      this.getList();
    }
  }
};
</script>
