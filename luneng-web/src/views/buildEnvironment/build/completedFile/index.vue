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
            style="width: 220px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="绿建星级" prop="level">
          <el-select
            v-model="queryParams.level"
            laceholder="请选择绿建星级"
            clearable
            style="width: 220px"
            @keyup.enter.native="handleQuery">
            <el-option
              v-for="item in levelOptions"
              :key="item.dictValue"
              :value="item.dictValue"
              :label="item.dictLabel"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="年度" prop="curYearTem">
          <el-date-picker
            v-model="curYearTem"
            :clearable="false"
            style="width: 200px"
            type="year"
            placeholder="请选择年度">
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
              :disabled="multiple"
              @click="handleArchive"
              v-hasPermi="['build:buildInfo:end']">归档
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-hasPermi="['build:buildInfo:upload']"
              type="text"
              style="color: red; cursor: default">
              有星级证书请上传证书，没有请上传其他作证材料
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="main-center">
        <el-table
          ref="table"
          @selection-change="handleSelectionChange"
          v-loading="loading"
          :data="greenBuildProList">
          <el-table-column
            type="selection"
            min-width="40"
            v-show="projectEnd"
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
            prop="enterUnit"
            >
          </el-table-column>
          <el-table-column
            min-width="160"
            label="实际开工时间"
            align="center"
            prop="startDate">
            <template slot-scope="scope">
              <div @dblclick="getStartDate(scope.row)">
                <div v-if="scope.row.showStartDate && scope.row.startDate">
                  {{scope.row.startDate}}
                </div>
                <div v-else>
                  <el-date-picker
                    v-hasPermi="['build:buildInfo:updateTime']"
                    v-model="scope.row.startDate"
                    :picker-options="timePickerOptions1(scope.row)"
                    style="width: 140px"
                    type="date"
                    value-format="yyyy-MM-dd"
                    @change="updateDate(scope.row)"
                    placeholder="选择日期">
                  </el-date-picker>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="160"
            label="实际竣工时间"
            align="center"
            prop="endDate">
            <template slot-scope="scope">
              <div @dblclick="getEndDate(scope.row)">
                <div v-if="scope.row.showEndDate && scope.row.endDate">
                  {{scope.row.endDate}}
                </div>
                <div v-else>
                  <el-date-picker
                    v-hasPermi="['build:buildInfo:updateTime']"
                    v-model="scope.row.endDate"
                    :picker-options="timePickerOptions2(scope.row)"
                    style="width: 140px"
                    type="date"
                    value-format="yyyy-MM-dd"
                    @change="updateDate(scope.row)"
                    placeholder="选择日期">
                  </el-date-picker>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="160"
            label="获证时间"
            align="center"
            prop="authenticationDate">
            <template slot-scope="scope">
              <div @dblclick="getAuthenticationDate(scope.row)">
                <div v-if="scope.row.showAuthenticationDate && scope.row.authenticationDate">
                  {{scope.row.authenticationDate}}
                </div>
                <div v-else>
                  <el-date-picker
                    v-hasPermi="['build:buildInfo:updateTime']"
                    v-model="scope.row.authenticationDate"
                    style="width: 140px"
                    type="date"
                    value-format="yyyy-MM-dd"
                    @change="updateDate(scope.row)"
                    placeholder="选择日期">
                  </el-date-picker>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="120"
            label="绿建星级"
            align="center"
            :formatter="levelFormat"
            prop="level"
            />
          <el-table-column
            width="130"
            label="星级认证证书"
            align="center"
            fixed="right"
            prop="attestationFile">
            <template slot-scope="scope">
              <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.attestationFile" @click="uploadBtnsClick(13, scope.row, $event, '星级认证证书')" />
            </template>
          </el-table-column>
          <el-table-column
            width="130"
            label="归档"
            align="center"
            fixed="right"
            prop="finish"
            v-if="projectEnd">
            <template slot-scope="scope">
              <el-switch
                v-hasPermi="['build:buildInfo:end']"
                v-model="scope.row.finish"
                :active-value="1"
                :inactive-value="0"
                @change="archiveBuildPro(scope.row)">
              </el-switch>
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
    <upload-file-dialog :id="currProId" :type="uploadFileType" :title="title" :open.sync="open" @success="getList"/>
    <!-- 权限 -->
    <div v-hasPermi="['build:buildInfo:end']" id="projectEnd"></div>
  </div>
</template>

