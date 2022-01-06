<template>
  <div>
    <div style="text-align: right;margin-bottom: 10px;">单位：万元</div>
    <table class="pdf-show-table tc">
      <tbody>
        <tr>
          <td style="width: 256px;"><b>科目名称</b></td>
          <td style="min-width: 80px;">预算金额</td>
          <td style="min-width: 80px;">甲方拨款</td>
          <td style="min-width: 80px;">乙方自筹</td>
          <td style="min-width: 80px;">备 注</td>
        </tr>
        <tr v-for="(item, index) in list">
          <td v-if="item.type=='1'" align="left"><b>（一）直接费</b></td>
          <td v-if="item.type=='2'" align="left">1.人工费</td>
          <td v-if="item.type=='3'" align="left">（1）专职研究人员人工费</td>
          <td v-if="item.type=='4'" align="left">（2）劳务外包人员人工费</td>
          <td v-if="item.type=='5'" align="left">（3）临时性研究人员人工费</td>
          <td v-if="item.type=='6'" align="left">2.设备使用费</td>
          <td v-if="item.type=='7'" align="left">（1）仪器设备使用费</td>
          <td v-if="item.type=='8'" align="left">（2）软件使用费</td>
          <td v-if="item.type=='9'" align="left">3.业务费</td>
          <td v-if="item.type=='10'" align="left">（1）材料费</td>
          <td v-if="item.type=='11'" align="left">（2）资料、印刷及知识产权费</td>
          <td v-if="item.type=='12'" align="left">（3）会议、差旅及国际合作交流费</td>
          <td v-if="item.type=='13'" align="left">4.场地使用费</td>
          <td v-if="item.type=='14'" align="left">（1）场地物业费</td>
          <td v-if="item.type=='15'" align="left">（2）场地使用租金</td>
          <td v-if="item.type=='16'" align="left">5.专家咨询费</td>
          <td v-if="item.type=='17'" align="left"><b>（二）间接费</b></td>
          <td v-if="item.type=='18'" align="left"><b>（三）外委支出费</b></td>
          <td v-if="item.type=='19'" align="left">1.外委研究支出费</td>
          <td v-if="item.type=='20'" align="left">2.仪器设备租赁费</td>
          <td v-if="item.type=='21'" align="left">3.外协测试试验与加工费</td>
          <td v-if="item.type=='22'" align="left"><b>（四）税金</b></td>
          <td v-if="item.type=='23'" align="left"><b>合  计</b></td>
          <td>
            <m-input type="textarea" v-if="isEdit(item.type)" inputType="wanYuan" :showText="false" v-model="item.budgetCost" @blur="submitForm(item, index)" />
            <span v-else>{{item.budgetCost}}</span>
          </td>
          <td>
            <m-input type="textarea" v-if="isEdit(item.type)" inputType="wanYuan" :showText="false" v-model="item.costA" @blur="submitForm(item, index)" />
            <span v-else>{{item.costA}}</span>
          </td>
          <td>
            <m-input type="textarea" v-if="isEdit(item.type)" inputType="wanYuan" :showText="false" v-model="item.costB" @blur="submitForm(item, index)" />
            <span v-else>{{item.costB}}</span>
          </td>
          <td>
            <el-input type="textarea" v-if="item.type !== '23'" v-model="item.remark" @blur="submitForm(item, index)" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { listProjectStorageFeasibleCost, delProjectStorageFeasibleCost, addProjectStorageFeasibleCost, updateProjectStorageFeasibleCost } from "@/api/storage/projectStorageFeasibleCost";

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
      form: {},
      tableColumn: ['（一）直接费', '1.人工费']
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
      listProjectStorageFeasibleCost({
        feasibleId: this.form.id,
        dataType: '0'
      }).then(response => {
        this.list = response.rows;
        this.$emit('change', this.list);
      });
    },
    /** 提交按钮 */
    submitForm: function(item, index) {
      if (item.id != undefined) {
        updateProjectStorageFeasibleCost(item).then(res => {
          this.getList();
        })
      } else {
        addProjectStorageFeasibleCost(item).then(response => {
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
          return delProjectStorageFeasibleCost(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    isEdit(type) {
      let arr = ['1', '2', '6', '9', '13', '18', '23'];
      if (arr.indexOf(type) !== -1) {
        return false;
      } else {
        return true;
      }
    },
    getTotalRow() {

    },
    getTotalColumn(row, name, arr = null) {
      const list = this.list;
      if (list.length === 0) return;
      let amount = null;
      list.map(item => {
        if(!arr) {
          if (item.type !== '23') {
            if (item[name]) {
              if(!amount) amount = 0;
              amount += parseFloat(item[name]);
            }
          }
        } else {
          arr.map(type => {
            if(type == item.type) {
              if (item[name]) {
                if(!amount) amount = 0;
                amount += parseFloat(item[name]);
              }
            }
          })
        }
      })
      if(amount) amount = this.amountToFixed(amount);
      return amount;
    },
    amountToFixed(amount) {
      let arr = amount.toString().split('.');
      if (arr[1] && arr[1].length > 4) {
        amount = amount.toFixed(4);
      }
      return amount;
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
