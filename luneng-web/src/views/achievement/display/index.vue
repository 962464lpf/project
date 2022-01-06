<template>
  <div class="app-container">
    <div class="header">
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true">
        <el-form-item label="成果产业类型" prop="achieType">
          <el-select
            v-model="queryParams.achieType"
            clearable
            style="width: 220px"
            placeholder="请选择成果产业类型">
            <el-option
              v-for="item in industryTypeOptions"
              :key="item.dictValue"
              :value="item.dictValue"
              :label="item.dictLabel"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="成果名称" prop="achieName">
          <el-input
            v-model="queryParams.achieName"
            clearable
            style="width: 200px"
            placeholder="请输入成果名称"
          />
        </el-form-item>
        <el-form-item label="发表年度" prop="curYearTem">
          <el-date-picker
            v-model="curYearTem"
            :clearable="false"
            style="width: 160px"
            type="year"
            placeholder="请选择发表年度">
          </el-date-picker>
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
              type="primary"
              icon="el-icon-plus"
              v-hasPermi="['achie:achieDisplayInfo:add']"
              @click="handleAdd"
            >发布成果
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              :disabled="multiple"
              v-hasPermi="['achie:achieDisplayInfo:remove']"
              @click="handleDelete"
            >删除
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="main-center">
        <el-table
          ref="table"
          v-loading="loading"
          :data="achievementList"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            min-width="40"
            align="center"/>
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
            min-width="200"
            label="成果产业类型"
            align="center"
            prop="achieType">
          </el-table-column>
          <el-table-column
            min-width="260"
            label="成果名称"
            align="center"
            prop="achieName">
          </el-table-column>
          <el-table-column
            min-width="120"
            label="发表年度"
            align="center"
            prop="publishYear">
          </el-table-column>
          <el-table-column
            min-width="260"
            label="成果所属单位"
            align="center"
            prop="achieUnit">
          </el-table-column>
          <el-table-column
            width="160"
            label="操作"
            fixed="right"
            align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.publishStatus === 0 && scope.row.addType == 1"
                type="text"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['achie:achieDisplayInfo:edit']">修改
              </el-button>
              <el-button
                v-if="scope.row.publishStatus === 0 && scope.row.addType == 0"
                type="text"
                @click="handlePublish(scope.row)"
                v-hasPermi="['achie:achieDisplayInfo:edit']">发布
              </el-button>
              <el-button
                v-if="scope.row.publishStatus === 1"
                type="text"
                @click="queryDetail(scope.row)"
                v-hasPermi="['achie:achieDisplayInfo:query']">详情
              </el-button>
              <el-button
                type="text"
                @click="handleDelete(scope.row)"
                v-hasPermi="['achie:achieDisplayInfo:remove']">删除
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
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
      :show-close="false"
      :close-on-click-modal="false">
      <div style="padding: 0 40px 0 20px">
        <el-form
          ref="releaseForm"
          :model="releaseForm"
          :rules="releaseRules"
          label-width="155px"
          label-position="left">
          <el-form-item label="添加方式：" prop="addType">
            <el-select
              v-model="releaseForm.addType"
              @change="handleAddTypeChange"
              placeholder="请选择添加方式">
              <el-option
                v-for="item in addTypeOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="releaseForm.addType === '0'" label="奖励证书编号：" prop="certificateCode">
            <el-input
              v-model="releaseForm.certificateCode"
              @change="getCompanyName"
              placeholder="请输入奖励证书编号"
            />
          </el-form-item>
          <el-form-item v-if="releaseForm.addType === '1'" label="成果产业类型：" prop="industryType">
            <el-select
              v-model="releaseForm.industryType"
              placeholder="请选择成果产业类型">
              <el-option
                v-for="item in industryTypeOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="releaseForm.addType === '1'" label="成果评选类型：" prop="awardsType">
            <el-select
              v-model="releaseForm.awardsType"
              placeholder="请选择成果评选类型">
              <el-option
                v-for="item in awardsTypeOptions"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="releaseForm.addType === '1' && releaseForm.awardsType === '1'" label="成果名称：" prop="projectNameCn">
            <el-input
              v-model="releaseForm.projectNameCn"
              placeholder="请输入成果名称"
            />
          </el-form-item>
          <el-form-item v-if="releaseForm.addType === '1' && releaseForm.awardsType === '2'" label="成果名称：" prop="patentName">
            <el-input
              v-model="releaseForm.patentName"
              placeholder="请输入成果名称"
            />
          </el-form-item>
          <div
            v-if="releaseForm.addType === '0'"
            style="font-size: 20px; font-weight: bold; color: #000; margin-bottom: 10px">
            {{declareCompany}}
          </div>
          <el-form-item label="联系人姓名：" prop="businessLinkman">
            <el-input
              v-model="releaseForm.businessLinkman"
              placeholder="请输入联系人姓名"
            />
          </el-form-item>
          <el-form-item label="联系电话：" prop="businessTel">
            <el-input
              v-model="releaseForm.businessTel"
              placeholder="请输入联系电话"
            />
          </el-form-item>
          <el-form-item label="联系邮箱：" prop="businessEmail">
            <el-input
              v-model="releaseForm.businessEmail"
              placeholder="请输入联系邮箱"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  autoAddAchieDisplayInfo,
  delAchieDisplayInfo,
  getUnitByCertCode,
  listAchieDisplayInfo,
  updateAchieDisplayInfo
} from "@/api/achie/achieDisplayInfo";
import {releaseRules} from "@/utils/el_validate";
import {addSelDeclareScience} from "@/api/sel/selDeclareScience";
import {addSelDeclarePatent} from "@/api/sel/selDeclarePatent";

