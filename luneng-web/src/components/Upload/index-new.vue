<template>
  <div class="upload">
    <div v-if="list.length == 0 && !edit" class="no-data">{{hint}}</div>
    <el-upload
      v-show="edit && fileList.length < limit"
      ref="upload"
      :headers="headers"
      :accept="accept"
      :action="uploadImgUrl"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-progress="handleProgress"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      multiple
      :limit="4"
      :on-exceed="handleExceed"
      :file-list="fileList"
      :show-file-list="false">
      <el-button ref="uploadBtn" type="primary"><i class="el-icon-upload2"></i> 上传附件</el-button>
    </el-upload>

    <ul class="upload-list">
      <li v-for="(item, index) in fileList" :key="index" class="upload-list-item">
        <div class="upload-list-name">{{item.name}}</div>
        <el-progress
          v-if="item.showProgress"
          type="line"
          :show-text="true"
          :percentage="handlePercentage(item.percentage)"
          :color="progressColor"
          :width="100"/>
        <div class="upload-list-btns">
          <el-button
            v-if="item.showDownloadBtn"
            type="text"
            class="upload-list-btn"
            @click="handleDownload(item)"
          >下载</el-button>
          <el-button
            v-if="item.showPreviewBtn"
            type="text"
            class="upload-list-btn"
            @click="handlePreview(item)"
          >预览</el-button>
          <el-button
            v-if="edit"
            type="text"
            class="upload-list-btn"
            @click="handleRemove(item, index)"
          >{{item.showProgress ? '取消' : '删除'}}</el-button>
        </div>
      </li>
    </ul>

    <el-dialog :visible.sync="dialogVisible" append-to-body :close-on-click-modal="false">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog title="附件预览" :visible.sync="dialogVisiblePdf" append-to-body :close-on-click-modal="false">
      <iframe :src="dialogPdfUrl" frameborder="0" style="width: 100%;height: calc(100vh - 200px);"></iframe>
    </el-dialog>
    <el-dialog title="附件预览" :visible.sync="dialogVisibleWord" append-to-body :close-on-click-modal="false">
      <iframe ref="wordPreview" frameborder="0" style="width: 100%;height: calc(100vh - 200px);"></iframe>
    </el-dialog>
  </div>
</template>

