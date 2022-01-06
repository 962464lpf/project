<template>
  <div class="app-container">
    <div class="header">
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true">
        <!--
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
        <el-form-item label="申报单位" prop="jobLevel">
          <el-input
            v-model="queryParams.declareUnit"
            placeholder="请输入申报单位"
            clearable

            style="width: 200px"
            @keyup.enter.native="handleQuery"/>
        </el-form-item>
        -->
        <el-form-item label="评审年度" prop="reviewYear">
          <el-select
            v-model="queryParams.reviewYear"
            placeholder="请选择评审年度"
            clearable
            style="width: 200px"
            >
            <el-option
              v-for="dict in reviewYears"
              :key="dict"
              :label="dict"
              :value="dict"/>
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
      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          :data="rewardSuggestionList">
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
            label="评审年度"
            align="center"
            prop="reviewYear"
            show-overflow-tooltip />
          <el-table-column
            label="奖励建议"
            align="center"
            prop="rewardFilePaths"
            show-overflow-tooltip>
            <template slot-scope="scope">
               <el-button
                 type="text"
                 @click="produceRewardSuggestion(scope.row)"
                 v-hasPermi="['sel:selRewardSuggest:create']">生成奖励建议
               </el-button>
              <el-button
                v-if="scope.row.rewardFilePaths!=null"

                type="text"
                @click="handleDownloadFile(scope.row)"
                v-hasPermi="['sel:selRewardSuggest:download']">下载奖励建议
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="党委会决议材料"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button

                type="text"
                @click="handleUploadFile(scope.row)"
                v-hasPermi="['sel:selRewardSuggest:upload']">上传决议材料
              </el-button>
              <el-button
                v-if="scope.row.resolutionFilePaths!=null"

                type="text"
                @click="handleViewMate(scope.row)"
                v-hasPermi="['sel:selRewardSuggest:viewMate']">查看决议材料
              </el-button>
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
      <!-- 上传专家签到表对话框 -->
      <el-dialog
        :title="uploadFileDialog.title"
        :visible.sync="uploadFileDialog.open"
        width="420px"
        append-to-body :close-on-click-modal="false">
        <el-form
          :model="uploadFileFrom"
          ref="uploadFileFrom"
          :inline="true">
          <el-form-item label="" prop="resolutionFilePaths">
            <upload
              accept=".pdf"
              :limit="pdfLimit"
              v-model="uploadFileFrom.resolutionFilePaths"/>
            <div class="el-upload__tip" style="color: red">
              仅支持PDF格式的文件，且不超过50M
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" style="text-align: center" class="dialog-footer">
          <el-button type="primary" @click="submitUploadFile">提 交</el-button>
          <el-button @click="cancelUploadFile">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import { listSelRewardSuggest, createRewardSuggestFile, updateSelRewardSuggest,searchAwardProjectCount } from "@/api/sel/selRewardSuggest";

export default {
  name: "index",
  data() {
    return {
      // 加载等待线
      loading: false,
      // 总条数
      total: 0,
      // 奖励建议列表
      rewardSuggestionList: [],
      // 产业类别字典
      industryTypeOptions: [],
      // 评审年份列表
      reviewYears: [],
      // 搜索框查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        reviewYear:new Date().getFullYear()
      },

      // 上传专家签到表对话框控制
      uploadFileDialog: {
        title: "上传决议文件",
        open: false
      },
      // 上传专家签到表表单
      uploadFileFrom: {
        id: null,
          resolutionFilePaths: undefined
      },
      //上传文件相关配置
      pdfLimit: 1
    }
  },
  created() {
    this.$store.dispatch("GetInfo").then(response => {
        this.reviewYears = response.yearList;
    })
    //获取申报待评审列表
    this.getList()

    //产业类别字典
    this.getDicts("industry_type").then(response => {
      this.industryTypeOptions = response.data;
    });
  },

  methods: {
    /** 获取申报待评审列表 */
    getList() {
      this.loading = true;
      listSelRewardSuggest(this.queryParams).then(response => {
        this.rewardSuggestionList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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

    handleDownloadFile(row) {
       const filePath = JSON.parse(row.rewardFilePaths);
        window.location.href = filePath[0].url;
    },
    handleViewMate(row) {
        const filePath = JSON.parse(row.resolutionFilePaths);

        window.open(filePath[0].url);
    },

    //生成奖励建议
    produceRewardSuggestion(row) {
        searchAwardProjectCount(row.id).then(response => {
            if(response.data == 0){
                this.$confirm('当前没有获奖项目, 是否继续生成奖励建议?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    createRewardSuggestFile(row.id).then(response => {
                        if(response.code == 200){
                            this.msgSuccess('生成成功');
                            this.getList();
                        }else {
                            this.msgError('生成失败');
                        }
                    })
                })
            }else {
                createRewardSuggestFile(row.id).then(response => {
                    if(response.code == 200){
                        this.msgSuccess('生成成功');
                        this.getList();
                    }else {
                        this.msgError('生成失败');
                    }
                })
            }
        });
    },

    /************* 上传文件(需打开对话框) *************/
    handleUploadFile(row) {
      this.uploadFileDialog.open = true
      this.uploadFileFrom.id = row.id
    },
    //提交上传的专家签到表
    submitUploadFile() {
      console.log(this.uploadFileFrom);
      const filePaths = JSON.parse(this.uploadFileFrom.resolutionFilePaths)
      const dataTem = filePaths[0].fileName
      const reg = /\.pdf$/
      if(reg.test(dataTem)) {
        this.uploadFileDialog.open = false
        updateSelRewardSuggest(this.uploadFileFrom).then(res => {
          this.resetForm("uploadFileFrom")
          this.getList()
        })
      }else {
        this.$message.warning('请上传pdf格式')
      }
    },
    //取消上传
    cancelUploadFile() {
      this.resetForm("uploadFileFrom")
      this.uploadFileDialog.open = false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  padding: 20px 30px;
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
    .main-center{
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
