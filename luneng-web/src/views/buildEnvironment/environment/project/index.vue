<template>
  <div class="app-container">
    <table-search v-model="queryParams" @query="handleQuery" @reset="resetQuery"/>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
          v-hasPermi="['hb:hbProjectInfo:add']"
        >录入项目
        </el-button>
      </el-col>
      <!--
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hb:hbProjectInfo:remove']"
        >删除
        </el-button>
      </el-col>
      -->
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-s-cooperation"
          @click="handleBatchDownload"
          :disabled="single"
          v-hasPermi="['hb:hbProjectInfo:download']"
        >批量打包
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-download"
          @click="handleDownloadList"
          v-hasPermi="['hb:hbProjectInfo:downloadList']"
        >打包列表
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="warning"-->
      <!--          icon="el-icon-download"-->
      <!--          @click="handleExport"-->
      <!--          v-hasPermi="['pro:hbProjectInfo:export']"-->
      <!--        >导出</el-button>-->
      <!--      </el-col>-->
    </el-row>

    <el-table ref="table" v-loading="loading" :data="hbProjectInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" min-width="40" align="center"/>
      <el-table-column min-width="55" label="序号" align="center" type="index">
        <template slot-scope="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="230" label="项目名称" align="center" prop="projectName">
        <template slot-scope="scope">
          <div :class="projectNameStyle" @click="handleDetail(scope.row)">
            <span>{{ scope.row.projectName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="200" label="项目地点" align="center" prop="projectAddr" />
      <el-table-column label="环境影响报告编制单位" align="center" prop="prepareUnit" min-width="160" />
      <el-table-column label="录入单位" align="center" prop="inputUnit" min-width="230" />
      <el-table-column label="计划开工日期" align="center" prop="planBeginDate" min-width="120" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.planBeginDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划竣工日期" align="center" prop="planEndDate" min-width="120" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.planEndDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际开工日期" align="center" prop="actualBeginDate" min-width="120" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.actualBeginDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际竣工日期" align="center" prop="actualEndDate" width="120" fixed="right">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.actualEndDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 批量下载对话框 -->
    <el-dialog title="下载" :visible.sync="downOpen" width="500px" append-to-body :close-on-click-modal="false"
               :before-close="handleDownloadCancel">
      <el-form label-width="100px">
        <el-form-item label="文件类型">
          <el-select v-model="fileType" multiple placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in options"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleDownloadSubmit">确 定</el-button>
        <el-button @click="handleDownloadCancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 文件列表对话框 -->
    <el-dialog :visible.sync="zipFileOpen" width="800px" append-to-body :close-on-click-modal="false">
      <el-table :data="zipFileList">
        <el-table-column label="文件名" prop="fileName" align="center"/>
        <el-table-column label="打包时间" prop="createTime" width="150px" align="center"/>
        <el-table-column label="打包人" prop="nickName" width="80px" align="center"/>
        <el-table-column label="操作" width="100px" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleDownloadFile(scope.row)"
            >下载
            </el-button>
            <el-button
              type="text"
              @click="handleDeleteFile(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="zipTotal>0"
        :total="zipTotal"
        :page.sync="zipQueryParams.pageNum"
        :limit.sync="zipQueryParams.pageSize"
        @pagination="getZipFileList"
      />
    </el-dialog>
  </div>
</template>

<script>
  import {
    listHbProjectInfo,
    getHbProjectInfo,
    delHbProjectInfo,
    addHbProjectInfo,
    updateHbProjectInfo,
    batchCreateZipFile
  } from '@/api/hb/hbProjectInfo'
  import { listHbFilesHis, delHbFilesHis } from '@/api/hb/hbFilesHis'
  import tableSearch from '../components/tableSearch'

  export default {
    name: 'HbProjectInfo',
    components: {
      tableSearch
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 环保项目信息表格数据
        hbProjectInfoList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          status: 1,
          projectName: undefined,
          prepareUnit: undefined
        },
        downOpen: false,
        fileType: [],
        options: [
          { key: 1, value: '确定环评类别' },
          { key: 2, value: '启动报告编制' },
          { key: 3, value: '完成报告批复' },
          { key: 4, value: '环保施工应急' },
          { key: 5, value: '竣工环保验收' },
          { key: 6, value: '专家评审' },
          { key: 7, value: '环保工作管理' },
          { key: 8, value: '环保验收' }
        ],
        zipFileOpen: false,
        zipFileList: [],
        zipQueryParams: {
          pageSize: 10,
          pageNum: 1,
          fileType: 'zip'
        },
        zipTotal: 0
      }
    },
    computed: {
      projectNameStyle() {
        return 'project-name-all'
      }
    },
    activated() {
      this.getList()
    },
    created() {
      this.getList()
    },
    methods: {
      /** 查询环保项目信息列表 */
      getList() {
        this.loading = true
        listHbProjectInfo(this.queryParams).then(response => {
          this.hbProjectInfoList = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      //批量下载
      handleBatchDownload() {
        this.downOpen = true
      },
      //下载列表
      handleDownloadList() {
        this.zipFileOpen = true
        this.zipQueryParams.pageNum = 1
        this.getZipFileList()
      },
      handleDownloadCancel() {
        this.fileType = []
        this.downOpen = false
      },
      handleDownloadSubmit() {
        if (this.fileType.length == 0) {
          this.msgError('请选择要下载的文件类型')
          return
        }
        const id = this.ids
        const fileTypes = this.fileType
        batchCreateZipFile({ 'id': id, 'fileTypes': fileTypes })
        setTimeout(this.afterCreate, 500)

      },
      afterCreate() {
        this.downOpen = false
        this.fileType = []
        this.msgSuccess('正在打包中，请稍后...')
        this.ids = []
        this.$refs.table.clearSelection()
      },
      // 批量下载
      handleDownload() {
        this.downOpen = true
      },

      handleDownloadFile(row) {
        let path = row.filePaths
        if (process.env.NODE_ENV === 'development') {
          path = path.replace('/dev-api', '')
        }
        window.location.href = path
        this.zipFileOpen = false
      },
      handleDeleteFile(row) {
        delHbFilesHis(row.id).then(res => {
          this.msgSuccess(res.msg)
          this.zipQueryParams.pageNum = 1
          this.getZipFileList()
        })
      },

      getZipFileList() {
        listHbFilesHis(this.zipQueryParams).then(res => {
          this.zipFileList = res.rows
          this.zipTotal = res.total
        })
      },

      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
        if (selection.length > 0) {
          selection.map(item => {
            if (item.fileStatus == 1) {
              this.multiple = true
            }
          })
        }
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
      },
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          projectName: undefined,
          projectAddr: undefined,
          inputUnit: undefined,
          inputMan: undefined,
          tel: undefined,
          email: undefined,
          prepareUnit: undefined,
          planBeginDate: undefined,
          planEndDate: undefined,
          actualBeginDate: undefined,
          actualEndDate: undefined,
          remark: undefined,
          oneFirstFilePaths: undefined,
          oneSecondFilePaths: undefined,
          oneThirdFilePaths: undefined,
          oneForthFilePaths: undefined,
          twoFirstFilePaths: undefined,
          twoSecondFilePaths: undefined,
          twoThirdFilePaths: undefined,
          threeOneFilePaths: undefined,
          baCode: undefined,
          baDate: undefined,
          baFilePaths: undefined,
          fourFirstFilePaths: undefined,
          fourSecondFilePaths: undefined,
          fiveFirstFilePaths: undefined,
          fiveSecondFilePaths: undefined,
          fiveThirdFilePaths: undefined,
          fiveForthFilePaths: undefined,
          sixFirstFilePaths: undefined,
          sixSecondFilePaths: undefined,
          sixThirdFilePaths: undefined,
          sevenFirstFilePaths: undefined,
          eightFirstFilePaths: undefined,
          eightSecondFilePaths: undefined,
          eightThirdFilePaths: undefined,
          eightForthFilePaths: undefined,
          fileStatus: '0',
          uploadSwitch: undefined
        }
        this.resetForm('form')
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.$router.push({
          path: '/buildEnvironment/environment/project/add'
        })
      },
      /** 详情按钮操作 */
      handleDetail(row) {
        this.$router.push({
          path: '/buildEnvironment/environment/project/detail',
          query: {
            id: row.id
          }
        })
      },
      /** 详情按钮操作 */
      handleView(row) {
        this.$router.push({
          path: '/buildEnvironment/environment/project/view',
          query: {
            id: row.id
          }
        })
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.$router.push({
          path: '/buildEnvironment/environment/project/edit',
          query: {
            id: row.id
          }
        })
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateHbProjectInfo(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                }
              })
            } else {
              addHbProjectInfo(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess('新增成功')
                  this.open = false
                  this.getList()
                }
              })
            }
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$confirm('是否确认删除?', '系统提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          getHbProjectInfo(row.id).then(response => {
            if (response.data.fileStatus == 1) {
              this.msgInfo('该项目已归档，暂时无法操作')
              this.getList()
            } else {
              delHbProjectInfo(ids).then(() => {
                this.getList()
                this.msgSuccess('删除成功')
              })
            }
          })
        }).catch(function() {
        })
      }
    }
  }
</script>
