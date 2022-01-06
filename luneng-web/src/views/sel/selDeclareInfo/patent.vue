<template>
  <div class="app-container red-placeholder">
    <div style="height: 0px;overflow: hidden;">
      <preview :value="form" :impl="implList" :unit="unitDate" :open="open"/>
    </div>
    <el-row :gutter="10" class="mb8">
      <div class="fr">
        <el-col :span="1.5">
          <el-button
            type="primary"

            @click="updateData('1')"
          >保存
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"

            @click="submitForm"
            v-if="this.$route.query.kxbEdit!=1"
            v-hasPermi="['sel:selDeclareInfo:submit']"
          >{{releaseFlag === '1' ? '发布' : '提交'}}
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <preview-pdf type="declare" :id="infoId" :hint="false" btnText="预览" style="padding: 0;" />
        </el-col>
        <el-col :span="1.5">
          <el-button

            @click="cancel"
          >取消
          </el-button>
        </el-col>
      </div>
    </el-row>

    <el-form ref="form" :model="form" :rules="rules">
      <el-radio-group v-model="tabIndex" style="margin-bottom: 20px;">
        <el-radio-button label="1">专利基本信息</el-radio-button>
        <el-radio-button label="2">专利技术状况</el-radio-button>
        <el-radio-button label="3">经济效益情况</el-radio-button>
        <el-radio-button label="4">社会效益状况</el-radio-button>
        <el-radio-button label="5">专利保护情况</el-radio-button>
        <el-radio-button label="6">实施单位实施状况</el-radio-button>
        <el-radio-button label="7">申报意见</el-radio-button>
      </el-radio-group>
      <div style="height: calc(100vh - 218px);overflow: auto;">
        <el-tabs v-model="tabIndex" @tab-click="handleTabClick">
          <el-tab-pane label="专利基本信息" name="1">
            <div>
              <basic-info v-model="form" @change="implChange"/>
            </div>
          </el-tab-pane>
          <el-tab-pane label="专利技术状况" name="2">
            <el-form-item prop="declareUnit">
              <ueditor
                v-model="form.patentSituation"
                class-name="red-placeholder"
                @change="updateData"
                placeholder="主要包括技术方案、与现有技术相比主要优点，发明创造创新高度的说明，何时何地获何种等级的奖励及其颁奖机构等。"
              />
<!--              <el-input v-model="form.patentSituation" type="textarea" rows="8"-->
<!--                placeholder="主要包括技术方案、与现有技术相比主要优点，发明创造创新高度的说明，何时何地获何种等级的奖励及其颁奖机构等。填写内容不得超过 400 字" maxlength="400"-->
<!--                show-word-limit @blur="updateData"/>-->
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="经济效益状况" name="3">
            <div>
              <economic-benefit @ecnomicform="getEcnomicForm" v-model="form"/>
            </div>
          </el-tab-pane>
          <el-tab-pane label="社会效益状况" name="4">
            <el-form-item prop="benefit">
              <ueditor
                v-model="form.benefit"
                class-name="red-placeholder"
                @change="updateData"
                placeholder="对促进科学技术进步、提高科学管理水平、保护自然资源与生态环境、消除安全生产隐患、改善劳动条件、保障国家和公共安全等效益，应详细说明，如能采取定量方法说明的均需有具体数字。统计截止日为申报前一年12月31日。"
              />
<!--              <el-input-->
<!--                v-model="form.benefit" type="textarea" rows="8"-->
<!--                placeholder="对促进科学技术进步、提高科学管理水平、保护自然资源与生态环境、消除安全生产隐患、改善劳动条件、保障国家和公共安全等效益，应详细说明，如能采取定量方法说明的均需有具体数字。统计截止日为申报前一年12月31日。填写内容不得超过 400 字"-->
<!--                maxlength="400" show-word-limit @blur="updateData"/>-->
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="专利保护情况" name="5">
            <el-form-item prop="patentProtection">
              <ueditor
                v-model="form.patentProtection"
                class-name="red-placeholder"
                @change="updateData"
                placeholder="主要包括采取何种措施保护专利权，如何通过专利保护获取并巩固市场竞争地位、扩大市场份额；在各有关知识产权纠纷中，如何利用专利权提出合理诉求，获得赔偿等。"
              />
