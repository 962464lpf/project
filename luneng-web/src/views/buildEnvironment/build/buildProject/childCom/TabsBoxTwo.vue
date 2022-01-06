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
        min-width="160"
        label="绿建工作组会签表"
        align="center"
        fixed="right"
        prop="signFile">
        <template slot-scope="scope">
          <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.signFile" @click="uploadBtnsClick(1, scope.row, $event, '绿建工作组会签表')" />
        </template>
      </el-table-column>
      <el-table-column
        min-width="140"
        label="预评估报告"
        align="center"
        fixed="right"
        prop="beforehandEvaluationFile">
        <template slot-scope="scope">
          <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.beforehandEvaluationFile" @click="uploadBtnsClick(2, scope.row, $event, '预评估报告')" />
        </template>
      </el-table-column>
      <el-table-column
        min-width="140"
        label="成本分析报告"
        align="center"
        fixed="right"
        prop="costAnalysisFile">
        <template slot-scope="scope">
          <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.costAnalysisFile" @click="uploadBtnsClick(3, scope.row, $event, '成本分析报告')" />
        </template>
      </el-table-column>
      <el-table-column
        min-width="140"
        label="绿建认证目标建议书"
        align="center"
        fixed="right"
        prop="targetSuggestionsFile">
        <template slot-scope="scope">
          <el-row>
            <el-col>
              <el-button
                v-if="scope.row.approvalStatus === 1"
                type="text"
                @click="establishTargetBook(scope.row)"
                v-hasPermi="['build:buildInfo:editAdviseInfo']"
              >编制
              </el-button>
              <el-button
                v-if="scope.row.approvalStatus === 2 || scope.row.approvalStatus === 5"
                type="text"
                @click="editTargetBook(scope.row)"
                v-hasPermi="['build:buildInfo:editAdviseInfo']"
              >编辑
              </el-button>
              <el-button
                v-if="scope.row.approvalStatus === 2"
                type="text"
                @click="deleteTargetBook(scope.row)"
                v-hasPermi="['build:buildInfo:removeAdviseInfo']"
              >删除
              </el-button>
              <el-button
                v-if="scope.row.approvalStatus === 4"
                type="text"
                @click="uploadSignTargetBook(22, scope.row, '建议书签字版扫描件')"
                v-hasPermi="['build:buildInfo:upload']"
              >上传签字版扫描件
              </el-button>
              <el-button
                v-if="scope.row.approvalStatus !== 1"
                type="text"
                @click="queryTargetBook(scope.row)"
                v-hasPermi="['build:buildInfo:checkFile']"
              >查看
              </el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        width="120"
        label="审核状态"
        align="center"
        :formatter="approvalStatusFormat"
        prop="approvalStatus">
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
import {deleteAdviseInfo, getBuildInfo, operation} from "@/api/build/buildInfo";

export default {
  name: "TabsBoxTwo",
  props: {
    buildProForm: {
      type: Object,
      default() {
        return {}
      }
    },
    approvalStatusOptions :{
      type: Array,
      default() {
        return []
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
            if (data.approvalStatus !== 3) {
              this.currProId = row.id
              this.uploadFileType = fileType
              if (title) this.title = title
              this.open = true
            } else {
              this.msgError('当前项目正在审核中，不可操作')
            }
          } else {
            this.msgError('当前项目已归档，不可操作')
          }
        })
      }
    },
    //建立目标书
    establishTargetBook(row) {
      getBuildInfo(row.id).then(({data}) => {
        if (data.finish === 0) {
          const id = row.id
          const path = '/buildEnvironment/build/confirmGoal/editTargetBook'
          const query = {
            infoId: id,
            operation: 1
          }
          operation(query).then(() => {
            this.$router.push({
              'path': path,
              'query': {
                id,
                proDetailFlag: this.proDetailFlag,
                tabActiveName: this.tabActiveName
              }
            })
          })
        } else {
          this.msgError('当前项目已归档，不可操作')
        }
      })
    },
    //编辑目标书
    editTargetBook(row) {
      getBuildInfo(row.id).then(({data}) => {
        if (data.finish === 0) {
          const id = row.id
          const path = '/buildEnvironment/build/confirmGoal/editTargetBook'
          this.$router.push({
            'path': path,
            'query': {
              id,
              proDetailFlag: this.proDetailFlag,
              tabActiveName: this.tabActiveName
            }
          })
        } else {
          this.msgError('当前项目已归档，不可操作')
        }
      })
    },
    //删除目标书
    deleteTargetBook(row) {
      getBuildInfo(row.id).then(({data}) => {
        if (data.finish === 0) {
          const id = row.id;
          this.$confirm('是否确认删除当前项目建议书?', "系统提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(function () {
            return deleteAdviseInfo(id);
          }).then(() => {
            this.getList();
            this.msgSuccess("删除成功");
          }).catch(function () {
          });
        } else {
          this.msgError('当前项目已归档，不可操作')
        }
      })
    },
    //上传签字版目标书
    uploadSignTargetBook(fileType, row, title) {
      getBuildInfo(row.id).then(({data}) => {
        if (data.finish === 0) {
          this.currProId = row.id
          this.uploadFileType = fileType
          if (title) this.title = title
          this.open = true
        } else {
          this.msgError('当前项目已归档，不可操作')
        }
      })
    },
    //查看目标书
    queryTargetBook(row) {
      const id = row.id
      const path = '/buildEnvironment/build/buildProject/targetBookDetail'
      this.$router.push({
        'path': path,
        'query': {
          id,
          detailFlag: '0',
          proDetailFlag: this.proDetailFlag,
          tabActiveName: this.tabActiveName
        }
      })
    },
    //上传成功刷新
    getList() {
      this.$emit('refresh-list')
    }
  }
}
</script>
