<template>
  <div>
    <div style="margin-bottom: 15px;">
      <span class="annexed-table-title">附表3 外委研究支出预算明细表</span>
      <span class="annexed-table-unit fr">单位：万元</span>
    </div>
    <table class="pdf-show-table tc">
      <tbody>
      <tr style="font-weight: bold;">
        <td style="min-width: 80px;">序号</td>
        <td style="min-width: 250px;">协作研究任务名称</td>
        <td style="min-width: 250px;">协作研究任务内容</td>
        <td style="min-width: 250px;">协作研究任务承担单位</td>
        <td style="min-width: 120px;">经费列支</td>
        <td>
          <el-button
            type="primary"
            icon="el-icon-plus"

            @click="submitForm({feasibleId: form.id, type: '1'})"
          >新增</el-button>
        </td>
      </tr>
      <tr v-for="(item, index) in list" v-if="item.type !== '2'">
        <td>{{index+1}}</td>
        <td>
          <el-input v-model="item.taskName" type="textarea" @blur="submitForm(item, index)" maxlength="30"/>
        </td>
        <td>
          <el-input v-model="item.taskContent" type="textarea" @blur="submitForm(item, index)" maxlength="100"/>
        </td>
        <td>
          <el-input v-model="item.taskUnit" type="textarea" @blur="submitForm(item, index)" maxlength="20"/>
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
      <tr>
        <td colspan="4">累　计</td>
        <td>{{totalItem.cost}}</td>
        <td></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { listProjectStorageFeasibleContractor, delProjectStorageFeasibleContractor, addProjectStorageFeasibleContractor, updateProjectStorageFeasibleContractor } from "@/api/storage/projectStorageFeasibleContractor";

export default {
  data() {
    return {
      // 表格数据
      list: [],
      // 表单参数
      form: {},
      totalItem: {}
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
      listProjectStorageFeasibleContractor({
        feasibleId: this.form.id,
      }).then(response => {
        let rows = response.rows;
        let list = [];
        // if(this.list.length > 10) {
        //   this.list.length = 10;
        // }
        rows.map((item, index) => {
          if(item.type == 2) {
            this.totalItem = item;
          } else {
            item.index = index+1;
            list.push(item);
          }
        })
        this.list = list;
        this.$emit('change', this.list);
      });
    },
    /** 提交按钮 */
    submitForm: function(item, index) {
      if (item.id != undefined) {
        updateProjectStorageFeasibleContractor(item).then(res => {
          this.getList();
        })

        // this.totalItem.cost = this.getTotalColumn('cost');
        // updateProjectStorageFeasibleContractor(this.totalItem).then(res => {
        //   this.getList();
        // });
      } else {
        // if (this.list.length >= 10) {
        //   this.msgError('最多只能添加10条！')
        //   return
        // }
        addProjectStorageFeasibleContractor(item).then(response => {
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
          return delProjectStorageFeasibleContractor(ids);
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
        if(item[key] !== '' && item[key] !== null && item.type !== '2') {
          if(!total) total = 0;
          total += parseFloat(item[key]);
        }
      })
      if(total == null) return '';
      if(total == '') return 0;
      let arr = total.toString().split('.');
      if (arr[1] && arr[1].length > 4) {
        total = total.toFixed(4);
      }
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