<!--              <el-input-->
<!--                v-model="form.patentProtection" type="textarea" rows="8"-->
<!--                placeholder="主要包括采取何种措施保护专利权，如何通过专利保护获取并巩固市场竞争地位、扩大市场份额；在各有关知识产权纠纷中，如何利用专利权提出合理诉求，获得赔偿等。填写内容不得超过 400 字"-->
<!--                maxlength="400" show-word-limit @blur="updateData"/>-->
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="实施单位实施状况" name="6">
            <div>
              <unit @implementationform="getImplementationForm" v-model="form" @change="unitChange"/>
            </div>
          </el-tab-pane>
          <el-tab-pane label="申报意见" name="7">
            <div>
              <opinion @opinionform="getOpinionform" v-model="form"/>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-form>

    <el-dialog title="PDF预览" :visible.sync="open" width="830px" append-to-body :close-on-click-modal="false">
      <div ref="pdfContentPreview"></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {updateSelDeclareInfo, submitDeclare, searchDeclareEndTime, pdfPreview} from "@/api/sel/selDeclareInfo";
  import {getSelDeclarePatentByinfo, updateSelDeclarePatent} from "@/api/sel/selDeclarePatent";

  import basicInfo from './patent/basic-info.vue'  //项目基本信息
  import economicBenefit from './patent/economic-benefit.vue'  //经济效益
  import unit from './patent/unit.vue'  //实施单位实施状况
  import opinion from './patent/opinion.vue'  //申报意见
  import preview from './patent/preview.vue'  //pdf
  import {base64ToPDF, downloadPDF} from "@/api/common/utils";
  import { addSelOperLog } from "@/api/sel/selOperLog";
  import ueditor from "@/components/Ueditor"
  import {publish} from "@/api/achie/achieDisplayInfo";

  export default {
    name: "sel-selDeclareInfo-patent",
    components: {
      basicInfo, economicBenefit, opinion, unit, preview, ueditor
    },
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
        rules: {
          patentName: [
            {required: true, message: "专利名称不能为空", trigger: "blur"}
          ]
        },
        dateRange: [],
        tabIndex: '1',
        taskSourceOptions: [],
        implList: [],  //专利基本信息-实施状况列表数据
        unitDate: {},  //实施单位实施状况数据
        infoId: undefined,
        isSubmit: false,
        path: null,
        ecnomicForm: {},
        implementationForm: {},
        opinionForm: {},
        //成果展示申请标记
        releaseFlag: null,
        fromFullPath: ''
      };
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.fromFullPath = from.fullPath
      })
    },
    created() {
      this.init();
      if (this.$route.query.releaseFlag) {
        this.releaseFlag = this.$route.query.releaseFlag
      }
    },
    methods: {
      implChange(data) {
        this.implList = data;
      },
      unitChange(data) {
        this.unitDate = data;
      },
      init() {
        const id = this.$route.query.id;
        if (id) {
          this.infoId = id;
          getSelDeclarePatentByinfo(id).then(response => {
            this.form = response.data;
            this.ecnomicForm = response.data
            this.implementationForm = response.data
            this.opinionForm = response.data
          });
        } else {
          this.reset();
        }
      },
      handleTabClick() {

      },
      //获取经济效益情况填写字段
      getEcnomicForm(valueForm) {
        this.ecnomicForm = valueForm
        this.isSubmit = false
      },
      //获取实施单位实施状况字段
      getImplementationForm(valueForm) {
        this.implementationForm = valueForm
        this.isSubmit = false
      },
      //获取申报意见
      getOpinionform(valueForm) {
        this.opinionForm = valueForm
        this.isSubmit = false
      },
      /** 保存操作 */
      updateData(showMsg) {
        if (this.$route.query.kxbEdit == 1) {
          pdfPreview({
            id: this.infoId
          }).then((response) => {
            if (response.code === 200) {
              updateSelDeclareInfo({ id: this.infoId, submitPdfFilePaths: response.msg }).then(res => {
                this.msgSuccess('保存成功！');
                if (this.releaseFlag === '1') {
                  this.cancel()
                } else {
                  const log = {};
                  log.infoId = this.infoId;
                  log.operName = '保存申报';
                  addSelOperLog(log);
                  this.cancel()
                }
              })
            }
          });
        } else {
          updateSelDeclarePatent(this.form).then(response => {
            if(showMsg == '1') {
              this.msgSuccess('保存成功！');
              if (this.releaseFlag === '1') {
                this.cancel()
              } else {
                const log = {};
                log.infoId = this.infoId;
                log.operName = '保存申报';
                addSelOperLog(log);
                this.cancel()
              }
            }
          })
        }
      },
      preview() {
        this.open = true;
        setTimeout(() => {
          let pdfContent = document.getElementById('pdfContent').cloneNode(true);
          this.$refs.pdfContentPreview.innerHTML = '';
          this.$refs.pdfContentPreview.appendChild(pdfContent);
        }, 100)
      },
      // 取消按钮
      cancel() {
        this.closeView(this.$route.path, this.fromFullPath, 0);
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
      getPdfPaths(id, name) {
        return new Promise((resolve, reject) => {
          this.exportPdf(id, name, (base64) => {
            base64ToPDF(base64).then((response) => {
              if (response.code === 200) {
                resolve(response.fileName);
              } else {
                reject(response.msg);
              }
            })
          })
        })
      },
      getUploadPdfPaths(key) {
        return new Promise((resolve, reject) => {
          let paths = '';
          let arr = this.form[key];
          if (arr) {
            arr = JSON.parse(arr);
            paths = arr[0].fileName;
            resolve(paths);
          } else {
            resolve('');
          }
        })
      },
      /** 提交按钮 */
      submitForm: function () {
        if (this.ecnomicForm.encFilePaths && this.implementationForm.putFilePaths && this.opinionForm.opinionFilePaths) {
          if(this.isSubmit) return;
          this.isSubmit = true;
          this.$refs["form"].validate(valid => {
            if (valid) {
              const id = this.$route.query.id;
              if (this.releaseFlag === '1') {
                this.submitAchievement(id)
              } else {
                searchDeclareEndTime({
                  id: id
                }).then(resp => {
                  if (resp.code == 200) {
                    pdfPreview({
                      id: id
                    }).then((response) => {
                      this.isSubmit = false;
                      if (response.code === 200) {
                        submitDeclare({
                          id: id
                        }).then(response => {
                          if (response.code === 200) {
                            this.msgSuccess("提交成功");
                            const log = {};
                            log.infoId = id;
                            log.operName = '提交申报';
                            addSelOperLog(log);
                            this.cancel()
                          }
                        });
                        updateSelDeclareInfo({id: id, submitPdfFilePaths: response.msg});
                      }
                    }).catch(() => {
                      this.isSubmit = false;
                    })
                  }
                }).catch(() => {
                  this.isSubmit = false;
                })
              }
            } else {
              this.isSubmit = false;
            }
          });
        } else {
          this.msgError('所有需要盖章的pdf文件上传不可为空')
        }
      },
      //成果展示提交
      submitAchievement(id) {
        pdfPreview({
          id: id
        }).then((response) => {
          this.isSubmit = false;
          if (response.code === 200) {
            publish({
              id: id,
              publishStatus: 1
            }).then(response => {
              if (response.code === 200) {
                this.cancel()
                this.msgSuccess("发布成功");
              }
            });
            updateSelDeclareInfo({id: id, submitPdfFilePaths: response.msg});
          }
        }).catch(() => {
          this.isSubmit = false;
        })
      }
    },
    watch: {
      '$route': function (to, from) {
        if (to.path === '/sel/selDeclareInfo/patent') {
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
</style>
