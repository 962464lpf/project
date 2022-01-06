<template>
  <div class="app-container">
    <div class="header">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true">
        <el-form-item label="时间" prop="curTime">
          <el-date-picker
            v-model="curTime"
            :clearable="false"
            style="width: 200px"
            type="month"
            value-format="yyyy-MM"
            placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="经办人" prop="createByName">
          <el-input
            v-model="queryParams.createByName"
            placeholder="请输入经办人"
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
              v-if="type === 1"
              type="primary"
              icon="el-icon-plus"
              v-hasPermi="['build:buildInfo:addMonthlyReport']"
              @click="handleAdd">新增简报
            </el-button>
            <el-button
              v-if="type === 2 && buildInfoForm.weeklyNewspaper === 1"
              type="primary"
              icon="el-icon-plus"
              v-hasPermi="['build:buildInfo:addWeeklyReport']"
              @click="handleAdd">新增周报
            </el-button>
          </el-col>
<!--          <el-col :span="1.5">-->
<!--            <el-button-->
<!--              v-if="type===2"-->
<!--              type="danger"-->
<!--              icon="el-icon-delete"-->
<!--              -->
<!--              :disabled="multiple"-->
<!--              @click="handleDelete"-->
<!--              v-hasPermi="['build:buildInfo:deleteWeeklyReport']">删除-->
<!--            </el-button>-->
<!--            <el-button-->
<!--              v-if="type===1"-->
<!--              type="danger"-->
<!--              icon="el-icon-delete"-->
<!--              -->
<!--              :disabled="multiple"-->
<!--              @click="handleDelete"-->
<!--              v-hasPermi="['build:buildInfo:deleteMonthlyReport']">删除-->
<!--            </el-button>-->
<!--          </el-col>-->
        </el-row>
      </div>
      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          :data="workLogList">
