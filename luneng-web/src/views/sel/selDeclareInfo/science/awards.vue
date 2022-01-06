<template>
  <el-row>
    <el-col :span="24">
      <table class="pdf-show-table">
        <tr>
          <td>获奖项目名称</td>
          <td style="width: 190px;">获奖时间</td>
          <td>奖项名称</td>
          <td>奖励等级</td>
          <td>授奖部门(单位)</td>
<!--          <td style="width: 80px;">-->
<!--            <el-button-->
<!--              type="primary"-->
<!--              icon="el-icon-plus"-->
<!--              -->
<!--              @click="submitForm({scienceId: form.id})"-->
<!--            >新增</el-button>-->
<!--          </td>-->
        </tr>
        <tr v-for="(item, index) in list">
          <td>
            <el-input v-model="item.awardProjectName" type="textarea" @blur="submitForm(item, index)" maxlength="20"/>
          </td>
          <td class="gray-placeholder">
            <el-date-picker clearable  style="width: 140px"
              v-model="item.awardDate"
              type="month"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="submitForm(item, index)"
              placeholder="选择获奖时间">
            </el-date-picker>
          </td>
          <td>
            <el-input v-model="item.awardName" type="textarea" @blur="submitForm(item, index)" maxlength="30"/>
          </td>
          <td>
            <el-input v-model="item.awardLevel" type="textarea" @blur="submitForm(item, index)" maxlength="20"/>
          </td>
          <td>
            <el-input v-model="item.awardUnit" type="textarea" @blur="submitForm(item, index)" maxlength="20"/>
          </td>
<!--          <td>-->
<!--            <el-button-->
<!--              type="danger"-->
<!--              icon="el-icon-delete"-->
<!--              -->
<!--              @click="handleDelete(item)"-->
<!--            >删除</el-button>-->
<!--          </td>-->
        </tr>
      </table>
    </el-col>
  </el-row>
</template>

<script>
import { listSelDeclareScienceHistory, delSelDeclareScienceHistory, addSelDeclareScienceHistory, updateSelDeclareScienceHistory } from "@/api/sel/selDeclareScienceHistory";

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 本项目曾获科技奖励情况表格数据
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
    /** 查询本项目曾获科技奖励情况列表 */
    getList() {
      if (!this.form.id) return
      listSelDeclareScienceHistory({
        scienceId: this.form.id,
      }).then(response => {
        this.list = response.rows;
        if(this.list.length < 10) {
          this.submitForm({ scienceId: this.form.id });
        }
        if(this.list.length > 10) {
          this.list.length = 10;
        }
        this.$emit('change', this.list);
      });
    },
    /** 提交按钮 */
    submitForm: function(item, index) {
      if (item.id != undefined) {
        updateSelDeclareScienceHistory(item).then(response => {

        });
      } else {
        if (this.list.length >= 10) {
          this.msgError('最多只能添加10条！')
          return
        }
        addSelDeclareScienceHistory(item).then(response => {
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
          return delSelDeclareScienceHistory(ids);
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
