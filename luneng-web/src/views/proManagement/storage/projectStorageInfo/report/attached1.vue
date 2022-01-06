<template>
  <div>
    <div style="margin-bottom: 15px;">
      <span class="annexed-table-title">附表1 仪器设备使用费预算明细表</span>
      <span class="annexed-table-unit fr">单位：万元</span>
    </div>
    <table class="pdf-show-table tc">
      <tbody>
      <tr style="font-weight: bold;">
        <td style="width: 50px;">序号</td>
        <td style="min-width: 160px;">仪器设备名称</td>
        <td style="min-width: 120px;">型号</td>
        <td style="min-width: 100px;width: 100px;">固定资产原值</td>
        <td style="min-width: 160px;">固定资产编号</td>
        <td style="min-width: 80px;width: 80px;">使用年限</td>
        <td style="min-width: 90px;width: 90px;">折旧费</td>
        <td style="min-width: 90px;width: 90px;">大修理费</td>
        <td style="min-width: 90px;width: 90px;">安装及拆卸费</td>
        <td style="min-width: 90px;width: 90px;">场外运费</td>
        <td style="min-width: 90px;width: 90px;">操作人员人工费</td>
        <td style="min-width: 80px;width: 90px;">燃料动力费</td>
        <td style="min-width: 90px;width: 90px;">养路费及车船税</td>
        <td style="min-width: 74px;">费用合计</td>
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
          <el-input v-model="item.name" type="textarea" @blur="submitForm(item, index)" maxlength="20"/>
        </td>
        <td>
          <el-input v-model="item.model" type="textarea" @blur="submitForm(item, index)" maxlength="20"/>
        </td>
        <td>
          <m-input type="textarea" inputType="wanYuan" :showText="false" v-model="item.fixedAssets" @blur="submitForm(item, index)" />
        </td>
        <td>
          <el-input v-model="item.fixedCode" type="textarea" @blur="submitForm(item, index)" maxlength="20"/>
        </td>
        <td>
          <m-input v-model="item.useFixed" type="textarea" inputType="number" @blur="submitForm(item, index)" maxlength="2"/>
        </td>
        <td>
          <m-input type="textarea" inputType="wanYuan" :showText="false" v-model="item.depreciationCost" @blur="submitForm(item, index)" />
        </td>
        <td>
          <m-input type="textarea" inputType="wanYuan" :showText="false" v-model="item.repairCost" @blur="submitForm(item, index)" />
        </td>
        <td>
          <m-input type="textarea" inputType="wanYuan" :showText="false" v-model="item.mountingDismountingCost" @blur="submitForm(item, index)" />
        </td>
        <td>
          <m-input type="textarea" inputType="wanYuan" :showText="false" v-model="item.transportCost" @blur="submitForm(item, index)" />
        </td>
        <td>
          <m-input type="textarea" inputType="wanYuan" :showText="false" v-model="item.operatorCost" @blur="submitForm(item, index)" />
        </td>
        <td>
          <m-input type="textarea" inputType="wanYuan" :showText="false" v-model="item.fuelCost" @blur="submitForm(item, index)" />
        </td>
        <td>
          <m-input type="textarea" inputType="wanYuan" :showText="false" v-model="item.toll" @blur="submitForm(item, index)" />
        </td>
        <td>{{item.totalCost}}</td>
        <td>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(item)"
          >删除</el-button>
        </td>
      </tr>
      <tr>
        <td colspan="2">累计</td>
        <td></td>
        <td>{{totalItem.fixedAssets}}</td>
        <td></td>
        <td></td>
        <td>{{totalItem.depreciationCost}}</td>
        <td>{{totalItem.repairCost}}</td>
        <td>{{totalItem.mountingDismountingCost}}</td>
        <td>{{totalItem.transportCost}}</td>
        <td>{{totalItem.operatorCost}}</td>
        <td>{{totalItem.fuelCost}}</td>
        <td>{{totalItem.toll}}</td>
        <td>{{totalItem.totalCost}}</td>
        <td></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { listProjectStorageFeasibleInstrument, delProjectStorageFeasibleInstrument, addProjectStorageFeasibleInstrument, updateProjectStorageFeasibleInstrument } from "@/api/storage/projectStorageFeasibleInstrument";

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
      listProjectStorageFeasibleInstrument({
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
        item.totalCost = this.getTotalRow(item);
        updateProjectStorageFeasibleInstrument(item).then(res => {
          this.getList();
        })
        // this.totalItem.fixedAssets = this.getTotalColumn('fixedAssets');
        // this.totalItem.depreciationCost = this.getTotalColumn('depreciationCost');
        // this.totalItem.repairCost = this.getTotalColumn('repairCost');
        // this.totalItem.mountingDismountingCost = this.getTotalColumn('mountingDismountingCost');
        // this.totalItem.transportCost = this.getTotalColumn('transportCost');
        // this.totalItem.operatorCost = this.getTotalColumn('operatorCost');
        // this.totalItem.fuelCost = this.getTotalColumn('fuelCost');
        // this.totalItem.toll = this.getTotalColumn('toll');
        // this.totalItem.totalCost = this.getTotalColumn('totalCost');
        // updateProjectStorageFeasibleInstrument(this.totalItem).then(res => {
        //   this.getList();
        // });
      } else {
        addProjectStorageFeasibleInstrument(item).then(response => {
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
          return delProjectStorageFeasibleInstrument(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    getTotalRow(item) {
      let total = null;
      let arr = ['fixedAssets', 'depreciationCost', 'repairCost', 'mountingDismountingCost', 'transportCost', 'operatorCost', 'fuelCost', 'toll'];
      arr.map(key => {
        if(item[key]) {
          if(!total) total = 0;
          total += parseFloat(item[key]);
        }
      })
      if(!total) return '';
      let arr1 = total.toString().split('.');
      if (arr1[1] && arr1[1].length > 4) {
        total = total.toFixed(4);
      }
      return total;
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

<style lang="scss" scoped>
  .pdf-show-table td {
    padding: 10px 8px;
    /deep/ .el-input__inner {
      padding: 0 10px;
    }
  }
  /deep/ .el-textarea__inner {
    padding: 5px;
  }
</style>