<script>
  import { getToken } from '@/utils/auth';
  import { downloadFile } from '@/api/download';
  import { wordToHtml } from '@/api/common/utils';
  export default {
    data() {
      return {
        uploadImgUrl: process.env.VUE_APP_BASE_API + "/common/upload",
        list: [],
        fileList: [],
        headers: {
          'Authorization': 'Bearer ' + getToken()
        },
        dialogImageUrl: '',
        dialogPdfUrl: '',
        dialogVisible: false,
        dialogVisiblePdf: false,
        dialogVisibleWord: false,
        baseApi: process.env.VUE_APP_BASE_API,
        progressColor: '',
        progressList: []
      };
    },
    props: {
      value: {
        default: ''
      },
      limit: {
        default: 1
      },
      edit: {
        default: true
      },
      accept: {
        default: '.bmp, .gif, .jpg, .jpeg, .png, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .html, .htm, .txt, .rar, .zip, .gz, .bz2, .pdf'
      },
      size: {
        type: Number,
        default: 500
      },
      name: {
        default: '暂无附件'
      },
      hint: {
        default: '暂无附件'
      }
    },
    created() {
      if (!this.value) {
        this.fileList = []
      } else {
        this.fileList = JSON.parse(this.value);
      }
    },
    methods: {
      handleExceed(files, fileList) {
        this.$message.warning(`最多上传 ${ this.limit } 个文件`);
      },
      handleSuccess(response, file, fileList) {
        file.showProgress = false;
        file.showDownloadBtn = true;
        file.fileName = file.response.fileName;
        file.url = file.response.url;
        file.type = file.raw.type;
        if (this.name) {
          this.fileList = this.formatName();

        } else {
          this.fileList = fileList;
        }
        this.$emit('input', JSON.stringify(this.fileList));
        this.$emit('change', this.fileList);
      },
      beforeUpload(file) {
        let el = this.$refs.uploadBtn.$el;
        if (el) el.blur();
        let acceptList = this.accept.split(',');
        if (acceptList.length > 0) {
          let flag = false;
          acceptList.map(item => {
            item = item.replace(/\s+/g, "");
            if(file.name.indexOf(item) !== -1) flag = true;
          })
          if (!flag) {
            this.$message.warning('上传文件格式不支持！');
            return false
          }
        }
        if (this.size) {
          const size = parseFloat(this.size) * 1024 * 1024;
          if (file.size > size) {
            this.$message.warning('上传文件不能超过' + this.size + 'MB');
            return false
          }
        }
        file.showDownloadBtn = false;
      },
      handleRemove(file, index) {
        this.$confirm(`确定${file.showProgress ? '取消' : '删除'} ${ file.name }？`).then(() => {
          this.$refs.upload.abort(file);
          this.fileList.splice(index, 1);
          if (this.fileList.length === 0) {
            this.$emit('input', '');
            this.$emit('remove', file);
          } else {
            this.$emit('input', JSON.stringify(this.fileList));
            this.$emit('remove', file);
          }
        })
      },
      handleProgress(event, file, fileList) {
        if (file.percentage && file.percentage < 100) {
          file.showProgress = true;
        } else {
          file.showProgress = false;
        }
        this.fileList = fileList;
      },
      handlePreview(file) {
        const arr = file.name.split('.');
        const type = arr[arr.length-1];
        if (file.type.indexOf('image') !== -1) {
          this.handlePicturePreview(file);
        }
        if (type.indexOf('pdf') !== -1) {
          this.handlePdfPreview(file);
        }
        if (type.indexOf('doc') !== -1) {
          this.handleWordPreview(file);
        }
      },
      handlePicturePreview(item) {
        this.dialogImageUrl = item.fileName;
        this.dialogVisible = true;
      },
      handlePdfPreview(item) {
        this.dialogPdfUrl = item.fileName;
        this.dialogVisiblePdf = true;
      },
      handleWordPreview(item) {
        this.dialogVisibleWord = true;
        wordToHtml({
          filePath: JSON.stringify([item])
        }).then(res => {
          const iframe = this.$refs.wordPreview.contentWindow.document;
          const html = iframe.getElementsByTagName('html')[0];
          html.style.overflowX = 'hidden';
          html.innerHTML = res;
        })
      },
      handleDownload(item) {
        let fileName = '';
        let name = encodeURIComponent(item.name);
        if (item.response && item.response.fileName) {
          fileName = item.response.fileName.replace('/dev-api/', '/');
        }
        const downloadHref = `${this.baseApi}/common/download/resource?name=${name}&fileName=${fileName}`;
        location.href = downloadHref;
      },
      getDownloadHref(item) {
        let fileName = '';
        let name = encodeURIComponent(item.name);
        if (item.response && item.response.fileName) {
          fileName = item.response.fileName.replace('/dev-api/', '/');
        }
        const downloadHref = `${this.baseApi}/common/download/resource?name=${name}&fileName=${fileName}`;
        return downloadHref;
      },
      handlePercentage(percentage) {
        return Math.floor(percentage);
      },
      formatName(file) {
        let arr = file.name.split('.');
        let type = arr[arr.length-1];
        if (this.name && type) {
          file.name = this.name + '.' + type;
          this.fileList = fileList;
          if (this.fileList.length > 1) {
            this.fileList.map((item, index) => {
              let arr = item.name.split('.' + type);
              let num = index+1;
              item.name = arr[0] + num + '.' + type;
            })
          }
        } else {
          this.fileList = fileList;
        }
      }
    },
    deactivated() {
      this.$refs.upload.clearFiles();
    },
    watch:{
      value (newVal) {
        if (!newVal) {
          this.fileList = []
        } else {
          this.fileList = JSON.parse(newVal);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .upload {
    text-align: left;
    line-height: 0;
  }
  .upload-list {
    display: inline-block;
    min-width: 120px;
    margin: 0;
    padding: 0;
    list-style: none;
    .upload-list-item {
      padding-top: 8px;
      text-align: left;
    }
    .upload-list-name {
      text-align: left;
      line-height: 20px;
      display: block;
    }
    .upload-list-btns {
      line-height: 20px;
    }
    .upload-list-btn {
      padding: 0;

    }
  }
  .no-data {
    color: #999999;
    font-size: 14px;
  }
</style>
