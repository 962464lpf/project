<template>
  <div class="dialog-box">
    <el-dialog
      :title="dialogObj.title"
      :visible.sync="dialogObj.open"
      width="60%"
      append-to-body :close-on-click-modal="false">
      <div class="dialog-center">
        <div class="table-data">
          <el-table
            ref="table"
            v-loading="loading"
            :data="storageInfoList"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55"
              align="center" />
            <el-table-column
              label="序号"
              align="center"
              width="60"
              type="index">
              <template slot-scope="scope">
                <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column
              width="230"
              label="项目名称"
              align="center"
              prop="projectName"/>
            <el-table-column
              width="200"
              label="申报单位"
              align="center"
              prop="subordinateUnit"/>
            <el-table-column
              width="120"
              label="项目类别"
              align="center"
              prop="type">
            </el-table-column>
            <el-table-column
              width="120"
              label="项目属性"
              align="center"
              prop="attri"
              :formatter="attriFormat"/>
            <el-table-column
              width="150"
              label="研究领域"
              align="center"
              prop="area"
              :formatter="areaFormatter">
            </el-table-column>
<!--            <el-table-column-->
<!--              label="主要研究内容"-->
<!--              align="center"-->
<!--              prop="content"-->
<!--              show-overflow-tooltip>-->
<!--            </el-table-column>-->
<!--            <el-table-column-->
<!--              label="预期目标"-->
<!--              align="center"-->
<!--              prop="target"-->
<!--              show-overflow-tooltip />-->
            <el-table-column
              width="100"
              label="起始时间"
              align="center"
              prop="beginDate">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.beginDate, '{y}-{m}') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              width="100"
              label="结束时间"
              align="center"
              prop="endTime">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.endDate, '{y}-{m}') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              width="110"
              label="项目负责人"
              align="center"
              prop="headName"/>
            <el-table-column
              width="120"
              label="下年计划投入(万元)"
              align="center"
              prop="planInvestment"/>
<!--            <el-table-column-->
<!--              width="120"-->
<!--              label="备注"-->
<!--              align="center"-->
<!--              prop="remark"-->
<!--              show-overflow-tooltip />-->
            <el-table-column
              label="分级评分"
              align="center"
              class-name="small-padding fixed-width"
              prop="reviewResult"
              :formatter="levelFormat"
              fixed="right"
              width="90">
            </el-table-column>
          </el-table>
        </div>
        <div class="table-pagination">
          <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"/>
        </div>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button style="width: 100px" type="primary"  @click="submitConfirm">确 定</el-button>
        <el-button style="width: 100px"   @click="cancelClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {saveProApprovalInfo, selProApprovalInfo} from "@/api/pro/proApprovalInfo";

export default {
  name: "ReserveProDialog",
  props: {
    dialogOption: {
      type: Object,
      default() {
        return {
          title: '对话框',
          open: false
        }
      }
    }
  },
  data() {
    return {
      // 搜索框查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        curYear: new Date().getFullYear()
      },
      //加载线
      loading: false,
      // 表格选中数组id串
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      //总条数
      total: 0,
      //储备库项目列表
      storageInfoList: [],
      attriOptions: [],
      areaOptions: [],
      proLevelOptions: []
    }
  },
  computed: {
    //对话框属性
    dialogObj() {
      return this.dialogOption
    }
  },
  created() {
    this.getDicts("project_storage_attri").then(response => {
      this.attriOptions = response.data;
    });
    this.getDicts("project_storage_area").then(response => {
      this.areaOptions = response.data;
    });
    this.getDicts("project_storage_level").then(response => {
      this.proLevelOptions = response.data;
    });
  },
  watch: {
    'dialogOption.open' (newValue) {
      if (newValue === true) {
        //打开对话框时获取列表数据
        this.getList()
      }
    }
  },
  methods: {
    /*********************** 数据获取 ***********************/
    getList() {
      //获取储备项目
      this.loading = true
      selProApprovalInfo(this.queryParams).then(({rows, total}) => {
        this.loading = false
        this.storageInfoList = rows
        this.total = total
      })
    },
    // 项目属性字典翻译
    attriFormat({attri}) {
      return this.selectDictLabel(this.attriOptions, attri);
    },
    // 研究领域字典翻译
    areaFormatter({area}) {
      return this.selectDictLabel(this.areaOptions, area);
    },
    // 研究领域字典翻译
    levelFormat({reviewResult}) {
      return this.selectDictLabel(this.proLevelOptions, reviewResult);
    },
    /*********************** 交互操作 ***********************/
    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    //确认选择立项项目
    submitConfirm() {
      const ids = this.ids
      if (ids.length > 0) {
        saveProApprovalInfo(ids).then(({code}) => {
          if (code === 200) {
            this.dialogObj.open = false
            this.msgSuccess("添加成功！")
            this.$emit("selSuccess")
          }
        })
      } else {
        this.$message({
          type: "warning",
          message: '您还没有选择需要立项的项目'
        })
      }
    },
    //取消关闭
    cancelClose() {
      this.dialogObj.open = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-box {
  width: 100%;
  .dialog-center {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .table-data, .table-pagination {
      width: 100%;
    }
  }
}
</style>
