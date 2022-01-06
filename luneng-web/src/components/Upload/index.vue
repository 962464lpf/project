<template>
  <div class="file">
    <div v-if="list.length == 0 && !edit" class="no-data">{{hint}}</div>
    <div v-for="(item, index) in list" class="file-item">
      <div>
        <div class="file-item-image">
          <img v-if="item.type && item.type.indexOf('image') !== -1" :src="item.fileName" :alt="item.name">
          <svg-icon v-else :icon-class="getFileIconClass(item.name)" class="file-item-icon" />
          <div class="file-item-image_operation">
            <i class="el-icon-zoom-in" v-if="item.type && item.type.indexOf('image') !== -1" @click="handlePictureCardPreview(item.fileName)"></i>
            <i class="el-icon-zoom-in" v-if="item.type && item.type.indexOf('pdf') !== -1" @click="handlePdfPreview(item.fileName)"></i>
            <i class="el-icon-zoom-in" v-if="item.url && item.url.indexOf('doc') !== -1" @click="handleWordPreview(item)"></i>
            <a :href="getDownloadHref(item)" class="el-icon-download"></a>
            <i v-if="edit" class="el-icon-delete" @click="handleRemove(item, index)"></i>
          </div>
        </div>
        <el-progress v-if="item.percentage && item.percentage != 100" type="line" :show-text="false" :percentage="handlePercentage(item.percentage)" :color="progressColor" :width="100"/>
        <el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
          <div class="file-item-name">{{ item.name }}</div>
        </el-tooltip>
      </div>
      <div v-if="checkShowAudio(item)" class="file-item-audio">
        <aplayer :music="getMusic(item)" :narrow="false" :mutex="true" theme="#b7daff" mode="circulation" ref="player"></aplayer>
      </div>
    </div>
    <el-upload
      v-if="edit && list.length < limit"
      ref="upload"
      class="upload-demo"
      :headers="headers"
      :accept="accept"
      :action="uploadImgUrl"
      :on-success="handleSuccess"
      :on-error="handleError"
      multiple
      :limit="limit"
      :file-list="list"
      :show-file-list="false"
      :on-progress="handleProgress"
      :before-upload="handlebeforeUpload">
      <el-button type="primary" ref="uploadBtn"><i class="el-icon-upload2"></i> 上传附件</el-button>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" append-to-body :close-on-click-modal="false">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog title="附件预览" :visible.sync="dialogVisiblePdf" append-to-body :close-on-click-modal="false">
      <iframe :src="dialogPdfUrl" frameborder="0" style="width: 100%;height: calc(100vh - 200px);"></iframe>
    </el-dialog>
    <el-dialog title="附件预览" :visible.sync="dialogVisibleWord" class="dialogWord" append-to-body :close-on-click-modal="false">
      <div style="padding-bottom: 15px;text-align: right;padding-right: 30px;">
        <a :href="getDownloadHref(dialogWordForm)"><el-button type="primary">下载</el-button></a>
        <el-button type="primary" style="margin-left: 6px;" @click="handlePrint">打印</el-button>
      </div>
      <iframe ref="wordPreview" frameborder="0" style="width: 100%;height: calc(100vh - 200px);"></iframe>
    </el-dialog>
  </div>
</template>

