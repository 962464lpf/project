<template>
  <div class="app-container">
    <el-row class="mb10" :gutter="20">
      <el-col :span="1.5" v-hasPermi="['sel:selNotice:myNotice']">
        <el-button
          v-show="form.isEdit && !from"
          type="primary"
          @click="handleUpdate(form)"
          v-hasPermi="['sel:selNotice:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5" v-hasPermi="['sel:selNotice:myNotice']">
        <el-button
          v-show="form.publishStatus === 0"
          type="primary"
          @click="handleDelete(form)"
          v-hasPermi="['sel:selNotice:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5" v-hasPermi="['sel:selNotice:receiveNotice']">
        <el-button
          v-show="isShowDeclare && form.publishStatus === 1"
          type="primary"
          v-hasPermi="['sel:selNotice:declare']"
          @click="toDeclare(form)"
        >申报
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

    <el-row>
      <el-col :span="20">
        <table class="detail-table">
          <tr>
            <td>通知标题</td>
            <td>{{ form.noticeTitle }}</td>
          </tr>
          <tr>
            <td style="width: 200px;">通知简述</td>
            <td>
              <div v-html="form.noticeObjective"/>
            </td>
          </tr>
          <tr>
            <td>申报截止时间</td>
            <td>{{ parseTime(form.declareEndDate, '{y}-{m}-{d}') }}</td>
          </tr>
          <tr>
            <td>补充资料截止时间</td>
            <td>{{ parseTime(form.uploadEndDate, '{y}-{m}-{d}') }}</td>
          </tr>
          <tr>
            <td>附件</td>
            <td colspan="3">
              <upload v-model="form.filePaths" :edit="false"/>
            </td>
          </tr>
        </table>

        <div :hidden="isHidden || form.publishStatus == 0">
          <div class="el-tabs__header">
            <div class="el-tabs__nav-wrap">
              <div class="el-tabs__nav-scroll">
                <div class="el-tabs__nav" style="transform: translateX(0px);">
                  <div class="el-tabs__item" :class="tabIndex == '1' ? 'is-active' : ''" @click="tabIndex='1'">查阅情况
                  </div>
                  <div class="el-tabs__item" :class="tabIndex == '2' ? 'is-active' : ''" @click="tabIndex='2'">历史版本情况
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-show="tabIndex == '1'">
            <div class="read-status">
              <span>未查阅：{{ readStatus.noRead }}个单位</span>
              <span>已查阅：{{ readStatus.read }}个单位</span>
            </div>
            <div class="table-overflow">
              <table class="history-table">
                <tr v-for="item in readDetail">
                  <td>{{ item.dept_name }}</td>
                  <td>
                    <span v-if="item.read_status == '0'">未查阅</span>
                    <span v-if="item.read_status == '1'">已查阅</span>
                  </td>
                </tr>
                <tr v-if="readDetail.length === 0">
                  <td colspan="2" class="no-data">暂无数据</td>
                </tr>
              </table>
            </div>
          </div>
          <div v-show="tabIndex == '2'">
            <div class="table-overflow">
              <table class="history-table">
                <tr v-for="item in history">
                  <td style="width: 300px;">{{ item.publishTime }}</td>
                  <td>{{ item.noticeTitle }}</td>
                  <td style="width: 100px; text-align: center">
                    <el-button type="text">
                      <router-link
                        :to="{ path: '/msg/selNotice/detailNoticeHis',query:{id:item.id,hidden: true,from:'his',toId:id} }">
                        查看
                      </router-link>
                    </el-button>
                  </td>
                </tr>
                <tr v-if="history.length === 0">
                  <td colspan="2" class="no-data">暂无数据</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="700px"
      append-to-body
      :close-on-click-modal="false">
      <!--      评选通知-->
      <el-form
        ref="form2"
        :model="form2"
        :rules="rules2"
        label-width="80px"
        v-if="type === 1">
        <el-form-item label="评选通知" prop="noticeId">
          <el-select
            v-model="form2.noticeId"
            placeholder="请选择对应通知"
            style="width: 100%">
            <el-option
              v-for="item in selNoticeOptions"
              :key="item.id"
              :label="item.noticeTitle"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产业类别" prop="industryType">
          <el-select
            v-model="form2.industryType"
            placeholder="请选择产业类别"
            style="width: 100%">
            <el-option
              v-for="dict in industryTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="奖项类别" prop="awardsType">
          <el-select
            v-model="form2.awardsType"
            placeholder="请选择奖项类别"
            style="width: 100%">
            <el-option
              v-for="dict in awardsTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectNameCn" v-if="form2.awardsType === 1">
          <el-input
            v-model="form2.projectNameCn"
            placeholder="请输入项目名称"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="专利名称" prop="patentName" v-if="form2.awardsType === 2">
          <el-input
            v-model="form2.patentName"
            placeholder="请输入专利名称"
            maxlength="100"
          />
        </el-form-item>
      </el-form>
      <!--      项目储备-->
      <el-form ref="declareForm" :model="declareForm" :rules="declareRules" label-width="108px" v-if="type === 2">
        <declare v-model="declareForm" :add="true"/>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {delSelNotice, getSelNotice} from '@/api/sel/selNotice'
