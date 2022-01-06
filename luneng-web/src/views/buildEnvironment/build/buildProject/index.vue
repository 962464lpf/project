<template>
  <div class="app-container">
    <div class="header">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true">
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="queryParams.projectName"
            placeholder="请输入项目名称"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="设计单位" prop="designUnit">
          <el-input
            v-model="queryParams.designUnit"
            placeholder="请输入设计单位"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="绿建星级" prop="level">
          <el-select
            v-model="queryParams.level"
            laceholder="请选择绿建星级"
            clearable
            style="width: 200px"
            @keyup.enter.native="handleQuery">
            <el-option
              v-for="item in levelOptions"
              :key="item.dictValue"
              :value="item.dictValue"
              :label="item.dictLabel"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="计划取得认证时间" prop="attestationTime">
          <el-date-picker
            v-model="queryParams.attestationTime"
            clearable
            style="width: 280px"
            type="month"
            value-format="yyyy-MM"
            placeholder="请选择计划取得认证时间">
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
              v-hasPermi="['build:buildInfo:add']"
              @click="handleAdd">录入项目
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-s-cooperation"
              :disabled="single"
              v-has-permi="['build:buildInfo:package']"
              @click="handlePackage">批量打包
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-download"
              @click="handleDownloadList"
              v-has-permi="['build:buildInfo:package']">打包列表
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          :data="greenBuildProList">
          <el-table-column
            min-width="40"
            type="selection"
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
            label="项目名称"
            align="center"
            prop="projectName">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row)" @click="navProDetail(scope.row)">
                <span>{{ scope.row.projectName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="230"
            label="责任单位"
            align="center"
            prop="enterUnit"/>
          <el-table-column
            min-width="140"
            label="国标认证"
            align="center"
            prop="personName"
            :formatter="levelFormat">
          </el-table-column>
          <el-table-column
            min-width="150"
            label="计划取得认证时间"
            align="center"
            prop="attestationTime">
          </el-table-column>
          <el-table-column
            min-width="140"
            label="证书获得时间"
            align="center"
            prop="authenticationDate">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.authenticationDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="其他认证"
            align="center"
            fixed="right"
            width="140">
            <template slot-scope="scope">
              <el-row
                v-for="(item, index) in handleCriterion(scope.row)"
                :key="index">
                <el-col>
                  <el-button
                    style="padding: 0;"
                    type="text"
                    @click="navDetailCriterion(scope.row)"
                    v-hasPermi="['build:buildInfo:otherAuthentication']">
                    {{ item }}
                  </el-button>
                </el-col>
              </el-row>
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
      <!--打包选择文件类型对话框-->
      <el-dialog title="下载" :visible.sync="packOpen" width="380px" append-to-body :close-on-click-modal="false">
        <el-form label-width="100px">
          <el-form-item label="文件类型">
            <el-select v-model="fileTypes" multiple placeholder="请选择">
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
          <el-button type="primary" @click="handlePackSubmit">确 定</el-button>
          <el-button @click="handlePackCancel">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 文件下载列表 -->
      <el-dialog :visible.sync="downOpen" width="800px" append-to-body :close-on-click-modal="false">
        <el-table :data="downFileList">
          <el-table-column label="文件名称" :formatter="fileNameFormat"/>
          <el-table-column label="打包时间" width="150" prop="createTime"/>
          <el-table-column label="打包人" width="80" prop="createByName"/>
          <el-table-column label="操作" width="100">
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
          :page.sync="downQueryParams.pageNum"
          :limit.sync="downQueryParams.pageSize"
          @pagination="downFileList"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>

import {delBuildInfo, listBuildInfo, createZip, getBuildInfo, removeOther} from "@/api/build/buildInfo";
import {listBuildFile, deleteFile} from "@/api/build/buildFile"

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
        type: 1,
        projectName: '',
        designUnit: '',
        level: '',
        attestationTime: ''
      },
      //绿建等级字典
      levelOptions: [],
      // 绿建标准字典
      criterionOptions: [],
      //绿建项目列表
      greenBuildProList: [],
      packOpen: false,
      fileTypes: [],
      options: [
        {key: 1, value: '确认目标'},
        {key: 2, value: '绿建评价认证'},
        {key: 3, value: '绿建施工配合'},
        {key: 4, value: '工作简报'},
        {key: 5, value: '项目周报'},
        {key: 6, value: '竣工资料'},
        {key: 7, value: '备案资料'},
        {key: 8, value: '运营与跟踪管理'}
      ],
      downOpen: false,
      zipTotal: 0,
      downQueryParams: {
        pageNum: 1,
        pageSize: 10,
        fileType: 24,
        history: 0
      },
      downFileList: []
    }
  },
  created() {
    //获取接口数据
    this.getList()
    //获取字典数据
    this.getDicts("build_criterion").then(response => {
      this.criterionOptions = response.data;
    });
    this.getDicts("national_standard_level").then(response => {
      this.levelOptions = response.data;
    });
  },
  computed: {
    userName() {
      return this.$store.state.user.name
    },
    projectNameStyle() {
      return (row) => {
        if (row.approvalStatus === 1 || row.approvalStatus === 2) {
          return 'project-name-all-hover'
        } else if (row.approvalStatus === 5) {
          return 'project-name-all-red'
        } else {
          return 'project-name-all'
        }
      }
    }
  },
  methods: {
    /*********************** 数据获取及处理 ***********************/
    /** 获取申报待评审列表 */
    getList() {
      this.loading = true;
      listBuildInfo(this.queryParams).then(({rows, total}) => {
        this.greenBuildProList = rows;
        this.total = total;
        this.loading = false;
      });
    },
    // 绿建标准字典翻译
    criterionFormat(row) {
      return this.selectDictLabel(this.criterionOptions, row.criterion);
    },
    // 绿建星级字典翻译
    levelFormat(row) {
      return this.selectDictLabel(this.levelOptions, row.level);
    },
    // 文件名称翻译
    fileNameFormat(row) {
      return row.projectName + "_" + this.parseTime(row.createTime, "{y}_{m}_{d}_{h}_{i}_{s}") + ".zip";
    },
    /*********************** 交互操作 ***********************/
    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.projectName = '';
      this.queryParams.designUnit = '';
      this.queryParams.level = '';
      this.queryParams.attestationTime = ''
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
      const path = '/buildEnvironment/build/buildProject/editProInfo'
      this.$router.push({
        'path': path
      })
    },
    //修改
    handleUpdate(row) {
      getBuildInfo(row.id).then(({data}) => {
        if (data.finish === 0) {
          const id = row.id
          const path = '/buildEnvironment/build/buildProject/editProInfo'
          this.$router.push({
            'path': path,
            'query': {
              id
            }
          })
        } else {
          this.msgError('当前项目已归档，不可操作')
        }
      })
    },
    //删除
    handleDelete(row) {
      getBuildInfo(row.id).then(({data}) => {
        if (data.finish === 0) {
          const ids = row.id;
          this.$confirm('是否确认删除所选择的绿色建筑项目?', "系统提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(function () {
            return delBuildInfo(ids);
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
    //文件类型对话框关闭
    handlePackCancel() {
      this.packOpen = false;
    },
    //打包
    handlePackage() {
      this.packOpen = true;
      this.fileTypes = [];
    },
    //打包提交
    handlePackSubmit() {
      if (this.fileTypes.length == 0) {
        this.msgError("请选择要下载的文件类型");
        return;
      }
      const id = this.ids[0];
      const params = {id: id, fileTypes: JSON.stringify(this.fileTypes)};
      createZip(params).then(res => {
        this.msgSuccess(res.msg);
        this.packOpen = false;
        this.fileTypes = [];
        this.ids = [];
        this.$refs.table.clearSelection();
      })
    },
    //下载列表
    handleDownloadList() {
      this.getBuildFile();
      this.downOpen = true;
      // listBuildFile(this.downQueryParams).then(res => {
      //   this.downFileList = res.rows;
      //   this.zipTotal = res.total;
      //   this.downOpen = true;
      // })
    },
    getBuildFile() {
      listBuildFile(this.downQueryParams).then(res => {
        this.downFileList = res.rows;
        this.zipTotal = res.total;
      })
    },
    //下载方法
    handleDownloadFile(row) {
      location.href = process.env.VUE_APP_BASE_API + '/common/download/resource?name=' + this.fileNameFormat(row) + '.zip&&fileName=' + row.filePath;
    },
    // 删除
    handleDeleteFile(row) {
      const ids = row.id;
      deleteFile(ids).then(res => {
        this.getBuildFile();
      })
    },
    //查看项目详情
    navProDetail(row) {
      const id = row.id
      const path = '/buildEnvironment/build/buildProject/buildProDetail'
      this.$router.push({
        'path': path,
        'query': {
          id,
          proDetailFlag: '1',
          tabActiveName: '1'
        }
      })
    },
    //跳转详情认证
    navDetailCriterion(row) {
      const id = row.id
      const path = '/buildEnvironment/build/buildProject/buildProDetail'
      this.$router.push({
        'path': path,
        'query': {
          id,
          proDetailFlag: '1',
          tabActiveName: '8'
        }
      })
    },
    //处理凭证
    handleCriterion(row) {
      let hasKey = {}
      let arr = []
      if (row.otherAuthentications.length > 0) {
        arr = row.otherAuthentications.reduce((criterion, item) => {
          hasKey[item.criterion] ? '' : hasKey[item.criterion] = true && criterion.push(this.selectDictLabel(this.criterionOptions, item.criterion))
          return criterion
        }, [])
        return arr
      } else {
        return ['添加']
      }
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
