<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <div class="fr" v-if="!edit">
        <el-col :span="1.5">
          <el-button
            type="primary"
            @click="updateData('1')"
          >保存为草稿
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            @click="submitForm"
            v-hasPermi="['project:projectStorageInfo:submit']"
          >提交
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <preview-pdf v-if="tabIndex == '0'" type="storage" :id="proposalForm.id" :page="0" :hint="false" btnText="预览"
                       style="padding: 0;"/>
          <preview-pdf v-if="tabIndex !== '0' && tabIndex !== '-1'" type="storage" :id="form.id" :hint="false"
                       btnText="预览" style="padding: 0;"/>
        </el-col>
        <el-col :span="1.5" v-if="tabIndex !== '-1'">
          <el-button
            type="primary"
            @click="dialogShow"
          >下载
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            @click="cancel"
          >取消
          </el-button>
        </el-col>
      </div>
      <div class="fr" v-if="edit">
        <el-col :span="1.5">
          <el-button
            type="primary"
            @click="checkAjaxNum"
            v-hasPermi="['project:projectStorageInfo:submit']"
          >确认修改
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            @click="auditCancel"
          >取消
          </el-button>
        </el-col>
      </div>
    </el-row>
    <el-form ref="form" :model="form" :rules="rules" style="padding-top: 10px;">
      <div class="wrapper">
        <el-radio-group v-model="tabIndex" style="margin-bottom: 20px;" @change="handleTabClick">
          <template v-if="!supplement">
            <el-radio-button v-if="!add" label="-1">项目基本信息</el-radio-button>
            <el-radio-button v-if="!add && declareForm.submitType == '0'" label="0">项目建议书</el-radio-button>
          </template>
          <template v-if="declareForm.additionalInformation == '1'">
            <el-radio-button label="1">可研封面</el-radio-button>
            <el-radio-button label="2">报告内容</el-radio-button>
            <el-radio-button label="3">项目的进度安排</el-radio-button>
            <el-radio-button label="4">项目经费预算</el-radio-button>
            <el-radio-button label="5">有关证明文件</el-radio-button>
            <el-radio-button label="6">申请单位领导审查意见</el-radio-button>
            <el-radio-button label="7">附表1</el-radio-button>
            <el-radio-button label="8">附表2</el-radio-button>
            <el-radio-button label="9">附表3</el-radio-button>
            <el-radio-button label="10">附表4</el-radio-button>
            <el-radio-button label="11">补充1</el-radio-button>
            <el-radio-button label="12">补充2</el-radio-button>
          </template>
        </el-radio-group>
      </div>
      <div class="declare-tab-content" ref="declareTabContent" style="padding-right: 20px;">
        <template v-if="!supplement">
          <el-form v-show="tabIndex === '-1'" label-width="108px">
            <declareContent v-model="declareForm" :hiddenTypeRadio="true"
                            :edit="!(declareForm.submitType == '0' && declareForm.status == '3' && declareForm.additionalInformation == '1')"
                            @update="init(true)"/>
          </el-form>
          <el-form v-show="tabIndex === '0'">
            <proposalContent v-model="proposalForm"
                             :edit="!(declareForm.submitType == '0' && declareForm.status == '3' && declareForm.additionalInformation == '1')"
                             @update="init(true)"/>
          </el-form>
        </template>
        <template v-if="declareForm.additionalInformation == '1'">
          <cover v-show="tabIndex === '1'" v-model="form" @update="init(true)"/>
          <report-content v-if="tabIndex === '2'" v-model="form"/>
          <pro-progress v-show="tabIndex === '3'" v-model="form"/>
          <budget v-show="tabIndex === '4'" v-model="form"/>
          <file v-if="tabIndex === '5'" v-model="form"/>
          <opinion @opinionform="getOpinionform" v-show="tabIndex === '6'" v-model="form"/>
          <attached1 v-show="tabIndex === '7'" v-model="form"/>
          <attached2 v-show="tabIndex === '8'" v-model="form"/>
          <attached3 v-show="tabIndex === '9'" v-model="form"/>
          <attached4 v-show="tabIndex === '10'" v-model="form"/>
          <replenish1 v-show="tabIndex === '11'" v-model="form"/>
          <replenish2 v-show="tabIndex === '12'" v-model="form"/>
        </template>
      </div>
    </el-form>
    <!-- 下载 -->
    <el-dialog title="下载" :visible.sync="open" width="400px" append-to-body class="el-dialog-center">
      <div style="text-align: center;" ref="downLoading">
        <el-radio v-model="downloadType" :label="1">PDF</el-radio>
        <el-radio v-model="downloadType" :label="2">WORD</el-radio>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="download">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getProjectStorageInfo,
  updateProjectStorageInfo,
  operation,
  storageDownWord
} from "@/api/storage/projectStorageInfo";
import {updateProjectStorageFeasible, getProjectStorageFeasibleByInfoId} from "@/api/storage/projectStorageFeasible";
import {
  listProjectStorageAdvice,
  getProjectStorageAdvice,
  updateProjectStorageAdvice
} from "@/api/storage/projectStorageAdvice";
import {storagePreview} from "@/api/storage/projectStorageInfo";
import {pdfToWord, downloadFile} from "@/api/common/utils";

