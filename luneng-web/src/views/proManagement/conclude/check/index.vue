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
      <el-form-item label="研究领域" prop="researchField">
        <el-select
          v-model="queryParams.researchField"
          placeholder="请选择研究领域"
          clearable >
          <el-option
            v-for="researchField in researchFieldOptions"
            :key="researchField.dictValue"
            :label="researchField.dictLabel"
            :value="researchField.dictValue"/>
        </el-select>
      </el-form-item>
      <el-form-item label="年度" prop="curYear">
        <el-date-picker
          v-model="curYear"
          type="year"
          :clearable="false"
          placeholder="请选择申报年度">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search"  @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh"  @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table ref="table" v-loading="loading" :data="resultList">
      <el-table-column
        min-width="55"
        label="序号"
        align="center"
        type="index">
        <template slot-scope="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="230"
        label="项目名称"
        align="center"
        prop="projectName">
        <template slot-scope="scope">
          <div :class="projectNameStyle(scope.row)" @click="handleApprovalDetail(scope.row)">
            <span>{{ scope.row.projectName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="120" label="技术领域" align="center" prop="researchField" :formatter="researchFieldFormat"/>
      <el-table-column min-width="230" label="主要承担单位" align="center" prop="undertakeUnit" />
      <el-table-column min-width="90" label="年度" align="center" prop="approvalTime" :formatter="dateFormat"/>
      <el-table-column min-width="120" label="结题状态" align="center" prop="concludeStatus" >
        <template slot-scope="scope">
          <div :class="projectNameStyle(scope.row) + ' no-cursor-point'">
            <span>{{ selectDictLabel(statusOptions, scope.row.concludeStatus) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="历史版本" align="center" class-name="small-padding fixed-width" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.checkFilePath"
            type="text"
            v-hasPermi="['conclude:researchResult:uploadCheckFile']"
            @click="handleFilesHis(scope.row)"
          >查看历史版本
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
    <!-- 历史版本 -->
    <el-dialog
      title="历史文件"
      :visible.sync="filesHisOpen"
      width="800px"
      append-to-body :close-on-click-modal="false">
      <el-table ref="table" :data="biddingFilesHisList" height="500px">
        <el-table-column label="文件">
          <template slot-scope="scope">
            <div style="display: inline-block;">
              <upload :value="scope.row.hisFilePaths" :edit="false" hint=""/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="uploadBy" label="上传人"/>
        <el-table-column prop="uploadTime" label="上传时间"/>
      </el-table>
      <pagination
        v-show="historyTotal > 0"
        :total="historyTotal"
        :page.sync="historyQueryParams.pageNum"
        :limit.sync="historyQueryParams.pageSize"
        @pagination="getBiddingFileHisList"
      />
    </el-dialog>
  </div>
</template>

<script>
  import {checkList, operation} from "@/api/conclude/result"
  import {saveBiddingFilesHis, listBiddingFilesHis} from "@/api/pro/proBiddingFilesHis"
  import {updateProApprovalInfo} from "@/api/pro/proApprovalInfo"

  export default {
    data() {
      return {
        // 遮罩层
        loading: true,
        // 总条数
        total: 0,
        // 研究成果列表
        resultList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 状态字典
        statusOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          curYear: undefined,
          projectName: undefined,
          researchField: undefined
        },
        // 申报年限
        curYear: new Date(),
        // 统计数量
        statisticalNum: {},
        researchFieldOptions: [],
        checkForm: {},
        //上传文件相关配置
        pdfLimit: 1,
        lookOpen: false,
        lookForm: {},
        oldCheckFilePath: undefined,
        biddingFilesHis: {},
        biddingFilesHisList: [],
        filesHisOpen: false,
        historyQueryParams: {
          pageNum: 1,
          pageSize: 10,
          infoId: undefined,
          fileType: 11
        },
        historyTotal: 0
      };
    },
    activated() {
      this.getList();
    },
    computed: {
      projectNameStyle() {
        return (row) => {
          if (row.setupStatus === 0) {
            return 'project-name-all-grey'
          } else {
            if (row.concludeStatus === '4') {
              return 'project-name-all-red'
            } else if (row.concludeStatus === '3') {
              return 'project-name-all'
            } else {
              return 'project-name-all-hover'
            }
          }
        }
      }
    },
    created() {
      this.getList();
      this.getDicts("conclude_status").then(response => {
        this.statusOptions = response.data;
      });
      this.getDicts("project_storage_area").then(response => {
        this.researchFieldOptions = response.data;
      })
    },
    methods: {
      handleApprovalDetail(row) {
        const path = '/proManagement/proImplement/proEstablish/proMainTask'
        this.$router.push({
          'path': path,
          'query': {
            "id": row.id,
            "proDetailFlag": '10',
            tabActiveName: '10'
          }
        })
      },
      dateFormat(row) {
        return this.parseTime(row.approvalTime, "{y}")
      },
      submitCheckForm() {
        if(!this.checkForm.checkFilePath){
          this.msgError("请选择需要上传的文件");
          return;
        }
        if (this.oldCheckFilePath) {
          // 记录历史文件
          this.biddingFilesHis.infoId = this.checkForm.id;
          this.biddingFilesHis.hisFilePaths = this.oldCheckFilePath;
          this.biddingFilesHis.fileType = 11;
          this.biddingFilesHis.uploadBy = this.checkForm.checkFileCreateBy;
          this.biddingFilesHis.uploadTime = this.checkForm.checkFileCreateTime;
          console.log(this.biddingFilesHis);
          saveBiddingFilesHis(this.biddingFilesHis).then(res => {

          })
        }
        this.checkForm.checkTime = this.parseTime(new Date(), "{y}-{m}-{d} {h}:{i}:{s}");
        this.checkForm.checkFileCreateBy = this.$store.getters.name;
        this.checkForm.checkFileCreateTime = this.parseTime(new Date(), "{y}-{m}-{d} {h}:{i}:{s}");
        updateProApprovalInfo(this.checkForm).then(() => {
          this.open = false;
          this.getList();
          this.msgSuccess("上传成功！");
        })
      },
      cancelUploadCheckForm() {
        this.open = false;
      },
      /** 查询项目储备申报列表 */
      getList() {
        this.loading = true;
        this.queryParams.curYear = this.curYear.getFullYear();
        checkList(this.queryParams).then(response => {
          this.resultList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },

      researchFieldFormat(row) {
        return this.selectDictLabel(this.researchFieldOptions, row.researchField);
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.curYear = new Date();
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 详情按钮操作 */
      handleDetail(row) {
        this.lookForm.checkFilePath = '';
        this.lookOpen = true;
        this.lookForm.checkFilePath = row.checkFilePath;
      },
      handleFilesHis(row) {
        this.filesHisOpen = true;
        this.historyQueryParams.infoId = row.id;
        this.getBiddingFileHisList();
      },
      getBiddingFileHisList() {
        listBiddingFilesHis(this.historyQueryParams).then(res => {
          console.log(res);
          this.biddingFilesHisList = res.rows;
          this.historyTotal = res.total;
        })
      }
    }
  };
</script>
