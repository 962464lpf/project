<template>
  <div class="voucher-list">
    <div class="main-center">
      <el-table
        ref="table"
        v-loading="loading"
        :data="paymentVoucherList">
        <el-table-column
          label="序号"
          width="55"
          align="center"
          type="index">
          <template slot-scope="scope">
            <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="款项"
          align="center"
          prop="projectName">
          <template slot-scope="scope">
            <span>{{'第' + ((queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1) + '笔款项' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="应付金额(元)"
          align="center"
          width="160"
          prop="moneyAmount">
        </el-table-column>
        <el-table-column
          label="实付金额(元)"
          align="center"
          width="160"
          prop="paidAmount">
        </el-table-column>
        <el-table-column
          label="付款时间"
          align="center"
          width="140"
          prop="payTime">
        </el-table-column>
        <el-table-column
          label="经办人"
          align="center"
          width="140"
          prop="agentPerson">
        </el-table-column>
        <el-table-column
          label="付款凭证"
          align="center"
          class-name="small-padding fixed-width"
          fixed="right"
          width="200">
          <template slot-scope="scope">
            <div v-if="scope.row.payTime">
              <el-button
                type="text"
                v-hasPermi="['pro:proMoneyPlanVocher:add']"
                @click="addMoneyVoucher(scope.row)">补充付款凭证
              </el-button>
              <el-button
                type="text"
                v-hasPermi="['pro:proMoneyPlanVocher:list']"
                @click="queryMoneyVoucher(scope.row)">查看凭证
              </el-button>
            </div>
            <div v-else>
              <el-button
                type="text"
                v-hasPermi="['pro:proMoneyPlanVocher:add']"
                @click="addMoneyVoucher(scope.row)">上传付款凭证
              </el-button>
            </div>
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
    <el-dialog
      :title="option1.title"
      :visible.sync="option1.open"
      width="600px"
      append-to-body
      :show-close="false"
      :close-on-click-modal="false">
      <div class="dialog-center">
        <el-form ref="voucherForm" :model="voucherForm" :rules="voucherRules" label-width="96px">
          <el-form-item label="实付金额" prop="payAmount">
            <m-input
              style="width: 50%"
              v-model="voucherForm.payAmount"
              inputType="yuan"/>
          </el-form-item>
          <el-form-item label="付款时间" prop="payTime">
            <el-date-picker
              v-model="voucherForm.payTime"
              style="width: 50%"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="付款凭证" prop="voucherPath">
            <upload v-model="voucherForm.voucherPath"/>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button style="width: 100px" type="primary"  @click="submitForm">确 定</el-button>
        <el-button style="width: 100px"   @click="cancelClose">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="option2.title"
      :visible.sync="option2.open"
      width="60%"
      append-to-body
      :close-on-click-modal="false">
      <div class="dialog-center">
        <div class="table-data">
          <el-table
            ref="table"
            v-loading="loading"
            max-height="500"
            :data="voucherHistoryList">
            <el-table-column
              width="55"
              label="序号"
              align="center"
              type="index">
              <template slot-scope="scope">
                <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column
              width="160"
              label="实付金额(元)"
              align="center"
              prop="payAmount"/>
            <el-table-column
              width="140"
              label="付款时间"
              align="center"
              prop="payTime"/>
            <el-table-column
              width="140"
              label="经办人"
              align="center"
              prop="createBy">
            </el-table-column>
            <el-table-column
              label="付款凭证"
              align="center"
              prop="voucherPath">
              <template slot-scope="scope">
                <div class="table-upload-center">
                  <upload :edit="false" v-model="scope.row.voucherPath"/>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="table-pagination">
          <pagination
            v-show="total2 > 0"
            :total="total2"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getVoucherList()"/>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {saveMoneyPlanVoucher, selectMoneyPlan, selectMoneyVoucher} from "@/api/pro/proContractFund";
import {getProApprovalInfo} from "@/api/pro/proApprovalInfo";

export default {
  name: "voucherList",
  props: {
    contractId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        contractId: null
      },
      paymentVoucherList: [],
      option1: {
        open: false,
        title: '付款凭证'
      },
      voucherForm: {
        contractId: null,
        moneyPlanId: null,
        payAmount: null,
        payTime: null,
        voucherPath: null
      },
      voucherRules: {
        payAmount: [
          {required: true, message: "实付金额不能为空", trigger: "blur"}
        ],
        payTime: [
          {required: true, message: "付款时间不能为空", trigger: "blur"}
        ],
        voucherPath: [
          {required: true, message: "付款凭证不能为空", trigger: "blur"}
        ]
      },
      option2: {
        open: false,
        title: '付款凭证'
      },
      queryParams2: {
        pageNum: 1,
        pageSize: 10,
        moneyPlanId: null
      },
      total2: 0,
      voucherHistoryList: [],
      moneyPlanId: null
    }
  },
  created() {
    this.getList()
  },
  computed: {
    contractInfoId() {
      return this.contractId
    }
  },
  methods: {
    //列表
    getList() {
      this.loading = true;
      this.queryParams.contractId = this.contractInfoId
      selectMoneyPlan(this.queryParams).then(({rows, total}) => {
        this.paymentVoucherList = rows;
        this.total = total;
        this.$emit('refreshbs')
        this.loading = false;
      });
    },
    //获取付款凭证历史列表
    getVoucherList() {
      this.queryParams2.moneyPlanId = this.moneyPlanId
      selectMoneyVoucher(this.queryParams2).then(({rows, total}) => {
        if (rows && rows.length > 0) {
          this.voucherHistoryList = rows;
          this.total2 = total;
        }
      });
    },
    //增加付款凭证
    addMoneyVoucher(row) {
      getProApprovalInfo(row.infoId).then(({data}) => {
        if (data.proStatus != 8) {
          if ((data.setupStatus === 0 && data.proStatus == 4) || (data.setupStatus !== 0)) {
            this.option1.open = true
            this.moneyPlanId = row.id
          } else {
            this.msgError('当前项目已暂停，不可操作')
          }
        } else {
          this.msgInfo('当前项目已验收，不可操作')
        }
      })
    },
    //查看付款凭证
    queryMoneyVoucher(row) {
      this.option2.open = true
      this.moneyPlanId = row.id
      this.getVoucherList()
    },
    //提交按钮
    submitForm() {
      this.$refs["voucherForm"].validate(valid => {
        if (valid) {
          this.voucherForm.contractId = this.contractInfoId
          this.voucherForm.moneyPlanId = this.moneyPlanId
          saveMoneyPlanVoucher(this.voucherForm).then(() => {
            this.msgSuccess('提交成功')
            this.getList()
            this.cancelClose()
            this.voucherForm = {
              payAmount: null,
              payTime: null,
              voucherPath: null
            }
          })
        }
      })
    },
    //取消关闭
    cancelClose() {
      this.$refs["voucherForm"].clearValidate()
      this.option1.open = false
    }
  }
}
</script>

<style lang="scss" scoped>
.voucher-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .main-center {
    width: 100%;
  }
  .main-footer {
    width: 420px;
    margin-top: 20px;
  }
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