<script>
  import { getToken } from '@/utils/auth';
  import { downloadFile } from '@/api/download';
  import { wordToHtml } from '@/api/common/utils';
  import Aplayer from 'vue-aplayer';
  export default {
    components: {
      Aplayer
    },
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
        dialogWordForm: {},
        baseApi: process.env.VUE_APP_BASE_API,
        progressColor: '',
        progressList: [],
        fileList: [],
        songList: {
          title: '教案设计问请问为去问去饿请问去饿请问去饿请问我去饿请问请问',
          artist: ' ',
          url: 'http://127.0.0.1:8080/profile/upload/2020/12/18/654f00c2f554b585eb516e07c275b48e.mp3'
        },
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
        default: '.bmp, .gif, .jpg, .jpeg, .png, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .html, .htm, .txt, .rar, .zip, .gz, .bz2, .pdf, .mp3, .wav, .wma, .m4a'
      },
      size: {
        type: Number,
        default: 500
      },
      name: {
        default: ''
      },
      hint: {
        default: '暂无附件'
      }
    },
    created() {
      if (!this.value) {
        this.list = []
      } else {
        this.list = JSON.parse(this.value);
      }
    },
    methods: {
      getMusic(item) {
        return {title: item.name, url: item.url, artist: ' '};
      },
      checkShowAudio(item) {
        if (!item.url) return;
        let arr = item.name.split('.');
        let type = arr[arr.length-1];
        const audioTypes = ['mp3', 'wav', 'wma', 'm4a'];
        let flag = false;
        audioTypes.map(audioType => {
          if (type == audioType) flag = true;
        })
        return flag;
      },
      handlebeforeUpload(file) {
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
          let size = parseFloat(this.size) * 1024 * 1024;
          if (file.size > size) {
            this.$message.warning('上传文件不能超过' + this.size + 'MB');
            return false
          }
        }
        if (this.list.length >= this.limit) {
          this.$message.warning(`最多只能上传 ${this.limit} 个文件`);
          return false
        }
      },
      handleProgress(event, file, fileList) {
        this.list = fileList;
      },
      handleSuccess(response, file, fileList) {
        if (fileList.length > this.limit) {
          this.$message.warning(`最多只能上传 ${this.limit} 个文件`);
          return false
        }
        if (response.code == 200) {
          file.fileName = file.response.fileName;
          file.url = file.response.url;
          file.type = file.raw.type;
          let arr = file.name.split('.');
          let type = arr[arr.length-1];
          if (this.name && type) {
            file.name = this.name + '.' + type;
            this.list = fileList;
            if (this.list.length > 1) {
              this.list.map((item, index) => {
                let arr = item.name.split('.pdf');
                let num = index+1;
                item.name = arr[0] + num + '.pdf';
              })
            }
          } else {
            this.list = fileList;
          }
        } else {
          this.msgError('上传失败');
          file.isError = true;
          let list = fileList;
          fileList.map((item, index) => {
            if (item.isError) {
              list.splice(index, 1)
            }
          })
          this.list = list;
        }
        console.log(fileList)
        this.$emit('input', JSON.stringify(this.list));
        this.$emit('change', this.list);
      },
      handleError(err, file, fileList) {
        console.log(err, file, fileList)
      },
      handleRemove(item, index) {
        this.$confirm(`确定移除 ${ item.name }？`).then(() => {
          this.list.splice(index, 1);
          if (this.list.length === 0) {
            this.$emit('input', '');
            this.$emit('remove', item);
          } else {
            this.$emit('input', JSON.stringify(this.list));
            this.$emit('remove', item);
          }
        })
      },
      handlePictureCardPreview(fileName) {
        this.dialogImageUrl = fileName;
        this.dialogVisible = true;
      },
      handlePdfPreview(fileName) {
        if (fileName.indexOf("http") !== -1) {
          this.dialogPdfUrl = fileName;
        } else {
          this.dialogPdfUrl = fileName;
        }
        this.dialogVisiblePdf = true;
      },
      handleWordPreview(item) {
        this.dialogVisibleWord = true;
        this.dialogWordForm = item;
        wordToHtml({
          filePath: JSON.stringify([item])
        }).then(res => {
          const iframe = this.$refs.wordPreview.contentWindow.document;
          const html = iframe.getElementsByTagName('html')[0];
          html.style.overflowX = 'hidden';
          html.innerHTML = res;
        })
      },
      getFileIconClass(name) {
        let fileIcons = ['gif', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'html', 'htm', 'txt', 'zip', 'rar', 'pdf', 'mp3', 'wav'];
        let arr = name.split('.');
        let fileType =  arr[arr.length -1];
        fileType = fileType.toLowerCase();
        if (fileType == 'docx') fileType = 'doc';
        if (fileType == 'xlsx') fileType = 'xls';
        if (fileType == 'pptx') fileType = 'ppt';
        if (fileType == 'jpeg') fileType = 'jpg';
        if (fileType == 'rar') fileType = 'zip';
        if (fileIcons.indexOf(fileType) !== -1) {
          fileType =  'file-' + fileType;
          return fileType
        } else {
          return 'file-unknown'
        }
      },
      getDownloadHref(item) {
        let fileName = '';
        let name = encodeURIComponent(item.name);
        if (item.response && item.response.fileName) {
          fileName = item.response.fileName.replace('/dev-api/', '/');
        }
        if (item.fileName) {
          fileName = item.fileName.replace('/dev-api/', '/');
        }
        const downloadHref = `${this.baseApi}/common/download/resource?name=${name}&fileName=${fileName}`;
        return downloadHref;
      },
      handlePercentage(percentage) {
        return Math.floor(percentage);
      },
      handlePrint() {
        const iframeWindow = this.$refs.wordPreview.contentWindow;
        iframeWindow.print();
      }
    },
    watch:{
      value (newVal, oldVal) {
        // this.$refs.upload.clearFiles();
        if (!newVal) {
          this.list = []
        } else {
          this.list = JSON.parse(newVal);
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  $width : 120px;
  $height : 120px;

  /deep/ .el-icon-upload2 {
    font-size: 14px;
  }
  .upload-demo {
    display: inline-block;
  }
  .file {
    text-align: left;
    font-size: 16px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .file-item {
      display: flex;
      align-items: center;
      vertical-align: top;
      text-align: center;
      margin-right: 10px;
      padding: 6px 0;
      cursor: pointer;
      position: relative;
      &:hover .file-item-remove {
        opacity: 1;
      }

      .file-item-remove {
        position: absolute;
        right: 6px;
        top: -6px;
        font-size: 20px;
        opacity: 0;
        transition: .4s;
      }
      .file-item-remove:hover {
        opacity: 0.8;
      }
      .file-item-name {
        width: $width;
        line-height: 16px;
      }
      .file-item-image {
        height: $height;
        overflow: hidden;
        text-align: center;
        margin-bottom: 6px;
        position: relative;
        &:hover .file-item-image_operation {
          opacity: 1;
        }
        img {
          width: $width;
          display: inline-block;
        }
        .file-item-icon {
          width: $width;
          height: $height;
          margin-bottom: 6px;
        }
        .file-item-image_operation {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          color: #fff;
          font-size: 24px;
          opacity: 0;
          line-height: $height;
          border-radius: 6px;
          background-color: rgba(0,0,0,.5);
          transition: .4s;
          i, a {
            margin: 0 4px;
          }
        }
      }
      .file-item-audio {
        margin-left: 10px;
        min-width: 320px;
        max-width: 350px;
      }
      .file-operation {
        color: #2695FF;
        line-height: 24px;
      }
    }
    /*.file-item + .upload-demo {margin-top: 50px;}*/
  }
  .no-data {
    color: #999999;
    font-size: 14px;
  }

  .dialogWord  {
    /deep/ .el-dialog__body {
      padding-top: 0;
    }
  }
</style>
