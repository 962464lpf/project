<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="90px">
      <el-form-item label="通知类型" prop="kind">
        <el-select
          v-model="queryParams.kind"
          placeholder="请选择通知类型"
          style="width: 100%;"
          clearable>
          <el-option
            v-for="item in noticeSelKinds"
            :key="item.kind"
            :label="item.name"
            :value="item.kind"
            @keyup.enter.native="handleQuery"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通知标题" prop="noticeTitle">
        <el-input
          v-model="queryParams.noticeTitle"
          placeholder="请输入通知标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="年度" prop="publishTime">
        <el-date-picker
          v-model="queryParams.publishTime"
          type="year"
          format="yyyy"
          value-format="yyyy"
          placeholder="选择年度">
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
          v-hasPermi="['sel:selNotice:add']"
        >发布通知
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['sel:selNotice:remove']">删除
        </el-button>
      </el-col>
    </el-row>
    <el-tabs v-model="tabIndex" @tab-click="tabChange" ref="tab">
      <el-tab-pane label="我发布的" name="1" v-hasPermi="['sel:selNotice:myNotice']">
        <el-table
          v-if="tabIndex === '1'"
          ref="table"
          v-loading="loading"
          :data="selNoticeList"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" min-width="40" align="center"/>
          <el-table-column
            min-width="55"
            label="序号"
            align="center">
            <template slot-scope="scope">
              <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="通知类型"
            align="center"
            prop="kind"
            min-width="150">
            <template slot-scope="scope">
              <el-tag :type="noticeKindFormat(2, scope.row.kind)">{{noticeKindFormat(1, scope.row.kind)}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="通知标题"
            align="center"
            prop="noticeTitle"
            min-width="230">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row)"
                   v-hasPermi="['sel:selNotice:query']"
                   @click="handleDetail(scope.row)">
                <span>{{ scope.row.noticeTitle }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="发布时间"
            align="center"
            prop="publishTime"
            min-width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.publishTime == null ? '--' : parseTime(scope.row.publishTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="发布状态"
            align="center"
            prop="publishStatus"
            min-width="150">
            <template slot-scope="scope">
              <div :class="projectNameStyle(scope.row) + ' no-cursor-point'">
                <span>{{ scope.row.publishStatus === 1 ? '已发布' : '草稿' }}</span>
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
      </el-tab-pane>

      <el-tab-pane label="我收到的" name="2" v-hasPermi="['sel:selNotice:receiveNotice']">
        <el-table
          v-if="tabIndex === '2'"
          ref="table"
          v-loading="loading"
          :data="selNoticeList"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" min-width="40" align="center"/>
          <el-table-column
            label="序号"
            align="center"
            min-width="55">
            <template slot-scope="scope">
              <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="通知类型"
            align="center"
            prop="kind"
            min-width="200">
            <template slot-scope="scope">
              <el-tag :type="noticeKindFormat(2, scope.row.kind)">{{noticeKindFormat(1, scope.row.kind)}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="通知标题"
            align="center"
            prop="noticeTitle"
            min-width="230">
            <template slot-scope="scope">
              <div :class="projectNameStyle2(scope.row)"
                   v-hasPermi="['sel:selNotice:query']"
                   @click="handleDetail(scope.row, true)">
                <span>{{ scope.row.noticeTitle }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="发布部门"
            align="center"
            prop=""
            min-width="150">
            <template slot-scope="scope">
              <span>科信部</span>
            </template>
          </el-table-column>
          <el-table-column
            label="发布时间"
            align="center"
            prop="publishTime"
            min-width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.publishTime == null ? '--' : parseTime(scope.row.publishTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="是否已读"
            align="center"
            prop="readStatus"
            min-width="150">
            <template slot-scope="scope">
              <div :class="projectNameStyle2(scope.row) + ' no-cursor-point'">
                <span>{{ scope.row.readStatus === 1 ? '已读' : '未读' }}</span>
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
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      :title="title"
      :visible.sync="open"
      :width="type === 0 ? '500px' : '700px'"
      append-to-body
      :close-on-click-modal="false"
      :class="type === 0 ? 'el-dialog-center' : ''">
      <!--      申报弹窗-->
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="108px"
        v-if="type === 0"
        tyle="padding-top: 36px;">
        <el-form-item label="通知类型" prop="noticeId">
          <el-select
            v-model="form.kind"
            placeholder="请选择对应通知"
            style="width: 100%">
            <el-option
              v-for="item in noticeKind2"
              :key="item.kind"
              :label="item.name"
              :value="item.kind"
            ></el-option>
          </el-select>
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
import {byNoticeUpdate, delSelNotice, exportSelNotice, listSelNotice} from "@/api/sel/selNotice";

export default {
  name: "msgSelNotice",
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
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 评选通知表格数据
      selNoticeList: [],
      //0:弹出选择通知选项  1：奖励申报按钮   2：项目储备申报按钮
      type: 0,
      //所有通知类型
      noticeAllKinds: [
        {name: "奖励评选通知", kind: 1},
        {name: "项目储备通知", kind: 2},
        {name: "项目立项通知", kind: 3},
        {name: "专家选拔通知", kind: 12},
        {name: "证书下发通知", kind: 4},
        {name: "上传可研报告通知", kind: 5},
        {name: "完善公司信息通知", kind: 6},
        {name: "立项项目实施计划审核提醒通知", kind: 7},
        {name: "奖励评选打包通知", kind: 8},
        {name: "绿建打包通知", kind: 9},
        {name: "提醒上传绿建认证目标建议书签字版扫描件通知", kind: 10},
        {name: "环保项目打包通知", kind: 11},
        {name: "会议议程发布通知", kind: 13},
        {name: "会议纪要发布通知", kind: 14},
        {name: "项目编制计划审核结果通知", kind: 15},
        {name: "项目实施计划审核结果通知", kind: 16},
      ],
      //主动发送通知类型选择
      noticeSelKinds: [
        {name: "奖励评选通知", kind: 1},
        {name: "项目储备通知", kind: 2},
        {name: "项目立项通知", kind: 3},
        {name: "专家选拔通知", kind: 12},
        {name: "系统消息", kind: 0},
      ],
      noticeKind2: [
        {name: "奖励评选通知", kind: 1},
        {name: "项目储备通知", kind: 2},
        {name: "项目立项通知", kind: 3},
        {name: "专家选拔通知", kind: 12}
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        noticeObjective: undefined,
        declareEndDate: undefined,
        uploadEndDate: undefined,
        filePaths: undefined,
        parentId: undefined,
        publishStatus: undefined,
        publishTime: new Date().getFullYear() + '',
        type: '1'
      },
      // 表单参数
      form: {
        kind: ""
      },
      dateRange: [],
      tabIndex: '1',
      isSendNotice: true,
      industryTypeOptions: [],
      awardsTypeOptions: [],
      selNoticeOptions: [],
      // 表单校验
      rules: {
        noticeId: [
          {required: true, message: "评选通知不能为空", trigger: "blur"}
        ]
      }
    };
  },

  computed: {
    noticeKindFormat() {
      return (type, kind) => {
        const index = this.noticeSelKinds.findIndex(item => {
          return item.kind === kind
        })
        if (index === -1) {
          return type === 1 ? '系统消息' : 'info'
        } else {
          if (type === 1) {
            return this.noticeSelKinds[index].name
          } else {
            const kindList = {
              1: '',
              2: 'success',
              3: 'warning',
              12: 'warning',
            }
            return kindList[kind]
          }
        }
      }
    },
    token: {
      get() {
        return this.$store.state.user.token
      }
    },
    msgNoRead: {
      set(val) {
        this.$store.commit('SET_MSGNOREAD', val)
      },
      get() {
        return this.$store.state.user.msgNoRead
      }
    },
    projectNameStyle() {
      return (row) => {
        return row.publishStatus === 0 ? 'project-name-all-hover' : 'project-name-all'
      }
    },
    projectNameStyle2() {
      return (row) => {
        return row.readStatus === 0 ? 'project-name-all-hover' : 'project-name-all'
      }
    }
  },

  created() {
    this.getDicts("industry_type").then(response => {
      this.industryTypeOptions = response.data;
    });
    this.getDicts("award_type").then(response => {
      this.awardsTypeOptions = response.data;
    });
    this.getList();
  },

  mounted() {
    let tabDom = this.$refs.tab.$el;
    let tabs = tabDom.getElementsByClassName('el-tab-pane');
    let index = tabs[0].id.split('-')[1];
    setTimeout(() => {
      if (tabs.length < 2) {
        if (index == 1) {
          document.getElementById('tab-2').style.display = 'none';
        }
        if (index == 2) {
          document.getElementById('tab-1').style.display = 'none';
        }
      }
    }, 50)
    this.tabIndex = index;
    if (this.$route.query.tabIndex) {
      this.tabIndex = this.$route.query.tabIndex
    }
    this.queryParams.type = index;
    this.getList();
  },

  activated() {
    this.getList();
  },

  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //获取项目列表
    getList() {
      this.loading = true;
      listSelNotice(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.selNoticeList = response.rows;
        this.total = response.total;
        this.loading = false;
        const nowYear = new Date().getFullYear().toString();
        this.selNoticeList.map(item => {
          item.isEdit = true;
          if (item.createTime) {
            let year = this.parseTime(item.createTime, '{y}');
            if (year !== nowYear) item.isEdit = false;
          }
        })
      });
    },
    // 表单重置
    reset() {
      this.resetForm("form");
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.type = 0;
      // this.form.kind="";
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return delSelNotice(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      //0未发布,1已发布
      let status = selection.map(item => item.publishStatus)
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      if (!(status.indexOf(1) !== -1)) {
        this.multiple = !selection.length
      } else {
        this.multiple = true;
      }
    },

    //tab切换
    tabChange() {
      this.queryParams.type = this.tabIndex;
      this.getList();
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },

    /** 提交按钮 */
    submitForm: function () {
      if (this.type === 0) {
        if (this.form.kind === 1) {
          this.msgNoticeAdd()
        } else if (this.form.kind === 2) {
          this.open = false;
          let path = "/msg/selNotice/addPro";
          this.$router.push({
            "path": path,
            "query": {"kind": 2}
          })
        } else if (this.form.kind === 3) {
          this.open = false;
          let path = "/msg/selNotice/addReserve";
          this.$router.push({
            "path": path
          })
        } else if (this.form.kind === 12) {
          this.open = false;
          let path = "/msg/selNotice/addPro";
          this.$router.push({
            "path": path,
            "query": {"kind": 12}
          })
        }
      }
    },

    msgNoticeAdd() {
      listSelNotice(this.queryParams).then(response => {
        let selNoticeList = response.rows;
        let isSendNotice = true;
        const nowYear = new Date().getFullYear().toString();
        selNoticeList.map(item => {
          let year = this.parseTime(item.createTime, '{y}');
          if (year == nowYear && item.kind == 1) isSendNotice = false;
        })
        if (!isSendNotice) {
          this.msgInfo('今年已发布评选通知！')
          return false;
        }
        this.cancel();
        let path = "/msg/selNotice/addNotice";
        this.$router.push({
          "path": path
        })
      })
    },

    /** 详情按钮操作 */
    handleDetail(row, isHidden) {
      //更新通知
      byNoticeUpdate(row.id).then(response => {
        this.msgNoRead = this.msgNoRead - response.data;
      })
      const pathObj = {
        1: '/msg/selNotice/detailNotice',
        2: '/msg/selNotice/detailPro',
        3: '/msg/selNotice/detailReserve',
        4: '/sel/selRecognition',
        5: '/proManagement/storage/projectStorageInfo',
        6: '/user/profile',
        7: '/proManagement/proImplement/proLaunch/playPlanDetailKXB',
        8: '/sel/awardAudit',
        9: '/buildEnvironment/build/buildProject',
        10: '/buildEnvironment/build/confirmGoal',
        11: '/buildEnvironment/environment/project',
        12: '/msg/selNotice/detailPro',
        13: '/meeting/management/queryAgenda',
        14: '/meeting/management/editMeetingSummary',
        15: row.remark,
        16: row.remark
      }
      const path = pathObj[row.kind]
      let query = {}
      if (row.kind === 13) {
        query.id = row.remark
        this.$router.push({path, query})
      } else if (row.kind === 14) {
        query.id = row.remark
        query.onlyRead = '1'
        this.$router.push({path, query})
      } else if (row.kind === 15 || row.kind === 16) {
        query = {}
        this.$router.push({path, query})
      } else if (row.kind !== 7) {
        query.id = row.id
        query.hidden = isHidden
        this.$router.push({path, query})
      } else {
        let data = row.remark;
        let dataArr = data.split(',');
        query.id = dataArr[0].split(':')[1]
        query.detailFlag = '1'
        this.$router.push({path, query})
      }
    },

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有评选通知数据项?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportSelNotice(queryParams);
      }).then(response => {
        this.download(response.msg);
      }).catch(function () {
      });
    }
  }
};
</script>
