<template>
  <el-row>
    <el-col :span="20">
      <table class="pdf-show-table">
        <tr>
          <td colspan="5" style="text-align: left;">
            <span>经济效益(加盖财务专用章)</span>
            <span style="float: right;">单位：万元人民币</span>
          </td>
        </tr>
        <tr>
          <td style="width: 200px;">项目总投资额</td>
          <td colspan="2">
            <el-form-item prop="totalInvestment">
              <a-input v-model="form.totalInvestment" placeholder="" @blur="updateData" maxlength="8" />
            </el-form-item>
          </td>
          <td style="width: 200px;">回收期(年)</td>
          <td>
            <el-form-item prop="paybackPeriod">
              <a-input type="number" v-model="form.paybackPeriod" placeholder="" @blur="updateData" maxlength="8" />
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td class="subfield">
            <div class="subfield-item">栏目</div>
            <div class="subfield-item">年份(3年内)</div>
            <div class="subfield-line"></div>
          </td>
          <td>新增利润</td>
          <td>新增税收</td>
          <td>创收外汇</td>
          <td>节支总额</td>
        </tr>
        <tr v-for="item in selDeclareScienceEconomicList">
          <td>
            <a-input type="number" v-model="item.investmentYear" @blur="checkYear(item)" maxlength="4"/>
          </td>
          <td>
            <a-input v-model="item.newProfits" @blur="submitForm(item)" maxlength="8"/>
          </td>
          <td>
            <a-input v-model="item.newTaxes" @blur="submitForm(item)" maxlength="8"/>
          </td>
          <td>
            <a-input v-model="item.incomeExchange" @blur="submitForm(item)" maxlength="8"/>
          </td>
          <td>
            <a-input v-model="item.totalSavings" @blur="submitForm(item)" maxlength="8"/>
          </td>
        </tr>
        <tr>
          <td>累计</td>
          <td>{{form.economic1}}</td>
          <td>{{form.economic2}}</td>
          <td>{{form.economic3}}</td>
          <td>{{form.economicSum}}</td>
        </tr>
        <tr>
          <td style="width: 200px;">经济效益额的计算依据</td>
          <td colspan="4">
            <el-form-item prop="settlementBasis">
              <el-input v-model="form.settlementBasis" type="textarea" rows="8"  placeholder="应就生产或应用项目后产生的直接累计净增效益、提高产品质量、提高劳动生产率等做出简要说明，并具体列出所填各项效益额的计算方法和计算依据，如无直接经济效益，可以不填此栏，填写不得超过400字" maxlength="400" show-word-limit @blur="updateData" />
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td style="width: 200px;">社会效益与间接经济效益</td>
          <td colspan="4">
            <el-form-item prop="benefit">
              <el-input v-model="form.benefit" type="textarea" rows="8"  placeholder="指项目在推动公司科技进步，保护自然资源或生态环境；提高中国绿发投资集团有限公司综合实力；改善人民物质、文化、生活及健康水平等方面所起的作用，以及项目应用推广后，本项目主要完成单位之外产生的经济效益，应扼要地做出说明，填写内容不得超过500字" maxlength="500" show-word-limit @blur="updateData" />
            </el-form-item>
          </td>
        </tr>
      </table>
      <preview-pdf :id="form.infoId" :page="4" />
      <div>
        <upload accept=".pdf" v-model="form.economicFilePaths" @change="updateData" @remove="updateData" />
        <div class="el-upload__tip red-hint">只能上传PDF格式的文件，分辨率为300dpi彩色，且文件不超过5M</div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { updateSelDeclareScience } from "@/api/sel/selDeclareScience";
import { listSelDeclareScienceEconomic, addSelDeclareScienceEconomic, updateSelDeclareScienceEconomic } from "@/api/sel/selDeclareScienceEconomic";

export default {
  data() {
    return {
      // 表单参数
      form: {},
      selDeclareScienceEconomicList: []
    };
  },
  props: {
    value: {
      default: {}
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询科技进步奖经济效益列表 */
    getList() {
      if(!this.form.id) return;
      listSelDeclareScienceEconomic({
        scienceId: this.form.id
      }).then(response => {
        this.selDeclareScienceEconomicList = response.rows;
        if(this.selDeclareScienceEconomicList.length < 3) {
          this.submitForm({ scienceId: this.form.id });
        }
        if(this.selDeclareScienceEconomicList.length > 3) {
          this.selDeclareScienceEconomicList.length = 3;
        }
        this.$emit('change', this.selDeclareScienceEconomicList);
      });
    },
    //校验是否是三年内年份
    checkYear(row) {
      let years = [];
      this.selDeclareScienceEconomicList.map(item => {
        if(item.investmentYear) years.push(item.investmentYear);
      })
      let minYear = Math.min.apply(null, years);
      let maxYear = Math.max.apply(null, years);
      if(maxYear - minYear >= 3) {
        this.msgError('请输入三年内的年份！');
          return false;
      }
      this.submitForm(row);
    },
    /** 保存操作 */
    submitForm(item, index) {
      if (item.id != undefined) {
        updateSelDeclareScienceEconomic(item);
        let isUpdate = false;
        let newProfits = this.getTotal('newProfits');
        let newTaxes = this.getTotal('newTaxes');
        let incomeExchange = this.getTotal('incomeExchange');
        let totalSavings = this.getTotal('totalSavings');
        if (newProfits && newProfits !== this.form.economic1) {
          this.form.economic1 = newProfits;
          isUpdate = true;
        }
        if (newTaxes && newTaxes !== this.form.economic2) {
          this.form.economic2 = newTaxes;
          isUpdate = true;
        }
        if (incomeExchange && incomeExchange !== this.form.economic3) {
          this.form.economic3 = incomeExchange;
          isUpdate = true;
        }
        if (totalSavings && totalSavings !== this.form.economicSum) {
          this.form.economicSum = totalSavings;
          isUpdate = true;
        }
        if (isUpdate) this.updateData();
      } else {
        addSelDeclareScienceEconomic(item).then(response => {
          this.getList();
        });
      }
    },
    /** 保存操作 */
    updateData() {
      updateSelDeclareScience(this.form);
      this.$emit('ecnomicform', this.form)
    },
    getTotal(key) {
      let total = null;
      this.selDeclareScienceEconomicList.map(item => {
        if(item[key]) total += parseFloat(item[key]);
      })
      return total;
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

<style lang="scss" scoped>
  .subfield {
    position: relative;
    overflow: hidden;
    .subfield-line {
      content: '';
      display: block;
      width: 400px;
      height: 1px;
      background-color: #EBEEF5;
      position: absolute;
      top: 0;
      left: 0;
      transform: rotate(18.5deg);
      transform-origin: 0;
    }
    .subfield-item {
      text-align: left;
    }
    .subfield-item:first-child {
      text-align: right;
      padding-right: 10px;
    }
    .subfield-item:last-child {
      text-align: left;
      padding-left: 10px;
    }
  }
  .red, .red-hint, .hint-text.red-hint {
    color: #EC808D;
  }
</style>
