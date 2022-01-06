<template>
  <div class="app-container">
    <el-row class="mb10" :gutter="20">
      <el-col :span="1.5">
        <el-button
          type="primary"
          @click="handleSupplement(form)"
          v-show="(form.status !== '9' && form.additionalInformation === '0' && form.status !== '5') || (form.status === '2' && form.feasibleStatus === '0')"
          v-hasPermi="['project:projectStorageInfo:supplement']"
        >补充资料
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          @click="handleUpdate(form)"
          v-show="form.status === '1' || form.status === '4' || (form.submitType === '0' && form.status === '3' && form.additionalInformation === '1')"
          v-hasPermi="['project:projectStorageInfo:edit']"
        >编辑
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          @click="handleDelete(form)"
          v-show="form.status === '1' || form.status === '9'"
          v-hasPermi="['project:projectStorageInfo:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          @click="handleWithdraw(form)"
          v-show="form.status === '2'"
          v-hasPermi="['project:projectStorageInfo:withdraw']"
        >撤回
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          @click="handleInvalid(form)"
          v-show="form.status === '2'"
          v-hasPermi="['project:projectStorageInfo:invalid']"
        >作废
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          @click="handleBack"
        >返回
        </el-button>
      </el-col>
    </el-row>
    <div class="detail-title">{{ form.projectName }}</div>
    <div class="detail-hint">{{ form.createBy ? form.createBy : '' }}申报于{{parseTime(form.declareTime, '{y}-{m}-{d}') }}</div>
    <el-radio-group v-model="tabIndex" style="margin-bottom: 20px;">
      <el-radio-button label="1">项目基本信息</el-radio-button>
      <el-radio-button v-if="form.submitType === '0'" label="2">项目建议书</el-radio-button>
      <el-radio-button label="3">项目可研报告</el-radio-button>
    </el-radio-group>
    <el-form v-show="tabIndex === '1'" label-width="108px">
      <declareContent v-model="form" :edit="false"/>
    </el-form>
    <el-form v-if="tabIndex === '2'">
      <PdfView :src="form.adviceUrl"/>
    </el-form>
    <div v-if="tabIndex === '3'">
      <PdfView :src="form.feasibleUrl"/>
      <reportDetail v-model="form" :edit="false"/>
    </div>

    <el-tabs v-model="activeName">
      <el-tab-pane label="操作日志" name="1">
        <el-table ref="table" :data="logList">
          <el-table-column prop="operUserName" label="操作人"></el-table-column>
          <el-table-column prop="operName" label="操作事件">
            <template slot-scope="scope">
              <span>{{ scope.row.operName }}</span>
              <div v-if="scope.row.filePaths">
                <upload v-model="scope.row.filePaths" :edit="false"></upload>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="时间"></el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-tab-pane>
      <el-tab-pane label="历史版本" name="2">
        <el-table ref="table" :data="historyVersions">
          <el-table-column prop="createBy" label="操作人"></el-table-column>
          <el-table-column prop="createTime" label="操作时间"></el-table-column>
          <el-table-column prop="version" label="版本号"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button

                type="text"
                @click="handleDetail(scope.row)">查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="historyTotal > 0"
          :total="historyTotal"
          :page.sync="historyQueryParams.pageNum"
          :limit.sync="historyQueryParams.pageSize"
          @pagination="getHistoryList"
        />
      </el-tab-pane>
      <el-tab-pane label="审批历史" name="3">
        <el-table ref="table" :data="approvalHis">
          <el-table-column prop="operUserName" label="操作人"></el-table-column>
          <el-table-column prop="operName" label="审批意见"></el-table-column>
          <el-table-column prop="createTime" label="时间"/>
        </el-table>
        <pagination
          v-show="approvalTotal > 0"
          :total="approvalTotal"
          :page.sync="approvalParams.pageNum"
          :limit.sync="approvalParams.pageSize"
          @pagination="getHistoryList"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  delProjectStorageInfo,
  getProjectStorageInfo,
  listProjectStorageInfo,
  operation
} from "@/api/storage/projectStorageInfo";
import {listProjectStorageAdvice} from "@/api/storage/projectStorageAdvice";
import declareContent from './declare';
import reportDetail from './report-detail';
import {listOperLog} from "@/api/storage/operLog";
import PdfView from "@/components/PdfView";

