<template>
  <div class="dec-project-component">
    <div class="header" v-if="showHeader">
      <div class="slot-box1" v-if="topBoxType === '标题'">
        <slot name="titleText">
          <span v-if="declareInfo && (declareInfo.projectName || declareInfo.projectName2) && totalTitle">
            {{(declareInfo.projectName || declareInfo.projectName2) + ' ' + totalTitle}}
          </span>
          <span style="font-weight: normal;" v-if="(!showTabs || showScoreInfoAll) && (declareInfo.declareUnit || declareInfo.declareTime)">
            {{(declareInfo.declareUnit?declareInfo.declareUnit:'') + ' '}}申报于{{' '+ parseTime(declareInfo.declareTime, '{y}-{m}-{d}')}}
          </span>
        </slot>
      </div>
      <div class="slot-box2" v-else>
        <div class="item1Class" @click="submitForm(12)">
          <slot name="item0"></slot>
        </div>
        <div class="item1Class" @click="submitForm(13)">
          <slot name="item1"></slot>
        </div>
        <div class="item2Class" @click="cancelBack">
          <slot name="item2"></slot>
        </div>
      </div>
    </div>
    <div class="main" v-if="showTabs">
      <el-tabs
        v-model="tabIndex"
        @tab-click="handleClick">
        <el-tab-pane label="项目简介" name="0">
          <div class="tab1-box">
            <el-form
              :model="decProjForm"
              :rules="rules"
              ref="decProjForm">
              <table class="proj-table">
                <tr>
                  <td>项目名称</td>
                  <td>
                    <div v-if="topBoxType != '标题'">
                      <el-form-item prop="projectName2" style="margin: 0;">
                        <el-input
                          v-model="decProjForm.projectName2"
                          type="text"
                          placeholder="请输入项目名称" disabled/>
                      </el-form-item>
                    </div>
                    <div v-else>
                      <span>{{declareInfo.projectName2}}</span>
                    </div>
                  </td>
                  <td><span v-if="topBoxType != '标题'" class="red-star">*</span>完成单位</td>
                  <td>
                    <div v-if="topBoxType != '标题'">
                      <el-form-item prop="mainUnits2" style="margin: 0;">
                        <el-input
                          v-model="decProjForm.mainUnits2"
                          type="text"
                          placeholder="请输入完成单位"/>
                      </el-form-item>
                    </div>
                    <div v-else>
                      <span>{{declareInfo.mainUnits2}}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td><span v-if="topBoxType != '标题'" class="red-star">*</span>主要完成人</td>
                  <td colspan="3">
                    <div v-if="topBoxType != '标题'">
                      <el-form-item prop="mainPersons2" style="margin: 0;">
                        <el-input
                          v-model="decProjForm.mainPersons2"
                          type="text"
                          placeholder="请输入主要完成人"/>
                      </el-form-item>
                    </div>
                    <div v-else>
                      <span>{{declareInfo.mainPersons2}}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td><span v-if="topBoxType != '标题'" class="red-star">*</span>项目简介及创新点</td>
                  <td colspan="3">
                    <div v-if="topBoxType != '标题'">
                      <el-form-item prop="projectText1" style="margin: 0;">
                        <el-input
                          type="textarea"
                          :rows="8"
                          placeholder="请填写项目简介及创新点，字数不超过500"
                          maxlength="500"
                          show-word-limit
                          v-model="decProjForm.projectText1"
                          />
                      </el-form-item>
                    </div>
                    <div v-else>
                      <span>{{declareInfo.projectText1}}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td><span v-if="topBoxType != '标题'" class="red-star">*</span>已获奖励及知识产权</td>
                  <td colspan="3">
                    <div v-if="topBoxType != '标题'">
                      <el-form-item prop="projectText2" style="margin: 0">
                        <el-input
                          type="textarea"
                          :rows="8"
                          placeholder="请填写已获奖励及知识产权，字数不超过150"
                          maxlength="150"
                          show-word-limit
                          v-model="decProjForm.projectText2"
                          />
                      </el-form-item>
                    </div>
                    <div v-else>
                      <span>{{declareInfo.projectText2}}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td><span v-if="topBoxType != '标题'" class="red-star">*</span>应用情况及经济效益</td>
                  <td colspan="3">
                    <div v-if="topBoxType != '标题'">
                      <el-form-item prop="projectText3" style="margin: 0">
                        <el-input
                          type="textarea"
                          :rows="8"
                          placeholder="请填写应用情况及经济效益，字数不超过300"
                          maxlength="300"
                          show-word-limit
                          v-model="decProjForm.projectText3"
                          />
                      </el-form-item>
                    </div>
                    <div v-else>
                      <span>{{declareInfo.projectText3}}</span>
                    </div>
                  </td>
                </tr>
              </table>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="项目介绍PPT" name="1">
          <div class="tab1-box">
            <table class="proj-table">
              <tr>
                <td style="height: 200px"><span v-if="topBoxType != '标题'" class="red-star">*</span>项目介绍PPT</td>
                <td>
                  <div v-if="topBoxType != '标题'">
                    <upload
                      accept=".pdf"
                      :limit="pdfLimit"
                      :size="50"
                      :name="PPTName"
                      v-model="decProjForm.pptFilePaths"/>
                    <div class="el-upload__tip" style="color: red">
                      仅支持PDF格式的文件，最大50MB
                    </div>
                  </div>
                  <div v-else>
                    <upload
                      :edit="false"
                      v-model="declareInfo.pptFilePaths"/>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="打分表"
                     name="2"
                     v-if="topBoxType == '标题' && showScoreInfo && scoreInfo && (scoreInfo.status == '0' ? false : true) ">
          <div class="tab2-box" v-if="!showScoreInfoAll">
            <table class="proj-table">
              <tr>
                <td rowspan="11" style="width: 100px">指标类型</td>
                <td style="min-width: 100px">序号</td>
                <td style="min-width: 170px">评分指标</td>
                <td style="min-width: 250px">参考元素</td>
                <td style="min-width: 370px" colspan="3">评分等级</td>
                <td>得分</td>
              </tr>
              <tr>
                <td rowspan="2">1</td>
                <td rowspan="2">创新程度</td>
                <td rowspan="2">1.项目自身创新先进性2.国内外技术对比先进性</td>
                <td>较高</td>
                <td>一般</td>
                <td>较弱</td>
                <td rowspan="2">
                  <span>{{scoreInfo.innovationScore}}</span>
                </td>
              </tr>
              <tr>
                <td>10-8</td>
                <td>7-5</td>
                <td>5-3</td>
              </tr>
              <tr>
                <td rowspan="2">2</td>
                <td rowspan="2">知识产权情况</td>
                <td rowspan="2">研究或实施的专业性、难易程度</td>
                <td>2个以上</td>
                <td>1个</td>
                <td>无</td>
                <td rowspan="2">
                  <span>{{scoreInfo.technologyScore}}</span>
                </td>
              </tr>
              <tr>
                <td>10</td>
                <td>5</td>
                <td>3</td>
              </tr>
              <tr>
                <td rowspan="2">3</td>
                <td rowspan="2">难易或复杂程度</td>
                <td rowspan="2">1.研究成果情况2.已获奖励情况</td>
                <td>很难</td>
                <td>一般</td>
                <td>简单</td>
                <td rowspan="2">
                  <span>{{scoreInfo.complexScore}}</span>
                </td>
              </tr>
              <tr>
                <td>10-8</td>
                <td>7-5</td>
                <td>5-3</td>
              </tr>
              <tr>
                <td rowspan="2">4</td>
                <td rowspan="2">应用情况及经济效益</td>
                <td rowspan="2">1.是否已应用验证2.经济效益是否客观</td>
                <td>很大</td>
                <td>中等</td>
                <td>一般</td>
                <td rowspan="2">
                  <span>{{scoreInfo.benefitsScore}}</span>
                </td>
              </tr>
              <tr>
                <td>10-8</td>
                <td>7-5</td>
                <td>5-3</td>
              </tr>
              <tr>
                <td rowspan="2">5</td>
                <td rowspan="2">可推广应用性</td>
                <td rowspan="2">是否具有推广、示范、转化的价值</td>
                <td>建议推广</td>
                <td>待完善后</td>
                <td>无推广价值</td>
                <td rowspan="2">
                  <span>{{scoreInfo.generalizationScore}}</span>
                </td>
              </tr>
              <tr>
                <td>10-8</td>
                <td>7-5</td>
                <td>5-3</td>
              </tr>
              <tr>
                <td>合计</td>
                <td colspan="6">总计</td>
                <td>
                  <span>{{scoreInfo.countScore}}</span>
                </td>
              </tr>
              <tr>
                <td style="height: 160px">评审意见</td>
                <td colspan="7">
                  <span>{{scoreInfo.remark}}</span>
                </td>
              </tr>
            </table>
          </div>
          <div class="tab2-box" v-else>
            <div class="title-box">
              <div class="top">
                <span>{{expertScoreInfo.declareYear}}年{{decRewardFormatter}}评审项目评分</span>
                <div class="top-bottom">
                  <span v-if="declareInfo.projectName2">项目名称：{{declareInfo.projectName2}}</span>
                  <span v-if="expertScoreInfo.declareUnit">申报单位：{{ expertScoreInfo.declareUnit }}</span>
                  <span v-if="industryTypeFormatter">产业类别：{{ industryTypeFormatter }}</span>
                </div>
              </div>
              <div class="bottom">
                <div class="titleText">
                  <span>最高分：</span>
                  <span>{{expertScoreInfo.maxScore|scoreFilter}}分</span>
                </div>
                <div class="titleText">
                  <span>最低分：</span>
                  <span>{{expertScoreInfo.minScore|scoreFilter}}分</span>
                </div>
                <div class="titleText">
                  <span>平均：</span>
                  <span>{{expertScoreInfo.score|scoreFilter}}分</span>
                </div>
              </div>
            </div>
            <el-table
              ref="table"
              v-loading="loading"
              :data="otherScoreInfo"
              style="width: 70%">
              <el-table-column
                label="序号"
                align="center"
                type="index"
                width="80px"/>
              <el-table-column
                label="专家姓名"
                align="center"
                prop="expertName"
                show-overflow-tooltip/>
              <el-table-column
                label="得分"
                align="center"
                prop="countScore"
                :formatter="scoreFormatter"
                show-overflow-tooltip/>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="main" v-if="!showTabs">
      <iframe
        v-if="declareInfo.submitPdfFilePaths"
        :src="declareInfo.submitPdfFilePaths"
        frameborder="0"
        style="width: 100%;height: calc(100vh - 170px);">
      </iframe>
    </div>
  </div>
