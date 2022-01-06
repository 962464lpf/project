<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogOpen"
      width="600px"
      append-to-body
      :close-on-click-modal="false">
      <div style="text-align: center;">
        <el-form ref="fileForm" label-width="80px">
          <el-form-item label="附件">
            <upload v-if="dialogOpen" v-model="filePaths" :limit="limit"/>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" style="text-align: center;">
        <el-button style="width: 100px" type="primary" @click="submitForm">确 定</el-button>
        <el-button style="width: 100px" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addBuildInfo, listBuildFile} from "@/api/build/buildFile";

export default {
  name: 'uploadFileDialog',
  props: {
    value: {
      type: String,
      default: ''
    },
    id: {
      type: Number,
      default: null
    },
    type: {
      type: Number,
      default: null
    },
    title: {
      type: String,
      default: '附件'
    },
    open: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      dialogOpen: this.open,
      filePaths: '',
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        history: 0,
        infoId: null,
        fileType: null
      }
    }
  },
  methods: {
    //获取单个文件上传信息
    getSingleFile() {
      this.queryParams.infoId = this.id
      this.queryParams.fileType = this.type
      listBuildFile(this.queryParams).then(({rows}) => {
        this.filePaths = rows[0].filePath
      })
    },
    submitForm() {
      if (this.filePaths) {
        //上传，更新操作
        addBuildInfo({
          infoId: this.id,
          filePath: this.filePaths,
          fileType: this.type,
          history: 0
        }).then(() => {
          this.$emit('success', this.filePaths);
          this.msgSuccess('操作成功');
          this.cancel();
        })
      } else {
        this.msgError('请先选择文件')
      }
    },
    cancel() {
      this.filePaths = ''
      this.$emit('update:open', false);
      this.dialogOpen = false;
    }
  },
  watch: {
    value(newVal) {
      this.filePaths = newVal;
    },
    open(newVal) {
      this.dialogOpen = newVal;
    },
    dialogOpen(newVal) {
      this.$emit('update:open', newVal);
      if (this.limit > 1 && this.open === true) {
        this.getSingleFile()
      }
    }
  }
}
</script>

<style scoped>

</style>
