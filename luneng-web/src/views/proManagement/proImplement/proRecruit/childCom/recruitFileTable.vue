<template>
  <div class="recruit-file-table">
    <table class="pdf-show-table tc">
      <tr>
        <td style="width: 200px">招标文件</td>
        <td style="padding: 30px 10px 20px 10px">
          <div class="upload-box">
            <div class="upload-box-left">
              <div v-if="showFileUpload">
                <upload
                  :edit="false"
                  v-model="formObj.biddingFilePaths"/>
              </div>
              <div v-else v-hasPermi="['pro:proApprovalInfo:uploadTenderInfo']">
                <upload
                  @change="fileChange($event,'1')"
                  @remove="removeFile($event,'1')"
                  v-model="formObj.biddingFilePaths"/>
              </div>
            </div>
            <div class="upload-box-right">
              <el-button
                type="primary"

                @click="getHistoryV(1)">历史版本
              </el-button>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>招标审批表</td>
        <td style="padding: 30px 10px 20px 10px">
          <div class="upload-box">
            <div class="upload-box-left">
              <div v-if="showFileUpload">
                <upload
                  :edit="false"
                  v-model="formObj.auditFilePaths"/>
              </div>
              <div v-else v-hasPermi="['pro:proApprovalInfo:uploadTenderInfo']">
                <upload
                  @change="fileChange($event,'2')"
                  @remove="removeFile($event,'2')"
                  v-model="formObj.auditFilePaths"/>
              </div>
            </div>
            <div class="upload-box-right">
              <el-button
                type="primary"

                @click="getHistoryV(2)">历史版本
              </el-button>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>中标通知书</td>
        <td style="padding: 30px 10px 20px 10px">
          <div class="upload-box">
            <div class="upload-box-left">
              <div v-if="showFileUpload">
                <upload
                  :edit="false"
                  v-model="formObj.winningFilePaths"/>
              </div>
              <div v-else v-hasPermi="['pro:proApprovalInfo:uploadTenderInfo']">
                <upload
                  @change="fileChange($event,'3')"
                  @remove="removeFile($event,'3')"
                  v-model="formObj.winningFilePaths"/>
              </div>
            </div>
            <div class="upload-box-right">
              <el-button
                type="primary"

                @click="getHistoryV(3)">历史版本
              </el-button>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>中标单位投标文件</td>
        <td style="padding: 30px 10px 20px 10px">
          <div class="upload-box">
            <div class="upload-box-left">
              <div v-if="showFileUpload">
                <upload
                  :edit="false"
                  v-model="formObj.tenderFilePaths"/>
              </div>
              <div v-else v-hasPermi="['pro:proApprovalInfo:uploadTenderInfo']">
                <upload
                  @change="fileChange($event,'4')"
                  @remove="removeFile($event,'4')"
                  v-model="formObj.tenderFilePaths"/>
              </div>
            </div>
            <div class="upload-box-right">
              <el-button
                type="primary"

                @click="getHistoryV(4)">历史版本
              </el-button>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td>定标会材料</td>
        <td style="padding: 30px 10px 20px 10px">
          <div class="upload-box">
            <div class="upload-box-left">
              <div v-if="showFileUpload">
                <upload
                  :edit="false"
                  v-model="formObj.calibrationFilePaths"/>
              </div>
              <div v-else v-hasPermi="['pro:proApprovalInfo:uploadTenderInfo']">
                <upload
                  @change="fileChange($event,'5')"
                  @remove="removeFile($event,'5')"
                  v-model="formObj.calibrationFilePaths" :limit="100"/>
              </div>
            </div>
            <div class="upload-box-right" v-hasPermi="['pro:proBiddingFilesHis:list']">
              <el-button
                type="primary"

                @click="getHistoryV(5)">历史版本
              </el-button>
            </div>
          </div>
        </td>
      </tr>
    </table>
    <recruit-file-history :curIndex="curIndex" :dialog-option="dialogOption" :infoId="formObj.id"/>
  </div>
</template>

<script>
import {uploadTenderInfo} from "@/api/pro/proRecruit";
import recruitFileHistory from "./recruitFileHistory"
import {saveProOptLog,deleteZcFile,removeZbhFile} from "@/api/pro/proApprovalInfo";

export default {
  name: "recruitFileTable",
  props: {
    form: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      curIndex: null,
      dialogOption: {
        title: '历史版本',
        open: false
      }
    }
  },
  computed: {
    formObj() {
      return this.form
    },
    userName() {
      return this.$store.state.user.name
    },
    showFileUpload() {
      if (this.form.proStatus != 8) {
        return !((this.form.setupStatus === 0 && this.form.proStatus == 3 && this.form.planStatus == 3) || (this.form.setupStatus !== 0 && this.form.planStatus == 3));
      } else {
        return true
      }
    }
  },
  components: {
    recruitFileHistory
  },
  methods: {
    fileChange(files,fileType) {
        let operName = '';
        if(fileType=='1'){
            operName = '上传了招标文件'
        }else if(fileType=='2'){
            operName = '上传了招标审批表'
        }else if(fileType=='3'){
            operName = '上传了中标通知书'
        }else if(fileType=='4'){
            operName = '上传了中标单位投标文件'
        }else if(fileType=='5'){
            operName = '上传了定标会材料'
        }
      if (files && files.length > 0) {
        uploadTenderInfo({
          id: this.formObj.id,
          filePaths: JSON.stringify(files),
          fileType: fileType
        }).then(()=>{
          this.$emit('refreshbs')
          saveProOptLog({
            infoId: this.formObj.id,
            operName: operName,
            operUserName: this.userName,
            operType: 3
          }).then(() => {})
        })
      }
    },
    removeFile(file,fileType){
      let sendData = {};
      let filePath = '';
      if(fileType=='1'){
          filePath = this.formObj.biddingFilePaths
      }else if(fileType=='2'){
          filePath = this.formObj.auditFilePaths
      }else if(fileType=='3'){
          filePath = this.formObj.winningFilePaths
      }else if(fileType=='4'){
          filePath = this.formObj.tenderFilePaths
      }else if(fileType=='5'){
          filePath = this.formObj.calibrationFilePaths
      }
      sendData.infoId = this.formObj.id;
      sendData.fileType = fileType;
      sendData.removedFilePath = JSON.stringify([file]);
      sendData.filePath = filePath;
      deleteZcFile(sendData);
    },
    getHistoryV(index) {
      this.curIndex = index
      this.dialogOption.open = true
    }
  }
}
</script>

<style lang="scss" scoped>
.pdf-show-table {
  table-layout: fixed;
  font-size: 18px;
  color: #000;
  margin: 0;
  tr td:nth-child(2n+1) {
    text-align: center;
    color: #666;
    background-color: #f8f8f9;
  }
}
.upload-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .upload-box-left {
    width: 85%;
    display: flex;
    flex-wrap: wrap;
  }
  .upload-box-right {
    width: 15%;
  }
}
</style>
