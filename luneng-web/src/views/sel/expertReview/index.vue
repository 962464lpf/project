<template>
  <div class="app-container">
    <div class="header">
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true">
        <el-form-item label="产业类别" prop="industryType">
          <el-select
            v-model="queryParams.industryType"
            placeholder="请选择产业类别"
            clearable
            style="width: 200px"
            >
            <el-option
              v-for="dict in industryTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"/>
          </el-select>
        </el-form-item>
        <el-form-item label="评审年度" prop="reviewYear">
          <el-select
            @visible-change = "handleShowSelect"
            v-model="queryParams.reviewYear"
            placeholder="请选择评审年度"
            clearable
            style="width: 200px"
            >
            <el-option
              v-for="item in reviewYears"
              :key="item"
              :label="item"
              :value="item"/>
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
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              :disabled="isShowSelBtn"
              @click="selExpertGroup"
              v-hasPermi="['expert:expertGroup:list']">选择专家组
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          :data="selReviewList"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            min-width="40"
            align="center" />
          <el-table-column
            label="序号"
            align="center"
            min-width="55"
            type="index">
            <template slot-scope="scope">
              <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="申报奖项"
            min-width="130"
            align="center"
            prop="awardsType"
            :formatter="awardsTypeFormat"
             />
          <el-table-column
            label="产业类别"
            min-width="100"
            align="center"
            prop="industryType"
            :formatter="industryTypeFormat"
             />
          <el-table-column
            label="评审项目(打分)"
            align="center"
            min-width="140"
            prop="reviewScore">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-hasPermi="['expert:expertReview:list']"
                @click="navReviewScore(scope.row)">评审项目
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="评审年度"
            align="center"
            prop="reviewYear"
            min-width="100"/>
          <el-table-column
            label="专家组"
            min-width="160"
            align="center"
            prop="expertGroupId">
              <template slot-scope="scope">
                <el-button
                  v-if="!scope.row.expertGroupId"
                  type="text"
                  :disabled="scope.row.status == '1'"
                  @click="selExpertGroup(scope.row)"
                  v-hasPermi="['expert:expertGroup:list']">选择专家组
                </el-button>
                <el-button
                  v-else
                  type="text"
                  :disabled="scope.row.status == '1'"
                  @click="navGroupMember(scope.row)"
                  v-hasPermi="['expert:expertReview:setExpertGroup']">
                  {{scope.row.expertGroupName + '专家组'}}
                </el-button>
              </template>
          </el-table-column>
          <el-table-column
            label="评审时间"
            align="center"
            min-width="170"
            >
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.reviewEndTime"
                type="text"
                @click="setReviewTime(scope.row)"
                v-hasPermi="['expert:expertReview:setTime']">设置评审时间
              </el-button>
              <span
                v-else
                v-hasPermi="['expert:expertReview:setTime']"
                @click="setReviewTime(scope.row)">
                {{scope.row.reviewBeginTime}} - {{scope.row.reviewEndTime}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="签到表"
            align="center"
            class-name="small-padding fixed-width"
            fixed="right"
            width="160">
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.filePaths"
                type="text"
                icon="el-icon-upload"
                :disabled="scope.row.expertGroupId ? false : true"
                @click="handleUploadSign(scope.row)"
                v-hasPermi="['expert:expertReview:reupload']">上传专家签到表
              </el-button>
              <div v-else>
                <el-button
                  type="text"
                  icon="el-icon-upload"
                  @click="handleUploadSign(scope.row)"
                  v-hasPermi="['expert:expertReview:reupload']">重传
                </el-button>
                <el-button
                  type="text"
                  icon="el-icon-s-open"
                  @click="handleViewSign(scope.row)"
                  v-hasPermi="['expert:expertReview:querySign']">查看签到表
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="main-footer">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"/>
      </div>
    </div>
    <div>
      <!-- 选择专家组对话框 -->
      <el-dialog
        :title="selExpertGroupDialog .title"
        :visible.sync="selExpertGroupDialog.open"
        width="400px"
        append-to-body  :close-on-click-modal="false"
        @close="closeSelExpertGroup">
        <el-form
          :model="selExpertGroupFrom"
          ref="selExpertGroupFrom"
          :inline="true">
          <el-form-item label="专家组" prop="inExpertGroupId">
            <el-select
              v-model="selExpertGroupFrom.expertGroupId"
              placeholder="请选择专家组"
              clearable
              style="width: 250px"
              >
              <el-option
                v-for="item in allExpertGroups"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
            <div class="el-upload__tip" style="color: red">
              专家组的成员在三人及以上才会在此显示并可选择
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" style="text-align: center" class="dialog-footer">
          <el-button style="width: 110px" type="primary" @click="submitSelExpertGroup">确 定</el-button>
          <el-button style="width: 110px"  @click="navAddExpertGroup">新增专家组</el-button>
        </div>
      </el-dialog>
      <!-- 设置评审时间对话框 -->
      <el-dialog
        :title="datePickerDialog.title"
        :visible.sync="datePickerDialog.open"
        width="500px"
        append-to-body :close-on-click-modal="false">
        <div class="date-picker-box">
          <el-date-picker
            v-model="datePickerValue"
            type="datetimerange"
            align="right"

            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="timePickerOptions">
          </el-date-picker>
        </div>
        <div slot="footer" style="text-align: center" class="dialog-footer">
          <el-button type="primary" @click="confirmDatePicker">确 定</el-button>
          <el-button @click="cancelDatePicker">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 上传专家签到表对话框 -->
      <el-dialog
        :title="uploadSignDialog.title"
        :visible.sync="uploadSignDialog.open"
        width="420px"
        append-to-body :close-on-click-modal="false">
        <el-form
          :model="uploadSignFrom"
          ref="uploadSignFrom"
          :inline="true">
          <el-form-item label="" prop="filePaths">
            <upload
              accept=".pdf"
              :limit="pdfLimit"
              v-model="uploadSignFrom.filePaths"/>
            <div class="el-upload__tip" style="color: red">
              仅支持PDF格式的文件，分辨率300dpi彩色，仅限一个且不超过50M
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" style="text-align: center" class="dialog-footer">
          <el-button type="primary" @click="submitUploadSignFrom">提 交</el-button>
          <el-button @click="cancelUploadSignFrom">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  listExpertReview,
  updateExpertReview,
  selExpertReviewGroup
} from "@/api/expert/expertReview";

