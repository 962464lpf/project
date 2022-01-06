<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="90px">
      <el-form-item label="申报奖项" prop="awardsType">
        <el-select
          v-model="queryParams.awardsType"
          placeholder="请选择奖项类别"
          style="width: 180px;"
          clearable >
          <el-option
            v-for="dict in awardsTypeOptions"
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
          style="width: 180px;"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申报年度" prop="declareYear">
        <el-select
          v-model="queryParams.declareYear"
          placeholder="请选择申报年度"
          clearable
          style="width: 120px;"
          @visible-change = "handleShowSelect">
          <el-option
            v-for="item in reviewYears"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="评审状态" prop="declareStatus">
        <el-select
          v-model="queryParams.declareStatus"
          style="width: 220px;"
          placeholder="请选择"
          clearable >
          <el-option
            v-for="dict in declareStatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
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
          icon="el-icon-plus"
          @click="handleAdd"
          v-hasPermi="['sel:selDeclareInfo:add']"
        >申报</el-button>
      </el-col>
    </el-row>

    <el-table ref="table" v-loading="loading" :data="selDeclareInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" min-width="40" align="center" />
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
      <el-table-column min-width="160" label="申报奖项" align="center" prop="awardsType" >
        <template slot-scope="scope">
          {{ selectDictLabel(awardsTypeOptions, scope.row.awardsType) }}
        </template>
      </el-table-column>
      <el-table-column min-width="90" label="产业类别" align="center" prop="industryType" >
        <template slot-scope="scope">
          {{ selectDictLabel(industryTypeOptions, scope.row.industryType) }}
        </template>
      </el-table-column>
      <el-table-column min-width="230" label="申报单位" align="center" prop="declareUnit"  />
      <el-table-column min-width="100" label="申报人" align="center" prop="createBy"  />
      <el-table-column min-width="110" label="申报时间" align="center" prop="declareTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.declareTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150" label="评审状态" align="center" prop="declareStatus"  fixed="right">
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

    <!-- 添加或修改申报信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="评选通知" prop="noticeId">
          <el-select v-model="form.noticeId" placeholder="请选择对应通知" style="width: 100%">
            <el-option
              v-for="item in selNoticeOptions"
              :key="item.id"
              :label="item.noticeTitle"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产业类别" prop="industryType">
          <el-select v-model="form.industryType" placeholder="请选择产业类别" style="width: 100%">
            <el-option
              v-for="dict in industryTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖项类别" prop="awardsType">
          <el-select v-model="form.awardsType" placeholder="请选择奖项类别" style="width: 100%">
            <el-option
              v-for="dict in awardsTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectNameCn" v-if="form.awardsType == 1">
          <el-input v-model="form.projectNameCn" placeholder="请输入项目名称" maxlength="30" show-word-limit />
        </el-form-item>
        <el-form-item label="专利名称" prop="patentName" v-if="form.awardsType == 2">
          <el-input v-model="form.patentName" placeholder="请输入专利名称" maxlength="100" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSelDeclareInfo,  delSelDeclareInfo,  updateSelDeclareInfo, getSelDeclareInfo, searchDeclarable, getCountById } from "@/api/sel/selDeclareInfo";
import { addSelDeclarePatent } from "@/api/sel/selDeclarePatent";
import { addSelDeclareScience } from "@/api/sel/selDeclareScience";
import { listSelNotice } from "@/api/sel/selNotice";
import { addSelOperLog } from "@/api/sel/selOperLog";
import { presenter} from '@/components/Crud/crud';

