<template>
  <div class="app-container">
    <div class="header">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true">
        <el-form-item label="合同名称" prop="contractName">
          <el-input
          v-model="queryParams.contractName"
          placeholder="请输入合同名称"
          clearable
          style="width: 200px"
          @keyup.enter.native="handleQuery"
        />
        </el-form-item>
        <el-form-item label="年度" prop="curYearTem">
          <el-date-picker
            v-model="curYearTem"
            :clearable="false"
            style="width: 200px"
            type="year"
            placeholder="请选择年度">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="支付状态" prop="complete">
          <el-select
            v-model="queryParams.complete"
            placeholder="请选择支付状态"
            clearable
            style="width: 200px">
            <el-option
              v-for="item in payCompleteOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"/>
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
      <div class="main-top">

      </div>
      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          :data="fundManagementList">
          <el-table-column
            label="序号"
            width="60"
            align="center"
            type="index">
            <template slot-scope="scope">
              <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="合同名称"
            align="center"
            min-width="230"
            prop="contractName">
            <template slot-scope="scope">
              <div>
                <span>{{ scope.row.contractName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="承担单位"
            width="200"
            align="center"
            prop="undertakeUnit"/>
          <el-table-column
            width="90"
            label="年度"
            align="center"
            prop="approvalYear"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            width="140"
            label="总金额(元)"
            align="center"
            prop="contractAmount"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            width="140"
            label="支付进度"
            align="center"
            prop="paymentScheduling"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-progress
                :text-inside="true"
                :stroke-width="24"
                :percentage="scope.row.paymentScheduling"
                status="success"></el-progress>
            </template>
          </el-table-column>
          <el-table-column
            width="140"
            label="已付金额(元)"
            align="center"
            prop="paidAmount"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            width="140"
            label="未付款金额(元)"
            align="center"
            prop="unpaidAmount"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="付款凭证"
            align="center"
            class-name="small-padding fixed-width"
            fixed="right"
            width="120">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-hasPermi="['pro:proMoneyPlan:selectMoneyPlan']"
                @click="paymentVoucher(scope.row)">付款凭证
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
  </div>
</template>

<script>
import {listFundManagement} from "@/api/pro/proContractFund";

export default {
  name: "",
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
        contractName: '',
        curYear: null,
        complete: ''
      },
      curYearTem: new Date(),
      //合同经费管理
      fundManagementList: [],
      payCompleteOptions: []
    }
  },
  created() {
    //获取接口数据
    this.getList()
    //获取字典数据
    this.getDicts("contract_pay_status").then(response => {
      this.payCompleteOptions = response.data;
    });
  },
  methods: {
    /*********************** 数据获取及处理 ***********************/
    /** 获取申报待评审列表 */
    getList() {
      this.loading = true;
      this.queryParams.curYear = this.parseTime(this.curYearTem, "{y}");
      listFundManagement(this.queryParams).then(({rows, total}) => {
        this.fundManagementList = rows;
        this.total = total;
        this.loading = false;
      });
    },
    // 研究领域字典翻译

    /*********************** 交互操作 ***********************/
    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.curYearTem = new Date()
      this.resetForm("queryForm");
      this.handleQuery();
    },
    //跳转付款凭证信息
    paymentVoucher(row) {
      const id = row.id
      const contractName = row.contractName
      const path = '/proManagement/proImplement/fundManagement/paymentVoucher'
      this.$router.push({
        'path': path,
        'query': {
          id,
          contractName
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
    .main-top, .main-center {
      width: 100%;
    }
    .main-footer {
      width: 420px;
      margin-top: 20px;
    }
  }
  .dialog-center {
    width: 100%;
    display: flex;
    justify-content: center;
    span {
      color: #333;
      margin-right: 20px;
    }
  }
}
</style>
