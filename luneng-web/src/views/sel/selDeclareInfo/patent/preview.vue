<template>
  <!-- pdf 打印 -->
  <div class="pdf-content" id="pdfContent">
    <!--  一、专利基本情况-->
    <div id="table-page1" class="pdf-page">
      <h1>公司专利奖申报书</h1>
      <h2>一、专利基本情况</h2>
      <div class="item-number">项目编号：</div>
      <table class="pdf-print-table" style="text-align: center;border-bottom: none;font-size: 11pt;line-height: 16pt;">
        <tbody>
          <tr>
            <td style="width: 90px;height: 40pt;">专利名称</td>
            <td style="width: 200px;">{{form.patentName}}</td>
            <td style="width: 80px;">专利类型</td>
            <td colspan="3">{{form.patentType}}</td>
          </tr>
          <tr>
            <td style="height: 40pt;">专利号</td>
            <td>{{form.patentCode}}</td>
            <td>专利申请日</td>
            <td colspan="3">{{getCnDate(form.patentApplyDate)}}</td>
          </tr>
          <tr>
            <td style="height: 40pt;">成果分类名称及代码</td>
            <td>{{form.achieTypeName}}</td>
            <td>授权公告日</td>
            <td colspan="3">{{getCnDate(form.grantDate)}}</td>
          </tr>
          <tr>
            <td style="height: 40pt;">发明/设计人</td>
            <td colspan="5">{{form.inventionPerson}}</td>
          </tr>
          <tr>
            <td style="height: 40pt;">通讯地址</td>
            <td>{{form.inventionAddr}}</td>
            <td>邮编</td>
            <td>{{form.inventionPostCode}}</td>
            <td style="width: 38pt;">电话</td>
            <td>{{form.inventionPhone}}</td>
          </tr>
          <tr>
            <td style="height: 40pt;">专利权人</td>
            <td colspan="5">{{form.patenteePerson}}</td>
          </tr>
          <tr>
            <td style="height: 40pt;">通讯地址</td>
            <td>{{form.patenteeAddr}}</td>
            <td>邮编</td>
            <td>{{form.patenteePostCode}}</td>
            <td>电话</td>
            <td>{{form.patenteePhone}}</td>
          </tr>
          <tr>
            <td style="height: 40pt;">联系人</td>
            <td>{{form.linkman}}</td>
            <td>电话</td>
            <td>{{form.linkPhone}}</td>
            <td>手机</td>
            <td>{{form.linkMobile}}</td>
          </tr>
          <tr>
            <td style="border-bottom: none;height: 40pt;">申报单位</td>
            <td style="border-bottom: none;">{{form.declareUnit}}</td>
            <td style="border-bottom: none;">申报等级</td>
            <td style="border-bottom: none;" colspan="3">{{form.declareLevel}}</td>
          </tr>
        </tbody>
      </table>
      <div style="border-bottom: 1pt solid #000;width: calc(100% - 0.5pt);"></div>
      <table class="pdf-print-table" style="text-align: center;border-top: none;">
        <tr>
          <td :rowspan="implList.length + 2" style="width: 120px;border-top: none;">实施状况</td>
        </tr>
        <tr>
          <td style="border-top: none;height: 40pt;">实施单位</td>
          <td style="border-top: none;">许可种类</td>
          <td style="border-top: none;">许可金额</td>
          <td style="border-top: none;">合同履行情况</td>
        </tr>
        <tr v-for="item in implList">
          <td style="height: 40pt;">{{item.unitName}}</td>
          <td>{{item.licenseType}}</td>
          <td>{{item.licenseAmount}}</td>
          <td>{{item.contractPerformance}}</td>
        </tr>
      </table>
    </div>
    <!--  二、专利技术状况-->
    <div id="table-page2" class="pdf-page">
      <h2>二、专利技术状况</h2>
      <div style="border: 1pt solid #000000;height: 100%;padding: 6pt;">
        <pre>{{form.patentSituation}}</pre>
      </div>
    </div>
    <!-- 三、经济效益状况-->
    <div id="table-page3" class="pdf-page">
      <h2>三、经济效益状况</h2>
      <table class="pdf-print-table" style="text-align: center;">
        <tr>
          <td style="width: 50pt;">实施起始时间</td>
          <td colspan="5">{{getCnDate(form.implBeginDate)}}</td>
        </tr>
        <tr>
          <td rowspan="8">
            <div>实</div>
            <div>施</div>
            <div>效</div>
            <div>益</div>
          </td>
          <td class="subfield" style="width: 170pt;">
            <div class="subfield-item">效益</div>
            <div class="subfield-item">项目</div>
            <div class="subfield-line" style="background-color: #000;transform: rotate(14deg);"></div>
          </td>
          <td style="width: 52pt;">累计</td>
          <td>年 月 - 年 月</td>
        </tr>
        <tr>
          <td>产量</td>
          <td>{{form.sumYield}}</td>
          <td>{{changeDate(form.timeYield)}}</td>
        </tr>
        <tr>
          <td>专利权人收益</td>
          <td>{{form.sumPatenteeIncome}}</td>
          <td>{{changeDate(form.timePatenteeIncome)}}</td>
        </tr>
        <tr>
          <td>其他实施单位收益</td>
          <td>{{form.sumUnitIncome}}</td>
          <td>{{changeDate(form.timeUnitIncome)}}</td>
        </tr>
        <tr>
          <td>专利权人新增销售额（万元）</td>
          <td>{{form.sumNewSales}}</td>
          <td>{{changeDate(form.timeNewSales)}}</td>
        </tr>
        <tr>
          <td>专利权人新增利润（万元）</td>
          <td>{{form.sumNewProfit}}</td>
          <td>{{changeDate(form.timeNewSales)}}</td>
        </tr>
        <tr>
          <td>专利权人新增出口额（万元）</td>
          <td>{{form.sumNewExport}}</td>
          <td>{{changeDate(form.timeNewExport)}}</td>
        </tr>
        <tr>
          <td>合计</td>
          <td>{{getTotal()}}</td>
          <td></td>
        </tr>
        <tr>
          <td colspan="5">
            <div style="text-align: left;">各栏目的计算依据：</div>
            <pre style="height: 180pt;font-size: 11pt;line-height: 17pt;">{{form.calcBasis}}</pre>
          </td>
        </tr>
        <tr>
          <td colspan="5">
            <div style="text-align: left;">经济效益情况：</div>
            <pre style="height: 180pt;font-size: 11pt;line-height: 17pt;">{{form.encText}}</pre>
          </td>
        </tr>
      </table>
    </div>
    <!--  四、社会效益状况-->
    <div id="table-page4" class="pdf-page">
      <h2>四、社会效益状况</h2>
      <div style="border: 1pt solid #000000;height: 100%;padding: 6pt;">
        <pre>{{form.benefit}}</pre>
      </div>
    </div>
    <!-- 五、专利权保护情况-->
    <div id="table-page5" class="pdf-page">
      <h2>五、专利权保护情况</h2>
      <div style="border: 1pt solid #000000;height: 100%;padding: 6pt;">
        <pre>{{form.patentProtection}}</pre>
      </div>
    </div>
    <div id="table-page6">
      <!-- 六、实施单位实施状况-->
      <div id="table-page6-1" class="pdf-page">
        <h2>六、实施单位实施状况</h2>
        <table class="pdf-print-table" style="text-align: center;">
          <tr>
            <td style="width: 124pt;height: 36pt;">实施单位</td>
            <td colspan="5" style="text-align: left;">{{unitDate.unitName}}</td>
          </tr>
          <tr>
            <td style="height: 36pt;">通讯地址</td>
            <td>{{unitDate.postalAddress}}</td>
            <td style="width: 36pt;">邮编</td>
            <td>{{unitDate.postCode}}</td>
            <td style="width: 36pt;">电话</td>
            <td>{{unitDate.phone}}</td>
          </tr>
          <tr>
            <td colspan="6" style="text-align: center;height: 36pt;">累 计 经 济 效 益</td>
          </tr>
          <tr>
            <td style="height: 36pt;">实施起止时间</td>
            <td colspan="5">{{unitDate.implBeginTime}}</td>
          </tr>
          <tr>
            <td style="height: 36pt;">产量</td>
            <td colspan="5">{{unitDate.yield}}</td>
          </tr>
          <tr>
            <td style="height: 36pt;">新增销售额（万元）</td>
            <td colspan="5">{{unitDate.newSales}}</td>
          </tr>
          <tr>
            <td style="height: 36pt;">新增利润（万元）</td>
            <td colspan="5">{{unitDate.newProfits}}</td>
          </tr>
          <tr>
            <td style="height: 36pt;">新增出口额（万元）</td>
            <td colspan="5">{{unitDate.newExports}}</td>
          </tr>
          <tr>
            <td style="height: 36pt;">合计（万元）</td>
            <td colspan="5">{{unitDate.totalAmount}}</td>
          </tr>
          <tr>
            <td colspan="6">
              <div style="text-align: left;">各栏目的计算依据：</div>
              <pre style="height: 150pt;">{{unitDate.calcBasis}}</pre>
              <div style="text-align: right;padding-top: 20pt;">
                <div>
                  <span>实施单位财务专用章（盖章）</span>
                  <span style="display: inline-block;width: 80pt;"></span>
                </div>
                <div style="padding: 10pt 60pt 10pt 0;">{{getCnDate(unitDate.regDate1)}}</div>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <!-- 声明 -->
      <div id="table-page6-2" class="pdf-page">
        <table class="pdf-print-table">
          <tr>
            <td style="width: 40px;text-align: center;" rowspan="2">声明</td>
            <td style="text-align: left;">
              <div style="height: 400pt;padding-left: 20pt;padding-top: 10pt;line-height: 46pt;">
                <div>本人、本单位对提供的所有数据及内容的真实性负责。</div>
                <div>
                  <span style="display: inline-block;width: 80pt;">专利权人1: </span>
                  <span style="display: inline-block;width: 80pt;"></span>
                  盖章
                </div>
                <div>
                  <span style="display: inline-block;width: 80pt;">联 系 人:</span>
                  <span style="display: inline-block;width: 80pt;"></span>
                  <span>联系电话：</span>
                  {{unitDate.phone1}}
                </div>
                <div>
                  <span style="display: inline-block;width: 80pt;">专利权人1: </span>
                  <span style="display: inline-block;width: 80pt;"></span>
                  盖章
                </div>
                <div>
                  <span style="display: inline-block;width: 80pt;">联 系 人:</span>
                  <span style="display: inline-block;width: 80pt;"></span>
                  <span>联系电话：</span>
                  {{unitDate.phone1}}
                </div>
                <div>其他专利权人盖章：</div>
                <div>发明/设计人签字：</div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="text-align: left;">
              <div style="text-indent: 2em;height: 100pt;">（如：本单位对专利权人的申报信息及全部附件材料进行了严格审查，确认该项目符合申报要求，申报材料内容全部属实。）</div>
              <div style="text-align: right;padding-top: 20pt;">
                <div>
                  <span>申报单位公章</span>
                  <span style="display: inline-block;width: 100pt;"></span>
                </div>
                <div style="padding: 20pt 60pt 10pt 0;">{{getCnDate(unitDate.regDate2)}}</div>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <!-- 七、申报意见 -->
    <div class="pdf-page" id="table-page7">
      <table class="pdf-print-table">
        <tr>
          <td style="width: 60px;text-align: center;">
            <div>申报</div>
            <div>意见</div>
          </td>
          <td style="text-align: left;">
            <pre style="height: 340pt;">{{form.declareOpinions}}</pre>
          </td>
        </tr>
        <tr>
          <td style="text-align: center;">申报单位盖章签字</td>
          <td style="text-align: left;">
            <div style="padding-left: 20pt;">
              <div style="margin: 10pt 0 20pt;">各单位/部门</div>
              <div>主管专利工作部门负责人签字：<span style="width: 100pt;display: inline-block;border-bottom: 1pt solid #000;line-height: 18pt;margin-bottom: -3pt;"></span></div>
            </div>
            <div style="height: 100pt;"></div>
            <div style="text-align: right;padding-top: 20pt;">
              <div>
                <span>公章</span>
                <span style="display: inline-block;width: 60pt;"></span>
              </div>
              <div style="padding: 10pt 60pt 10pt 0;">{{getCnDate(unitDate.regDate2)}}</div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { updateSelDeclarePatent } from "@/api/sel/selDeclarePatent";