import {
  selExpertGroup
} from "@/api/expert/expertGroup";


export default {
  name: "",
  data() {
    return {
      // 加载等待线
      loading: false,
      //控制是否显示选择专家组按钮
      isShowSelBtn: true,
      // 表格选中数组id串
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 申报待评审列表
      selReviewList: [],
      // 申报奖项字典
      decRewardOptions: [],
      // 产业类别字典
      industryTypeOptions: [],
      // 评审年份列表
      reviewYears: [],
      // 搜索框查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        industryType: undefined,
        reviewYear: new Date().getFullYear()
      },

      // 所有可选的专家组
      allExpertGroups: [],
      // 选择专家组对话框控制
      selExpertGroupDialog: {
        title: "选择专家组",
        open: false
      },
      // 选择专家组表单
      selExpertGroupFrom: {
        ids: null,
        expertGroupId: null
      },
      // 设置评审时间对话框控制
      datePickerDialog: {
        title: "设置评审时间",
        open: false
      },
      // 事件当前申报评审的id
      currDeclaredItemId: null,
      // 已选择设置的时间
      datePickerValue: null,
      // 时间日期选择器的额外选项
      timePickerOptions: {
        // 设置当前时间之前不可选
        disabledDate(date) {
          return date.getTime() < Date.now() - 8.64e7
        }
      },

      // 上传专家签到表对话框控制
      uploadSignDialog: {
        title: "上传专家签到表",
        open: false
      },
      // 上传专家签到表表单
      uploadSignFrom: {
        id: null,
        filePaths: undefined
      },
      //上传文件相关配置
      pdfLimit: 1
    }
  },
  created() {
    //获取申报待评审列表
    this.getList()
    //申报奖项字典
    this.getDicts("dec_reward_type").then(response => {
        this.decRewardOptions = response.data;
    });
    //产业类别字典
    this.getDicts("industry_type").then(response => {
        this.industryTypeOptions = response.data;
    });
  },

  methods: {
    /*********************** 数据获取及处理 ***********************/
    /** 获取申报待评审列表 */
    getList() {
      this.loading = true;
      listExpertReview(this.queryParams).then(response => {
        console.log(response.rows);
        this.selReviewList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 申报奖项字典翻译
    awardsTypeFormat(row, column) {
      return this.selectDictLabel(this.decRewardOptions, row.awardsType);
    },
    // 产业类别字典翻译
    industryTypeFormat(row, column) {
      return this.selectDictLabel(this.industryTypeOptions, row.industryType);
    },
    //申报年度下来框出现时
    handleShowSelect(value) {
      if(value === true) {
        this.$store.dispatch("GetInfo").then(response => {
          this.reviewYears = response.yearList;
        })
      }
    },

    /*********************** 交互操作 ***********************/
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
      const idsTem = selection.map(item => {
        if(item.status != '1') {
          return item.id
        }
      })
      console.log(idsTem)
      if(idsTem.indexOf(undefined) !== -1) {
        this.$message.warning("所选申报项目中含有已不能设置专家组的项目")
      }else {
        this.ids = idsTem
        this.isShowSelBtn = this.ids.length <= 0
      }
      this.single = selection.length!=1
      this.multiple = !selection.length
    },

    /********** 选择专家组按钮操作(需打开对话框) **********/
    selExpertGroup(row) {
      let idsTem = []
      if(row.id != undefined) {
        idsTem.push(row.id)
      }else {
        idsTem = this.ids
      }
      console.log(idsTem);
      selExpertGroup().then(res => {
        this.allExpertGroups = res.data
        if(idsTem.length > 0) {
          this.selExpertGroupFrom.ids = idsTem
          this.selExpertGroupDialog.open = true
        }else {
          this.$message({
            type: "warning",
            message: '请先选择需要选择专家组的申报项目'
          })
        }
      })
    },
    //确定选择的专家组
    submitSelExpertGroup() {
      console.log(this.selExpertGroupFrom)
      selExpertReviewGroup(this.selExpertGroupFrom).then(res => {
        console.log(res);
        this.selExpertGroupFrom = {
          ids: null,
          expertGroupId: null
        }
        this.getList()
        this.selExpertGroupDialog.open = false
      })
    },
    //跳转添加新的专家组
    navAddExpertGroup() {
      const path = "/expert/expertGroup/addExpertGroup"
      const backExpertReviewFlag = '0'
      this.$router.push({
        "path": path,
        "query": {
          "backExpertReviewFlag": backExpertReviewFlag
        }
      })
    },
    //关闭选择专家组对话框重置表单
    closeSelExpertGroup() {
      this.selExpertGroupFrom = {
        ids: null,
        expertGroupId: null
      }
    },
    //跳转评审项目打分(id)
    navReviewScore(row) {
      const path = "/sel/expertReview/reviewScore"
      const id = row.id
      const expertGroupId = row.expertGroupId
      this.$router.push({
        "path": path,
        "query": {
          "id": id,
          "expertGroupId": expertGroupId
        }
      })
    },
    //查看该专家组成员(id)
    navGroupMember(row) {
      const path = "/expert/expertGroup/manageMember/addMember"
      const expertGroupId = row.expertGroupId
      this.$router.push({
        "path": path,
        "query": {
          "expertGroupId": expertGroupId,
          "expertReviewFlag": "0"
        }
      })
    },
    /************* 设置评审时间按钮(需打开对话框) *************/
    setReviewTime(row) {
      if (row.uploadEndDate) {
        const lastDay = (new Date().getFullYear() + '-12-31' + ' ' + '23:59:59').replace(/-/g, '/')
        const lastDayTime = new Date(lastDay).getTime()
        const currTime = new Date().getTime()
        if (row.reviewBeginTime) {
          this.datePickerValue = [row.reviewBeginTime, row.reviewEndTime]
          const reviewBeginTime = row.reviewBeginTime.replace(/-/g, '/')
          const reviewBeginTimeTem = new Date(reviewBeginTime).getTime()
          if (currTime < reviewBeginTimeTem) {
            this.initDatePicker(row.id, row.uploadEndDate.replace(/-/g, '/'), lastDayTime)
          } else {
            this.$message.warning("评审设置时间已过")
          }
        } else {
          this.initDatePicker(row.id, row.uploadEndDate.replace(/-/g, '/'), lastDayTime)
        }
      } else {
        this.$message.warning("请先设置资料补充的截止时间")
      }
    },
    //打开时间设置初始化
    initDatePicker(id, uploadEndDate, lastDayTime) {
      this.currDeclaredItemId = id
      this.timePickerOptions = {
        disabledDate(date) {
          return date.getTime() < (new Date(uploadEndDate).getTime() + 8.64e7) || date.getTime() >= lastDayTime
        }
      }
      this.datePickerDialog.open = true
    },

    //确定设置申报的时间
    confirmDatePicker() {
      if(this.datePickerValue && this.datePickerValue.length!==0) {
        const reviewBeginTime = this.parseTime(this.datePickerValue[0],'{y}-{m}-{d} {h}:{i}:{s}')
        const reviewEndTime = this.parseTime(this.datePickerValue[1],'{y}-{m}-{d} {h}:{i}:{s}')
        const dataTem = {
          id: this.currDeclaredItemId,
          reviewBeginTime,
          reviewEndTime
        }
        this.datePickerDialog.open = false
        updateExpertReview(dataTem).then(res => {
          console.log(res);
          this.getList()
          this.currDeclaredItemId = null
          this.datePickerValue = null
        })
      } else {
        this.$message.warning("请先选择您需要设置的时间")
      }
    },
    //取消申报时间重置表单数据
    cancelDatePicker() {
      this.currDeclaredItemId = null
      this.datePickerValue = null
      this.datePickerDialog.open = false
    },
    /************* 上传专家签到表(需打开对话框) *************/
    handleUploadSign(row) {
      this.uploadSignDialog.open = true
      this.uploadSignFrom.id = row.id
    },
    //提交上传的专家签到表
    submitUploadSignFrom() {
      console.log(this.uploadSignFrom);
      const filePaths = JSON.parse(this.uploadSignFrom.filePaths)
      const dataTem = filePaths[0].fileName
      const reg = /\.pdf$/
      if(reg.test(dataTem)) {
        this.uploadSignDialog.open = false
        updateExpertReview(this.uploadSignFrom).then(() => {
          this.$message.success('上传签到表成功')
          this.resetForm("uploadSignFrom")
          this.getList()
        })
      }else {
        this.$message.warning('请上传pdf格式')
      }
    },
    //取消上传专家签到表
    cancelUploadSignFrom() {
      this.resetForm("uploadSignFrom")
      this.uploadSignDialog.open = false
    },
    //查看专家签到表(id)
    handleViewSign(row) {
      const path = "/sel/expertReview/expertSignDetail"
      const id = row.id
      this.$router.push({
        "path": path,
        "query": {
          "id": id
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
      .main-top, .main-center{
        width: 100%;
      }
      .main-footer{
        width: 420px;
        margin-top: 20px;
      }
    }
    .date-picker-box {
      width: 500px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .dialog-footer {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
