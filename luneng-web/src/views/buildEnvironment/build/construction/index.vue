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
              <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.technicalEquipmentFile"
                           @click="uploadBtnsClick(9, scope.row, $event, '绿建材料设备技术规格书')"/>
            </template>
          </el-table-column>
          <el-table-column
            min-width="140"
            label="批复意见"
            align="center"
            prop="replyFile">
            <template slot-scope="scope">
              <upload-btns :edit="scope.row.finish === 0" :filePaths="scope.row.replyFile"
                           @click="uploadBtnsClick(10, scope.row, $event, '批复意见')"/>
            </template>
          </el-table-column>
          <el-table-column
            min-width="150"
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
            min-width="150"
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
  import {getBuildInfo, listBuildInfo, updateBuildInfo} from "@/api/build/buildInfo";

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
          level: '',
          approvalStatus: JSON.stringify([4])
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
            proDetailFlag: '5',
            tabActiveName: '4'
          }
        })
      },
      //上传更新按钮
      uploadBtnsClick(fileType, row, event, title) {
        if (event === "view") {
          const id = row.id
          const path = '/buildEnvironment/build/construction/fileDetail'
          this.$router.push({
            'path': path,
            'query': {
              id,
              fileType,
              fileDetailPath: '4'
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
            const id = row.id
            const path = '/buildEnvironment/build/construction/editEvaluate'
            this.$router.push({
              'path': path,
              'query': {
                id,
                menuFlag: '1'
              }
            })
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
            this.$confirm(`是否确认所选择的项目周报${row.weeklyNewspaper === 0 ? '关闭' : '开启'}?`, "系统提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              return updateBuildInfo(row)
            }).then(() => {
              this.getList();
              this.msgSuccess("操作成功");
            }).catch(() => {
              this.getList();
            });
          } else {
            this.msgError('当前项目已归档，不可操作')
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
