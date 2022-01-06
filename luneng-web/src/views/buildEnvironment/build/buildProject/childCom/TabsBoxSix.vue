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
        min-width="130"
        label="合同文件技术部分"
        align="center"
        prop="contractScienceFile">
        <template slot-scope="scope">
          <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.contractScienceFile" @click="uploadBtnsClick(14, scope.row, $event, '合同文件技术部分')" />
        </template>
      </el-table-column>
      <el-table-column
        min-width="130"
        label="计划书"
        align="center"
        prop="projectPlanFile">
        <template slot-scope="scope">
          <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.projectPlanFile" @click="uploadBtnsClick(15, scope.row, $event, '计划书')" />
        </template>
      </el-table-column>
      <el-table-column
        min-width="130"
        label="设计文件"
        align="center"
        prop="designFile">
        <template slot-scope="scope">
          <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.designFile" @click="uploadBtnsClick(16, scope.row, $event, '设计文件')" />
        </template>
      </el-table-column>
      <el-table-column
        min-width="130"
        label="相关报告"
        align="center"
        prop="reportFile">
        <template slot-scope="scope">
          <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.reportFile" @click="uploadBtnsClick(17, scope.row, $event, '相关报告')" />
        </template>
      </el-table-column>
      <el-table-column
        min-width="130"
        label="申报资料电子版"
        align="center"
        prop="declareFile">
        <template slot-scope="scope">
          <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.declareFile" @click="uploadBtnsClick(18, scope.row, $event, '申报资料电子版')" />
        </template>
      </el-table-column>
      <el-table-column
        min-width="130"
        label="会议纪要"
        align="center"
        prop="meetingFile">
        <template slot-scope="scope">
          <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.meetingFile" @click="uploadBtnsClick(19, scope.row, $event, '会议纪要')" />
        </template>
      </el-table-column>
      <el-table-column
        width="130"
        label="认证标识扫描件"
        align="center"
        fixed="right"
        prop="documentsIdentifiedFile">
        <template slot-scope="scope">
          <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.documentsIdentifiedFile" @click="uploadBtnsClick(20, scope.row, $event, '认证标识扫描件')" />
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
  name: "TabsBoxSix",
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
