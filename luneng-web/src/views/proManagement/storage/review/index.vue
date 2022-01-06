<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="90px">
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申报单位" prop="subordinateUnit">
        <el-input
          v-model="queryParams.subordinateUnit"
          placeholder="请输入申报单位名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="年度" prop="declareYear">
        <el-date-picker
          v-model="declareYear"
          :clearable="false"
          type="year"
          placeholder="请选择年度">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-check"
          :disabled="setExpertGroupFlag"
          @click="selExpertGroup"
          v-hasPermi="['project:projectStorageReview:setExpertGroup']"
        >选择专家组
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-switch-button"
          :disabled="reviewEndFlag"
          @click="handleReviewEnd"
          v-hasPermi="['project:projectStorageReview:reviewEnd']"
        >评审结束
        </el-button>
        <el-button
          type="warning"
          v-if="viewImport"
          icon="el-icon-download"
          @click="handleDownload"
        >评审结果导入模板
        </el-button>
        <el-button
          type="warning"
          icon="el-icon-download"
          @click="handleExport"
          v-hasPermi="['project:projectStorageReview:export']"
        >导出专家意见
        </el-button>
      </el-col>
    </el-row>

    <el-table
      ref="table"
      v-loading="loading"
      :data="projectStorageInfoList"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" min-width="45" align="center"/>
      <el-table-column
        min-width="55"
        label="序号"
        align="center"
        type="index">
        <template slot-scope="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="项目名称"
        align="center"
        prop="projectName"
        min-width="230">
        <template slot-scope="scope">
          <div :class="projectNameStyle(scope.row)"
               @click="handleDetail(scope.row)">
            <span>{{ scope.row.projectName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="230" label="申报单位" align="center" prop="subordinateUnit" />
      <el-table-column min-width="120" label="项目类别" align="center" prop="type" />
      <el-table-column min-width="160" label="专家组" align="center" >
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.expertGroupId"
            type="text"
            @click="selExpertGroup(scope.row)"
            :disabled="scope.row.levelFlag==1||scope.row.status==7"
            v-hasPermi="['project:projectStorageReview:setExpertGroup']">选择专家组
          </el-button>
          <el-button
            v-else
            type="text"
            @click="navGroupMember(scope.row)"
            :disabled="scope.row.levelFlag==1||scope.row.status==7"
            v-hasPermi="['project:projectStorageReview:setExpertGroup']">
            {{ scope.row.group.name }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column width="120" label="评审详情（未评审/全部）" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="scope.row.sumTotal"
            :disabled="!scope.row.sumTotal"
            @click="reviewDetail(scope.row)">{{ scope.row.noReviewTotal }}/{{ scope.row.sumTotal }}
          </el-button>
          <el-button
            type="text"
            v-if="!scope.row.sumTotal"
            :disabled="!scope.row.sumTotal"
            @click="reviewDetail(scope.row)">--
          </el-button>
        </template>
      </el-table-column>
      <el-table-column width="160" label="评审操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-switch
            :disabled="scope.row.levelFlag==1"
            :value="scope.row.status==6||scope.row.status==8"
            @change="handleStatusChange(scope.row)"
          >
          </el-switch>
          <el-button
            type="text"
            v-if="viewImport"
            @click="handleImportExpertReviewResult(scope.row)">导入专家评审结果
          </el-button>
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
    <!-- 选择专家组对话框 -->
    <el-dialog
      :title="selExpertGroupDialog.title"
      :visible.sync="selExpertGroupDialog.open"
      width="400px"
      append-to-body :close-on-click-modal="false"
      @close="closeSelExpertGroup">
      <el-form
        :model="selExpertGroupFrom"
        ref="selExpertGroupFrom"
        :inline="true">
        <el-form-item label="专家组" prop="inExpertGroupId">
          <el-select
            v-model="selExpertGroupFrom.expertGroupId"
            placeholder="请选择专家组"
            clearable
            style="width: 250px"
          >
            <el-option
              v-for="item in allExpertGroups"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
          <div class="el-upload__tip" style="color: red">
            专家组的成员在三人及以上才会在此显示并可选择
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center" class="dialog-footer">
        <el-button style="width: 110px" type="primary" @click="submitSelExpertGroup">确 定</el-button>
        <el-button style="width: 110px" @click="navAddExpertGroup">新增专家组</el-button>
      </div>
    </el-dialog>


    <!-- 评审意见导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body
               :close-on-click-modal="false">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls,.xlsm"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport"/>
          是否更新已经存在的用户数据
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”、“xlsx”、”xlsm“格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getToken} from "@/utils/auth";
import {listProjectStorageInfo, setExpertGroup, operation, exportExcel} from "@/api/storage/review"
import {selExpertGroup} from "@/api/expert/expertGroup";
import {getProjectNoticeSend,downloadTemp} from "@/api/storage/projectStorageInfo";

export default {
  data() {
    return {
      // 遮罩层
      loading: true,
      // 复选框选中ID
      ids: '',
      // 评审结束是否可用
      reviewEndFlag: true,
      // 选怎专家组是否可用
      setExpertGroupFlag: true,
      // 总条数
      total: 0,
      // 项目储备申报表格数据
      projectStorageInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 项目属性字典
      attriOptions: [],
      // 研究领域字典
      areaOptions: [],
      // 状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        declareYear: undefined,
        projectName: undefined,
        subordinateUnit: undefined,
        area: undefined
      },
      // 申报年限
      declareYear: new Date(),
      // 选择专家组对话框控制
      selExpertGroupDialog: {
        title: "选择专家组",
        open: false
      },
      // 选择专家组表单
      selExpertGroupFrom: {
        ids: null,
        expertGroupId: null
      },
      // 所有可选的专家组
      allExpertGroups: [],
      // 评审结束
      updateStatusFrom: {
        ids: null,
        operation: null
      },
      viewImport: true,
      // 评审结果
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: {Authorization: "Bearer " + getToken()},
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/project/projectStorageInfo/importData"
      }
    };
  },
  activated() {
    this.getProjectNoticeSendStatus();
    this.getList();
  },
  computed: {
    projectNameStyle() {
      return (row) => {
        return (row.status === '7') ? 'project-name-all' : 'project-name-all-hover'
      }
    }
  },
  created() {
    this.getProjectNoticeSendStatus();
    this.getList();
    this.getDicts("project_storage_attri").then(response => {
      this.attriOptions = response.data;
    });
    this.getDicts("project_storage_area").then(response => {
      this.areaOptions = response.data;
    });
    this.getDicts("project_storage_status").then(response => {
      this.statusOptions = response.data;
    });
    // this.getDeclareYear();
  },
  methods: {
    // 修改评审状态
    handleStatusChange(row) {
      const ids = [];
      ids.push(row.id);
      this.updateStatusFrom.ids = ids;
      this.updateStatusFrom.operation = "2";
      let title = "";
      if (row.status == 6 || row.status == 8) {
        title = "评审结束，未评审专家将不可继续评审！"
      } else if (row.status == 7) {
        title = "重新评审，专家可以继续评审！"
      }
      this.$confirm(title, "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        operation(this.updateStatusFrom).then(res => {
          if (res.code == 200) {
            this.getList();
          }
        })
      })
    },
    handleDownload(){
        window.location.href = process.env.VUE_APP_BASE_API + "/project/projectStorageInfo/downloadTemp";
    },
    getProjectNoticeSendStatus() {
      getProjectNoticeSend().then(res => {
        this.viewImport = res.data == 'true'
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.msgInfo(response.msg);
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    //关闭选择专家组对话框重置表单
    closeSelExpertGroup() {
      this.selExpertGroupFrom = {
        ids: null,
        expertGroupId: null
      }
    },
    //跳转添加新的专家组
    navAddExpertGroup() {
      this.selExpertGroupDialog.open = false
      const path = "/expert/expertGroup/addExpertGroup"
      const backExpertReviewFlag = '1'
      this.$router.push({
        "path": path,
        "query": {
          "backExpertReviewFlag": backExpertReviewFlag
        }
      })
    },
    //确定选择的专家组
    submitSelExpertGroup() {
      console.log(this.selExpertGroupFrom)
      setExpertGroup(this.selExpertGroupFrom).then(res => {
        this.selExpertGroupFrom = {
          ids: null,
          expertGroupId: null
        }
        this.getList()
        this.selExpertGroupDialog.open = false
      })
    },
    /********** 选择专家组按钮操作(需打开对话框) **********/
    selExpertGroup(row) {
      let idsTem = []
      if (row.id != undefined) {
        idsTem.push(row.id)
      } else {
        idsTem = this.ids
      }
      selExpertGroup().then(res => {
        this.allExpertGroups = res.data
        if (idsTem.length > 0) {
          this.selExpertGroupFrom.ids = idsTem
          this.selExpertGroupDialog.open = true
        } else {
          this.$message({
            type: "warning",
            message: '请先选择需要选择专家组的申报项目'
          })
        }
      })
    },
    //查看该专家组成员(id)
    navGroupMember(row) {
      const path = "/expert/expertGroup/manageMember/addMember"
      const expertGroupId = row.expertGroupId
      this.$router.push({
        "path": path,
        "query": {
          "expertGroupId": expertGroupId,
          "expertReviewFlag": "1"
        }
      })
    },
    /** 查询项目储备申报列表 */
    getList() {
      this.loading = true;
      this.queryParams.declareYear = this.parseTime(this.declareYear, "{y}")
      listProjectStorageInfo(this.queryParams).then(response => {
        this.projectStorageInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 项目属性字典翻译
    attriFormat(row, column) {
      return this.selectDictLabel(this.attriOptions, row.attri);
    },
    // 研究领域字典翻译
    areaFormat(row, column) {
      return this.selectDictLabel(this.areaOptions, row.area);
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.setExpertGroupFlag = !selection.length;
      this.reviewEndFlag = !selection.length;
      selection.map(item => {
        if (item.status == 7) {
          this.reviewEndFlag = true;
          this.setExpertGroupFlag = true;
        }
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.declareYear = new Date();
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleImportExpertReviewResult(row) {
      this.upload.url = process.env.VUE_APP_BASE_API + "/project/projectStorageInfo/importData?id=" + row.id;
      this.upload.title = "评审意见导入";
      this.upload.open = true;
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      const ids = [];
      ids.push(row.id);
      operation({"ids": ids, "operation": "3"}).then(res => {
        this.$router.push({
          path: '/proManagement/storage/review/infoDetail',
          query: {
            id: row.id
          }
        })
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有项目储备申报数据项?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportExcel(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () {
      });
    },
    // 评审结束
    handleReviewEnd() {
      const ids = this.ids;
      this.updateStatusFrom.operation = "1";
      this.$confirm("评审结束，未评审专家将不可继续评审！", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        operation({"ids": ids, "operation": "1"}).then(res => {
          if (res.code == 200) {
            this.msgSuccess("操作成功！");
            this.getList();
          }
        })
      }).catch(function () {
      });
    },
    reviewDetail(row) {
      this.$router.push({path: "/proManagement/storage/review/detail", query: {"id": row.id, status: row.status}})
    }
  }
};
</script>
