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
        label="绿建材料设备技术规格书"
        align="center"
        prop="technicalEquipmentFile">
        <template slot-scope="scope">
          <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.technicalEquipmentFile" @click="uploadBtnsClick(9, scope.row, $event, '绿建材料设备技术规格书')" />
        </template>
      </el-table-column>
      <el-table-column
        min-width="140"
        label="批复意见"
        align="center"
        prop="replyFile">
        <template slot-scope="scope">
          <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.replyFile" @click="uploadBtnsClick(10, scope.row, $event, '批复意见')" />
        </template>
      </el-table-column>
      <el-table-column
        min-width="140"
        label="工作简报"
        align="center"
        prop="costAnalysisFile">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="navWorkBriefing(1 ,scope.row)"
            v-hasPermi="['build:buildInfo:monthlyReport']"
          >工作简报
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        min-width="160"
        label="项目周报"
        align="center"
        prop="targetSuggestionsFile">
        <template slot-scope="scope">
          <div>
            <el-switch
              v-hasPermi="['build:buildInfo:weeklyNewspaper']"
              v-model="scope.row.weeklyNewspaper"
              @change="isWorkWeekNew(scope.row)"
              :active-value="1"
              :inactive-value="0">
            </el-switch>
            <el-button
              type="text"
              @click="navWorkBriefing(2, scope.row)"
              v-hasPermi="['build:buildInfo:weeklyReport']"
            >项目周报
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="140"
        label="绿色施工评价"
        align="center"
        fixed="right"
        prop="targetSuggestionsFile">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="addConstructionAppraisal(scope.row)"
            v-hasPermi="['build:buildAppraise:add']"
          >新增
          </el-button>
          <el-button
            type="text"
            @click="recordConstructionAppraisal(scope.row)"
            v-hasPermi="['build:buildAppraise:list']"
          >记录
          </el-button>
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
import { getBuildInfo, updateBuildInfo} from "@/api/build/buildInfo";
export default {
  name: "TabsBoxFour",
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
  components: {
    uploadBtns,
    uploadFileDialog
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
  methods: {
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
    //查看工作简报
    navWorkBriefing(type, row) {
      const id = row.id
      const path = type === 1 ? '/buildEnvironment/build/construction/workBriefing' : '/buildEnvironment/build/construction/weekBriefing'
      this.$router.push({
        'path': path,
        'query': {
          id,
          type
        }
      })
    },
    //新增绿色施工评价
    addConstructionAppraisal(row) {
      getBuildInfo(row.id).then(({data}) => {
        if (data.finish === 0) {
          if (data.approvalStatus === 4) {
            const id = row.id
            const path = '/buildEnvironment/build/construction/editEvaluate'
            this.$router.push({
              'path': path,
              'query': {
                id,
                proDetailFlag: this.proDetailFlag,
                tabActiveName: this.tabActiveName
              }
            })
          } else {
            this.msgError('当前项目正在审核中或审核未通过，不可操作')
          }
        } else {
          this.msgError('当前项目已归档，不可操作')
        }
      })
    },
    //记录绿色施工评价
    recordConstructionAppraisal(row) {
      const id = row.id
      const path = '/buildEnvironment/build/construction/workEvaluate'
      this.$router.push({
        'path': path,
        'query': {
          id
        }
      })
    },
    //是否上传周报
    isWorkWeekNew(row) {
      getBuildInfo(row.id).then(({data}) => {
        if (data.finish === 0) {
          if (data.approvalStatus === 4) {
            this.$confirm(`是否确认所选择的项目周报${row.weeklyNewspaper === 0 ? '关闭' : '开启'}?`, "系统提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              return updateBuildInfo(row);
            }).then(() => {
              this.getList();
              this.msgSuccess("操作成功");
            }).catch(() => {
              this.getList();
            });
          } else {
            this.msgError('当前项目正在审核中或审核未通过，不可操作')
            this.getList()
          }
        } else {
          this.msgError('当前项目已归档，不可操作')
        }
      })
    },
    //上传成功刷新
    getList() {
      this.$emit('refresh-list')
    },
  }
}
</script>
