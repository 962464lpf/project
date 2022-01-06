<template>
  <div>
    <el-row>
      <el-col :span="20">
        <table class="pdf-show-table">
          <tbody>
            <tr>
              <td style="width: 180px;">实施单位</td>
              <td colspan="5">
                <el-form-item prop="unitName">
                  <el-input v-model="form.unitName" placeholder="" @blur="updateData(form)" maxlength="50" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>通讯地址</td>
              <td>
                <el-form-item prop="postalAddress">
                  <el-input type="textarea" v-model="form.postalAddress" placeholder="" @blur="updateData(form)" maxlength="50" />
                </el-form-item>
              </td>
              <td>邮编</td>
              <td style="text-align: left;width: 220px;">
                <el-form-item prop="postCode">
                  <el-input v-model="form.postCode" placeholder="" @blur="updateData(form)" maxlength="20" />
                </el-form-item>
              </td>
              <td>电话</td>
              <td style="width: 220px;">
                <el-form-item prop="phone">
                  <a-input type="phone" v-model="form.phone" placeholder="" @blur="updateData(form)" maxlength="20" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td colspan="6" style="text-align: center;">累 计 经 济 效 益</td>
            </tr>
            <tr>
              <td>实施起止时间</td>
              <td colspan="5" style="text-align: left;" class="gray-placeholder">
                <el-form-item prop="implBeginTime">
                  <el-input type="text" v-model="form.implBeginTime" placeholder="" @blur="updateData(form)" maxlength="30" />
                </el-form-item>
<!--                <el-form-item prop="implBeginTime">-->
<!--                  <el-date-picker clearable  style="width: 300px"-->
<!--                                  v-model="dateRange"-->
<!--                                  type="daterange"-->
<!--                                  range-separator="至"-->
<!--                                  start-placeholder="开始时间"-->
<!--                                  end-placeholder="结束时间"-->
<!--                                  @change="updateData(form)"-->
<!--                                  value-format="yyyy-MM-dd HH:mm:ss">-->
<!--                  </el-date-picker>-->
<!--                </el-form-item>-->
              </td>
            </tr>
            <tr>
              <td>产量</td>
              <td colspan="5">
                <el-form-item prop="yield">
                  <el-input type="text" v-model="form.yield" placeholder="" @blur="updateData(form)" maxlength="30" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>新增销售额（万元）</td>
              <td colspan="5">
                <el-form-item prop="newSales">
                  <el-input v-model="form.newSales" placeholder="" @blur="updateData(form)" maxlength="30" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>新增利润（万元）</td>
              <td colspan="5">
                <el-form-item prop="newProfits">
                  <el-input v-model="form.newProfits" placeholder="" @blur="updateData(form)" maxlength="30" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>新增出口额（万元）</td>
              <td colspan="5">
                <el-form-item prop="newExports">
                  <el-input v-model="form.newExports" placeholder="" @blur="updateData(form)" maxlength="30" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>合计（万元）</td>
              <td colspan="5" style="text-align: left;">
                <el-input v-model="form.totalAmount" placeholder="" @blur="updateData(form)" maxlength="30" />
              </td>
            </tr>
            <tr>
              <td>各栏目的计算依据</td>
              <td colspan="5">
                <el-form-item prop="calcBasis">
                  <el-input v-model="form.calcBasis" type="textarea" placeholder="请输入各栏目的计算依据" rows="4" maxlength="400" show-word-limit @blur="updateData(form)" />
                </el-form-item>
                <div style="text-align: right;padding-top: 20px;" class="hint-text">
                  <span>实施单位财务专用章（盖章）</span><span style="width: 50px;display: inline-block;"></span>
                  <div>
                    <span>日期</span>
                    <el-form-item prop="regDate1" style="display: inline-block;">
                      <el-date-picker clearable  style="width: 200px"
                                      v-model="form.regDate1"
                                      type="date"
                                      value-format="yyyy-MM-dd HH:mm:ss"
                                      @blur="updateData(form)"
                                      placeholder="选择日期">
                      </el-date-picker>
                    </el-form-item>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>声明</td>
              <td colspan="6">
                <div style="text-align: left;">
                  <div style="margin-bottom: 20px;">本人、本单位对提供的所有数据及内容的真实性负责。</div>
                  <div style="margin-bottom: 20px;">
                    <span style="width: 100px;display: inline-block;text-align: right;">专利权人1</span>
                    <el-input disabled value="请打印签名后上传证明文件" style="display: inline-block;width: 200px;margin-right: 30px;" />
                    <span>盖章</span>
                  </div>
                  <div style="margin-bottom: 20px;">
                    <span style="width: 100px;display: inline-block;text-align: right;">联系人</span>
                    <el-input disabled value="请打印签名后上传证明文件" style="display: inline-block;width: 200px;margin-right: 30px;" />
                    <span>联系电话</span>
                    <a-input type="phone" v-model="form.phone1" placeholder="" style="display: inline-block;width: 200px;" @blur="updateData(form)" maxlength="20" />
                  </div>
                  <div style="margin-bottom: 20px;">
                    <span style="width: 100px;display: inline-block;text-align: right;">专利权人2</span>
                    <el-input disabled value="请打印签名后上传证明文件" style="display: inline-block;width: 200px;margin-right: 30px;" />
                    <span>盖章</span>
                  </div>
                  <div>
                    <span style="width: 100px;display: inline-block;text-align: right;">联系人</span>
                    <el-input disabled value="请打印签名后上传证明文件" style="display: inline-block;width: 200px;margin-right: 30px;" />
                    <span>联系电话</span>
                    <a-input type="phone" v-model="form.phone2" placeholder="" style="display: inline-block;width: 200px;" @blur="updateData(form)" maxlength="20" />
                  </div>
                  <div style="padding: 10px 40px;margin-top: 20px;">其他专利人盖章</div>
                  <div style="padding: 10px 40px;margin-bottom: 20px;">发明/设计人签字</div>
                </div>
                <div style="border-top: 1px solid #EBEEF5;padding: 10px 0 20px;text-align: left;">（如：本单位对专利权人的申报信息及全部附件材料进行了严格审查，确认该项目符合申报要求，申报材料内容全部属实。）</div>
                <div style="text-align: right;padding-top: 20px;" class="hint-text">
                  <span>实施单位财务专用章（盖章）</span><span style="width: 50px;display: inline-block;"></span>
                  <div>
                    <span>日期</span>
                    <el-form-item prop="regDate2" style="display: inline-block;">
                      <el-date-picker clearable  style="width: 200px"
                                      v-model="form.regDate2"
                                      type="date"
                                      value-format="yyyy-MM-dd HH:mm:ss"
                                      @blur="updateData(form)"
                                      placeholder="选择日期">
                      </el-date-picker>
                    </el-form-item>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <preview-pdf :id="patentForm.infoId" :page="6" />
        <div>
          <upload accept=".pdf" v-model="patentForm.putFilePaths" @change="submitForm" @remove="submitForm" />
          <div class="el-upload__tip red-hint">只能上传PDF格式的文件，分辨率为300dpi彩色，且文件不超过5M</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { updateSelDeclarePatent } from "@/api/sel/selDeclarePatent";
