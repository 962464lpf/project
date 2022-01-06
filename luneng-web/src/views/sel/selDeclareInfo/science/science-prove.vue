<template>
  <div>
    <el-row>
      <el-col :span="24">
        <table class="pdf-show-table gray-placeholder">
          <tr style="text-align: center;">
            <td style="width: 170px;">知识产权类别</td>
            <td style="width: 200px;">知识产权具体名称</td>
            <td style="width: 120px;">国家(地区)</td>
            <td>授权号</td>
            <td>授权日期</td>
            <td>证书编号</td>
            <td style="width: 180px;">权利人</td>
            <td>发明人</td>
            <td style="width: 120px;">发明专利有效状态</td>
<!--            <td style="width: 80px;">-->
<!--              <el-button-->
<!--                type="primary"-->
<!--                icon="el-icon-plus"-->
<!--                -->
<!--                @click="submitForm({scienceId: form.id})"-->
<!--              >新增</el-button>-->
<!--            </td>-->
          </tr>
          <tr v-for="(item, index) in selDeclareScienceProveList">
            <td>
              <el-select v-model="item.rightType" clearable placeholder="请选择类别" style="width: 100%" @change="submitForm(item, index)">
                <el-option
                  v-for="dict in indicateSafetyTypes"
                  :key="dict.dictLabel"
                  :label="dict.dictLabel"
                  :value="dict.dictLabel"
                ></el-option>
              </el-select>
<!--              <el-input v-model="item.rightType" type="textarea" @blur="submitForm(item, index)" maxlength="20"/>-->
            </td>
            <td>
              <el-input v-model="item.rightName" type="textarea" @blur="submitForm(item, index)" maxlength="100"/>
            </td>
            <td>
              <el-input v-model="item.country" type="textarea" @blur="submitForm(item, index)" maxlength="20"/>
            </td>
            <td>
              <el-input v-model="item.authCode" type="textarea" @blur="submitForm(item, index)" maxlength="20"/>
            </td>
            <td class="gray-placeholder">
              <el-date-picker clearable  style="width: 146px;"
                v-model="item.authDate"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                @blur="submitForm(item, index)"
                placeholder="选择授权日期">
              </el-date-picker>
            </td>
            <td>
              <el-input v-model="item.certificateCode" type="textarea" @blur="submitForm(item, index)" maxlength="20"/>
            </td>
            <td>
              <el-input v-model="item.obligee" type="textarea" @blur="submitForm(item, index)" maxlength="50"/>
            </td>
            <td>
              <el-input v-model="item.inventor" type="textarea" @blur="submitForm(item, index)" maxlength="20"/>
            </td>
            <td>
              <el-input v-model="item.patentStatus" type="textarea" @blur="submitForm(item, index)" maxlength="20"/>
            </td>
<!--            <td>-->
<!--              <el-button-->
<!--                type="danger"-->
<!--                icon="el-icon-delete"-->
<!--                -->
<!--                @click="handleDelete(item)"-->
<!--              >删除</el-button>-->
<!--            </td>-->
          </tr>
        </table>
        <div class="hint-text">承诺：上述知识产权用于报奖的情况，已征得未列入项目主要完成人的权利人（发明专利指发明人）的同意。</div>
        <div style="text-align: right;" class="hint-text">
          <span class="red">* </span><span>第一完成人签名</span>
          <el-input type="text"  placeholder="请打印签名后上传证明文件" disabled style="display: inline-block;width: 200px;" />
        </div>
        <preview-pdf :id="form.infoId" :page="6" />
        <div>
          <upload accept=".pdf" v-model="form.signFilePaths" @change="updateData" @remove="updateData" />
          <div class="el-upload__tip red-hint">只能上传PDF格式的文件，分辨率为300dpi彩色，且文件不超过5M</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { listSelDeclareScienceProve, delSelDeclareScienceProve, addSelDeclareScienceProve, updateSelDeclareScienceProve } from "@/api/sel/selDeclareScienceProve";
import { updateSelDeclareScience } from "@/api/sel/selDeclareScience";

export default {
  data() {
    return {
      // 主要知识产权证明目录表格数据
      selDeclareScienceProveList: [],
      // 表单参数
      form: {},
      //知识产权类别
      indicateSafetyTypes: []
    };
  },
  props: {
    value: {
      default: {}
    }
  },
  created() {
    this.getList();
    this.getDicts("indicate_safety_type").then(response => {
      this.indicateSafetyTypes = response.data;
    });
  },
  methods: {
    /** 查询主要知识产权证明目录列表 */
    getList() {
      if (!this.form.id) return
      listSelDeclareScienceProve({
        scienceId: this.form.id
      }).then(response => {
        this.selDeclareScienceProveList = response.rows;
        if(this.selDeclareScienceProveList.length < 10) {
          this.submitForm({ scienceId: this.form.id });
        }
        if(this.selDeclareScienceProveList.length > 10) {
          this.selDeclareScienceProveList.length = 10;
        }
        this.$emit('change', this.selDeclareScienceProveList);
      });
    },

    /** 提交按钮 */
    submitForm: function(item) {
      if (item.id != undefined) {
        updateSelDeclareScienceProve(item).then(response => {

        });
      } else {
        if (this.selDeclareScienceProveList.length >= 10) {
          this.msgError('最多只能添加10条！')
          return
        }
        addSelDeclareScienceProve(item).then(response => {
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
          return delSelDeclareScienceProve(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 保存操作 */
    updateData() {
      updateSelDeclareScience(this.form);
      this.$emit('proveform', this.form)
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

<style scoped>
  .red, .red-hint {
    color: #EC808D;
  }

  .hint-text {
    font-size: 14px;
    line-height: 40px;
    color: #333333;
  }
  .pdf-show-table /deep/ .el-textarea__inner{padding: 5px;}
</style>
