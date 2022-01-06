<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="80px">
      <el-form-item v-if="reportType == 1" label="年度" prop="reportPeriod">
        <el-date-picker
          clearable
          v-model="queryParams.reportPeriod"
          type="year"
          value-format="yyyy"
          placeholder="请选择年度">
        </el-date-picker>
      </el-form-item>
      <el-form-item v-if="reportType == 2" label="时间" prop="reportPeriod">
        <el-date-picker
          clearable
          v-model="queryParams.reportPeriod"
          type="month"
          value-format="yyyy-MM"
          placeholder="请选择时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item v-if="reportType == 3" label="时间" prop="reportPeriod">
        <el-date-picker
          clearable
          v-model="queryParams.reportPeriod"
          type="month"
          value-format="yyyy-MM"
          placeholder="请选择时间">
        </el-date-picker>
        <!--<el-date-picker
          v-model="queryParams.reportPeriod"
          type="week"
          value-format="yyyy-M-d"
          :format="'yyyy-MM 第' + week + '周'"
          @change="weekChange"
          :picker-options="{'firstDayOfWeek': 1}"
          placeholder="请选择时间">
        </el-date-picker>-->
      </el-form-item>
      <el-form-item label="经办人" prop="jbr">
        <el-input
          v-model="queryParams.jbr"
          placeholder="请输入经办人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-if="(projectForm.uploadSwitch == 1 && reportType == 3) || reportType != 3"
          type="primary"
          icon="el-icon-plus"
          :disabled="projectForm.fileStatus == '1'"
          @click="handleAdd"
          v-hasPermi="['hb:hbWorkReport:add']"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['hb:hbWorkReport:edit']"
        >修改</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hb:hbWorkReport:remove']"
        >删除</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          @click="handleExport"
          v-hasPermi="['hb:hbWorkReport:export']"
        >导出</el-button>
      </el-col> -->
    </el-row>

    <el-table ref="table" v-loading="loading" :data="hbWorkReportList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" min-width="40" align="center" />
      <el-table-column min-width="55" label="序号" align="center" type="index">
        <template slot-scope="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="230" label="项目名称" align="center" prop="projectName">
        <template slot-scope="scope">
          <span>{{ projectForm.projectName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经办人" align="center" prop="jbr" min-width="140" />
      <el-table-column min-width="120" v-if="reportType == 1" label="年度" align="center" prop="reportPeriod"  />
      <el-table-column min-width="120" v-if="reportType == 2" label="时间" align="center" prop="reportPeriod"  />
      <el-table-column min-width="120" v-if="reportType == 3" label="时间" align="center" prop="reportPeriod" >
        <template slot-scope="scope">
          <span>{{getWeekInMonthText(scope.row.reportPeriod)}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="130" v-if="reportType == 2 || reportType == 3" label="上传时间" align="center" prop="updateTime" >
        <template slot-scope="scope">
          <span>{{scope.row.updateTime ? parseTime(scope.row.updateTime, "{y}-{m}-{d}") : parseTime(scope.row.createTime, "{y}-{m}-{d}")}}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" align="center" class-name="small-padding fixed-width" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="(scope.row.submitStatus !== 1 && projectForm.fileStatus != '1' && reportType != 3) || (projectForm.uploadSwitch == 1 && reportType == 3 && scope.row.submitStatus !== 1 && projectForm.fileStatus != '1')"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hb:hbWorkReport:edit']"
          >修改</el-button>
          <el-button
            v-if="(scope.row.submitStatus !== 1 && projectForm.fileStatus != '1' && reportType != 3) || (projectForm.uploadSwitch == 1 && reportType == 3 && scope.row.submitStatus !== 1 && projectForm.fileStatus != '1')"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hb:hbWorkReport:remove']"
          >删除</el-button>
          <el-button
            type="text"
            @click="handleDetail(scope.row)"
          >详情</el-button>
<!--          <el-button-->
<!--            type="text"-->
<!--            @click="handleDownLoad(scope.row)"-->
<!--          >下载查看</el-button>-->
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

    <!-- 添加或修改环保项目工作报告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目名称" prop="projectName">
          <span>{{projectForm.projectName}}</span>
        </el-form-item>
        <el-form-item v-if="reportType == 1" label="年度" prop="reportPeriod">
          <el-date-picker
            v-if="edit"
            v-model="form.reportPeriod"
            type="year"
            value-format="yyyy"
            placeholder="请选择年度">
          </el-date-picker>
          <span v-else>{{form.reportPeriod}}</span>
        </el-form-item>
        <el-form-item v-if="reportType == 2" label="时间" prop="reportPeriod">
          <el-date-picker
            v-if="edit"
            v-model="form.reportPeriod"
            type="month"
            value-format="yyyy-MM"
            placeholder="请选择时间">
          </el-date-picker>
          <span v-else>{{form.reportPeriod}}</span>
        </el-form-item>
        <el-form-item v-if="reportType == 3" label="时间" prop="reportPeriod">
          <el-date-picker
            v-if="edit"
            v-model="form.reportPeriod"
            type="week"
            value-format="yyyy-M-d"
            :format="'yyyy-MM 第' + week + '周'"
            @change="weekChange"
            :picker-options="{'firstDayOfWeek': 1}"
            placeholder="请选择时间">
          </el-date-picker>
          <span v-else>{{getWeekInMonthText(form.reportPeriod)}}</span>
        </el-form-item>
        <el-form-item label="附件" prop="reportFilePaths">
          <upload v-model="form.reportFilePaths" :limit="1" :edit="edit"></upload>
        </el-form-item>
      </el-form>
      <div v-if="edit" slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="submitForm('submit')">提 交</el-button>
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listHbWorkReport, getHbWorkReport, delHbWorkReport, addHbWorkReport, updateHbWorkReport, exportHbWorkReport } from "@/api/hb/hbWorkReport";
  import { getHbProjectInfo } from "@/api/hb/hbProjectInfo";

  export default {
    name: "HbWorkReport",
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
        // 环保项目工作报告表格数据
        hbWorkReportList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          infoId: undefined,
          reportPeriod: undefined,
          reportType: undefined,
          jbr: undefined
        },
        // 表单参数
        form: {},
        projectForm: {},
        // 表单校验
        rules: {
          reportPeriod: [
            { required: true, message: "时间不能为空", trigger: "blur" }
          ],
          reportFilePaths: [
            { required: true, message: "附件不能为空", trigger: "blur" }
          ]
        },
        week: '',
        edit: true,
        baseApi: process.env.VUE_APP_BASE_API
      };
    },
    computed: {
      infoId() {
        return this.$route.query.infoId;
      },
      reportType() {
        return this.$route.query.reportType;
      }
    },
    created() {
      this.getList();
      if (this.reportType == 1) {
        this.rules.reportPeriod[0].message = '年度不能为空';
      }
    },
    methods: {
      /** 查询环保项目工作报告列表 */
      getList() {
        this.loading = true;
        this.queryParams.infoId = this.infoId;
        this.queryParams.reportType = this.reportType;
        listHbWorkReport(this.queryParams).then(response => {
          this.hbWorkReportList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
        if(this.infoId) {
          getHbProjectInfo(this.infoId).then(response => {
            this.projectForm = response.data;
          });
        }
      },
      weekChange(val) {
        if (val) {
          this.week = this.getWeekInMonth(new Date(val));
        }
      },
      // 根据日期判断是月的第几周
      getWeekInMonth(t) {
        if (t == undefined || t == '' || t == null) {
          t = new Date();
        } else {
          var _t = new Date();
          _t.setYear(t.getFullYear());
          _t.setMonth(t.getMonth());
          _t.setDate(t.getDate());

          var date = _t.getDate(); //给定的日期是几号

          _t.setDate(1);
          var d = _t.getDay(); //1. 得到当前的1号是星期几。
          var fisrtWeekend = d;
          if (d == 0) {
            fisrtWeekend = 1;
            //1号就是星期天
          } else {
            fisrtWeekend = 7 - d + 1; //第一周的周未是几号
          }
          if (date <= fisrtWeekend) {
            return 1;
          } else {
            return 1 + Math.ceil((date - fisrtWeekend) / 7);
          }
        }
      },
      getWeekInMonthText(date) {
        if(!date) return;
        let arr = date.split('-');
        if(arr.length < 3) return;
        let week = this.getWeekInMonth(new Date(date));
        return `${arr[0]}年${arr[1]}月 第${week}周`;
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: undefined,
          infoId: undefined,
          reportType: undefined,
          reportPeriod: undefined,
          reportFilePaths: undefined,
          submitStatus: 0
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
        this.edit = true;
        this.reset();
        this.open = true;
        if(this.reportType == 1) this.title = "添加年度计划";
        if(this.reportType == 2) this.title = "添加工作简报";
        if(this.reportType == 3) this.title = "添加项目周报";
      },
      /** 详情按钮操作 */
      handleDetail(row) {
        this.edit = false;
        this.reset();
        const id = row.id || this.ids
        getHbWorkReport(id).then(response => {
          this.form = response.data;
          this.week = this.getWeekInMonth(new Date(this.form.reportPeriod));
          this.open = true;
          if(this.reportType == 1) this.title = "查看年度计划";
          if(this.reportType == 2) this.title = "查看工作简报";
          if(this.reportType == 3) this.title = "查看项目周报";
        });
      },
      //下载
      handleDownLoad(row) {
        let reportFilePaths = JSON.parse(row.reportFilePaths)[0];
        if(!reportFilePaths.fileName) return;
        location.href = this.baseApi + '/common/download/resource?name=' + encodeURIComponent(reportFilePaths.name) + '&fileName=' + reportFilePaths.fileName.replace('/dev-api/', '/');
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.edit = true;
        this.reset();
        const id = row.id || this.ids
        getHbWorkReport(id).then(response => {
          this.form = response.data;
          this.week = this.getWeekInMonth(new Date(this.form.reportPeriod));
          this.open = true;
          if(this.reportType == 1) this.title = "修改年度计划";
          if(this.reportType == 2) this.title = "修改工作简报";
          if(this.reportType == 3) this.title = "修改项目周报";
        });
      },
      /** 提交按钮 */
      submitForm: function(type) {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.form.infoId = this.infoId;
            this.form.reportType = this.reportType;
            if (type == 'submit') {
              this.form.submitStatus = 1;
            } else {
              this.form.submitStatus = 0;
            }
            if (this.form.id != undefined) {
              updateHbWorkReport(this.form).then(response => {
                if (response.code === 200) {
                  if (type == 'submit') {
                    this.msgSuccess("提交成功");
                  } else {
                    this.msgSuccess("修改成功");
                  }
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addHbWorkReport(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                }
              });
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
          return delHbWorkReport(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有环保项目工作报告数据项?', "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportHbWorkReport(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      }
    }
  };
</script>