import cover from './report/cover.vue'  //封面
import reportContent from './report/content.vue'  //报告内容
import proProgress from './report/progress.vue'  //项目的进度安排
import budget from './report/budget.vue'  //项目经费预算
import file from './report/file.vue'  //有关证明文件
import opinion from './report/opinion.vue'  //申请单位领导审查意见
import attached1 from './report/attached1.vue'  //附表1
import attached2 from './report/attached2.vue'  //附表1
import attached3 from './report/attached3.vue'  //附表3
import attached4 from './report/attached4.vue'  //附表4
import replenish1 from './report/replenish1.vue'  //补充1
import replenish2 from './report/replenish2.vue'  //补充2
import proposalContent from './proposal/index';
import declareContent from './declare';

import {Loading} from 'element-ui';

export default {
  name: "proManagement-storage-projectStorageInfo-report",
  components: {
    cover,
    reportContent,
    proProgress,
    budget,
    file,
    opinion,
    attached1,
    attached2,
    attached3,
    attached4,
    replenish1,
    replenish2,
    proposalContent,
    declareContent
  },
  data() {
    return {
      // 遮罩层
      loading: null,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 工作日报表格数据
      dailyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        work: undefined,
        plan: undefined,
        risk: undefined,
        recipient: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      dateRange: [],
      tabIndex: '',
      taskSourceOptions: [],
      economicList: [],  //经济效益页列表数据
      awardList: [],  //本项目曾获科技奖励情况列表数据
      proveList: [], //主要知识产权证明目录列表数据
      personList: [], //主要完成人情况表列表数据
      unitList: [],  //主要完成单位情况表列表数据
      infoId: undefined,
      isSubmit: false,
      path: null,
      declareForm: {},
      proposalForm: {},
      downloadType: 1,  //下载  pdf 1  word 2
      opinionForm: {},
      fromFullPath: ''
    };
  },
  computed: {
    add() {
      return this.$route.query.add || '';
    },
    edit() {
      return this.$route.query.edit || '';
    },
    supplement() {
      return this.$route.query.supplement || '';
    },
    type() {
      return this.$route.query.type || '';
    }
  },
  created() {
    this.init();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fromFullPath = from.fullPath
    })
  },
  methods: {
    economicChange(data) {
      this.economicList = data;
    },
    awardChange(data) {
      this.awardList = data;
    },
    proveChange(data) {
      this.proveList = data;
    },
    personChange(data) {
      this.personList = data;
    },
    unitChange(data) {
      this.unitList = data;
    },
    init(isChangeTabIndex) {
      const id = this.$route.query.id;
      if (id) {
        this.infoId = id;
        //项目基本信息
        getProjectStorageInfo(id).then(response => {
          this.declareForm = response.data;
          //申报项目建议书
          if (!isChangeTabIndex) {
            if (this.declareForm.additionalInformation == '0') {
              if (this.add == '1') {
                this.tabIndex = '0';
              } else {
                this.tabIndex = '-1';
              }
            } else {
              if (this.add == '1') {
                this.tabIndex = '1';
              } else {
                this.tabIndex = '-1';
              }
            }
          }
          if (this.supplement) {
            this.tabIndex = "1";
          }
          getProjectStorageFeasibleByInfoId(id).then(response => {
            this.form = response.data;
            this.opinionForm = response.data
            this.form.isUpdate = !isChangeTabIndex;
            if (this.declareForm.submitType == '1') return;
            //项目建议书基本信息
            listProjectStorageAdvice({
              infoId: id
            }).then(response => {
              if (response.rows.length > 0) {
                this.proposalForm = response.rows[0];
              }
            });
          });
        });
      } else {
        this.reset();
      }
    },
    handleTabClick() {
      this.$refs.declareTabContent.scrollTop = 0;
    },
    //获取单位领导意见页面字段
    getOpinionform(valueForm) {
      this.opinionForm = valueForm
      this.isSubmit = false
    },
    /** 保存操作 */
    updateData(showMsg) {
      updateProjectStorageFeasible(this.form).then(response => {
        if (showMsg == '1') {
          this.msgSuccess('保存成功！');
          this.closeView(this.$route.path, this.fromFullPath, 0);
        }
      });
    },
    checkAjaxNum() {
      let reqNum = localStorage.getItem('reqNum');
      if (reqNum > 0) {
        let timer = setInterval(() => {
          reqNum = localStorage.getItem('reqNum');
          if (reqNum <= 0) {
            window.clearInterval(timer);
            this.auditUpdateData();
          }
        }, 300)
      } else {
        this.auditUpdateData();
      }
    },
    auditUpdateData() {
      if (this.isSubmit) return;
      this.isSubmit = true;
      let values = [];
      if (this.declareForm.additionalInformation == '1' && this.declareForm.submitType == '0') {
        let promise1 = storagePreview({id: this.form.id});
        let promise2 = storagePreview({id: this.proposalForm.id, page: 0});
        values = [promise1, promise2];
      }
      if (this.declareForm.additionalInformation == '0' && this.declareForm.submitType == '0') {
        let promise2 = storagePreview({id: this.proposalForm.id, page: 0});
        values = [promise2];
      }
      if (this.declareForm.submitType == '1') {
        let promise1 = storagePreview({id: this.form.id});
        values = [promise1];
      }
      Promise.all(values).then(res => {
        let data = {id: this.infoId};
        if (this.declareForm.additionalInformation == '1' && this.declareForm.submitType == '0') {
          data.adviceUrl = res[1].msg;
          data.feasibleUrl = res[0].msg;
        }
        if (this.declareForm.additionalInformation == '0' && this.declareForm.submitType == '0') {
          data.adviceUrl = res[0].msg;
        }
        if (this.declareForm.submitType == '1') {
          data.feasibleUrl = res[0].msg;
        }
        updateProjectStorageInfo(data).then(res => {
          this.isSubmit = false;
          this.msgSuccess('操作成功！');
          this.auditCancel(500);
        }).catch(() => {
          this.isSubmit = false;
        })
      }).catch(() => {
        this.isSubmit = false;
      })
    },
    dialogShow() {
      if (this.loading && this.loading.close) this.loading.close();
      this.open = true;
    },
    download() {
      this.loading = null;
      this.loading = Loading.service({target: this.$refs.downLoading, text: '正在下载请稍后...'});
      let data = {
        id: this.form.id
      };
      let name = '可行性研究报告';
      if (this.tabIndex == '0') {
        data.page = '0';
        data.id = this.proposalForm.id;
        name = '项目建议书';
      }
      if (this.downloadType == 1) {
        storagePreview(data).then((response) => {
          this.open = false;
          this.loading.close();
          location.href = process.env.VUE_APP_BASE_API + '/common/download/resource?name=' + encodeURIComponent(name) + '.pdf&&fileName=' + response.msg;
        })
      }
      if (this.downloadType == 2) {
        storageDownWord(data).then(response => {
          this.open = false;
          this.loading.close();
          location.href = process.env.VUE_APP_BASE_API + '/common/download/resource?name=' + encodeURIComponent(name) + '.doc&&fileName=' + response.msg
        })
      }
    },
    // 取消按钮
    cancel() {
      this.closeView(this.$route.path, this.fromFullPath, 0);
    },
    auditCancel(time = 0) {
      this.closeView(this.$route.path, this.fromFullPath, time);
    },
    getCnDate(date) {
      if (date) {
        let arr = date.split(' ')[0].split('-');
        return arr[0] + '年' + arr[1] + '月' + arr[2] + '日';
      }
    },
    getTotal(key) {
      let total = null;
      this.economicList.map(item => {
        if (item[key]) total += parseFloat(item[key]);
      })
      return total;
    },
    getFileName(date) {
      if (date && typeof date == 'string') {
        if (date.length > 0) {
          return JSON.parse(date)[0].name;
        }
      }
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined
      };
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm: function () {
      if (this.isSubmit) return;
      this.isSubmit = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          // declareForm.submitType  //0项目建议书  1可研
          // declareForm.additionalInformation  1有可研  0没可研

          let values = [];
          if (this.declareForm.additionalInformation == '1' && this.declareForm.submitType == '0') {
            let promise1 = storagePreview({id: this.form.id});
            let promise2 = storagePreview({id: this.proposalForm.id, page: 0});
            values = [promise1, promise2];
            if (!this.opinionForm.declareUnitUrl) {
              this.msgError('需要盖章的pdf文件上传不能为空')
              return;
            }
          }
          if (this.declareForm.additionalInformation == '0' && this.declareForm.submitType == '0') {
            let promise2 = storagePreview({id: this.proposalForm.id, page: 0});
            values = [promise2];
          }
          if (this.declareForm.submitType == '1') {
            let promise1 = storagePreview({id: this.form.id});
            values = [promise1];
            if (!this.opinionForm.declareUnitUrl) {
              this.msgError('需要盖章的pdf文件上传不能为空')
              return;
            }
          }
          Promise.all(values).then(res => {
            let data = {id: this.infoId};
            if (this.declareForm.additionalInformation == '1' && this.declareForm.submitType == '0') {
              data.adviceUrl = res[1].msg;
              data.feasibleUrl = res[0].msg;
            }
            if (this.declareForm.additionalInformation == '0' && this.declareForm.submitType == '0') {
              data.adviceUrl = res[0].msg;
            }
            if (this.declareForm.submitType == '1') {
              data.feasibleUrl = res[0].msg;
            }
            updateProjectStorageInfo(data).then(res => {
              let operationStatus = '4';
              if (this.declareForm.submitType == '0' && this.declareForm.additionalInformation == '0') operationStatus = '3';
              operation({
                infoId: this.infoId,
                operation: operationStatus
              }).then(res => {
                if (res.code == 200) {
                  this.closeView(this.$route.path, this.fromFullPath, 0);
                  this.msgSuccess("操作成功！");
                } else {
                  this.msgError(res.msg);
                }
                this.isSubmit = false;
              }).catch(() => {
                this.isSubmit = false;
              })
            })
          }).catch(() => {
            this.isSubmit = false;
          })
        } else {
          this.isSubmit = false;
        }
      });
    }
  },
  watch: {
    '$route': function (to, from) {
      if (to.path === '/proManagement/storage/projectStorageInfo/report') {
        if (to.fullPath !== this.path) {
          this.path = to.fullPath;
          this.init();
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/*.pdf-page {*/
/*  position: absolute;*/
/*  top: 0;*/
/*  left: 0;*/
/*}*/
.hint-text {
  font-size: 14px;
  line-height: 40px;
  color: #333333;
}

.red, .red-hint, .hint-text.red-hint {
  color: #EC808D;
}

.subfield {
  position: relative;
  overflow: hidden;

  .subfield-line {
    content: '';
    display: block;
    width: 400px;
    height: 1px;
    background-color: #EBEEF5;
    position: absolute;
    top: 0;
    left: 0;
    transform: rotate(18.5deg);
    transform-origin: 0;
  }

  .subfield-item {
    text-align: left;
  }

  .subfield-item:first-child {
    text-align: right;
    padding-right: 10px;
  }

  .subfield-item:last-child {
    text-align: left;
    padding-left: 10px;
  }
}

.word-limit {
  text-align: right;
  padding-top: 4pt;
}

/deep/ .el-tabs__header {
  display: none;
}

.wrapper {
  width: 98%;
  height: 100%;
  white-space: nowrap;
  overflow-x: auto;
}
</style>