export default {
  name: "proManagement-storage-projectStorageInfo-detail",
  components: {
    PdfView, declareContent, reportDetail
  },
  data() {
    return {
      // 项目通知ID字典
      noticeIdOptions: [],
      // 申报年度字典
      declareYearOptions: [],
      // 项目类别字典
      typeOptions: [],
      // 项目属性字典
      attriOptions: [],
      // 研究领域字典
      areaOptions: [],
      // 状态字典
      statusOptions: [],
      // 表单参数
      form: {},
      tabIndex: '1',
      proposalForm: {},
      activeName: '1',
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 历史版本总条数
      historyTotal: 0,
      // 历史版本查询条件
      historyQueryParams: {
        pageNum: 1,
        pageSize: 10,
        infoId: undefined
      },
      logList: [],
      // 历史版本
      historyVersions: [],
      approvalParams: {
        pageNum: 1,
        pageSize: 10,
        infoId: undefined,
        type: "1"
      },
      // 审核历史总条数
      approvalTotal: 0,
      approvalHis: []
    };
  },
  computed: {
    id: function () {
      return this.$route.query.id
    }
  },
  activated() {
    this.init();
  },
  created() {
    this.init();
    this.getDicts("project_storage_attri").then(response => {
      this.attriOptions = response.data;
    });
    this.getDicts("project_storage_area").then(response => {
      this.areaOptions = response.data;
    });
    this.getDicts("project_storage_status").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    init() {
      const id = this.$route.query.id;
      getProjectStorageInfo(id).then(response => {
        this.form = response.data;
      });
      this.getList();
      this.getHistoryList();
      listProjectStorageAdvice({
        infoId: id
      }).then(response => {
        if (response.rows.length > 0) {
          this.proposalForm = response.rows[0];
        }
      });
    },
    getHistoryList() {
      this.historyQueryParams.infoId = this.$route.query.id;
      listProjectStorageInfo(this.historyQueryParams).then(res => {
        this.historyVersions = res.rows;
        this.historyTotal = res.total;
      })
    },
    getList() {
      this.queryParams.infoId = this.id;
      listOperLog(this.queryParams).then(response => {
        this.logList = response.rows;
        this.total = response.total;
      });
      this.approvalParams.infoId = this.$route.query.id;
      listOperLog(this.approvalParams).then(response => {
        this.approvalHis = response.rows;
        this.approvalTotal = response.total;
      });
    },
    handleDetail(row) {
      let path = "/proManagement/storage/projectStorageInfo/historyDetail"
      let id = row.id;
      this.$router.push({
        "path": path,
        "query": {"id": id, "type": 1}
      })
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      operation({"infoId": row.id, "operation": "6"}).then((res) => {
        if (res.code === 200) {
          if (row.submitType === '0') {
            this.$router.push({
              path: '/proManagement/storage/projectStorageInfo/report',
              query: {
                id: row.id
              }
            })
          } else {
            this.$router.push({
              path: '/proManagement/storage/projectStorageInfo/report',
              query: {
                id: row.id
              }
            })
          }
        }
      }).catch(res => {
        this.init();
      })
    },

    // 撤回
    handleWithdraw(row) {
      this.$confirm('确认要撤回吗？', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        operation({"infoId": row.id, "operation": "1"}).then(res => {
          if (res.code === 200) {
            this.msgSuccess("撤回成功！")
            this.init();
          } else {
            this.msgError(res.msg);
          }
        })
      })
    },

    // 作废
    handleInvalid(row) {
      this.$confirm('您确定要作废吗？', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        operation({"infoId": row.id, "operation": "2"}).then(res => {
          if (res.code === 200) {
            this.msgSuccess("作废成功！")
            this.init();
          } else {
            this.msgError(res.msg);
          }
        })
      })
    },

    // 补充资料
    handleSupplement(row) {
      operation({"infoId": row.id, "operation": "5"}).then(res => {
        if (res.code === 200) {
          this.$router.push({
            path: '/proManagement/storage/projectStorageInfo/report',
            query: {
              id: row.id,
              supplement: 1
            }
          })
        } else {
          this.msgError(res.msg);
        }
      })
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id
      this.$confirm('是否确认删除当前项目?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return delProjectStorageInfo(ids);
      }).then(() => {
        this.msgSuccess("删除成功");
        this.handleBack()
      }).catch(() => {
      });
    },

    /** 返回 */
    handleBack() {
      let path = "/proManagement/storage/projectStorageInfo"
      this.$router.push({"path": path})
    }
  }
};
</script>
