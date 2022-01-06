<template>
  <div>
    <el-table
      ref="table"
      :data="greenBuildProList">
      <el-table-column
        min-width="120"
        label="绿建星级"
        align="center"
        :formatter="levelFormat"
        prop="level"
        />
      <el-table-column
        min-width="180"
        label="获证时间"
        align="center"
        prop="authenticationDate">
        <template slot-scope="scope">
          <div @dblclick="getAuthenticationDate(scope.row)">
            <div v-if="scope.row.showAuthenticationDate && scope.row.authenticationDate">
              {{scope.row.authenticationDate}}
            </div>
            <div v-else>
              <el-date-picker
                v-hasPermi="['build:buildInfo:updateTime']"
                v-model="scope.row.authenticationDate"
                style="width: 140px"
                type="date"
                value-format="yyyy-MM-dd"
                @change="updateDate(scope.row)"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="300"
        label="星级认证证书"
        align="center"
        fixed="right"
        prop="attestationFile">
        <template slot-scope="scope">
          <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.attestationFile" @click="uploadBtnsClick(13, scope.row, $event, '星级认证证书')" />
        </template>
      </el-table-column>
    </el-table>
    <upload-file-dialog
      :id="currProId"
      :type="uploadFileType"
      :title="title"
      :open.sync="open"
      @success="getList"/>
  </div>
</template>

<script>
import uploadBtns from '../../../components/uploadBtns';
import uploadFileDialog from '../../components/uploadFileDialog'
import {deleteAdviseInfo, getBuildInfo, updateBuildInfo} from "@/api/build/buildInfo";
export default {
  name: "TabsBoxFive",
  props: {
    buildProForm: {
      type: Object,
      default() {
        return {}
      }
    },
    levelOptions :{
      type: Array,
      default() {
        return []
      }
    },
    proDetailFlag: {
      type: String,
      default: ''
    },
    tabActiveName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      greenBuildProList: [],
      currProId: null,
      uploadFileType: null,
      title: '',
      open: false
    }
  },
  created() {
    this.greenBuildProList = []
    this.greenBuildProList.push(this.buildProForm)
  },
  watch :{
    buildProForm(newValue) {
      this.greenBuildProList = []
      this.greenBuildProList.push(newValue)
    }
  },
  components: {
    uploadBtns,
    uploadFileDialog
  },
  methods: {
    // 绿建审核字典翻译
    approvalStatusFormat(row) {
      return this.selectDictLabel(this.approvalStatusOptions, row.approvalStatus);
    },
    // 绿建星级字典翻译
    levelFormat(row) {
      return this.selectDictLabel(this.levelOptions, row.level);
    },
    //获取证书时间
    getAuthenticationDate(row) {
      getBuildInfo(row.id).then(({data}) => {
        if (data.finish === 0) {
          if (data.approvalStatus === 4) {
            row.showAuthenticationDate = false
          } else {
            this.msgError('当前项目正在审核中或审核未通过，不可操作')
          }
        } else {
          this.msgError('当前项目已归档，不可操作')
        }
      })
    },
    updateDate(row) {
      if (row.finish === 0) {
        if (row.approvalStatus === 4) {
          updateBuildInfo(row).then(() => {
            this.getList()
          })
        } else {
          row.authenticationDate = ''
          this.msgError('当前项目正在审核中或审核未通过，不可操作')
        }
      } else {
        this.msgError('当前项目已归档，不可操作')
      }
    },
    //上传更新按钮
    uploadBtnsClick(fileType, row, event, title) {
      if (event === "view") {
        const id = row.id
        const path = '/buildEnvironment/build/buildProject/fileDetail'
        this.$router.push({
          'path': path,
          'query': {
            id,
            fileType,
            proDetailFlag: this.proDetailFlag,
            tabActiveName: this.tabActiveName
          }
        })
      } else {
        getBuildInfo(row.id).then(({data}) => {
          if (data.finish === 0) {
            if (data.approvalStatus === 4) {
              this.currProId = row.id
              this.uploadFileType = fileType
              if (title) this.title = title
              this.open = true
            } else {
              this.msgError('当前项目正在审核中或审核未通过，不可操作')
            }
          } else {
            this.msgError('当前项目已归档，不可操作')
          }
        })
      }
    },
    //上传成功刷新
    getList() {
      this.$emit('refresh-list')
    }
  }
}
</script>