import declare from "@/views/proManagement/storage/projectStorageInfo/declare";
import {searchDeclarable} from "@/api/sel/selDeclareInfo";
import {addSelDeclareScience} from "@/api/sel/selDeclareScience";
import {addSelDeclarePatent} from "@/api/sel/selDeclarePatent";
import {addProjectStorageInfo} from "@/api/storage/projectStorageInfo";
import {getCompanyName} from "@/api/system/dept";

export default {
  name: 'sel-selNotice-detail',
  data() {
    return {
      tabIndex: '1',
      // 表单参数
      form: {},
      readDetail: [],  //阅读详细
      history: [],  //阅读历史
      readStatus: {},  //阅读状态
      isHidden: false,

      //0:弹出选择通知选项  1：奖励申报按钮   2：项目储备申报按钮
      type: 1,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form2: {
        kind: "",
        noticeId: "",
        industryType: "",
        awardsType: "",
        projectNameCn: "",
        patentName: ""
      },
      // 表单校验
      rules2: {
        noticeId: [
          {required: true, message: "评选通知不能为空", trigger: "blur"}
        ],
        industryType: [
          {required: true, message: "产业类别不能为空", trigger: "blur"}
        ],
        awardsType: [
          {required: true, message: "奖项类别不能为空", trigger: "blur"}
        ],
        projectNameCn: [
          {required: true, message: "项目名称(中文)不能为空", trigger: "blur", pattern: '[^ \x22]+'}
        ],
        patentName: [
          {required: true, message: "专利名称不能为空", trigger: "blur", pattern: '[^ \x22]+'}
        ]
      },
      selNoticeOptions: [],
      industryTypeOptions: [],
      awardsTypeOptions: [],

      declareForm: {
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
      },
      // 表单校验
      declareRules: {
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
          {required: true, message: "下年计划投入不能为空", trigger: "blur"},
          {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,4}|[1-9][0-9]*\.\d{1,4})))$/, message: "请输入正确的金额", trigger: "blur"}
        ]
      },
    }
  },
  computed: {
    id: function () {
      return this.$route.query.id
    },
    from: function () {
      return this.$route.query.from
    },
    toId: function () {
      return this.$route.query.toId
    },
    isShowDeclare() {
      return (form) => {
        const declareList = [1, 2, 12]
        return !!(form.isEdit && declareList.includes(form.kind))
      }
    }
  },
  components: {
    declare
  },
  created() {
    this.init()
    this.getDicts("industry_type").then(response => {
      this.industryTypeOptions = response.data;
    });
    this.getDicts("award_type").then(response => {
      this.awardsTypeOptions = response.data;
    });
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      this.isHidden = this.$route.query.hidden
      const id = this.$route.query.id
      getSelNotice(id).then(response => {
        this.form = response.data.notice
        this.form.isEdit = true;
        if (this.form.createTime) {
          const year = this.parseTime(this.form.createTime, '{y}');
          const nowYear = new Date().getFullYear().toString();
          if (year !== nowYear) this.form.isEdit = false;
        }
        this.readDetail = response.data.readDetail
        this.history = response.data.history
        this.readStatus = response.data.readStatus
      })
    },
    /** 返回 */
    handleBack() {
      let path = '/msgSelNotice'
      let id = this.id
      if (this.from) {
        path = '/msg/selNotice/detailNotice'
        id = this.toId
      }
      this.$router.push({'path': path, query: {id: id}})
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const path = '/msg/selNotice/editNotice'
      const id = row.id
      this.$router.push({
        path,
        query: {
          id,
          kind: row.kind
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id
      this.$confirm('是否确认删除?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return delSelNotice(ids);
      }).then(() => {
        this.msgSuccess("删除成功");
        this.closeView('/msg/selNotice/detailNotice', '/msgSelNotice', 0)
      }).catch(() => {
      });
    },

    //申报类型按钮
    toDeclare(row) {
      if (row.kind === 1) {
        this.selNoticeOptions = [row];
        searchDeclarable().then(({code, msg}) => {
          if (code === 200) {
            this.title = "申报选择";
            this.type = 1;
            this.open = true;
            this.form2.noticeId = row.id;
          } else {
            this.msgInfo(msg);
          }
        });
      } else if (row.kind === 2) {
        this.open = true;
        this.type = 2;
        this.title = "项目申报";
        this.declareForm.noticeId = row.id;
        this.getUnit();
      } else if (row.kind === 12) {
        const path = "/expert/selection/reportSelExperts"
        this.$router.push({
          path,
          "query": {
            "noticeId": row.id
          }
        })
      }
    },

    /** 弹窗提交按钮 */
    submitForm: function () {
      if (this.type === 1) {
        this.selNoticeSubmit();
      } else if (this.type === 2) {
        this.proReservSubmit();
      }
    },

    //取消弹窗
    cancel() {
      this.open = false;
      this.$refs["form2"].resetFields()
      this.$refs["declareForm"].resetFields()
    },

    //奖励评选通知
    selNoticeSubmit() {
      this.$refs["form2"].validate(valid => {
        if (valid) {
          if (this.form2.awardsType === 1) {
            addSelDeclareScience(this.form2).then(response => {
              this.cancel();
              this.$router.push({
                path: '/sel/selDeclareInfo/science',
                query: {
                  id: response.data.infoId
                }
              })
            })
          } else if (this.form2.awardsType === 2) {
            addSelDeclarePatent(this.form2).then(response => {
              this.cancel();
              this.$router.push({
                path: '/sel/selDeclareInfo/patent',
                query: {
                  id: response.data.infoId
                }
              })
            });
          }
        }
      });
    },

    //项目储备申报
    proReservSubmit() {
      this.$refs["declareForm"].validate(valid => {
        if (valid) {
          addProjectStorageInfo(this.declareForm).then(({code, data}) => {
            if (code === 200) {
              if (this.type === 2) {
                this.$router.push({
                  path: '/proManagement/storage/projectStorageInfo/proposal',
                  query: {
                    id: data,
                    add: 1
                  }
                })
              } else {
                this.$router.push({
                  path: '/proManagement/storage/projectStorageInfo/report',
                  query: {
                    id: data,
                    add: 1
                  }
                })
              }
              this.cancel()
            }
          });
        }
      });
    },

    // 获取当前用户所在的单位
    getUnit() {
      const dept = this.$store.getters.dept;
      getCompanyName(dept.deptId).then(res => {
        this.declareForm.subordinateUnit = res.data.companyName;
        this.declareForm.undertakeUnit = res.data.companyName;
      })
    }
  },
  watch: {
    '$route': function (to, from) {
      if (to.name === 'sel-selNotice-detail') {
        if (to.fullPath !== this.path) {
          this.path = to.fullPath + '&time=' + new Date().getTime()
          this.init()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.read-status {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;

  span {
    margin-right: 20px;
  }
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 14px;

  td {
    border: 1px solid #e9e9e9;
    padding: 10px 15px;
  }
}

.table-overflow {
  width: 80%;
  min-height: 200px;
  max-height: 500px;
  overflow: auto;
}

.no-data {
  text-align: center;
  color: #666;
}

.is-active {
  border-bottom: 2px solid #68BC74;
}

.el-tabs__item {
  padding: 0;
  margin: 0 20px;

  &:first-child {
    margin-left: 0;
  }
}
</style>
