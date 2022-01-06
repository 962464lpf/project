<template>
  <div>
    <div style="margin-bottom: 15px;">
      <div class="replenish-table-title" style="margin-bottom: 10px;">补充1: 经费预算编制依据</div>
      <div style="margin-bottom: 10px;">根据《国家电网公司科技项目预算编制实施细则》，编制项目（或独立课题）经费预算，同时列出预算编制依据及说明。</div>
      <div class="replenish-table-title tc" style="text-align: center;">
        表：项目（或独立课题）经费预算及依据表
        <span class="annexed-table-unit fr">单位：万元</span>
      </div>
    </div>
    <table class="pdf-show-table tc">
      <tbody>
        <tr>
          <td style="width: 256px;min-width: 256px;">科目名称</td>
          <td style="min-width: 130px;width: 200px;">预算金额</td>
          <td style="min-width: 300px;">经费预算依据及说明</td>
          <td style="min-width: 200px;width: 300px;">计算方法</td>
          <td style="min-width: 200px;width: 300px;">备注</td>
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
            <el-input v-if="item.type !== '23'" type="textarea" v-model="item.remark" @blur="submitForm(item, index)" maxlength="100" show-word-limit />
          </td>
          <td>
            <div v-if="item.type == '1'">直接费＝人工费＋设备使用费＋业务费＋场地使用费＋专家咨询费</div>
            <div v-if="item.type == '2'">人工费＝专职研究人员人工费＋劳务外包人员人工费＋临时性研究人员人工费</div>
            <div v-if="item.type=='3'">
              <div>专职研究人员人工费=人员数量（人员类型1）×工作月×标准1+人员数量（人员类型2）×工作月×标准2+加班费</div>
              <img src="../../../../../assets/image/jiabanfei.png" alt="" height="70">
            </div>
            <div v-if="item.type=='4'">
              <div>劳务外包人员人工费=人员数量×工作月×标准3+加班费</div>
              <img src="../../../../../assets/image/jiabanfei.png" alt="" height="70">
            </div>
            <div v-if="item.type=='5'">
              <div>临时性研究人员人工费=人员数量×工作月×标准×加班费</div>
              <img src="../../../../../assets/image/jiabanfei.png" alt="" height="70">
            </div>
            <div v-if="item.type=='6'">设备使用费=仪器设备使用费＋软件使用费</div>
            <div v-if="item.type=='7'">仪器设备使用费＝折旧费+大修理费+经常修理费+安装及拆卸费+场外运费+操作人员人工费+燃料动力费+车船税</div>
            <div v-if="item.type=='8'">软件使用费=摊销费+维护费+技术服务费+培训费</div>
            <div v-if="item.type=='9'">业务费＝材料费＋资料费＋印刷出版费＋知识产权费+会议费＋差旅费＋培训费</div>
            <div v-if="item.type=='10'">材料费＝材料消耗量×材料预算价格</div>
            <div v-if="item.type=='11'">资料、印刷及知识产权费＝文献检索费+资料购置费+印刷出版费+翻译费+专利申请费+知识产权费</div>
            <div v-if="item.type=='12'">会议、差旅及国际合作交流费＝会议费+差旅费+国际合作交流费+培训费</div>
            <div v-if="item.type=='13'">场地使用费＝场地物业费＋场地租金</div>
            <div v-if="item.type=='14'">场地物业费＝占用面积×占用时间×单位面积物业管理费</div>
            <div v-if="item.type=='15'">场地使用租金＝占用面积×占用时间×单位面积场地租金</div>
            <div v-if="item.type=='16'">专家咨询费＝咨询专家人次×人员标准×天数</div>
            <div v-if="item.type=='17'"><b>间接费＝项目总费用×费率</b></div>
            <div v-if="item.type=='18'"><b>外委支出费＝外委研究支出费+外协测试试验与加工费+仪器设备租赁费</b></div>
            <div v-if="item.type=='19'"></div>
            <div v-if="item.type=='20'"></div>
            <div v-if="item.type=='21'"></div>
            <div v-if="item.type=='22'">税金=增值税+城市维护建设税+教育费附加</div>
          </td>
          <td>
            <div v-if="item.type=='3'">专职研究人员中，人员类型1为高级研究人员（含项目负责人、子项目负责人、项目骨干研究人员和其他高级研究人员），标准为2～3万元/人月（标准）；人员类型2为其他研究人员（含中初级研究人员、技术工人、博士后、研究生等其他研究人员），标准为1.5～2万元/人月（标准2）</div>
            <div v-if="item.type=='4'">劳务外包人员是指承担单位将部分研究业务外包给相关机构，由该机构按照承担单位要求安排的用于完成相应研究任务的人员，临时性研究人员包括单位实习生、社会短期聘用人员、兼职研究人员等。劳务外包人员人工费和临时性研究人员人工费应参照当地科学研究和技术服务业从业人员平均收入水平（标准3），根据其在项目研究中承担的工作任务确定</div>
            <div v-if="item.type=='5'"></div>
            <div v-if="item.type=='7'"></div>
            <div v-if="item.type=='7'"></div>
            <div v-if="item.type=='7'"></div>
            <div v-if="item.type=='7'"></div>
            <span v-if="item.type == '23'"></span>
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
      listProjectStorageFeasibleCost({
        feasibleId: this.form.id,
        dataType: '1'
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
    isEdit(type) {
      let arr = ['1', '2', '6', '9', '13', '18', '23'];
      if (arr.indexOf(type) !== -1) {
        return false;
      } else {
        return true;
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
    getTotalColumn(row) {
      const list = this.list;
      if (list.length === 0) return;
      let budgetCost = null;
      list.map(item => {
        if (item.type !== '23') {
          if (item.budgetCost) {
            if(!budgetCost) budgetCost = 0;
            budgetCost += parseFloat(item.budgetCost);
          }
        }
      })
      if(!budgetCost) return;
      let arr = budgetCost.toString().split('.');
      if (arr[1] && arr[1].length > 4) {
        budgetCost = budgetCost.toFixed(4);
      }
      row.budgetCost = budgetCost;
      updateProjectStorageFeasibleCost(row);
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
