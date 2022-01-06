<template>
  <div class="app-container">
    <div class="header">
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true">
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入姓名"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="技术职称" prop="jobLevel">
          <el-input
            v-model="queryParams.jobLevel"
            placeholder="请输入技术职称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="专家状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择专家状态"
            clearable>
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"/>
          </el-select>
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
      <div class="leftBox">
        <el-tree
          :data="exertGroupTypes"
          :props="defaultProps"
          :expand-on-click-node="false"
          default-expand-all
          @node-click="handleNodeClick"/>
      </div>

      <div class="rightBox">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="handleAdd"
              v-hasPermi="['expert:expert:add']">添加专家
            </el-button>
          </el-col>
          <el-col :span="1.5" v-if="false">
            <el-button
              type="success"
              icon="el-icon-edit"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['expert:expert:edit']">修改专家
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['expert:expert:remove']">删除专家
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              @click="handleExport"
              v-hasPermi="['expert:expert:export']">导出Excel
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              icon="el-icon-upload2"
              @click="handleImport"
              v-hasPermi="['expert:expert:import']">导入Excel
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              @click="importTemplate"
              v-hasPermi="['expert:expert:import']"
            >下载模板
            </el-button>
          </el-col>
        </el-row>
        <el-table
          ref="table"
          v-loading="loading"
          :data="expertList"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            min-width="40"
            align="center"/>
          <el-table-column
            label="序号"
            align="center"
            min-width="55"
            type="index">
            <template slot-scope="scope">
              <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            label="姓名"
            align="center"
            prop="name">
            <template slot-scope="scope">
              <div class="project-name-all-hover" @click="handleDetail(scope.row)">
                <span>{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="100"
            label="用户名"
            align="center"
            prop="userName">
            <template slot-scope="scope">
              <div class="project-name-all-hover" @click="handleDetail(scope.row)">
                <span>{{ scope.row.userName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="230"
            label="工作单位"
            align="center"
            prop="workUnit"/>
          <el-table-column
            min-width="120"
            label="现任职务"
            align="center"
            prop="job"/>
          <el-table-column
            min-width="120"
            label="技术职称"
            align="center"
            prop="jobLevel"/>
          <el-table-column
            min-width="120"
            label="专业领域"
            align="center"
            prop="exportArea"
            :formatter="exportAreaFormat"/>
          <el-table-column
            min-width="150"
            label="联系方式"
            align="center"
            prop="phone"/>
          <el-table-column
            min-width="120"
            label="邮箱"
            align="center"
            prop="email"/>
          <el-table-column
            min-width="115"
            label="入库时间"
            align="center"
            prop="createTime">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            label="状态"
            class-name="small-padding fixed-width"
            fixed="right"
            align="center"
            prop="status">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"/>
      </div>
    </div>

    <!-- 用户上传对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body :close-on-click-modal="false">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls, .xlsm"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
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
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listExpert,
  delExpert,
  changeExpertStatus,
  exportExpert,
  importTemplate
} from "@/api/expert/expert";

import {getToken} from "@/utils/auth";

export default {
  name: "",
  data() {
    return {
      // 加载等待线
      loading: true,
      // 表格选中数组id串
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 专家表格数据
      expertList: [],
      //专家状态字典
      statusOptions: [],
      // 专业领域字典
      exportAreaOptions: [],
      //专家在专家库中的组别字典
      exertGroupTypes: [],
      //树形结构属性替换
      defaultProps: {
        children: "children",
        label: "dictLabel"
      },

      // 用户导入参数
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
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/expert/expert/importData"
      },

      // 专家列表查询参数
      queryParams: {
        attribute: undefined,
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        status: undefined,
        jobLevel: undefined
      }
    }
  },
  created() {
    //获取专家列表
    this.getList();
    //获取专家领域字典
    this.getDicts("sys_expert_area").then(response => {
      this.exportAreaOptions = response.data;
    });
    //获取专家在专家库中的组别字典
    this.getDicts("expert_group").then(response => {
      this.exertGroupTypes = this.expertFormat2Tree(response.data)
    });
    //获取专家的个人状态字典
    this.getDicts("expert_status").then(response => {
      this.statusOptions = response.data
    });
  },
  activated() {
    this.getList()
  },
  methods: {
    /* **********************获取以及处理数据***********************/
    /** 查询专家列表 */
    getList() {
      this.loading = true;
      listExpert(this.queryParams).then(response => {
        this.expertList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 专业领域字典翻译
    exportAreaFormat(row) {
      if (row.exportArea) {
        const exportAreaArr = row.exportArea.split(',').map(item => {
          return this.selectDictLabel(this.exportAreaOptions, item)
        })
        return exportAreaArr.join()
      }
    },
    //专家在专家库组别字典转为树结构
    expertFormat2Tree(dataFormat) {
      const newDataTree = [
        {
          dictLabel: '专家库',
          children: dataFormat
        }
      ]
      return newDataTree
    },

    /* **************************交互操作*****************************/
    //处理选中树节点的事件
    handleNodeClick(data) {
      this.queryParams.attribute = data.dictValue
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    //开关专家状态
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.name + '"用户吗?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return changeExpertStatus(row.id, row.status);
      }).then(() => {
        this.msgSuccess(text + "成功");
      }).catch(function () {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      const path = "/expert/expert/addExpert"
      this.$router.push({
        "path": path
      })
    },
    /** 详情按钮操作 */
    handleDetail(row) {
      const path = "/expert/expert/expertDetail"
      const id = row.id
      this.$router.push({
        "path": path,
        "query": {
          "id": id
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const path = "/expert/expert/updateExpert"
      const id = row.id
      this.$router.push({
        "path": path,
        "query": {"id": id}
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delExpert(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有专家数据项?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportExpert(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () {
      });
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.download(response.msg);
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
      this.$alert(response.msg, "导入结果", {dangerouslyUseHTMLString: true});
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  padding: 20px 30px 50px 30px;

  .header {
    width: 100%;
    margin-bottom: 20px;
  }

  .main {
    width: 100%;
    display: flex;

    .leftBox {
      width: 15%;
      display: flex;
    }

    .rightBox {
      width: 85%;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
