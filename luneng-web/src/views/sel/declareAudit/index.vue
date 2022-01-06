<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="90px">
      <el-form-item label="申报奖项" prop="awardsType">
        <el-select v-model="queryParams.awardsType" placeholder="请选择奖项类别" clearable >
          <el-option
            v-for="dict in awardsTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产业类别" prop="industryType">
        <el-select v-model="queryParams.industryType" placeholder="请选择奖项类别" clearable >
          <el-option
            v-for="dict in industryTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申报单位" prop="declareUnit">
        <el-input
          v-model="queryParams.declareUnit"
          placeholder="请输入申报单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申报年度" prop="declareYear">
        <el-select v-model="queryParams.declareYear"
                   placeholder="请选择申报年度"
                   clearable
                   @visible-change="handleShowSelect">
          <el-option
            v-for="item in reviewYears"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search"  @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh"  @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-s-cooperation"
          @click="handleDownload"
          :disabled="multiple"
          v-hasPermi="['sel:selAudit:pack']"
        >批量打包
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-download"
          @click="handleOpen"
          v-hasPermi="['sel:selAudit:packList']"
        >打包列表
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          @click="handleExport"
          v-hasPermi="['sel:selAudit:export']"
        >导出Excel
        </el-button>
      </el-col>
      <el-col :span="20" style="line-height: 30px;font-size: 18px;color: #606266;">
        共{{statisticalNum.sumCount}}条，审核通过{{statisticalNum.agreeCount}}条，审核驳回{{statisticalNum.refusedCount}}条，审核拒绝{{statisticalNum.rejectedCount}}条，待审核{{statisticalNum.noApprovalCount}}条
      </el-col>
    </el-row>
    <el-table ref="auditTable" v-loading="loading" :data="selDeclareInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" min-width="40" align="center"/>
      <el-table-column
        label="序号"
        align="center"
        min-width="55"
        type="index">
        <template slot-scope="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="230" label="项目名称" align="center" prop="projectName">
        <template slot-scope="scope">
          <div :class="projectNameStyle(scope.row)" @click="handleDetail(scope.row)">
            <span>{{ scope.row.projectName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column min-width="140" label="申报奖项" align="center" prop="awardsType" >
        <template slot-scope="scope">
          {{ selectDictLabel(awardsTypeOptions, scope.row.awardsType) }}
        </template>
      </el-table-column>
      <el-table-column min-width="100" label="产业类别" align="center" prop="industryType" >
        <template slot-scope="scope">
          {{ selectDictLabel(industryTypeOptions, scope.row.industryType) }}
        </template>
      </el-table-column>
      <el-table-column min-width="230" label="申报单位" align="center" prop="declareUnit" />
      <el-table-column min-width="100" label="申报人" align="center" prop="createBy" />
      <el-table-column min-width="100" label="是否已读" align="center" prop="" fixed="right">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.auditReadStatus == 1" type="info">已读</el-tag>
          <el-tag v-if="scope.row.auditReadStatus == 0" type="success">未读</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="180" label="评审状态" align="center" prop="declareStatus" fixed="right">
        <template slot-scope="scope">
          <div :class="projectNameStyle(scope.row) + ' no-cursor-point'">
            {{ selectDictLabel(declareStatusOptions, scope.row.declareStatus) }}
          </div>
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


    <!-- 审批操作对话框 -->
    <el-dialog :visible.sync="opinionOpen" width="600px" append-to-body :close-on-click-modal="false">
      <el-form ref="opinionForm" :model="opinionForm" :rules="opinionRules" label-width="96px">
        <el-form-item label="变更说明" prop="auditIdea">
          <el-input v-model="opinionForm.auditIdea" type="textarea" placeholder="请输入变更说明" rows="4" maxlength="500"
                    show-word-limit/>
        </el-form-item>
        <el-form-item label="附件" prop="filePaths">
          <upload v-model="opinionForm.filePaths"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitOpinionForm">确 定</el-button>
        <el-button @click="opinionFormCancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 批量下载对话框 -->
    <el-dialog title="下载" :visible.sync="downOpen" width="380px" append-to-body :close-on-click-modal="false"
               :before-close="handleDownloadCancel">
      <el-form label-width="100px">
        <el-form-item label="文件类型">
          <el-select v-model="fileType" multiple placeholder="请选择">
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
        <el-button type="primary" @click="handleDownloadSubmit">确 定</el-button>
        <el-button @click="handleDownloadCancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 文件列表对话框 -->
    <el-dialog :visible.sync="zipFileOpen" width="800px" append-to-body :close-on-click-modal="false">
      <el-table :data="zipFileList">
        <el-table-column label="文件名" prop="fileName"/>
        <el-table-column label="打包时间" prop="createTime"/>
        <el-table-column label="打包人" prop="createBy"/>
        <el-table-column label="操作">
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
        :page.sync="zipQueryParams.pageNum"
        :limit.sync="zipQueryParams.pageSize"
        @pagination="getZipFileList"
      />
    </el-dialog>
  </div>
</template>

<script>
  import {
    listSelDeclareInfo,
    getSelDeclareInfo,
    auditSubmit,
    createDownZipFile,
    exportSelDeclareInfo,
    getStatisticalNum
  } from "@/api/sel/selDeclareInfo";
  import {fileList, deleteFile} from "@/api/sel/selFile"
  import {addSelOperLog} from "@/api/sel/selOperLog";

  export default {
    name: "AwardAudit",
    data() {
      return {
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 总条数
        total: 0,
        // 申报信息表格数据
        selDeclareInfoList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          industryType: undefined,
          awardsType: undefined,
          declareUnit: undefined,
          declareYear: (new Date().getFullYear()),
          auditFlag: '1'
        },
        reviewYears: [],
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          noticeId: [
            {required: true, message: "评选通知不能为空", trigger: "blur"}
          ],
          industryType: [
            {required: true, message: "产业类别不能为空", trigger: "blur"}
          ],
          awardsType: [
            {required: true, message: "奖项类别不能为空", trigger: "blur"}
          ]
        },
        industryTypeOptions: [],
        awardsTypeOptions: [],
        declareStatusOptions: [],
        // 审批意见弹出层
        opinionOpen: false,
        //审批意见表单
        opinionForm: {},
        //审批意见表单校验
        opinionRules: {
          auditIdea: [
            {required: true, message: "变更说明不能为空", trigger: "blur", pattern: '[^ \x22]+'}
          ]
        },
        downOpen: false,
        fileType: [],
        options: [
          {key: 1, value: "申报手册"},
          {key: 2, value: "项目简介"},
          {key: 3, value: "项目介绍PPT"}
        ],
        // 统计数量
        statisticalNum: {},
        zipFileOpen: false,
        zipFileList: [],
        zipQueryParams: {
          pageSize: 10,
          pageNum: 1
        },
        zipTotal: 0
      };
    },
    computed: {
      projectNameStyle() {
        return (row) => {
          if (row.declareStatus === 13) {
            return 'project-name-all-grey'
          } else if (row.declareStatus === 3 || row.declareStatus === 5 || row.declareStatus === 8 || row.declareStatus === 10) {
            return 'project-name-all-red'
          } else if (row.declareStatus === 4 || row.declareStatus === 9 || row.declareStatus === 11 || row.declareStatus === 12) {
            return 'project-name-all'
          } else {
            return 'project-name-all-hover'
          }
        }
      }
    },
    activated() {
      this.getList();
      this.getStatisticalNum();
    },
    created() {
      this.getList();
      this.getStatisticalNum();
      this.getDicts("industry_type").then(response => {
        this.industryTypeOptions = response.data;
      });
      this.getDicts("award_type").then(response => {
        this.awardsTypeOptions = response.data;
      });
      this.getDicts("declare_status").then(response => {
        this.declareStatusOptions = response.data;
      });
    },
    methods: {
      handleDownloadFile(row) {
        location.href = process.env.VUE_APP_BASE_API + '/common/download/resource?name=' + row.fileName + '&&fileName=' + row.filePath;
      },
      handleDeleteFile(row) {
        deleteFile(row.id).then(res => {
          this.msgSuccess(res.msg);
          this.zipQueryParams.pageNum = 1;
          this.getZipFileList();
        })
      },
      handleOpen() {
        this.zipFileOpen = true;
        this.zipQueryParams.pageNum = 1;
        this.getZipFileList();
      },
      getZipFileList() {
        fileList(this.zipQueryParams).then(res => {
          this.zipFileList = res.rows;
          this.zipTotal = res.total;
        })
      },
      getStatisticalNum() {
        getStatisticalNum(this.queryParams).then(res => {
          this.statisticalNum = res.data
        })
      },
      handleExport() {
        exportSelDeclareInfo(this.queryParams).then(res => {
          this.download(res.msg);
        })
      },
      handleDownloadCancel() {
        this.fileType = [];
        this.downOpen = false;
      },
      handleDownloadSubmit() {
        if (this.fileType.length == 0) {
          this.msgError("请选择要下载的文件类型");
          return;
        }
        const ids = JSON.stringify(this.ids);
        const fileTypes = JSON.stringify(this.fileType);
        createDownZipFile({"ids": ids, "fileTypes": fileTypes}).then(res => {
          this.downOpen = false;
          this.fileType = [];
          this.msgSuccess(res.msg);
          this.ids = [];
          this.$refs.auditTable.clearSelection();
        })
      },
      // 批量下载
      handleDownload() {
        this.downOpen = true;
      },
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      search() {
        this.searchToggle = !this.searchToggle;
      },
      /** 查询申报信息列表 */
      getList() {
        this.loading = true;
        listSelDeclareInfo(this.queryParams).then(response => {
          this.selDeclareInfoList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      //申报年度下来框出现时
      handleShowSelect(value) {
        if (value === true) {
          this.$store.dispatch("GetInfo").then(response => {
            this.reviewYears = response.yearList;
          })
        }
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },

      // 取消按钮
      opinionFormCancel() {
        this.opinionOpen = false;
        this.opinionForm = {
          auditIdea: undefined
        }
        this.resetForm("opinionForm");
      },

      handleEditDeclareStatus(row, status) {
        let preStatus = row.declareStatus;
        let operName = '';
        if (status == 3) {
          operName = '拒绝';
        } else if (status == 2) {
          operName = '退回';
        } else if (status == 1) {
          operName = '同意';
        }
        let declareStatus = -999;
        if (preStatus == 4) { //申报审核同意时
          if (status == 2) { //退回
            declareStatus = 3;
          } else if (status == 3) {//拒绝
            declareStatus = 10;
          }
        } else if (preStatus == 15) { //资料补充审核同意时
          if (status == 2) {
            declareStatus = 14;
          } else if (status == 3) {
            declareStatus = 16;
          }
        } else if (preStatus == 10) { //申报审核拒绝时
          if (status == 1) {
            declareStatus = 4;
          } else if (status == 2) {
            declareStatus = 3;
          }
        } else if (preStatus == 16) { //资料补充审核拒绝时
          if (status == 1) {
            declareStatus = 15;
          } else if (status == 2) {
            declareStatus = 14;
          }
        }
        if (declareStatus != -999) {
          this.$confirm('确认要' + operName + '吗?', "系统提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.opinionOpen = true;
            this.resetForm("opinionForm");
            this.opinionForm.id = row.id;
            this.opinionForm.declareStatus = declareStatus;
            this.opinionForm.preStatus = preStatus;
          }).catch(function () {
          });
        } else {
          this.msgError('参数错误，请刷新页面后重试')
        }
      },

      /** 审批意见提交按钮 */
      submitOpinionForm: function () {
        getSelDeclareInfo(this.opinionForm.id).then(response => {
          if (response.data.declareStatus != this.opinionForm.preStatus) {
            this.msgInfo('该记录审核状态已改变，请刷新页面后重试');
          } else {
            this.$refs["opinionForm"].validate(valid => {
              if (valid) {
                auditSubmit(this.opinionForm).then(response => {
                  this.opinionOpen = false;
                  if (response.code === 200) {
                    let result = '';
                    let auditName = this.opinionForm.preStatus < 11 ? '变更申报审核状态' : '变更补充资料审核状态';
                    if (this.opinionForm.declareStatus == 4 || this.opinionForm.declareStatus == 15) {
                      result = '同意';
                    } else if (this.opinionForm.declareStatus == 3 || this.opinionForm.declareStatus == 14) {
                      result = '退回';
                    } else if (this.opinionForm.declareStatus == 10 || this.opinionForm.declareStatus == 16) {
                      result = '拒绝';
                    }
                    const log = {};
                    log.infoId = this.opinionForm.id;
                    log.operName = auditName + '(' + result + '，' + this.opinionForm.auditIdea + ')';
                    log.filePaths = this.opinionForm.filePaths;
                    log.remark = this.opinionForm.auditIdea;
                    addSelOperLog(log);
                    this.msgSuccess('操作成功');
                    this.getList();
                  } else {
                    this.msgError('操作失败');
                  }
                });
              }
            });
          }
        });
      },

      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          noticeId: undefined,
          industryType: undefined,
          awardsType: undefined
        };
        this.resetForm("form");
      },

      //重置状态变更
      resetChangeForm() {
        this.changeForm = {
          id: undefined,
          preStatus: undefined,
          postStatus: undefined
        }
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
        this.getStatisticalNum();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 审核按钮操作 */
      handleAudit(row) {
        let path = "/sel/awardAudit/audit"
        let id = row.id;
        let auditType = row.declareStatus == 2 ? 1 : 2
        const log = {};
        log.infoId = id;
        log.operName = '审核申报';
        addSelOperLog(log);
        this.$router.push({
          "path": path,
          "query": {"id": id, "auditType": auditType}
        })
      },
      /** 详情按钮操作 */
      handleDetail(row) {
        let path = "/sel/awardAudit/detail"
        let id = row.id;
        let auditType = row.declareStatus == 2 ? 1 : 2
        const log = {};
        log.infoId = id;
        log.operName = '查看审批';
        addSelOperLog(log);
        this.$router.push({
          "path": path,
          "query": {"id": id,"auditType": auditType}
        })
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id;
        let path = '/sel/selDeclareInfo/science';
        let query = {id: id, kxbEdit: 1};
        if (row.awardsType == '1') {
          path = '/sel/selDeclareInfo/science';
        }
        if (row.awardsType == '2') {
          path = '/sel/selDeclareInfo/patent';
        }
        const log = {}
        log.infoId = row.id;
        log.operName = '编辑申报'
        addSelOperLog(log);
        this.$router.push({
          path: path,
          query: query
        })
      }
    }
  };
</script>
