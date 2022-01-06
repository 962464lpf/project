<template>
  <div>
    <div style="margin-bottom: 15px;">
      <span class="annexed-table-title">附表4 外协测试试验与加工费预算明细表</span>
      <span class="annexed-table-unit fr">单位：万元</span>
    </div>
    <table class="pdf-show-table tc">
      <tbody>
      <tr style="font-weight: bold;">
        <td style="min-width: 80px;">序号</td>
        <td style="min-width: 260px;">外协测试试验与加工的内容</td>
        <td style="min-width: 200px;">外协测试化验与加工单位</td>
        <td style="min-width: 120px;">计量单位</td>
        <td style="min-width: 120px;">单价（万元/单位数量）</td>
        <td style="min-width: 120px;">外协测试化验与加工费用</td>
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
          <el-input v-model="item.content" type="textarea" @blur="submitForm(item, index)" maxlength="100"/>
        </td>
        <td>
          <el-input v-model="item.unit" type="textarea" @blur="submitForm(item, index)" maxlength="20"/>
        </td>
        <td>
          <el-input v-model="item.measuringUnit" type="textarea" @blur="submitForm(item, index)" maxlength="10"/>
        </td>
        <td>
          <m-input type="textarea" inputType="wanYuan" :showText="false" v-model="item.price" @blur="submitForm(item, index)" />
        </td>
        <td>
          <m-input type="textarea" inputType="wanYuan" :showText="false" v-model="item.cost" @blur="submitForm(item, index)" />
        </td>
        <td>
          <m-input type="textarea" inputType="wanYuan" :showText="false" v-model="item.funding" @blur="submitForm(item, index)" />
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
        <td colspan="2">累　计</td>
        <td></td>
        <td></td>
        <td>{{totalItem.price}}</td>
        <td>{{totalItem.cost}}</td>
        <td>{{totalItem.funding}}</td>
        <td></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { listProjectStorageFeasibleOutsourcing, delProjectStorageFeasibleOutsourcing, addProjectStorageFeasibleOutsourcing, updateProjectStorageFeasibleOutsourcing } from "@/api/storage/projectStorageFeasibleOutsourcing";

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
      listProjectStorageFeasibleOutsourcing({
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
        updateProjectStorageFeasibleOutsourcing(item).then(res => {
          this.getList();
        })
        // this.totalItem.price = this.getTotalColumn('price');
        // this.totalItem.cost = this.getTotalColumn('cost');
        // this.totalItem.funding = this.getTotalColumn('funding');
        // updateProjectStorageFeasibleOutsourcing(this.totalItem).then(res => {
        //   this.getList();
        // });
      } else {
        // if (this.list.length >= 10) {
        //   this.msgError('最多只能添加10条！')
        //   return
        // }
        addProjectStorageFeasibleOutsourcing(item).then(response => {
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
          return delProjectStorageFeasibleOutsourcing(ids);
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