<script>
import uploadBtns from '../../components/uploadBtns';
import uploadFileDialog from '../components/uploadFileDialog'
import {listBuildInfo, updateBuildInfo, operation, buildEnd, getBuildInfo} from "@/api/build/buildInfo";

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
      //当前年份
      curYearTem: new Date(),
      // 搜索框查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: 1,
        projectName: '',
        level: '',
        year: '',
        approvalStatus: JSON.stringify([4])
      },
      //绿建等级字典
      levelOptions: [],
      //绿建项目列表
      greenBuildProList: [],
      currProId: null,
      uploadFileType: null,
      title: '',
      open: false,
      projectEnd:false
    }
  },
  created() {
    //获取接口数据
    this.getList()
    //获取字典数据
    this.getDicts("national_standard_level").then(response => {
      this.levelOptions = response.data;
    });
  },
  activated() {
    //获取接口数据
    this.getList()
    //获取字典数据
    this.getDicts("national_standard_level").then(response => {
      this.levelOptions = response.data;
    });
  },
  mounted() {
    this.projectEnd = !!document.getElementById('projectEnd')
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
  components: {
    uploadBtns,
    uploadFileDialog
  },
  methods: {
    /*********************** 数据获取及处理 ***********************/
    /** 获取申报待评审列表 */
    getList() {
      this.loading = true;
      this.queryParams.year = this.parseTime(this.curYearTem, "{y}");
      listBuildInfo(this.queryParams).then(({rows, total}) => {
        if (rows && rows.length > 0) {
          rows.forEach(item => {
            item.showStartDate = !!item.startDate;
            item.showEndDate = !!item.endDate;
            item.showAuthenticationDate = !!item.authenticationDate;
          })
        }
        this.greenBuildProList = rows;
        this.total = total;
        this.loading = false;
      });
    },
    // 绿建星级字典翻译
    levelFormat(row) {
      return this.selectDictLabel(this.levelOptions, row.level);
    },

    /*********************** 交互操作 ***********************/
    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.curYearTem = new Date()
      this.queryParams.projectName = '';
      this.queryParams.level = '';
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    //日期选择限制
    timePickerOptions1(row) {
      if (row.endDate) {
        const endDate = new Date(row.endDate).getTime()
        return {
          disabledDate(date) {
            return date.getTime() >= endDate
          }
        }
      }
    },
    timePickerOptions2(row) {
      if (row.startDate) {
        const startDate = new Date(row.startDate).getTime()
        return {
          disabledDate(date) {
            return date.getTime() < startDate
          }
        }
      }
    },
    //查看项目详情
    navProDetail(row) {
      const id = row.id
      const path = '/buildEnvironment/build/buildProject/buildProDetail'
      this.$router.push({
        'path': path,
        'query': {
          id,
          proDetailFlag: '6',
          tabActiveName: '5'
        }
      })
    },
    //实际开工时间
    getStartDate(row) {
      if (row.finish === 0) {
        row.showStartDate = false
      } else {
        this.msgError('当前项目已归档，不可操作')
      }
    },
    // submitStartDate(row) {
    //   if (row.finish === 0) {
    //     updateBuildInfo({
    //       id: row.id,
    //       startDate: row.startDate
    //     }).then(() => {
    //       this.getList()
    //     })
    //   } else {
    //     this.msgError('当前项目已归档，不可操作')
    //   }
    // },
    //实际竣工时间
    getEndDate(row) {
      if (row.finish === 0) {
        row.showEndDate = false
      } else {
        this.msgError('当前项目已归档，不可操作')
      }
    },
    // submitEndDate(row) {
    //   if (row.finish === 0) {
    //     updateBuildInfo({
    //       id: row.id,
    //       endDate: row.endDate
    //     }).then(() => {
    //       this.getList()
    //     })
    //   } else {
    //     this.msgError('当前项目已归档，不可操作')
    //   }
    // },
    //获取证书时间
    getAuthenticationDate(row) {
      if (row.finish === 0) {
        row.showAuthenticationDate = false
      } else {
        this.msgError('当前项目已归档，不可操作')
      }
    },
    updateDate(row) {
      if (row.finish === 0) {
        updateBuildInfo(row).then(() => {
          this.getList()
        })
      } else {
        this.msgError('当前项目已归档，不可操作')
      }
    },
    //上传更新按钮
    uploadBtnsClick(fileType, row, event, title) {
      if (event === "view") {
        const id = row.id
        const path = '/buildEnvironment/build/completedFile/fileDetail'
        this.$router.push({
          'path': path,
          'query': {
            id,
            fileType,
            fileDetailPath: '5'
          }
        })
      } else {
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
      }
    },
    //归档
    archiveBuildPro(row) {
      this.$confirm(`是否对所选择的项目${row.finish === 0 ? '取消归档' : '进行归档'}?`, "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return operation({
          infoId: row.id,
          operation: 5
        })
      }).then(() => {
        this.getList();
        this.msgSuccess("操作成功");
      }).catch(() => {
        this.getList();
      });
    },
    //批量归档
    handleArchive() {
      const ids = this.ids;
      this.$confirm(`是否对所选择的项目进行归档?`, "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return buildEnd(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("归档成功");
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
      padding-bottom: 5px;
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