export default {
  data() {
    return {
      // 表单参数
      form: {},
      implList: [],  //专利基本信息-实施状况列表数据
      unitDate: {},  //实施单位实施状况数据
      dateRange: []
    };
  },
  props: {
    value: {
      default: {}
    },
    impl: {
      default: []
    },
    unit: {
      default: {}
    },
    open: {
      default: false
    },
  },
  created() {
    this.form = this.value;
    this.implList = this.impl;
    this.unitDate = this.unit;
  },
  methods: {
    /** 保存操作 */
    updateData() {
      updateSelDeclarePatent(this.form);
    },
    getCnDate(date) {
      if(date) {
        let arr = date.split(' ')[0].split('-');
        return arr[0]+'年'+arr[1]+'月'+arr[2]+'日';
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
    getUnitTotal() {
      let total = null;
      if(this.unitDate.newSales) total += parseFloat(this.unitDate.newSales);
      if(this.unitDate.newProfits) total += parseFloat(this.unitDate.newProfits);
      if(this.unitDate.newExports) total += parseFloat(this.unitDate.newExports);
      return total;
    },
    changeDate(string) {
      if(string) {
        if(string == 'null') return '';
        let dateRange = JSON.parse(string);
        if(dateRange.length == 0) return '';
        return this.getCnDate(dateRange[0]) + ' - ' + this.getCnDate(dateRange[1]);
      }
    }
  },
  watch:{
    value (newVal, oldVal) {
      this.form = newVal;
    },
    impl (newVal, oldVal) {
      this.implList = newVal;
    },
    unit (newVal, oldVal) {
      this.unitDate = newVal;
    },
    open (newVal, oldVal) {
      this.open = newVal;
    },
  }
};
</script>

<style scoped lang="scss">
  /*.pdf-content {*/
  /*  position: fixed;*/
  /*  top: 0;*/
  /*  left: 0;*/
  /*}*/
  .pdf-content .pdf-page pre {
    padding: 0;
  }
  .pdf-content .pdf-page .pdf-print-table td {
    padding: 4pt;
  }
  .red, .red-hint {
    color: #EC808D;
  }

  .hint-text {
    font-size: 14px;
    line-height: 40px;
    color: #333333;
  }
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
</style>