<!--          <el-table-column-->
<!--            type="selection"-->
<!--            width="55"-->
<!--            align="center"/>-->
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
            min-width="300"
            label="项目公司"
            align="center"
            prop="companyName">
            <template slot-scope="scope">
              <span>{{ scope.row.companyName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="180"
            label="经办人"
            align="center"
            prop="createByName"
            />
          <el-table-column
            min-width="180"
            label="时间"
            align="center"
            prop="date"
            >
            <template slot-scope="scope">
              <span v-if="type === 1">{{ scope.row.date }}</span>
              <span v-if="type === 2">{{ getWeekInMonthText(scope.row.date) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="180"
            label="上传时间"
            align="center"
            prop="createTime"
            >
            <template slot-scope="scope">
              <span>{{ scope.row.createTime | proCreateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="type === 1 ? '简报' : '周报'"
            width="200"
            align="center"
            fixed="right">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status === 0"
                type="text"
                icon="el-icon-edit"
                @click="handleAdd(scope.row)"
                :v-hasPermi="type === 1 ? ['build:buildInfo:editMonthlyReport'] : ['build:buildInfo:editWeeklyReport']"
              >修改
              </el-button>
              <el-button
                v-if="scope.row.status === 0"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                :v-hasPermi="type === 1 ? ['build:buildInfo:deleteMonthlyReport'] : ['build:buildInfo:deleteWeeklyReport']"
              >删除
              </el-button>
              <el-button
                type="text"
                @click="queryWorkLog(scope.row)"
                :v-hasPermi="type === 1 ? ['build:buildInfo:detailMonthlyReport'] : ['build:buildInfo:detailWeeklyReport']"
              >详情
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
      :visible.sync="open"
      :title="title"
      width="600px"
      append-to-body
      :show-close="false"
      :close-on-click-modal="false">
      <div class="dialog-center">
        <el-form ref="workLogForm" :model="workLogForm" :rules="workLogRules" label-width="110px">
          <el-form-item label="项目公司名称" prop="companyName">
            <el-input
              v-model="workLogForm.companyName"
              placeholder="请填写项目公司名称"
              clearable
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item label="时间" prop="date">
            <el-date-picker
              v-if="type === 1"
              v-model="workLogForm.date"
              :clearable="false"
              style="width: 240px"
              type="month"
              value-format="yyyy-MM"
              placeholder="请选择时间">
            </el-date-picker>
            <el-date-picker
              v-if="type === 2"
              v-model="workLogForm.date"
              @change="weekChange"
              :format="'yyyy-MM 第' + week + '周'"
              :picker-options="{'firstDayOfWeek': 1}"
              value-format="yyyy-M-d"
              style="width: 240px"
              type="week"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="附件" prop="filePath">
            <upload v-model="workLogForm.filePath"/>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button style="width: 100px" type="primary" @click="submitForm">确 定</el-button>
        <el-button style="width: 100px" type="primary" @click="saveForm">保 存</el-button>
        <el-button style="width: 100px" @click="cancelClose">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="open2"
      :title="title2"
      width="600px"
      append-to-body
      :close-on-click-modal="false">
      <div class="dialog-center">
        <el-form ref="workLogForm2" :model="workLogForm2" label-width="110px">
          <el-form-item label="项目公司名称" prop="companyName">
            <span>{{workLogForm2.companyName}}</span>
          </el-form-item>
          <el-form-item label="时间" prop="date">
            <span>{{workLogForm2.date}}</span>
          </el-form-item>
          <el-form-item label="上传时间" prop="createTime">
            <span>{{workLogForm2.createTime | proCreateTime}}</span>
          </el-form-item>
          <el-form-item label="附件" prop="filePath">
            <upload v-model="workLogForm2.filePath" :edit="false"/>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addBuildReport,
  delBuildReport,
  getBuildReport,
  listBuildReport,
  updateBuildReport
} from "@/api/build/buildReport";
import {getBuildInfo} from "@/api/build/buildInfo";

export default {
  name: "workBriefing",
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
        infoId: null,
        type: 1,
        time: '',
        createByName: ''
      },
      curTime: '',
      //绿建项目列表
      workLogList: [],
      id: null,
      type: null,
      open: false,
      title: '新增简报',
      workLogForm: {
        infoId: null,
        type: null,
        companyName: '',
        date: '',
        filePath: '',
        status: 1
      },
      workLogRules: {
        companyName: [
          { required: true, message: "项目公司名称不能为空", trigger: "blur" },
          {max: 30, message: "最多30字", trigger: "blur"}
        ],
        date: [
          { required: true, message: "时间不能为空", trigger: "blur" }
        ],
        filePath: [
          { required: true, message: "附件不能为空", trigger: "blur" }
        ]
      },
      open2: false,
      title2: '查看工作简报',
      workLogForm2: {},
      week: '',
      buildInfoForm: {}
    }
  },
  created() {
    //获取接口数据
    if (this.$route.query.id && this.$route.query.type) {
      this.id = this.$route.query.id * 1
      this.type = this.$route.query.type * 1
      this.getList()
      this.getBuildInfoForm()
    }
  },
  computed: {
    userName() {
      return this.$store.state.user.name
    }
  },
  filters: {
    proCreateTime(value) {
      if (value) {
        return value.toString().substr(0, 10)
      }
    }
  },
  methods: {
    /*********************** 数据获取及处理 ***********************/
    /** 获取申报待评审列表 */
    getList() {
      this.loading = true;
      this.queryParams.infoId = this.id
      this.queryParams.type = this.type
      this.queryParams.time = this.parseTime(this.curTime, "{y}-{m}");
      listBuildReport(this.queryParams).then(({rows, total}) => {
        this.workLogList = rows;
        this.total = total;
        this.loading = false;
      });
    },
    //获取项目信息
    getBuildInfoForm() {
      getBuildInfo(this.id).then(({data}) => {
        this.buildInfoForm = data
      })
    },
    weekChange(val) {
      if (val) {
        this.week = this.getWeekInMonth(new Date(val));
      }
    },
    //判断月的第几周
    getWeekInMonthText(date) {
      if(!date) return;
      let arr = date.split('-');
      if(arr.length < 3) return;
      let week = this.getWeekInMonth(new Date(date));
      return `${arr[0]}年${arr[1]}月 第${week}周`;
    },
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
    /*********************** 交互操作 ***********************/
    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.curTime = ''
      this.queryParams.createByName = ''
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    //处理新增
    handleAdd(row) {
      getBuildInfo(this.id).then(({data}) => {
        if (data.finish === 0) {
          if (data.approvalStatus === 4) {
            if (row && row.id) {
              this.getBuildReportDetail(row.id)
            } else {
              this.workLogForm.companyName = data.enterUnit
            }
            if (this.type === 1) {
              this.open = true
              this.title = '工作简报'
            } else {
              this.open = true
              this.title = '工作周报'
            }
          } else {
            this.msgError('当前项目正在审核中或审核未通过，不可操作')
          }
        } else {
          this.msgError('当前项目已归档，不可操作')
        }
      })
    },
    //处理删除
    handleDelete(row) {
      getBuildInfo(this.id).then(({data}) => {
        if (data.finish === 0) {
          const ids = row.id || this.ids;
          this.$confirm(`是否确认删除所选择的${this.type === 1 ? '简报' : '周报'}?`, "系统提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(function () {
            return delBuildReport(ids);
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
    //获取工作简报周报详情
    getBuildReportDetail(id) {
      getBuildReport(id).then(({data}) => {
        this.workLogForm = data
      })
    },
    //查看工作简报
    queryWorkLog(row) {
      getBuildReport(row.id).then(({data}) => {
        this.workLogForm2 = data
        this.open2 = true
        if (this.type === 1) {
          this.title2 = '查看工作简报'
        } else {
          this.title2 = '查看工作周报'
        }
      })
    },
    //提交
    submitForm() {
      this.$refs["workLogForm"].validate(valid => {
        if (valid) {
          this.workLogForm.status = 1
          this.addAndUpdateBuildReport()
        }
      })
    },
    //保存
    saveForm() {
      this.$refs["workLogForm"].validate(valid => {
        if (valid) {
          this.workLogForm.status = 0
          this.addAndUpdateBuildReport()
        }
      })
    },
    //新增和提交方法
    addAndUpdateBuildReport() {
      this.workLogForm.infoId = this.id
      this.workLogForm.type = this.type
      if (this.workLogForm.id) {
        updateBuildReport(this.workLogForm).then(() => {
          this.msgSuccess("修改成功");
          this.getList()
          this.cancelClose()
        })
      } else {
        addBuildReport(this.workLogForm).then(() => {
          this.msgSuccess("新增成功");
          this.getList()
          this.cancelClose()
        })
      }
    },
    //取消
    cancelClose() {
      this.open = false
      this.workLogForm.id = null
      this.$refs["workLogForm"].resetFields();
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
      }
    }
    .main-footer {
      width: 420px;
      margin-top: 20px;
    }
  }
}
</style>
