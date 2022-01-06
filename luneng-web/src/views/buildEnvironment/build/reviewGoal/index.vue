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
        <el-form-item label="责任单位" prop="enterUnit">
          <el-input
            v-model="queryParams.enterUnit"
            placeholder="请输入责任单位"
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
            min-width="230"
            label="责任单位"
            align="center"
            prop="enterUnit"
            />
          <el-table-column
            min-width="120"
            label="计划取得认证时间"
            align="center"
            prop="attestationTime"
            >
<!--            <template slot-scope="scope">-->
<!--              <span>{{ parseTime(scope.row.attestationTime, '{y}-{m}') }}</span>-->
<!--            </template>-->
          </el-table-column>
          <el-table-column
            min-width="120"
            label="计划开始时间"
            align="center"
            prop="planStartDate"
            >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.planStartDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="120"
            label="计划竣工时间"
            align="center"
            prop="planEndDate"
            >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.planEndDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="110"
            label="预评估报告"
            align="center"
            fixed="right"
            prop="beforehandEvaluationFile">
            <template slot-scope="scope">
              <span v-if="!scope.row.beforehandEvaluationFile">暂未上传</span>
              <el-button
                v-if="scope.row.beforehandEvaluationFile"
                type="text"
                @click="queryFile(2, scope.row)"
                v-hasPermi="['build:buildInfo:checkFile']"
              >查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            label="成本分析报告"
            align="center"
            fixed="right"
            prop="costAnalysisFile">
            <template slot-scope="scope">
              <span v-if="!scope.row.costAnalysisFile">暂未上传</span>
              <el-button
                v-if="scope.row.costAnalysisFile"
                type="text"
                @click="queryFile(3, scope.row)"
                v-hasPermi="['build:buildInfo:checkFile']"
              >查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            label="绿建认证目标建议书"
            align="center"
            fixed="right"
            prop="targetSuggestionsFile">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.approvalStatus === 3"
                type="text"
                @click="auditFile(scope.row)"
                v-hasPermi="['build:buildInfo:audit']"
              >去审核
              </el-button>
              <el-button
                v-if="scope.row.approvalStatus === 4 || scope.row.approvalStatus === 5"
                type="text"
                @click="queryTargetBook(scope.row)"
                v-hasPermi="['build:buildInfo:checkFile']"
              >查看
              </el-button>
              <el-button
                v-if="scope.row.approvalStatus === 4"
                type="text"
                style="color: red"
                v-hasPermi="['build:buildInfo:reject']"
                @click="rejectTargetBook(scope.row)">退回
              </el-button>
              <el-button
                v-if="scope.row.approvalStatus === 4 && !scope.row.targetSuggestionsFile"
                type="text"
                @click="remindSignFile(scope.row)"
                v-hasPermi="['build:buildInfo:operation']"
              >提醒上传签字版扫描件
              </el-button>
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
    <el-dialog
      :visible.sync="open"
      width="600px"
      append-to-body
      :show-close="false"
      :close-on-click-modal="false">
      <div class="dialog-center">
        <el-form ref="opinionForm" :model="opinionForm" :rules="opinionRules" label-width="96px">
          <el-form-item label="审批意见" prop="remark">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入该审批的流转意见"
              maxlength="200"
              show-word-limit
              v-model="opinionForm.remark"
              style="width: 100%; margin-bottom: 10px">
            </el-input>
          </el-form-item>
          <el-form-item label="附件" prop="filePath">
            <upload v-model="opinionForm.filePath" :limit="100"/>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button style="width: 100px" type="primary" @click="submitForm">确 定</el-button>
        <el-button style="width: 100px"  @click="cancelClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getBuildInfo, listBuildInfo, operation} from "@/api/build/buildInfo";

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
        enterUnit: '',
        level: '',
        approvalStatus: JSON.stringify([3, 4, 5])
      },
      //绿建等级字典
      levelOptions: [],
      //审核状态字典
      approvalStatusOptions: [],
      //绿建项目列表
      greenBuildProList: [],
      open: false,
      //审批弹窗
      opinionForm: {
        infoId: null,
        operation: null,
        remark: '',
        filePath: ''
      },
      opinionRules: {
        remark: [
          {required: true, message: "审批意见不能为空", trigger: "blur", pattern: '[^ \x22]+'}
        ]
      },
      id: null
    }
  },
  created() {
    //获取接口数据
    this.getList()
    //获取字典数据
    this.getDicts("national_standard_level").then(response => {
      this.levelOptions = response.data;
    });
    this.getDicts("build_approval_status").then(response => {
      this.approvalStatusOptions = response.data;
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
      this.queryParams.projectName = ''
      this.queryParams.enterUnit = ''
      this.queryParams.level = ''
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
          proDetailFlag: '3',
          tabActiveName: '2'
        }
      })
    },
    //查看文件
    queryFile(fileType, row) {
      const id = row.id
      const path = '/buildEnvironment/build/reviewGoal/fileDetail'
      this.$router.push({
        'path': path,
        'query': {
          id,
          fileType,
          fileDetailPath: '2'
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
          detailFlag: '0'
        }
      })
    },
    //审核文件
    auditFile(row) {
      const id = row.id
      const path = '/buildEnvironment/build/reviewGoal/auditFile'
      this.$router.push({
        'path': path,
        'query': {
          id,
          detailFlag: '1'
        }
      })
    },
    //退回目标书
    rejectTargetBook(row) {
      this.open = true
      this.id = row.id
    },
    submitForm() {
      getBuildInfo(this.id).then(({data}) => {
        if (data.approvalStatus === 3) {
          this.msgInfo('该项目正在审核中')
        } else if (data.approvalStatus === 4){
          this.submitFormInfo()
        } else if (data.approvalStatus === 5) {
          this.msgInfo('该项目已退回')
        } else {
          this.msgInfo('该项目还没编制或正在编制中')
        }
      })
    },
    //提交审批信息
    submitFormInfo() {
      this.$refs["opinionForm"].validate(valid => {
        if (valid) {
          this.opinionForm.infoId = this.id
          this.opinionForm.operation = 3
          operation(this.opinionForm).then(()=>{
            this.cancelClose()
            this.msgSuccess("退回成功");
            this.getList()
          })
        }
      })
    },
    cancelClose() {
      this.open = false
      this.$refs["opinionForm"].resetFields();
    },
    //提醒上传签字版
    remindSignFile(row) {
      getBuildInfo(row.id).then(({data}) => {
        if (data.finish === 0) {
          operation({
            infoId: row.id,
            operation: 4
          }).then(() => {
            this.msgSuccess('已提醒对方上传签字版')
          })
        } else {
          this.msgSuccess('当前项目已归档，不可操作')
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
