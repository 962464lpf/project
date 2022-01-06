<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogOpen"
      width="500px"
      append-to-body
      :close-on-click-modal="false">
      <div style="text-align: center;" ref="fileLoading">
        <el-form :model="form" ref="form" :rules="rules" label-width="80px">
          <el-form-item label="附件" prop="filePaths">
            <upload v-if="dialogOpen" v-model="form.filePaths" :edit="edit" :limit="1" :size="size"/>
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
  import { updateFile, viewFile } from "@/api/hb/hbProjectInfo";
  import { getHbProjectInfo } from "@/api/hb/hbProjectInfo";
  // import { Loading } from 'element-ui'

  export default {
    name: 'uploadDialog',
    props: {
      value: {
        type: String,
        default: ''
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
        default: '附件'
      },
      open: {
        type: Boolean,
        default: false
      },
      edit: {
        type: Boolean,
        default: true
      },
      size: {
        type: Number,
        default: 500
      }
    },
    data() {
      return {
        dialogOpen: this.open,
        form: {
          filePaths: ''
        },
        loading: null,
        // 表单校验
        rules: {
          filePaths: [
            {required: true, message: "附件不能为空", trigger: "blur"}
          ]
        }
      }
    },
    methods: {
      init() {
        if(!this.id) return;
        // if (this.loading) this.loading.close();
        // setTimeout(() => {
        //   this.loading = Loading.service({target: this.$refs.fileLoading});
        // }, 20)
        if(this.edit) {
          this.form.filePaths = '';
        } else {
          viewFile({
            id: this.id,
            fileType: this.type
          }).then(res => {
            // this.loading.close();
            this.form.filePaths = res.data.filePath;
          })
        }
      },
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            getHbProjectInfo(this.id).then(response => {
              if (response.data.fileStatus == 1) {
                this.msgInfo('该项目已归档，暂时无法操作');
                this.$emit('success');
                this.cancel();
              } else {
                //更新操作
                updateFile({
                  id: this.id,
                  filePath: this.form.filePaths,
                  fileType: this.type
                }).then(() => {
                  this.$emit('success', this.filePaths);
                  this.msgSuccess('操作成功');
                  this.cancel();
                })
              }
            })
          }
        })
      },
      // 表单重置
      reset() {
        this.form = {
          filePaths: undefined
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
      open(newVal) {
        setTimeout(() => {
          this.dialogOpen = newVal;
        }, 300)
        if(newVal) {
          this.init();
        }
      },
      dialogOpen(newVal) {
        this.$emit('update:open', newVal);
      }
    }
  }
</script>

<style scoped>

</style>
