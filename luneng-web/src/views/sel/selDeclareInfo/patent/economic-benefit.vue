<template>
  <el-row>
    <el-col :span="20">
      <table class="pdf-show-table">
        <tr>
          <td style="width: 120px;">实施起始时间</td>
          <td colspan="5" style="text-align: left;">
            <el-form-item prop="implBeginDate">
              <el-date-picker clearable  style="width: 200px"
                              v-model="form.implBeginDate"
                              type="date"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              @blur="submitForm"
                              placeholder="请选择实施起始时间">
              </el-date-picker>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td rowspan="8">实施效益</td>
          <td class="subfield" style="width: 220px;">
            <div class="subfield-item">效益</div>
            <div class="subfield-item">项目</div>
            <div class="subfield-line" style="transform: rotate(16.8deg);"></div>
          </td>
          <td>累计</td>
          <td>年 月 - 年 月</td>
        </tr>
        <tr>
          <td>产量</td>
          <td>
            <a-input type="number" v-model="form.sumYield" @blur="submitForm" maxlength="8" />
          </td>
          <td class="gray-placeholder">
            <el-form-item prop="timeYield">
              <el-date-picker clearable  style="width: 300px"
                              v-model="timeYield"
                              type="monthrange"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              @blur="submitForm"
                              value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>专利权人收益</td>
          <td>
            <a-input v-model="form.sumPatenteeIncome" @blur="submitForm" maxlength="8" />
          </td>
          <td class="gray-placeholder">
            <el-form-item prop="timePatenteeIncome">
              <el-date-picker clearable  style="width: 300px"
                              v-model="timePatenteeIncome"
                              type="monthrange"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              @blur="submitForm"
                              value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>其他实施单位收益</td>
          <td>
            <a-input v-model="form.sumUnitIncome" @blur="submitForm" maxlength="8" />
          </td>
          <td class="gray-placeholder">
            <el-form-item prop="timeUnitIncome">
              <el-date-picker clearable  style="width: 300px"
                              v-model="timeUnitIncome"
                              type="monthrange"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              @blur="submitForm"
                              value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>专利权人新增销售额（万元）</td>
          <td>
            <a-input v-model="form.sumNewSales" @blur="submitForm" maxlength="8" />
          </td>
          <td class="gray-placeholder">
            <el-form-item prop="timeNewSales">
              <el-date-picker clearable  style="width: 300px;"
                              v-model="timeNewSales"
                              type="monthrange"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              @blur="submitForm"
                              value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>专利权人新增利润（万元）</td>
          <td>
            <a-input v-model="form.sumNewProfit" @blur="submitForm" maxlength="8" />
          </td>
          <td class="gray-placeholder">
            <el-form-item prop="timeNewSales">
              <el-date-picker clearable  style="width: 300px"
                              v-model="timeNewProfit"
                              type="monthrange"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              @blur="submitForm"
                              value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>专利权人新增出口额（万元）</td>
          <td>
            <a-input v-model="form.sumNewExport" @blur="submitForm" maxlength="8" />
          </td>
          <td class="gray-placeholder">
            <el-form-item prop="timeNewExport">
              <el-date-picker clearable  style="width: 300px"
                              v-model="timeNewExport"
                              type="monthrange"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              @blur="submitForm"
                              value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>合计</td>
          <td>{{form.sumTotal}}</td>
          <td></td>
        </tr>
        <tr>
          <td style="width: 200px;">各栏目的计算依据</td>
          <td colspan="4">
            <el-form-item prop="calcBasis">
              <el-input v-model="form.calcBasis" type="textarea" rows="8"  placeholder="请输入各栏目的计算依据" maxlength="400" show-word-limit @blur="submitForm" />
            </el-form-item>
            <div class="fr">加盖财务印章</div>
          </td>
        </tr>
        <tr>
          <td style="width: 200px;">经济效益情况</td>
          <td colspan="4">
            <el-form-item prop="encText">
              <el-input v-model="form.encText" type="textarea" rows="8"  placeholder="包括实施单位、用途、应用情况、产品销售情况等。填写内容不得超过 400 字" maxlength="400" show-word-limit @blur="submitForm" />
            </el-form-item>
          </td>
        </tr>
      </table>
      <preview-pdf :id="form.infoId" :page="3" />
      <div>
        <upload accept=".pdf" v-model="form.encFilePaths" @change="submitForm" @remove="submitForm" />
        <div class="el-upload__tip red-hint">只能上传PDF格式的文件，分辨率为300dpi彩色，且文件不超过5M</div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { updateSelDeclarePatent } from "@/api/sel/selDeclarePatent";

export default {
  data() {
    return {
      // 表单参数
      form: {},
      timeYield: [],
      timePatenteeIncome: [],
      timeUnitIncome: [],
      timeNewSales: [],
      timeNewProfit: [],
      timeNewExport: []
    };
  },
  props: {
    value: {
      default: {}
    }
  },
  created() {
  },
  methods: {
    /** 保存操作 */
    submitForm() {
      if (this.form.id != undefined) {
        let data = this.form;
        data.timeYield = JSON.stringify(this.timeYield);
        data.timePatenteeIncome = JSON.stringify(this.timePatenteeIncome);
        data.timeUnitIncome = JSON.stringify(this.timeUnitIncome);
        data.timeNewSales = JSON.stringify(this.timeNewSales);
        data.timeNewProfit = JSON.stringify(this.timeNewProfit);
        data.timeNewExport = JSON.stringify(this.timeNewExport);
        data.sumTotal = this.getTotal();
        updateSelDeclarePatent(data);
        this.$emit('ecnomicform', data)
      }
    },
    getTotal() {
      let total = null;
      if(this.form.sumYield) total += parseFloat(this.form.sumYield);
      if(this.form.sumPatenteeIncome) total += parseFloat(this.form.sumPatenteeIncome);
      if(this.form.sumUnitIncome) total += parseFloat(this.form.sumUnitIncome);
      if(this.form.sumNewSales) total += parseFloat(this.form.sumNewSales);
      if(this.form.sumNewProfit) total += parseFloat(this.form.sumNewProfit);
      if(this.form.sumNewExport) total += parseFloat(this.form.sumNewExport);
      return total
    },
    dateRangeParse(str) {
      if(!str) return []
      return JSON.parse(str)
    }
  },
  watch:{
    value (newVal, oldVal) {
      this.form = newVal;
      this.timeYield = this.dateRangeParse(this.form.timeYield);
      this.timePatenteeIncome = this.dateRangeParse(this.form.timePatenteeIncome);
      this.timeUnitIncome = this.dateRangeParse(this.form.timeUnitIncome);
      this.timeNewSales = this.dateRangeParse(this.form.timeNewSales);
      this.timeNewProfit = this.dateRangeParse(this.form.timeNewProfit);
      this.timeNewExport = this.dateRangeParse(this.form.timeNewExport);
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