export default {
  name: "SelDeclareInfo",
  mixins: [presenter()],
  data() {
    return {
      //控制搜索栏显示隐藏
      searchToggle: true,
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
        beginTime: undefined,
        endTime: undefined,
        declareYear: (new Date().getFullYear()),
        declareStatus: undefined
      },
      reviewYears: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        noticeId: [
            { required: true, message: "评选通知不能为空", trigger: "blur" }
        ],
        industryType: [
          { required: true, message: "产业类别不能为空", trigger: "blur" }
        ],
        awardsType: [
          { required: true, message: "奖项类别不能为空", trigger: "blur" }
        ],
        projectNameCn: [
          { required: true, message: "项目名称(中文)不能为空", trigger: "blur", pattern: '[^ \x22]+'  }
        ],
        patentName: [
          { required: true, message: "专利名称不能为空", trigger: "blur", pattern: '[^ \x22]+' }
        ],
      },
      industryTypeOptions: [],
      awardsTypeOptions: [],
      selNoticeOptions: [],
      declareStatusOptions: [],
      dateRange: []
    };
  },
  computed: {
    projectNameStyle() {
      return (row) => {
        if (row.declareStatus === 13) {
          return 'project-name-all-grey'
        } else if (row.declareStatus === 3 || row.declareStatus === 5 || row.declareStatus === 8 || row.declareStatus === 10) {
          return 'project-name-all-red'
        } else if (row.declareStatus === 2 || row.declareStatus === 4 || row.declareStatus === 7 || row.declareStatus === 9 || row.declareStatus === 11 || row.declareStatus === 12) {
          return 'project-name-all'
        } else {
          return 'project-name-all-hover'
        }
      }
    }
  },
  activated() {
    this.getList();
  },
  created() {
    this.getList();
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
    search() {
      this.searchToggle = !this.searchToggle;
    },
    /** 查询申报信息列表 */
    getList() {
      this.loading = true;
      listSelDeclareInfo(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.selDeclareInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getNoticeList(){
      let query = {};
      query.publishStatus = 1;
      query.type = 2;
      query.curYear = "1";
      query.kind=1;
      listSelNotice(query).then(response => {
          this.selNoticeOptions = response.rows;
      });
    },
    //申报年度下来框出现时
    handleShowSelect(value) {
        if(value === true) {
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
    //改变评审状态
    changeDeclareStatus(row,status) {
      const id = row.id || this.ids;
      let statusName = '';
      if(status == 1){
          statusName = '撤回'
      }else{
          statusName = '作废'
      }
      getSelDeclareInfo(id).then(response => {
          if(response.data.declareStatus!=2){//如果状态不是初审中，不能撤回或作废
              this.msgInfo('该记录已审核，不能'+statusName);
          } else {
              getCountById(id).then(response => {
                  if(response.data > 0){
                      this.msgInfo('该记录正在被审核，不能'+statusName);
                  }else {
                      this.$confirm('确认要'+statusName+'吗？', "系统提示", {
                          confirmButtonText: "确定",
                          cancelButtonText: "取消",
                          type: "warning"
                      }).then(() => {
                          updateSelDeclareInfo({
                              id: id,
                              declareStatus: status
                          }).then(() => {
                              const log = {}
                              log.infoId = id;
                              log.operName = statusName + '申报'
                              addSelOperLog(log);
                              this.msgSuccess("操作成功");
                              this.getList();
                          })
                      }).catch(function() {});
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
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      searchDeclarable().then(repsonse => {
          if(repsonse.code == 200){
              this.reset();
              this.getNoticeList();
              this.open = true;
              this.title = "申报选择";
          }else {
              this.msgInfo(repsonse.msg);
          }
      });
    },
    /** 详情按钮操作 */
    handleDetail(row) {
        let path="/sel/selDeclareInfo/detail"
        let id = row.id;
        const log = {}
        log.infoId = row.id;
        log.operName = '查看详情';
        addSelOperLog(log);
      this.$router.push({
          "path": path,
          "query": {
            "id":id,
            releaseFlag: '2'
          }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      let path = '/sel/selDeclareInfo/science';
      let query = { id: id };
      if(row.awardsType == '1') {
        path = '/sel/selDeclareInfo/science';
      }
      if(row.awardsType == '2') {
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
      // getSelDeclareInfo(id).then(response => {
      //   if(response.data.editStatus == 0) {
      //     this.$router.push({
      //       path: '/sel/selDeclareInfo/edit',
      //       query: { id: id }
      //     })
      //     updateSelDeclareInfo({
      //       id: id,
      //       editStatus: 1
      //     })
      //   } else {
      //     this.msgError('该数据正在被编辑!')
      //   }
      // });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateSelDeclareInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            if(this.form.awardsType == 1) {
              addSelDeclareScience(this.form).then(response => {
                this.$router.push({
                  path: '/sel/selDeclareInfo/science',
                  query: {
                    id: response.data.infoId
                  }
                })
                this.cancel();
              });
            }
            if (this.form.awardsType == 2) {
              addSelDeclarePatent(this.form).then(response => {
                this.$router.push({
                  path: '/sel/selDeclareInfo/patent',
                  query: {
                    id: response.data.infoId
                  }
                })
                this.cancel();
              });
            }
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除?', "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSelDeclareInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有申报信息数据项?', "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSelDeclareInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    //跳转资料补充
    handleAdditionalData(row) {
      const path="/sel/selDeclareInfo/additionalData"
      const id=row.id;
      this.$router.push({
        "path": path,
        "query": {"id":id}
      })
    }
  }
};
</script>
