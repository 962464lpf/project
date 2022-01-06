<template>
  <el-row>
    <el-col :span="20">
      <template v-for="(item, index) in selDeclareScienceUnitList">
        <div style="line-height: 30px;padding: 10px 0;">
          <span>第{{index+1}}页</span>
          <el-button
            v-if="index !== 0"
            style="float: right"
            type="danger"
            icon="el-icon-delete"

            @click="handleDelete(item)"
          >删除</el-button>
        </div>
        <table class="pdf-show-table tc" style="margin-bottom: 30px">
          <tr style="height: 0;">
            <td style="width: 15%;padding: 0;border: none;"></td>
            <td style="width: 13%;padding: 0;border: none;"></td>
            <td style="width: 20%;padding: 0;border: none;"></td>
            <td style="width: 15%;padding: 0;border: none;"></td>
            <td style="padding: 0;border-bottom: none;"></td>
          </tr>
          <tr>
            <td style="width: 200px;">
              第<a-input type="number" style="display: inline-block;width: 60px;margin: 0 6px;text-align: center;" v-model="item.unitNo" @blur="submitForm(item, index)" maxlength="3" />完成单位
            </td>
            <td>单位</td>
            <td colspan="4">
              <el-input v-model="item.unitName" type="text" placeholder="" @blur="submitForm(item, index)" maxlength="20"/>
            </td>
          </tr>
          <tr>
            <td>联系人</td>
            <td colspan="2"><el-input v-model="item.linkman" type="text" placeholder="" @blur="submitForm(item, index)" maxlength="20" /></td>
            <td>联系电话</td>
            <td><a-input v-model="item.linkPhone" type="phone" placeholder="" @blur="submitForm(item, index)" maxlength="20" /></td>
          </tr>
          <tr>
            <td>传真</td>
            <td colspan="2"><el-input v-model="item.fax" type="text" placeholder="" @blur="submitForm(item, index)" maxlength="20" /></td>
            <td>电子信箱</td>
            <td><a-input v-model="item.email" type="email" placeholder="" @blur="submitForm(item, index)" maxlength="50" /></td>
          </tr>
          <tr>
            <td>通讯地址及邮政编码</td>
            <td colspan="4"><el-input v-model="item.postalAddress" placeholder="" type="text" @blur="submitForm(item, index)" maxlength="50" /></td>
          </tr>
          <tr>
            <td>对本项目的创造性贡献</td>
            <td colspan="4"><el-input v-model="item.contributionDesc" placeholder="请输入对本项目的创造性贡献" type="textarea" rows="4" @blur="submitForm(item, index)"maxlength="400" show-word-limit/></td>
          </tr>
          <tr>
            <td>声明</td>
            <td colspan="5">
              <div style="text-align: left;text-indent: 2em;">
                本单位按照申报要求，如实提供了本申报书及相关材料，所提供材料不存在任何违反《中华人民共和国保守国家秘密法》和《科学技术保密规定》等相关法律法规及侵犯他人知识产权的情形，并对其真实性负责。如有不符，本人愿意承担相关后果。且确认上一栏目中所列本人对该项目的技术创造性贡献。
              </div>
              <div style="text-align: right;" class="hint-text">
                <div>完成单位（公章）：</div>
                <div>
                  <span>日期</span>
                  <el-form-item prop="regDate" style="display: inline-block;" class="gray-placeholder">
                    <el-date-picker clearable  style="width: 200px"
                                    v-model="item.regDate"
                                    type="date"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    @blur="submitForm(item, index)"
                                    placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </template>
      <div>
        <el-button
          type="primary"
          icon="el-icon-plus"

          @click="submitForm({scienceId: form.id})"
        >添加完成单位情况表</el-button>
      </div>
      <preview-pdf :id="form.infoId" :page="8" />
      <div>
        <upload accept=".pdf" :size="50" v-model="form.unitsFilePaths" @change="updateData" @remove="updateData" />
        <div class="el-upload__tip red-hint">仅支持PDF格式的文件，多页文件请合并为一份上传，分辨率为300dpi彩色，文件大小不超过50M</div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { listSelDeclareScienceUnit, delSelDeclareScienceUnit, addSelDeclareScienceUnit, updateSelDeclareScienceUnit } from "@/api/sel/selDeclareScienceUnit";
import { updateSelDeclareScience } from "@/api/sel/selDeclareScience";

export default {
  data() {
    return {
      // 表单参数
      form: {},
      // 主要完成单位情况表格数据
      selDeclareScienceUnitList: [],
      dateRange: [],
      idList: []
    };
  },
  props: {
    value: {
      default: {}
    }
  },
  created() {
    this.form = this.value;
    this.getList();
  },
  methods: {
    /** 查询主要完成单位情况列表 */
    getList() {
      if (!this.form.id) return
      listSelDeclareScienceUnit({
        scienceId: this.form.id
      }).then(response => {
        this.selDeclareScienceUnitList = response.rows;
        if(this.selDeclareScienceUnitList.length == 0) {
          this.submitForm({ scienceId: this.form.id })
        }
        // this.idList = [];
        // this.selDeclareScienceUnitList.map((item, index) => {
        //   this.idList.push('table-page6-'+(index+1));
        // })
        this.$emit('change', this.selDeclareScienceUnitList);
      });
    },
    /** 提交按钮 */
    submitForm: function(item) {
      if (item.id != undefined) {
        updateSelDeclareScienceUnit(item).then(response => {

        });
      } else {
        addSelDeclareScienceUnit(item).then(response => {
          this.getList();
        });
      }
    },
    /** 保存操作 */
    updateData() {
      updateSelDeclareScience(this.form);
      this.$emit('unitform', this.form)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delSelDeclareScienceUnit(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function() {});
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

<style scoped>
  .red, .red-hint {
    color: #EC808D;
  }

  .hint-text {
    font-size: 14px;
    line-height: 40px;
    color: #333333;
  }
</style>
