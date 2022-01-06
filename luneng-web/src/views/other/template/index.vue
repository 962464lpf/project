<template>
  <div class="app-container">
    <div class="header">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true">
        <el-form-item label="业务模块" prop="businessModelName">
          <el-input
            v-model="queryParams.businessModelName"
            placeholder="请输入业务模块名"
            clearable
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="业务流程" prop="businessFlowName">
          <el-input
            v-model="queryParams.businessFlowName"
            placeholder="请输入业务流程名"
            clearable
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="模板文件" prop="fileName">
          <el-input
            v-model="queryParams.fileName"
            placeholder="请输入模板文件名"
            clearable
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
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
              v-hasPermi="['template:templateInfo:add']"
              @click="handleAdd">新建
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['template:templateInfo:remove']">删除
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          :data="templateDownloadList">
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
            min-width="230"
            label="业务模块"
            align="center"
            prop="businessModelName">
          </el-table-column>
          <el-table-column
            min-width="230"
            label="业务流程"
            align="center"
            prop="businessFlowName"/>
          <el-table-column
            min-width="230"
            label="模板文件名称"
            align="center"
            prop="fileName">
          </el-table-column>
          <el-table-column
            width="160"
            label="操作"
            fixed="right"
            align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['template:templateInfo:edit']">更新
              </el-button>
              <el-button
                type="text"
                @click="handleDownload(scope.row)"
                v-hasPermi="['template:templateInfo:download']">下载
              </el-button>
              <el-button
                type="text"
                @click="handleDelete(scope.row)"
                v-hasPermi="['template:templateInfo:remove']">删除
              </el-button>
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
    <el-dialog
      :visible.sync="open2"
      :title="title2"
      width="600px"
      append-to-body
      :show-close="false"
      :close-on-click-modal="false">
      <div>
        <el-form ref="addNewForm" :model="addNewForm" :rules="addNewRules" label-width="140px">
          <el-form-item label="业务模块" prop="businessModelId">
            <el-row :gutter="25">
              <el-col :span="19">
                <el-select
                  v-model="addNewForm.businessModelId"
                  @change="handleSelModel"
                  filterable
                  allow-create
                  placeholder="请输入/选择业务模块"
                  style="width: 100%">
                  <el-option
                    v-for="dict in businessModelOptions"
                    :key="dict.id"
                    :label="dict.name"
                    :value="dict.id">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="业务流程" prop="businessFlowId">
            <el-row :gutter="25">
              <el-col :span="19">
                <el-select
                  :disabled="showBusinessFlow"
                  v-model="addNewForm.businessFlowId"
                  @change="handleSelFlow"
                  filterable
                  allow-create
                  placeholder="请输入/选择业务流程"
                  style="width: 100%">
                  <el-option
                    v-for="dict in businessFlowOptions"
                    :key="dict.id"
                    :label="dict.name"
                    :value="dict.id">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="模块文件名称" prop="fileName">
            <el-row :gutter="25">
              <el-col :span="19">
                <el-input
                  v-model="addNewForm.fileName"
                  placeholder="请输入模块文件名称"
                  clearable
                  style="width: 100%"
                />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="模板文件" prop="filePath">
            <el-row :gutter="25">
              <el-col :span="19">
                <upload v-model="addNewForm.filePath"/>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <div slot="footer" style="text-align: center">
          <el-button style="width: 100px" type="primary" @click="submitForm">确 定</el-button>
          <el-button style="width: 100px"  @click="cancelClose">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {
  addTemplateInfo,
  getTemplateInfo,
  listTemplateInfo,
  removeTemplateInfo,
  updateTemplateInfo
} from "@/api/template/templateInfo";
import {addTemplateType, listTemplateType} from "@/api/template/templateType";

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
        businessModelName: '',
        businessFlowName: '',
        fileName: ''
      },
      //绿建项目列表
      templateDownloadList: [],
      open2: false,
      title2: '新增模板',
      addNewForm: {
        id: null,
        businessModelId: null,
        businessFlowId: null,
        fileName: '',
        filePath: ''
      },
      addNewRules: {
        businessModelId: [
          { required: true, message: "业务模块不能为空", trigger: "blur" }
        ],
        businessFlowId: [
          { required: true, message: "业务流程不能为空", trigger: "blur" }
        ],
        fileName: [
          { required: true, message: "模块文件名称不能为空", trigger: "blur" },
          { max: 30, message: "模块文件名称最多30字符", trigger: "blur" }
        ],
        filePath: [
          { required: true, message: "模板文件不能为空", trigger: "blur" }
        ]
      },
      businessModelForm: {
        type: 1,
        parentId: 0
      },
      businessModelNameForm: {
        name: '',
        type: 1,
        parentId: 0
      },
      businessModelOptions: [],
      newBusinessModelId: null,
      businessFlowForm: {
        type: 2,
        parentId: 0
      },
      businessFlowNameForm: {
        name: '',
        type: 2,
        parentId: 0
      },
      businessFlowOptions: [],
      newBusinessFlowId: null,
      showBusinessFlow: true
    }
  },
  created() {
    //获取接口数据
    this.getList()
  },
  methods: {
    /*********************** 数据获取及处理 ***********************/
    /** 获取申报待评审列表 */
    getList() {
      this.loading = true;
      listTemplateInfo(this.queryParams).then(({rows, total}) => {
        this.templateDownloadList = rows;
        this.total = total;
        this.loading = false;
      });
    },
    /*********************** 交互操作 ***********************/
    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.$refs["queryForm"].resetFields();
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    //添加
    handleAdd() {
      listTemplateType(this.businessModelForm).then(({data}) => {
        this.businessModelOptions = data;
        this.open2 = true
        this.title2 = '新增模板'
      });
    },
    //处理业务模块选择
    handleSelModel(value) {
      this.addNewForm.businessFlowId = null
      if (typeof(value) === 'string') {
        const strLen = [...value].length
        if (strLen <= 10) {
          this.businessModelNameForm.name = value
          addTemplateType(this.businessModelNameForm).then(({data}) => {
            this.businessModelOptions.push(data)
            this.getBusinessFlowOptions(data.id)
            this.newBusinessModelId = data.id
          })
        } else {
          this.msgError('输入新增模块名最大长度为10字符')
          this.addNewForm.businessModelId = null
          this.newBusinessModelId = null
        }
      } else {
        this.newBusinessModelId = this.addNewForm.businessModelId
        this.getBusinessFlowOptions(value)
      }
    },
    //获取业务流程数据
    getBusinessFlowOptions(id) {
      this.businessFlowForm.parentId = id
      listTemplateType(this.businessFlowForm).then(({data}) => {
        this.businessFlowOptions = data;
        this.showBusinessFlow = false
      });
    },
    //处理业务流程选择
    handleSelFlow(value) {
      if (typeof(value) === 'string') {
        const strLen = [...value].length
        if (strLen <= 10) {
          this.businessFlowNameForm.parentId = this.businessFlowForm.parentId
          this.businessFlowNameForm.name = value
          addTemplateType(this.businessFlowNameForm).then(({data}) => {
            this.businessFlowOptions.push(data)
            this.newBusinessFlowId = data.id
          })
        } else {
          this.msgError('输入新增业务名最大长度为10字符')
          this.newBusinessFlowId = null
          this.addNewForm.businessFlowId = null
        }
      } else {
        this.newBusinessFlowId = this.addNewForm.businessFlowId
      }
    },
    //处理更新
    handleUpdate(row) {
      getTemplateInfo(row.id).then((res) => {
        this.addNewForm = res.data;
        this.showBusinessFlow = true
        listTemplateType(this.businessModelForm).then((res1) => {
          this.businessModelOptions = res1.data;
          this.open2 = true
          this.title2 = '修改模板'
          this.getBusinessFlowOptions(res.data.businessModelId)
        })
      })
    },
    //提交
    submitForm() {
      this.$refs["addNewForm"].validate(valid => {
        if (valid) {
          if (this.addNewForm.id) { //修改
            this.addNewForm.businessModelId = this.newBusinessModelId
            this.addNewForm.businessFlowId = this.newBusinessFlowId
            updateTemplateInfo(this.addNewForm).then(() => {
              this.cancelClose()
              this.msgSuccess("修改成功");
              this.getList()
            })
          } else { //新增
            this.addNewForm.businessModelId = this.newBusinessModelId
            this.addNewForm.businessFlowId = this.newBusinessFlowId
            addTemplateInfo(this.addNewForm).then(() => {
              this.cancelClose()
              this.msgSuccess("新增成功");
              this.getList()
            })
          }
        }
      })
    },
    //取消
    cancelClose() {
      this.open2 = false
      this.showBusinessFlow = true
      this.addNewForm.id = null
      this.$refs["addNewForm"].resetFields();
      this.addNewForm.businessModelId = null
      this.addNewForm.businessFlowId = null
      this.addNewForm.fileName = ''
      this.addNewForm.filePath = ''
      this.newBusinessModelId = null
      this.newBusinessFlowId = null
    },
    //处理下载
    handleDownload(row) {
      let filePath = JSON.parse(row.filePath);
      let path = filePath[0];
      let fileName = '';
      let name = '';
      if (path) {
        name = path.name;
        if (path.response && path.response.fileName) {
          fileName = path.response.fileName.replace('/dev-api/', '/');
        }
        location.href = process.env.VUE_APP_BASE_API + '/common/download/resource?name=' + name + '&&fileName=' + fileName;
      }
    },
    //删除
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除所选择的模板文件?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return removeTemplateInfo(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () {
      });
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

      .project-name {
        font-size: 14px;
        cursor: pointer;
      }
    }

    .main-footer {
      width: 420px;
      margin-top: 20px;
    }
  }
}
</style>