import { listSelDeclarePatentUnit, getSelDeclarePatentUnit, delSelDeclarePatentUnit, addSelDeclarePatentUnit, updateSelDeclarePatentUnit, exportSelDeclarePatentUnit } from "@/api/sel/selDeclarePatentUnit";

export default {
  data() {
    return {
      patentForm: {},
      // 表单参数
      form: {},
      // 实施单位实施情况表格数据
      selDeclarePatentUnitList: [],
      dateRange: []
    };
  },
  props: {
    value: {
      default: {}
    },
  },
  created() {
    this.patentForm = this.value;
  },
  methods: {
    /** 查询专利实施情况列表 */
    getList() {
      if (!this.patentForm.id) return
      listSelDeclarePatentUnit({
        patentId: this.patentForm.id
      }).then(response => {
        this.selDeclarePatentUnitList = response.rows;
        if(this.selDeclarePatentUnitList.length == 0) {
          this.updateData({ patentId: this.patentForm.id });
        } else {
          this.form = this.selDeclarePatentUnitList[0];
          // if(this.form.implBeginTime && this.form.implEndTime) {
          //   this.dateRange = [this.form.implBeginTime, this.form.implEndTime];
          // }
        }
        this.$emit('change', this.form);
      });
    },
    /** 更新操作 */
    submitForm: function() {
      if (this.patentForm.id != undefined) {
        updateSelDeclarePatent(this.patentForm);
        this.$emit('implementationform', this.patentForm)
      }
    },
    /** 提交按钮 */
    updateData: function(item) {
      if (item.id != undefined) {
        updateSelDeclarePatentUnit(item);
      } else {
        addSelDeclarePatentUnit(item);
        this.getList();
      }
    },
    // 添加日期范围
    addDateRange(params, dateRange) {
      var search = params;
      search.implBeginTime = undefined;
      search.implEndTime = undefined;
      if (null != dateRange && '' != dateRange) {
        search.implBeginTime = dateRange[0];
        search.implEndTime = dateRange[1];
      }
      return search;
    },
    getTotal() {
      let total = null;
      if(this.form.newSales) total += parseFloat(this.form.newSales);
      if(this.form.newProfits) total += parseFloat(this.form.newProfits);
      if(this.form.newExports) total += parseFloat(this.form.newExports);
      return total;
    }
  },
  watch:{
    value (newVal, oldVal) {
      this.patentForm = newVal;
      this.getList();
    }
  }
};
</script>

<style scoped>
  .red, .red-hint, .hint-text.red-hint {
    color: #EC808D;
  }
</style>