export default {
  name: "index",
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
      //当前年份
      curYearTem: new Date(),
      // 搜索框查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        achieType: '',
        achieName: '',
        publishYear: null
      },
      //列表
      achievementList: [],
      //字典
      industryTypeOptions: [],
      addTypeOptions: [],
      awardsTypeOptions: [],
      //发布成果弹窗
      releaseForm: {
        addType: null,
        certificateCode: null,
        industryType: null,
        awardsType: null,
        projectNameCn: null,
        patentName: null,
        businessLinkman: null,
        businessTel: null,
        businessEmail: null,
        businessType: 'cgzs'
      },
      releaseRules: releaseRules,
      declareCompany: '',
      //对话框
      title: '发布成果',
      open: false
    }
  },
  created() {
    //获取接口数据
    this.getList()
    //获取字典信息
    this.getDicts("industry_type").then(response => {
      this.industryTypeOptions = response.data;
    });
    this.getDicts("achievement_add_type").then(response => {
      this.addTypeOptions = response.data;
    });
    this.getDicts("award_type").then(response => {
      this.awardsTypeOptions = response.data;
    });
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  methods: {
    /*********************** 数据获取及处理 ***********************/
    /** 获取申报待评审列表 */
    getList() {
      this.loading = true;
      this.queryParams.publishYear = this.parseTime(this.curYearTem, "{y}");
      listAchieDisplayInfo(this.queryParams).then(({rows, total}) => {
        this.achievementList = rows;
        this.total = total;
        this.loading = false;
      });
    },
    industryTypeFormatter(row) {
      return this.selectDictLabel(this.industryTypeOptions, row.achieType);
    },
    /*********************** 交互操作 ***********************/
    /** 查询按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.$refs["queryForm"].resetFields();
      this.curYearTem = new Date()
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    //处理增加
    handleAdd() {
      this.open = true
    },
    //处理选择的添加方式
    handleAddTypeChange(value) {
      if (value === '1') {
        this.releaseForm.businessLinkman = ''
        this.releaseForm.businessTel = ''
        this.releaseForm.businessEmail = ''
      }
      this.$refs["releaseForm"].clearValidate();
    },
    //处理输入的编号
    getCompanyName(value) {
      getUnitByCertCode(value).then(res => {
        this.declareCompany = res.unitName
        this.releaseForm.businessLinkman = res.nickName
        this.releaseForm.businessTel = res.phonenumber || res.mobile
        this.releaseForm.businessEmail = res.email
      }).catch(() => {
        this.releaseForm.certificateCode = null
      })
    },
    //删除
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除所选择的成果展示信息?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delAchieDisplayInfo(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function () {
      });
    },
    handleUpdate(row) {
      const id = row.selDeclareInfo.id
      let path = '/sel/selDeclareInfo/science';
      if (row.selDeclareInfo.awardsType === '1') {
        path = '/sel/selDeclareInfo/science';
      } else if (row.selDeclareInfo.awardsType === '2') {
        path = '/sel/selDeclareInfo/patent';
      }
      this.$router.push({
        path: path,
        query: {
          id,
          releaseFlag: '1'
        }
      })
    },
    handlePublish(row){
        this.$confirm('确认要发布吗?', "系统提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(() => {
            const data = {};
            data.id = row.id;
            data.publishStatus = 1;
            return updateAchieDisplayInfo(data);
        }).then(() => {
            this.getList();
            this.msgSuccess("发布成功");
        }).catch(function () {
        });
    },
    queryDetail(row) {
      const path = "/sel/selDeclareInfo/detail"
      const id = row.selDeclareInfo.id;
      this.$router.push({
        "path": path,
        "query": {
          id,
          releaseFlag: '1'
        }
      })
    },
    submitForm() {
      this.$refs["releaseForm"].validate(valid => {
        if (valid) {
          if (this.releaseForm.addType === '0') {  //自动
            this.submitAutoWay(this.releaseForm)
          } else {
            this.submitManualWay(this.releaseForm)
          }
        }
      })
    },
    //自动方式
    submitAutoWay(releaseForm) {
      autoAddAchieDisplayInfo(releaseForm).then(() => {
        this.msgSuccess('保存成功')
        this.getList()
        this.cancel()
      })
    },
    //手动方式
    submitManualWay(releaseForm) {
      if (releaseForm.awardsType === '1') { //科学进步奖
        addSelDeclareScience(releaseForm).then(({data}) => {
          this.$router.push({
            path: '/sel/selDeclareInfo/science',
            query: {
              id: data.infoId,
              releaseFlag: '1'
            }
          })
          this.cancel()
        })
      } else { //专利奖
        addSelDeclarePatent(releaseForm).then(({data}) => {
          this.$router.push({
            path: '/sel/selDeclareInfo/patent',
            query: {
              id: data.infoId,
              releaseFlag: '1'
            }
          })
          this.cancel()
        })
      }
    },
    cancel() {
      this.open = false
      this.declareCompany = ''
      this.$refs["releaseForm"].resetFields();
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
    }
    .main-footer {
      width: 420px;
      margin-top: 20px;
    }
  }
}
</style>
