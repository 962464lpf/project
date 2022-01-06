<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="研究领域" prop="area">
        <el-select v-model="queryParams.area" placeholder="请选择研究领域" clearable>
          <el-option
            v-for="dict in areaOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="年度" prop="declareYear">
        <el-date-picker
          v-model="declareYear"
          type="year"
          :clearable="false"
          placeholder="请选择年度">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
          v-hasPermi="['project:projectStorageInfo:add']"
        >申报
        </el-button>
      </el-col>
      <div style="float: right;">
        <div style="line-height: 36px;display: inline-block;margin-right: 20px;"
             v-hasPermi="['project:projectStorageInfo:updateDeclareChannel']">
          <span style="font-size: 14px;vertical-align: middle;color: #666;">继续申报通道</span>
          <el-switch
            v-model="config.configValue"
            @change="configChange"
            active-value="true"
            inactive-value="false">
          </el-switch>
        </div>
      </div>
    </el-row>

    <el-table
      ref="table"
      v-loading="loading"
      :data="projectStorageInfoList">
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
        min-width="232"
        label="项目名称"
        align="center"
        prop="projectName">
        <template slot-scope="scope">
          <div :class="projectNameStyle(scope.row)"
               @click="handleDetail(scope.row)">
            <span>{{ scope.row.projectName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        min-width="200"
        label="申报单位"
        align="center"
        prop="subordinateUnit"/>
      <el-table-column min-width="100" label="申报人" align="center" prop="createBy"/>
      <el-table-column min-width="140" label="项目类别" align="center" prop="type" />
      <el-table-column min-width="100" label="项目属性" align="center" prop="attri" :formatter="attriFormat" />
      <el-table-column min-width="120" label="开始时间" align="center" prop="beginDate" :formatter="beginDateFormat"/>
      <el-table-column min-width="120" label="结束时间" align="center" prop="endDate" :formatter="endDateFormat"/>
      <el-table-column min-width="100" label="项目负责人" align="center" prop="headName" />
      <el-table-column width="90" fixed="right" label="申报年度" align="center" prop="declareYear"/>
      <el-table-column width="120" fixed="right" label="评审状态" align="center" prop="status">
        <template slot-scope="scope">
          <div :class="projectNameStyle(scope.row) + ' no-cursor-point'">
            <span>{{ selectDictLabel(statusOptions, scope.row.status) }}</span>
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

    <!-- 添加或修改项目储备申报对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="108px">
        <declare v-model="form" :add="true"/>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listProjectStorageInfo,
    delProjectStorageInfo,
    addProjectStorageInfo,
    updateProjectStorageInfo,
    operation
  } from "@/api/storage/projectStorageInfo";
  import {listSelReviewYears, listSelNotice} from "@/api/sel/selNotice"
  import {getCompanyName} from "@/api/system/dept";
  import {getConfigByKey, updateConfig} from "@/api/system/config"
  import declare from './declare';

  export default {
    name: "ProjectStorageInfo",
    components: {
      declare
    },
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
        // 项目储备申报表格数据
        projectStorageInfoList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 项目属性字典
        attriOptions: [],
        // 研究领域字典
        areaOptions: [],
        // 状态字典
        statusOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          declareYear: "",
          projectName: undefined,
          area: undefined,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          noticeId: [
            {required: true, message: "评选通知不能为空", trigger: "blur"}
          ],
          projectName: [
            {required: true, message: "项目名称不能为空", trigger: "blur", pattern: '[^ \x22]+'}
          ],
          subordinateUnit: [
            {required: true, message: "申报单位不能为空", trigger: "blur", pattern: '[^ \x22]+'}
          ],
          type: [
            {required: true, message: "项目类别不能为空", trigger: "blur", pattern: '[^ \x22]+'}
          ],
          beginDate: [
            {required: true, message: "起止时间不能为空", trigger: "blur"}
          ],
          attri: [
            {required: true, message: "项目属性不能为空", trigger: "blur"}
          ],
          area: [
            {required: true, message: "研究领域不能为空", trigger: "blur"}
          ],
          content: [
            {required: true, message: "主要研究内容不能为空", trigger: "blur", pattern: '[^ \x22]+'}
          ],
          target: [
            {required: true, message: "预期目标不能为空", trigger: "blur", pattern: '[^ \x22]+'}
          ],
          undertakeUnit: [
            {required: true, message: "承担单位不能为空", trigger: "blur", pattern: '[^ \x22]+'}
          ],
          implementationUnit: [
            {required: true, message: "实施单位不能为空", trigger: "blur", pattern: '[^ \x22]+'}
          ],
          headName: [
            {required: true, message: "项目负责人不能为空", trigger: "blur", pattern: '[^ \x22]+'}
          ],
          totalInvestment: [
            {required: true, message: "项目总投入不能为空", trigger: "blur"},
            {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,4}|[1-9][0-9]*\.\d{1,4})))$/, message: "请输入正确的金额", trigger: "blur"}
          ],
          planInvestment: [
            {required: true, message: new Date().getFullYear() + 1 + "年计划投入不能为空", trigger: "blur"},
            {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,4}|[1-9][0-9]*\.\d{1,4})))$/, message: "请输入正确的金额", trigger: "blur"}
          ]
        },
        // 申报通道
        config: {},
        // 类型
        type: '1',
        selNoticeOptions: [],
        dateRange: [],
        // 申报年限
        declareYear: new Date(),
        // 评选通知
        notices: [],
      };
    },
    activated() {
      this.getList();
    },
    computed: {
      projectNameStyle() {
        return (row) => {
          return (row.status === '3' || row.status === '6' || row.status === '7' || row.status === '8') ? 'project-name-all' : 'project-name-all-hover'
        }
      }
    },
    created() {
      this.getList();
      // this.getDeclareYear();
      this.getConfigByKey();
      this.getDicts("project_storage_status").then(response => {
        this.statusOptions = response.data;
      });
      this.getDicts("project_storage_attri").then(response => {
        this.attriOptions = response.data;
      });
      this.getDicts("project_storage_area").then(response => {
        this.areaOptions = response.data;
      });
    },
    methods: {
      configChange() {
        let title = "";
        if (this.config.configValue == "true") {
          title = "确定要打开申报通道？";
        }
        if (this.config.configValue == "false") {
          title = "确定要关闭申报通道？";
        }
        this.$confirm(title, "系统提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          updateConfig(this.config);
        }).catch(() => {
          if (this.config.configValue == "true") {
            this.config.configValue = "false";
          } else {
            this.config.configValue = "true";
          }
        })
      },
      // 获取申报通道状态
      getConfigByKey() {
        getConfigByKey("declare_channel_status").then(res => {
          if (res.code == 200) {
            if (res.data.length > 0) {
              this.config = res.data[0];
            }
          }
        })
      },
      // 获取申报年限
      // getDeclareYear() {
      //   listSelReviewYears().then(res => {
      //     this.declareYear = res.data;
      //   })
      // },
      /** 查询项目储备申报列表 */
      getList() {
        this.loading = true;
        this.queryParams.declareYear = this.parseTime(this.declareYear, "{y}")
        listProjectStorageInfo(this.queryParams).then(response => {
          this.projectStorageInfoList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      getNoticeList() {
        let query = {};
        query.type = 1;
        query.kind = 2;
        listSelNotice(query).then(response => {
          this.selNoticeOptions = response.rows;
        });
      },
      // 项目属性字典翻译
      attriFormat(row, column) {
        return this.selectDictLabel(this.attriOptions, row.attri);
      },
      // 研究领域字典翻译
      areaFormat(row, column) {
        return this.selectDictLabel(this.areaOptions, row.area);
      },
      beginDateFormat(row) {
        return this.parseTime(row.beginDate, "{y}年{m}月")
      },
      endDateFormat(row) {
        return this.parseTime(row.endDate, "{y}年{m}月")
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
          noticeId: undefined,
          declareYear: undefined,
          projectName: undefined,
          subordinateUnit: undefined,
          type: undefined,
          attri: undefined,
          area: undefined,
          additionalInformation: '0',
          submitType: '0',
          content: undefined,
          target: undefined,
          undertakeUnit: undefined,
          beginDate: undefined,
          endDate: undefined,
          headName: undefined,
          totalInvestment: undefined,
          planInvestment: undefined,
          lockStatus: "0",
          expertGroupId: undefined,
          reviewResult: undefined,
          status: undefined,
          remark: undefined,
          createBy: undefined,
          createTime: undefined,
          updateBy: undefined,
          updateTime: undefined,
          datePickerValue: [],
          dateRange: []
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
        this.declareYear = new Date();
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length != 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "项目申报";
        this.getUnit();
      },
      // 获取当前用户所在的单位
      getUnit() {
        const dept = this.$store.getters.dept;
        getCompanyName(dept.deptId).then(res => {
          this.form.subordinateUnit = res.data.companyName;
          this.form.undertakeUnit = res.data.companyName;
        })
      },

      /** 详情按钮操作 */
      handleDetail(row) {
        operation({"infoId": row.id, "operation": "7"}).then(res => {
          let path = "/proManagement/storage/projectStorageInfo/detail"
          let id = row.id;
          this.$router.push({
            "path": path,
            "query": {"id": id}
          })
        }).catch(() => {
          this.getList();
        })
      },

      /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateProjectStorageInfo(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addProjectStorageInfo(this.form).then(response => {
                if (response.code === 200) {
                  if (this.form.submitType == '0') {
                    this.$router.push({
                      path: '/proManagement/storage/projectStorageInfo/report',
                      query: {
                        id: response.data,
                        add: 1
                      }
                    })
                  } else {
                    this.$router.push({
                      path: '/proManagement/storage/projectStorageInfo/report',
                      query: {
                        id: response.data,
                        add: 1
                      }
                    })
                  }
                  this.cancel();
                  this.getList();
                }
              });
            }
          }
        });
      }
    }
  };
</script>
