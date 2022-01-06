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
      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          :data="greenBuildProList">
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
            label="设计单位"
            align="center"
            prop="designUnit"
            />
          <el-table-column
            min-width="120"
            label="绿建星级"
            align="center"
            :formatter="levelFormat"
            prop="level"
            />
          <el-table-column
            min-width="150"
            label="计划取得认证时间"
            align="center"
            prop="attestationTime"
            >
<!--            <template slot-scope="scope">-->
<!--              <span>{{ parseTime(scope.row.attestationTime, '{y}-{m}') }}</span>-->
<!--            </template>-->
          </el-table-column>
          <el-table-column
            width="130"
            label="绿建工作组会签表"
            align="center"
            fixed="right"
            prop="signFile">
            <template slot-scope="scope">
              <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.signFile" @click="uploadBtnsClick(1, scope.row, $event, '绿建工作组会签表')" />
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            label="预评估报告"
            align="center"
            fixed="right"
            prop="beforehandEvaluationFile">
            <template slot-scope="scope">
              <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.beforehandEvaluationFile" @click="uploadBtnsClick(2, scope.row, $event, '预评估报告')" />
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            label="成本分析报告"
            align="center"
            fixed="right"
            prop="costAnalysisFile">
            <template slot-scope="scope">
              <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.costAnalysisFile" @click="uploadBtnsClick(3, scope.row, $event, '成本分析报告')" />
            </template>
          </el-table-column>
          <el-table-column
            width="160"
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
                    v-if="scope.row.approvalStatus === 4 && !scope.row.targetSuggestionsFile"
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
            width="100"
            label="审核状态"
            align="center"
            prop="approvalStatus">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row) + ' no-cursor-point'">
                <span>{{ selectDictLabel(approvalStatusOptions, scope.row.approvalStatus)}}</span>
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
    <upload-file-dialog :id="currProId" :type="uploadFileType" :title="title" :open.sync="open" @success="getList"/>
  </div>
</template>

<script>
import uploadBtns from '../../components/uploadBtns';
import uploadFileDialog from '../components/uploadFileDialog'
import {deleteAdviseInfo, getBuildInfo, listBuildInfo, operation} from "@/api/build/buildInfo";

export default {
  name: "index",
  data() {
    return {
      // 加载等待线
      loading: false,
      // 总条数
      total: 0,
      // 搜索框查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: 1,
        projectName: '',
        level: ''
      },
      //绿建等级字典
      levelOptions: [],
      // 绿建审核标准字典
      approvalStatusOptions: [],
      //绿建项目列表
      greenBuildProList: [],
      currProId: null,
      uploadFileType: null,
      title: '',
      open: false
    }
  },
  created() {
    //获取接口数据
    this.getList()
    //获取字典数据
    this.getDicts("build_approval_status").then(response => {
      this.approvalStatusOptions = response.data;
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
  components: {
    uploadBtns,
    uploadFileDialog
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
      this.queryParams.projectName = '';
      this.queryParams.level = '';
      this.handleQuery();
    },
    //查看项目详情
    navProDetail(row) {
      const id = row.id
      const path = '/buildEnvironment/build/buildProject/buildProDetail'
      this.$router.push({
        'path': path,
        'query': {
          id,
          proDetailFlag: '2',
          tabActiveName: '2'
        }
      })
    },
    //上传更新按钮
    uploadBtnsClick(fileType, row, event, title) {
      if (event === "view") {
        const id = row.id
        const path = '/buildEnvironment/build/confirmGoal/fileDetail'
        this.$router.push({
          'path': path,
          'query': {
            id,
            fileType,
            fileDetailPath: '1'
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
                id
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
              id
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
          otherDetailFlag: '1'
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