</template>

<script>
  import {getScoreInfo} from '@/api/selReview/review'
  import {updateSelDeclareInfo} from '@/api/sel/selDeclareInfo'
  import {getSelDeclareInfo} from '@/api/sel/selDeclareInfo'
  import {getReviewResultScoreInfo} from '@/api/sel/selDeclareReviewResult'
  import {selExtraDataRules} from '@/utils/el_validate'
  import {addSelOperLog} from "@/api/sel/selOperLog";

  export default {
    name: 'DecProjectCom',
    props: {
      //是否显示header
      showHeader: {
        type: Boolean,
        default: true
      },
      showTabs: {
        type: Boolean,
        default: true
      },
      //判断是信息输入还是回填
      topBoxType: {
        type: String,
        default: '标题'
      },
      //是否显示打分表
      showScoreInfo: {
        type: Boolean,
        default: false
      },
      //是否显示全部的专家打分汇总
      showScoreInfoAll: {
        type: Boolean,
        default: false
      },
      //路由跳转传入的id
      currId: {
        type: Number,
        default: null
      },
      //路由跳转传入的专家id
      currExpertId: {
        type: Number,
        default: null
      },
      //路由跳转传入的项目信息id
      currInfoId: {
        type: Number,
        default: null
      }
    },
    data() {
      return {
        // 遮罩层
        loading: false,
        tabIndex: '0',
        decProjForm: {
          id: null,
          declareStatus: null,
          projectName2: null,
          mainUnits2: null,
          mainPersons2: null,
          projectText1: null,
          projectText2: null,
          projectText3: null,
          pptFilePaths: null
        },
        //表单验证规则
        rules: selExtraDataRules,
        //上传文件限制
        pdfLimit: 1,
        //申报项目信息
        declareInfo: {},
        //申报奖项字典
        decRewardOptions: [],
        //产业类别
        industryTypeOptions: [],
        //个人得分汇总
        scoreInfo: {},
        //所有专家打分汇总
        expertScoreInfo: {},
        //其他信息(平均分等)
        otherScoreInfo: [],
        fromFullPath: ''
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.fromFullPath = from.fullPath
      })
    },
    created() {
      if (this.topBoxType === '标题') {
        this.getDeclareInfo()
        if (this.showTabs && this.showScoreInfo) {
          if (this.showScoreInfoAll) {
            this._getReviewResultScoreInfo()
          } else {
            this._getScoreInfo()
          }
        }
      } else {
        this.getDeclareInfo()
      }
      //申报奖项字典
      this.getDicts("award_type").then(response => {
        this.decRewardOptions = response.data;
      });
      //产业类别字典
      this.getDicts("industry_type").then(response => {
        this.industryTypeOptions = response.data;
      });
    },
    computed: {
      totalTitle() {
        return this.selectDictLabel(this.decRewardOptions, this.declareInfo.awardsType)
      },
      PPTName() {
        return this.selectDictLabel(this.decRewardOptions, this.declareInfo.awardsType) +
          this.selectDictLabel(this.industryTypeOptions, this.declareInfo.industryType) +
          this.declareInfo.projectName
      },
      decRewardFormatter() {
        return this.selectDictLabel(this.decRewardOptions, this.expertScoreInfo.awardsType)
      },
      industryTypeFormatter() {
        return this.selectDictLabel(this.industryTypeOptions, this.expertScoreInfo.industryType)
      }
    },
    filters: {
      scoreFilter(value) {
        if (value && value > 0) {
          return value
        } else {
          return 0
        }
      }
    },
    methods: {
      scoreFormatter(row) {
        return row.countScore ? row.countScore : "--";
      },
      /******************* 获取及处理数据 *******************/
      //获取项目补充资料信息
      getDeclareInfo() {
        const infoId = this.currInfoId
        getSelDeclareInfo(infoId).then(res => {
          if (res.data) {
            const dateTem = res.data
            this.declareInfo = dateTem;
            console.log(this.declareInfo)
            this.decProjForm = {
              id: null,
              declareStatus: 6,
              projectName2: dateTem.projectName,
              mainUnits2: dateTem.mainUnits2 == null && dateTem.selDeclareScience !=null ? dateTem.selDeclareScience.mainCompletionUnit : dateTem.mainUnits2,
              mainPersons2: dateTem.mainPersons2 == null && dateTem.selDeclareScience !=null ? dateTem.selDeclareScience.mainCompletionPerson : dateTem.mainPersons2,
              projectText1: dateTem.projectText1,
              projectText2: dateTem.projectText2,
              projectText3: dateTem.projectText3,
              pptFilePaths: dateTem.pptFilePaths
            }
            this.$emit('sendDeclareInfo', dateTem)
          }
        })
      },
      //获取单个专家打分信息
      _getScoreInfo() {
        const query = {
          infoId: this.currInfoId,
          expertId: this.currExpertId
        }
        getScoreInfo(query).then(res => {
          console.log(res);
          this.scoreInfo = res.data;
        })
      },
      //获取所有专家打分汇总
      _getReviewResultScoreInfo() {
        this.loading = true
        getReviewResultScoreInfo(this.currId).then(res => {
          console.log(res)
          this.loading = false
          this.expertScoreInfo = res.data.declareReviewResult
          this.otherScoreInfo = res.data.scoreList
        })
      },

      /******************* 交互操作 *******************/
      //tab标签切换事件
      handleClick() {

      },
      //提交表单
      submitForm(status) {
        getSelDeclareInfo(this.currInfoId).then(res => {
          this.decProjForm.declareStatus = status;
          let opername = status == 12 ? '保存' : '提交'
            let operName = status == 12 ? '编辑' : '提交'
          if(status == 13){
              let {uploadEndDate} = res.data
              uploadEndDate = uploadEndDate.replace(/-/g, '/')
              const uploadEndDateTime = new Date(uploadEndDate).getTime()
              const currTime = new Date().getTime()
              if ((currTime < uploadEndDateTime)) {
                  this.$refs["decProjForm"].validate(valid => {
                      if (valid) {
                          if (this.decProjForm.pptFilePaths) {
                              const pptFilePaths = JSON.parse(this.decProjForm.pptFilePaths)
                              const dataTem = pptFilePaths[0].fileName
                              const reg = /(\.pdf)$/
                              if (reg.test(dataTem)) {
                                  this.decProjForm.id = this.currInfoId
                                  updateSelDeclareInfo(this.decProjForm).then(res => {
                                      if (res.code === 200) {
                                          const log = {};
                                          log.infoId = this.currInfoId;
                                          log.operName = operName+'补充资料';
                                          addSelOperLog(log);
                                          this.msgSuccess(opername+"补充资料成功")
                                          this.closeView(this.$route.path, this.fromFullPath, 0);
                                      }
                                  })
                              } else {
                                  this.$message.warning('请上传pdf格式')
                              }
                          } else {
                              this.$message.warning('请上传pdf文件')
                          }
                      } else {
                          if (this.tabIndex == '1') {
                              this.msgError('必填项不能为空')
                          }
                      }
                  })
              } else {
                  this.$message.warning("您的补充资料时间已过!")
              }
          }else {
              let {uploadEndDate, pptFilePaths} = res.data
              this.decProjForm.id = this.currInfoId
              if (this.decProjForm.pptFilePaths) {
                  const pptFilePaths = JSON.parse(this.decProjForm.pptFilePaths)
                  const dataTem = pptFilePaths[0].fileName
                  const reg = /(\.pdf)$/
                  if (!reg.test(dataTem)) {
                      this.$message.warning('请上传pdf格式')
                      return;
                  }
              }
              updateSelDeclareInfo(this.decProjForm).then(res => {
                  if (res.code === 200) {
                      const log = {};
                      log.infoId = this.currInfoId;
                      log.operName = operName+'补充资料';
                      addSelOperLog(log);
                      this.msgSuccess(opername+"补充资料成功")
                      this.closeView(this.$route.path, this.fromFullPath, 0);
                  }
              })
          }
        })
      },
      //取消返回
      cancelBack() {
        this.resetForm("decProjForm")
        this.closeView(this.$route.path, this.fromFullPath, 0);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dec-project-component {
    width: 100%;
    display: flex;
    flex-direction: column;

    .header {
      width: 100%;
      margin-bottom: 20px;

      .slot-box1 {
        width: 100%;
        font-size: 24px;
        font-weight: bold;
        color: #333;
        display: flex;
        flex-direction: column;

        span:nth-child(2) {
          margin-top: 10px;
          font-size: 18px;
          color: #666;
        }
      }

      .slot-box2 {
        width: 100%;
        display: flex;

        .item1Class {
          margin-right: 10px;
        }
      }
    }

    .tab1-box {
      width: 100%;

      .proj-table {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        color: #606266;
        font-size: 18px;
        line-height: 22px;
        table-layout: fixed;

        tr:nth-child(n+3) td {
          height: 200px;
        }

        td {
          border: 1px solid #E6E9F0;
          padding: 20px 15px;
          word-wrap: break-word;

          .ppt-box {
            width: 200px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: pointer;

            span {
              margin-top: 10px;
            }
          }
        }

        tr td:nth-child(2n+1) {
          text-align: center;
          width: 200px;
        }
      }
    }

    .tab2-box {
      width: 100%;

      .proj-table {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        color: #606266;
        font-size: 18px;
        line-height: 22px;
        table-layout: fixed;

        td {
          border: 1px solid #E6E9F0;
          padding: 15px 10px;
          word-wrap: break-word;
          text-align: center;
        }
      }

      .title-box {
        width: 70%;
        display: flex;
        flex-direction: column;
        margin-top: 10px;

        .top {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #333;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;

          .top-bottom {
            margin-top: 20px;
            display: flex;
            flex-direction: column;

            span {
              margin-bottom: 10px;
            }
          }
        }

        .bottom {
          width: 100%;
          display: flex;
          justify-content: space-around;
          margin-bottom: 15px;

          .titleText {

          }
        }
      }
    }
  }

  .red-star {
    color: red;
    margin-right: 4px;
  }
</style>
