<template>
  <div class="app-container">
    <div class="header">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true">
        <el-form-item label="姓名" prop="expertName">
          <el-input
            v-model="queryParams.expertName"
            placeholder="请输入姓名"
            clearable
            style="width: 230px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="添加日期" prop="searchTime">
          <el-date-picker
            v-model="searchTime"
            clearable
            style="width: 240px"
            type="daterange"
            value-format="yyyy-MM-dd"
            placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleQuery">查询
          </el-button>
          <el-button
            icon="el-icon-refresh"
            @click="resetQuery">重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="main">
      <div class="main-top">
        <el-row :gutter="15" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              v-hasPermi="['expert:expertReportingRecord:add']"
              @click="handleAdd"
            >手动添加
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              @click="downloadTemplate"
              v-hasPermi="['expert:expertReportingRecord:downloadTemp']"
            >下载模板
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              icon="el-icon-upload2"
              @click="importTemplate"
              v-hasPermi="['expert:expertReportingRecord:importData']"
            >导入添加
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          :data="expertSelectionList">
          <el-table-column
            type="selection"
            min-width="40"
            align="center"/>
          <el-table-column
            label="序号"
            min-width="55"
            align="center"
            type="index">
            <template slot-scope="scope">
              <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="300"
            label="专家姓名"
            align="center"
            prop="expertNames">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row)" @click="queryDetail(scope.row)">
                <span>{{ scope.row.expertNames }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="110"
            label="添加日期"
            align="center"
            prop="createTime">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            label="状态"
            fixed="right"
            align="center"
            prop="auditStatus">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row) + ' no-cursor-point'">
                <span>{{ selectDictLabel(expertSelectionOptions, scope.row.auditStatus) }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="main-footer">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"/>
      </div>
    </div>

    <!-- 专家导入对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="600px"
      append-to-body :close-on-click-modal="false">
      <el-select
        v-model="upload.noticeId"
        placeholder="请选择专家选拔通知"
        style="width: 65%;margin-bottom: 20px">
        <el-option
          v-for="item in selNoticeOptions"
          :key="item.id"
          :label="item.noticeTitle"
          :value="item.id"
        />
      </el-select>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls, .xlsm"
        :headers="upload.headers"
        :action="upload.url + '?noticeId=' + upload.noticeId"
        :disabled="upload.isUploading"
        :on-change="handleChange"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport"/>
          是否更新已经存在的用户数据
        </div>
        <div class="el-upload__tip"
             style="color:red"
             slot="tip">
          提示：仅允许导入“xls”、“xlsx”、”xlsm“格式文件！
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="cancel2">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
      :show-close="false"
      :close-on-click-modal="false">
      <div>
        <el-select
          v-model="noticeId"
          placeholder="请选择专家选拔通知"
          style="width: 80%;margin-bottom: 30px">
          <el-option
            v-for="item in selNoticeOptions"
            :key="item.id"
            :label="item.noticeTitle"
            :value="item.id"
          />
        </el-select>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="!noticeId" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {delExpertReportingRecord, listExpertReportingRecord, downloadTemp} from "@/api/expert/expertReportingRecord";
import {getToken} from "@/utils/auth";
import {listSelNotice} from "@/api/sel/selNotice";

export default {
  name: "index",
  data() {
    return {
      // 加载等待线
      loading: false,
      // 表格选中数组id串
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 搜索框查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        expertName: '',
        createTime: ''
      },
      //搜索时间
      searchTime: [],
      //专家选拔列表
      expertSelectionList: [],
      //字典选项
      expertSelectionOptions: [],
      //通知类型
      selNoticeOptions: [],
      noticeId: null,
      title: '选择通知',
      open: false,
      //专家导入参数
      upload: {
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: {Authorization: "Bearer " + getToken()},
          //专家选拔通知id
          noticeId: null,
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/expert/expertReportingRecord/importData"
      },
      fileName: ''
    }
  },
  computed: {
    projectNameStyle() {
      return (row) => {
        if (row.auditStatus === 1) {
          return 'project-name-all-hover'
        } else {
          return 'project-name-all'
        }
      }
    }
  },
  created() {
    //获取接口数据
    this.getList()
    //获取字典数据
    this.getDicts("expert_selection").then(response => {
      this.expertSelectionOptions = response.data;
    });
  },
  methods: {
    /*********************** 数据获取及处理 ***********************/
    /** 获取申报待评审列表 */
    getList() {
      this.loading = true;
      this.queryParams.createTime = JSON.stringify(this.searchTime)
      listExpertReportingRecord(this.queryParams).then(({rows, total}) => {
        this.expertSelectionList = rows;
        this.total = total;
        this.loading = false;
      });
    },
    //获取通知
    getNoticeList() {
      const query = {
        type: 2,
        kind: 12
      }
      return listSelNotice(query)
    },
    /*********************** 交互操作 ***********************/
    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.searchTime = []
      this.$refs["queryForm"].resetFields();
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    //手动添加
    handleAdd() {
      this.getNoticeList().then( response => {
        this.selNoticeOptions = response.rows;
        this.open = true
      })
    },
    //确定添加弹窗
    submitForm() {
      if (this.noticeId) {
        const path = "/expert/selection/reportSelExperts"
        this.$router.push({
          "path": path,
          "query": {
            "noticeId": this.noticeId
          }
        })
      }
    },
    //取消
    cancel() {
      this.open = false
      this.noticeId = null
    },
    //删除
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除所选择的专家选拔信息?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delExpertReportingRecord(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () {
      });
    },
    //下载模板
    downloadTemplate() {
        // downloadTemp().then(response => {
        //     let blob = new Blob([response], {type: "application/vnd.ms-excel"});
        //     let url = window.URL.createObjectURL(blob);
        //     const a = document.createElement('a');
        //     a.href = url;
        //     a.download = 'expert.xls';
        //     document.body.appendChild(a);
        //     a.click();
        //     document.body.removeChild(a)
        //     window.URL.revokeObjectURL(url);
        // });
        window.location.href = process.env.VUE_APP_BASE_API + "/expert/expertReportingRecord/downloadTemp";
    },
    //导入模板
    importTemplate() {
        this.getNoticeList().then( response => {
            this.selNoticeOptions = response.rows;
            this.upload.title = "用户导入";
            this.upload.open = true;
        })
    },
    //文件添加时
    handleChange(file, fileList) {
      this.fileName = file.name
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.cancel2()
      this.upload.isUploading = false;
      this.$alert(response.msg, "导入结果", {dangerouslyUseHTMLString: true});
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      if (this.upload.noticeId && this.fileName) {
        this.$refs.upload.submit();
      } else {
        this.msgError('专家选拔通知和上传的文件不能为空')
      }
    },
    cancel2() {
      this.upload.noticeId = null;
      this.$refs.upload.clearFiles();
      this.upload.open = false;
    },
    //修改
    handleUpdate(row) {
      const id = row.id
      const path = "/expert/selection/reportSelExperts"
      this.$router.push({
        "path": path,
        'query': {
          id
        }
      })
    },
    //查看
    queryDetail(row) {
      const id = row.id
      const path = "/expert/selection/selExpertsDetail"
      this.$router.push({
        "path": path,
        'query': {
          id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  padding: 20px 30px 50px 30px;
  display: flex;
  flex-direction: column;

  .header {
    width: 100%;
    margin-bottom: 20px;
  }

  .main {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .main-top {
      width: 100%;
    }

    .main-center {
      width: 100%;
    }

    .main-footer {
      width: 420px;
      margin-top: 20px;
    }
  }
}
</style>
