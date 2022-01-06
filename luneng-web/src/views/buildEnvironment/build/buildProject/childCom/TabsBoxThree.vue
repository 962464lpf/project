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
        min-width="140"
        label="绿建得分卡"
        align="center"
        prop="scoreFile">
        <template slot-scope="scope">
          <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.scoreFile" @click="uploadBtnsClick(4, scope.row, $event, '绿建得分卡')" />
        </template>
      </el-table-column>
      <el-table-column
        min-width="140"
        label="绿建评价任务书"
        align="center"
        prop="taskFile">
        <template slot-scope="scope">
          <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.taskFile" @click="uploadBtnsClick(5, scope.row, $event, '绿建评价任务书')" />
        </template>
      </el-table-column>
      <el-table-column
        min-width="140"
        label="绿建审核报告"
        align="center"
        prop="approvalFile">
        <template slot-scope="scope">
          <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.approvalFile" @click="uploadBtnsClick(6, scope.row, $event, '绿建审核报告')" />
        </template>
      </el-table-column>
      <el-table-column
        min-width="140"
        label="绿建设计预评估意见书"
        align="center"
        prop="optionFile">
        <template slot-scope="scope">
          <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.optionFile" @click="uploadBtnsClick(7, scope.row, $event, '绿建设计预评估意见书')" />
        </template>
      </el-table-column>
      <el-table-column
        width="140"
        label="其他资料"
        align="center"
        fixed="right"
        prop="otherFile">
        <template slot-scope="scope">
          <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.otherFile" @click="uploadBtnsClick(8, scope.row, $event, '其他资料')" />
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
import {deleteAdviseInfo, getBuildInfo} from "@/api/build/buildInfo";
export default {
  name: "TabsBoxThree",
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
