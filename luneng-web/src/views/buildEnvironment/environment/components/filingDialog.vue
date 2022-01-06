<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogOpen"
      width="500px"
      append-to-body
      :close-on-click-modal="false">
      <div style="padding-right: 30px;">
        <el-form :model="form" ref="form" :rules="rules" label-width="80px">
          <el-form-item label="备案号" prop="baCode">
            <el-input v-if="edit" v-model="form.baCode" type="text" placeholder="请输入备案号" maxlength="30" />
            <template v-else>
              <span v-if="form.baCode">{{form.baCode}}</span>
              <span class="no-data" v-else>暂无备案号</span>
            </template>
          </el-form-item>
          <el-form-item label="备案时间" prop="baDate">
            <el-date-picker
              v-if="edit"
              clearable
              style="width: 200px"
              v-model="form.baDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择备案时间">
            </el-date-picker>
            <template v-else>
              <span v-if="form.baDate">{{form.baDate}}</span>
              <span class="no-data" v-else>暂无备案时间</span>
            </template>
          </el-form-item>
          <el-form-item label="上传备案" prop="baFilePaths">
            <upload v-if="dialogOpen" v-model="form.baFilePaths" :edit="edit" accept=".gif, .jpg, .jpeg, .png, .pdf" />
          </el-form-item>
        </el-form>
      </div>
      <div v-if="edit" slot="footer" style="text-align: center;">
        <el-button style="width: 100px" type="primary" @click="submitForm">确 定</el-button>
        <el-button style="width: 100px" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { updateHbProjectInfo } from "@/api/hb/hbProjectInfo";

  export default {
    name: 'filingDialog',
    props: {
      value: {
        type: Object,
        default: {}
      },
      id: {
        default: ''
      },
      type: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: '备案信息'
      },
      open: {
        type: Boolean,
        default: false
      },
      edit: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        dialogOpen: this.open,
        form: {},
        loading: null,
        // 表单校验
        rules: {
          baCode: [
            {required: true, message: "备案号不能为空", trigger: "blur", pattern: '[^ \x22]+'}
          ],
          baDate: [
            {required: true, message: "备案时间不能为空", trigger: "blur"}
          ],
          baFilePaths: [
            {required: true, message: "备案附件不能为空", trigger: "blur"}
          ]
        }
      }
    },
    created() {
      this.form = this.value;
    },
    methods: {
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateHbProjectInfo(this.form).then(response => {
                if (response.code === 200) {
                  this.$emit('success');
                  this.msgSuccess("备案成功");
                  this.cancel();
                }
              });
            }
          }
        })
      },
      // 表单重置
      reset() {
        this.form = {
          baCode: undefined,
          baDate: undefined,
          baFilePaths: undefined
        };
        this.resetForm("form");
      },
      cancel() {
        this.$emit('update:open', false);
        this.dialogOpen = false;
        this.reset();
      }
    },
    watch: {
      value(newVal) {
        this.form = newVal;
      },
      open(newVal) {
        setTimeout(() => {
          this.dialogOpen = newVal;
        }, 300)
      },
      dialogOpen(newVal) {
        this.$emit('update:open', newVal);
      }
    }
  }
</script>

<style scoped>
  .no-data {
    color: #999999;
    font-size: 14px;
  }
</style>
