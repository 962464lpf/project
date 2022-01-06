<template>
  <div>
    <el-row>
      <el-col :span="20">
        <table class="pdf-show-table">
          <tbody>
            <tr>
              <td style="width: 120px;">专利名称</td>
              <td>
                <el-form-item prop="patentName">
                  <el-input type="textarea" v-model="form.patentName" placeholder="字数（含字符）不超过100字" @blur="submitForm" maxlength="100" />
                </el-form-item>
              </td>
              <td style="width: 120px;">专利类型</td>
              <td colspan="3">
                <el-form-item prop="patentType">
                  <el-input v-model="form.patentType" placeholder="" @blur="submitForm" maxlength="20" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>专利号</td>
              <td>
                <el-form-item prop="patentCode">
                  <el-input type="textarea" v-model="form.patentCode" placeholder="字数（含字符）不超过50字" @blur="submitForm" maxlength="50" />
                </el-form-item>
              </td>
              <td>专利申请日</td>
              <td colspan="3" style="text-align: left;">
                <el-form-item prop="patentApplyDate">
                    <el-date-picker clearable  style="width: 200px"
                                    v-model="form.patentApplyDate"
                                    type="date"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    @blur="submitForm"
                                    placeholder="">
                    </el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>成果分类名称及代码</td>
              <td>
                <el-form-item prop="achieTypeName">
                  <el-input v-model="form.achieTypeName" type="textarea" placeholder="选取的分类不超过3个" @blur="submitForm" maxlength="40" />
                </el-form-item>
              </td>
              <td>授权公告日</td>
              <td colspan="3" style="text-align: left;">
                <el-form-item prop="grantDate">
                  <el-date-picker clearable  style="width: 200px"
                                  v-model="form.grantDate"
                                  type="date"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  @blur="submitForm"
                                  placeholder="">
                  </el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>发明/设计人</td>
              <td colspan="5">
                <el-form-item prop="inventionPerson">
                  <el-input v-model="form.inventionPerson" type="text" placeholder="如存在多个发明人/设计人，之间用“、”分隔，务必与专利证书保持一致" @blur="submitForm" maxlength="50" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>通讯地址</td>
              <td>
                <el-form-item prop="inventionAddr">
                  <el-input v-model="form.inventionAddr" type="text" placeholder="" @blur="submitForm" maxlength="50" />
                </el-form-item>
              </td>
              <td>邮编</td>
              <td>
                <el-form-item prop="inventionPostCode">
                  <el-input v-model="form.inventionPostCode" type="text" placeholder="" @blur="submitForm" maxlength="20" />
                </el-form-item>
              </td>
              <td>电话</td>
              <td>
                <el-form-item prop="inventionPhone">
                  <a-input type="phone" v-model="form.inventionPhone" placeholder="" @blur="submitForm" maxlength="20" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>专利权人</td>
              <td colspan="5">
                <el-form-item prop="patenteePerson">
                  <el-input v-model="form.patenteePerson" type="text" placeholder="如存在多个发明人/设计人，之间用“、”分隔，务必与专利证书保持一致" @blur="submitForm" maxlength="50" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>通讯地址</td>
              <td>
                <el-form-item prop="patenteeAddr">
                  <el-input v-model="form.patenteeAddr" type="textarea" placeholder="" @blur="submitForm" maxlength="50" />
                </el-form-item>
              </td>
              <td>邮编</td>
              <td>
                <el-form-item prop="patenteePostCode">
                  <el-input v-model="form.patenteePostCode" type="text" placeholder="" @blur="submitForm" maxlength="20" />
                </el-form-item>
              </td>
              <td>电话</td>
              <td>
                <el-form-item prop="patenteePhone">
                  <a-input type="phone" v-model="form.patenteePhone" placeholder="" @blur="submitForm" maxlength="20" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>联系人</td>
              <td>
                <el-form-item prop="linkman">
                  <el-input v-model="form.linkman" type="text" placeholder="" @blur="submitForm" maxlength="20" />
                </el-form-item>
              </td>
              <td>电话</td>
              <td>
                <el-form-item prop="linkPhone">
                  <a-input type="phone" v-model="form.linkPhone" placeholder="" @blur="submitForm" maxlength="20" />
                </el-form-item>
              </td>
              <td>手机</td>
              <td>
                <el-form-item prop="linkMobile">
                  <a-input type="mobile" v-model="form.linkMobile" placeholder="" @blur="submitForm" maxlength="20" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>申报单位</td>
              <td>
                <el-form-item prop="declareUnit">
                  <el-input v-model="form.declareUnit" type="textarea" placeholder="指具有申报资格的单位" @blur="submitForm" maxlength="20" />
                </el-form-item>
              </td>
              <td>申报等级</td>
              <td colspan="3">
                <el-form-item prop="declareLevel">
                  <el-input v-model="form.declareLevel" type="text" placeholder="" @blur="submitForm" maxlength="20" />
                </el-form-item>
              </td>
            </tr>
          </tbody>
        </table>
        <table class="pdf-show-table" style="margin-top: -1px;text-align: center;">
          <tr>
            <td :rowspan="selDeclarePatentImplList.length + 2" style="width: 120px;">实施状况</td>
          </tr>
          <tr>
            <td>实施单位</td>
            <td>许可种类</td>
            <td>许可金额</td>
            <td>合同履行情况</td>
          </tr>
          <tr v-for="item in selDeclarePatentImplList">
            <td>
              <el-form-item prop="unitName">
                <el-input v-model="item.unitName" type="textarea" placeholder="" @blur="updateData(item)" maxlength="20" />
              </el-form-item>
            </td>
            <td>
              <el-form-item prop="licenseType">
                <el-input v-model="item.licenseType" type="textarea" placeholder="" @blur="updateData(item)" maxlength="20" />
              </el-form-item>
            </td>
            <td>
              <el-form-item prop="licenseAmount">
                <a-input v-model="item.licenseAmount" placeholder="" @blur="updateData(item)" maxlength="8" />
              </el-form-item>
            </td>
            <td>
              <el-form-item prop="contractPerformance">
                <el-input v-model="item.contractPerformance" type="textarea" placeholder="" @blur="updateData(item)" maxlength="20" />
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { updateSelDeclarePatent } from "@/api/sel/selDeclarePatent";
import { listSelDeclarePatentImpl, getSelDeclarePatentImpl, delSelDeclarePatentImpl, addSelDeclarePatentImpl, updateSelDeclarePatentImpl, exportSelDeclarePatentImpl } from "@/api/sel/selDeclarePatentImpl";

export default {
  data() {
    return {
      // 表单参数
      form: {},
      // 专利实施情况表格数据
      selDeclarePatentImplList: [],
    };
  },
  props: {
    value: {
      default: {}
    },
  },
  created() {
    this.form = this.value;
  },
  methods: {
    /** 查询专利实施情况列表 */
    getList() {
      if (!this.form.id) return
      listSelDeclarePatentImpl({
        patentId: this.form.id
      }).then(response => {
        this.selDeclarePatentImplList = response.rows;
        if(this.selDeclarePatentImplList.length < 4) {
          this.updateData({ patentId: this.form.id });
        }
        if(this.selDeclarePatentImplList.length > 4) this.selDeclarePatentImplList.length = 4;
        this.$emit('change', this.selDeclarePatentImplList);
      });
    },
    /** 更新操作 */
    submitForm: function() {
      if (this.form.id != undefined) {
        updateSelDeclarePatent(this.form);
      }
    },
    /** 提交按钮 */
    updateData: function(item) {
      if (item.id != undefined) {
        updateSelDeclarePatentImpl(item);
      } else {
        addSelDeclarePatentImpl(item);
        this.getList();
      }
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
