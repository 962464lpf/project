<template>
  <div class="app-container red-placeholder">
    <div style="height: 0px;overflow: hidden;width: 795px;">
      <!-- pdf 打印 -->
      <div class="pdf-content" id="pdfContent" ref="pdfContent">
        <div id="table-page1">
          <div id="table-page1_1">
            <div class="pdf-page">
              <div style="font-size: 20pt;">附件2</div>
              <div style="padding: 160pt 0 320pt;">
                <h1>中国绿发投资集团有限公司</h1>
                <h1>{{parseTime(form.updateTime, '{y}')}}年度科学技术奖励申报手册</h1>
              </div>
              <h2 style="margin-bottom: 30pt;font-size: 18pt;">中国绿发投资集团有限公司</h2>
              <div style="text-align: center;font-size: 18pt;">{{parseTime(form.updateTime, '{y}')}}年{{parseTime(form.updateTime, '{m}')}}月</div>
            </div>
            <!-- 一、	项目基本情况 -->
            <div id="table-page1-1" class="pdf-page">
              <h1>公司科学技术奖申报书</h1>
              <h2>一、	项目基本情况</h2>
              <div class="item-number">项目编号：</div>
              <table class="pdf-print-table">
                <tbody>
                <tr>
                  <td rowspan="2" style="width: 60pt;text-align: center;">项目名称</td>
                  <td style="width: 50pt;text-align: center;">中文</td>
                  <td colspan="2" style="height: 40pt;">{{form.projectNameCn}}</td>
                </tr>
                <tr>
                  <td style="text-align: center;">英文</td>
                  <td colspan="2" style="height: 40pt;">{{form.projectNameEn}}</td>
                </tr>
                <tr>
                  <td colspan="2" style="text-align: center;">主要完成人</td>
                  <td colspan="2">
                    <pre style="height: 100pt;overflow: hidden;">{{form.mainCompletionPerson}}</pre>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="text-align: center;">主要完成单位</td>
                  <td colspan="2" style="height: 100pt;">
                    <pre style="height: 120pt;overflow: hidden;">{{form.mainCompletionUnit}}</pre>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="text-align: center;">申报单位</td>
                  <td colspan="2" style="height: 40pt;">{{form.declareUnit}}</td>
                </tr>
                <tr>
                  <td colspan="2" style="text-align: center;">主题词</td>
                  <td colspan="2">
                    <pre style="height: 120pt;overflow: hidden;">{{form.theme}}</pre>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="text-align: center;">任务来源</td>
                  <td colspan="2" style="height: 40pt;">{{selectDictLabel(taskSourceOptions, form.taskSource)}}</td>
                </tr>
                <tr>
                  <td colspan="2" style="text-align: center;">项目起止时间</td>
                  <td style="height: 40pt;text-align: center;">
                    <span>起始：</span>{{getCnDate(form.projectBeginTime)}}
                  </td>
                  <td style="height: 40pt;text-align: center;">
                    <span>完成：</span>{{getCnDate(form.projectEndTime)}}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <!-- 二、项目简介 -->
            <div id="table-page1-2" class="pdf-page">
              <h2>二、项目简介</h2>
              <div style="border: 1pt solid #000000;height: 100%;padding: 6pt;">
                <pre>{{form.projectIntro}}</pre>
              </div>
            </div>
            <!-- 三、项目详细内容 -->
            <div id="table-page1-3" class="pdf-page">
              <h2>三、项目详细内容</h2>
              <div style="border: 1pt solid #000000;height: 100%;padding: 6pt;">
                <span>1．立项背景</span>
                <pre>{{form.projectBackground}}</pre>
              </div>
            </div>
          </div>
          <!-- 2．详细科学技术内容 -->
          <div id="table-page1-4" class="pdf-page" v-if="!form.projectContentFilePaths">
            <div style="border: 1pt solid #000000;height: 100%;padding: 6pt;">
              <span>2．详细科学技术内容</span>
              <pre>{{form.projectContent}}</pre>
            </div>
          </div>
          <div id="table-page1_2">
            <!-- 3．主要科技创新 -->
            <div id="table-page1-5" class="pdf-page">
              <div style="border: 1pt solid #000000;height: 100%;padding: 6pt;">
                <span>3．主要科技创新</span>
                <pre>{{form.mainInnovation}}</pre>
              </div>
            </div>
            <!-- 4．与当前国内外同类研究、同类技术的综合比较 -->
            <div id="table-page1-6" class="pdf-page">
              <div style="border: 1pt solid #000000;height: 100%;padding: 6pt;">
                <span>4．与当前国内外同类研究、同类技术的综合比较</span>
                <pre>{{form.generalComparison}}</pre>
              </div>
            </div>
            <!-- 5．应用情况 -->
            <div id="table-page1-7" class="pdf-page">
              <div style="border: 1pt solid #000000;height: 100%;padding: 6pt;">
                <span>5．应用情况</span>
                <pre>{{form.usageSituation}}</pre>
              </div>
            </div>
          </div>
        </div>
        <!-- 经济效益页 -->
        <div class="pdf-page" id="table-page2">
          <table class="pdf-print-table" style="text-align: center;">
            <tbody>
            <tr>
              <td colspan="5">
                <div style="text-align: left;height: 16pt;">
                  6．经济效益（加盖财务专用章）
                  <span style="float: right;">单位：万元人民币</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style="width: 100pt;">项目总投资额</td>
              <td colspan="2">{{form.totalInvestment}}</td>
              <td style="width: 100pt;">回收期（年）</td>
              <td style="">{{form.paybackPeriod}}</td>
            </tr>
            <tr>
              <td class="subfield">
                <div class="subfield-item" style="padding: 0;">年份</div>
                <div class="subfield-item" style="padding: 0;text-align: left;">栏目</div>
                <div class="subfield-line" style="background-color: #000;transform: rotate(23deg);"></div>
              </td>
              <td>新增利润</td>
              <td>新增税收</td>
              <td>创收外汇</td>
              <td>节支总额</td>
            </tr>
            <tr v-for="item in economicList">
              <td style="height: 40pt;">{{item.investmentYear}}</td>
              <td>{{item.newProfits}}</td>
              <td>{{item.newTaxes}}</td>
              <td>{{item.incomeExchange}}</td>
              <td>{{item.totalSavings}}</td>
            </tr>
            <tr>
              <td><div style="height: 19pt;">累计</div></td>
              <td>{{getTotal('newProfits')}}</td>
              <td>{{getTotal('newTaxes')}}</td>
              <td>{{getTotal('incomeExchange')}}</td>
              <td>{{getTotal('totalSavings')}}</td>
            </tr>
            <tr>
              <td colspan="5">
                <div style="text-align: left;">经济效益额的计算依据：</div>
                <pre style="height: 100pt;text-align: left;">{{form.settlementBasis}}</pre>
              </td>
            </tr>
            <tr>
              <td colspan="5">
                <div style="text-align: left;">社会效益与间接经济效益：</div>
                <pre style="height: 150pt;text-align: left;">{{form.benefit}}</pre>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <!-- 四、本项目曾获科技奖励情况 -->
        <div class="pdf-page" id="table-page3">
          <h2>四、本项目曾获科技奖励情况</h2>
          <table class="pdf-print-table" style="text-align: center;">
            <tbody>
            <tr style="white-space: nowrap;">
              <td>获奖项目名称</td>
              <td style="width: 80pt;">获奖时间</td>
              <td>奖项名称</td>
              <td style="width: 40pt;">奖励等级</td>
              <td><div>授奖部门</div><div>(单位)</div></td>
            </tr>
            <tr v-for="item in 9">
              <td style="height: 40pt;"><div>{{awardList[item-1] ? awardList[item-1].awardProjectName : ''}}</div></td>
              <td>{{awardList[item-1] ? parseTime(awardList[item-1].awardDate, '{y}-{m}-{d}') : ''}}</td>
              <td>{{awardList[item-1] ? awardList[item-1].awardName : ''}}</td>
              <td>{{awardList[item-1] ? awardList[item-1].awardLevel : ''}}</td>
              <td>{{awardList[item-1] ? awardList[item-1].awardUnit : ''}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <!-- 五、主要知识产权证明目录（不超过10件） -->
        <div class="pdf-page" id="table-page4">
          <h2>五、主要知识产权证明目录（不超过10件）</h2>
          <table class="pdf-print-table" style="text-align: center;">
            <tr>
              <td>知识产权类别</td>
              <td>知识产权具体名称</td>
              <td style="width: 20pt;">国家（地区）</td>
              <td style="width: 40pt;">授权号</td>
              <td style="width: 50pt;">授权日期</td>
              <td style="width: 40pt;">证书编号</td>
              <td>权利人</td>
              <td style="width: 50pt;">发明人</td>
              <td style="width: 20pt;">发明专利有效状态</td>
            </tr>
            <tr v-for="item in 9">
              <td style="height: 30pt;">{{proveList[item-1] ? proveList[item-1].rightType : ''}}</td>
              <td>{{proveList[item-1] ? proveList[item-1].rightName : ''}}</td>
              <td>{{proveList[item-1] ? proveList[item-1].country : ''}}</td>
              <td>{{proveList[item-1] ? proveList[item-1].authCode : ''}}</td>
              <td style="word-wrap: break-word;word-break:break-all;">{{proveList[item-1] ? parseTime(proveList[item-1].authDate, '{y}-{m}-{d}') : ''}}</td>
              <td>{{proveList[item-1] ? proveList[item-1].certificateCode : ''}}</td>
              <td>{{proveList[item-1] ? proveList[item-1].obligee : ''}}</td>
              <td>{{proveList[item-1] ? proveList[item-1].inventor : ''}}</td>
              <td>{{proveList[item-1] ? proveList[item-1].patentStatus : ''}}</td>
            </tr>
          </table>
          <div style="line-height: 18pt;margin-top: 4pt;"><span style="font-weight: bold;">承诺</span>：上述知识产权用于报奖的情况，已征得未列入项目主要完成人的权利人（发明专利指发明人）的同意。</div>
          <div style="text-align: right;margin-top: 40pt;">第一完成人签名：<span style="width: 100px;display: inline-block;">{{form.personNo}}</span></div>
        </div>
        <!-- 六、主要完成人情况表 -->
        <div id="table-page5">
          <div class="pdf-page" :id="'table-page5-'+(index+1)" v-for="(item, index) in personList">
          <h2 v-if="index == 0">六、主要完成人情况表</h2>
          <table class="pdf-print-table" style="text-align: center;">
            <tbody>
            <tr>
              <td style="width: 90pt;">第 <span style="text-decoration: underline;">{{item.personNo}}</span> 完成人</td>
              <td style="width: 50pt;">姓 名</td>
              <td>{{item.personName}}</td>
              <td style="width: 80pt;">性  别</td>
              <td>{{item.personSex}}</td>
              <td style="width: 70pt;">民  族</td>
              <td style="width: 100pt">{{item.personNation}}</td>
            </tr>
            <tr>
              <td>籍贯</td>
              <td colspan="4">{{item.nativePlace}}</td>
              <td>出生日期</td>
              <td>{{getCnDate(item.persionBirthday)}}</td>
            </tr>
            <tr>
              <td>工作单位</td>
              <td colspan="4">{{item.persionWorkUnit}}</td>
              <td>联系电话</td>
              <td>{{item.linkPhone}}</td>
            </tr>
            <!--                <tr>-->
            <!--                  <td>通讯地址及邮政编码</td>-->
            <!--                  <td colspan="6">{{item.email}}</td>-->
            <!--                </tr>-->
            <tr>
              <td>电子信箱</td>
              <td colspan="6">{{item.email}}</td>
            </tr>
            <tr>
              <td>毕业学校</td>
              <td colspan="2">{{item.graduateSchool}}</td>
              <td>文化程度</td>
              <td>{{item.education}}</td>
              <td>学位</td>
              <td>{{item.academicDegree}}</td>
            </tr>
            <tr>
              <td>职务、职称</td>
              <td colspan="2">{{item.personPost}}</td>
              <td>专业、专长</td>
              <td>{{item.major}}</td>
              <td>毕业时间</td>
              <td>{{getCnDate(item.graduationTime)}}</td>
            </tr>
            <tr>
              <td colspan="7" style="text-align: left;">
                <div>曾获奖励及荣誉称号情况:</div>
                <div style="height: 110pt;overflow: hidden;">
                  {{item.awardsIntro}}
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2">参加本项目的起止时间</td>
              <td colspan="5">{{getCnDate(item.partBeginTime)}} - {{getCnDate(item.partEndTime)}} </td>
            </tr>
            <tr>
              <td colspan="7" style="text-align: left;">
                <div>对本项目的创造性贡献：</div>
                <div style="height: 110pt;overflow: hidden;">{{item.contributionDesc}}</div>
              </td>
            </tr>
            <tr>
              <td>声明</td>
              <td colspan="6">
                <div style="text-align: left;text-indent: 2em;">
                  本人按照申报要求，如实提供了本申报书及相关材料，所提供材料不存在任何违反《中华人民共和国保守国家秘密法》和《科学技术保密规定》等相关法律法规及侵犯他人知识产权的情形，并对其真实性负责。如有不符，本人愿意承担相关后果。且确认上一栏目中所列本人对该项目的技术创造性贡献。
                </div>
                <div style="text-align: right;padding-top: 20pt;">
                  <div>
                    <span>本人签名</span>
                    <span style="display: inline-block;width: 100pt;"></span>
                  </div>
                  <div style="padding: 20pt 80pt 10pt 0;">{{getCnDate(item.regDate)}}</div>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        </div>
        <!-- 七、主要完成单位情况表 -->
        <div id="table-page6">
          <div class="pdf-page" :id="'table-page6-'+(index+1)" v-for="(item, index) in unitList">
            <h2 v-if="index == 0">七、主要完成单位情况表</h2>
            <table class="pdf-print-table" style="text-align: center;">
              <tbody>
              <tr>
                <td style="width: 125pt;height: 40pt;">单 位 名 称</td>
                <td colspan="3">{{item.unitName}}</td>
              </tr>
              <tr>
                <td colspan="4" style="text-align: left;padding-left: 30pt;height: 40pt;">第 <span style="text-decoration: underline;">{{item.unitNo}}</span> 完成单位</td>
              </tr>
              <tr>
                <td style="height: 40pt;">联  系  人</td>
                <td>{{item.linkman}}</td>
                <td style="width: 100pt;">联系电话</td>
                <td>{{item.linkPhone}}</td>
              </tr>
              <tr>
                <td style="height: 40pt;">传 真</td>
                <td>{{item.fax}}</td>
                <td>电子信箱</td>
                <td>{{item.email}}</td>
              </tr>
              <tr>
                <td style="height: 40pt;">通讯地址及邮政编码</td>
                <td colspan="6">{{item.postalAddress}}</td>
              </tr>
              <tr>
                <td colspan="7" style="text-align: left;">
                  <div>对本项目的创造性贡献：</div>
                  <div style="height: 110pt;overflow: hidden;">{{item.contributionDesc}}</div>
                </td>
              </tr>
              <tr>
                <td>声明</td>
                <td colspan="6">
                  <div style="text-align: left;text-indent: 2em;height: 200pt">
                    本单位按照申报要求，如实提供了本申报书及相关材料，所提供材料不存在任何违反《中华人民共和国保守国家秘密法》和《科学技术保密规定》等有关法律法规及侵犯他人知识产权的情形，并对其真实性负责。如有不符，本单位愿意承担相关后果。且确认上一栏目中所列本单位对该项目技术创新和应用的贡献。
                  </div>
                  <div style="text-align: right;padding-top: 20pt;">
                    <div>
                      <span>完成单位（公章）：</span>
                      <span style="display: inline-block;width: 100pt;"></span>
                    </div>
                    <div style="padding: 20pt 80pt 10pt 0;">{{getCnDate(item.regDate)}}</div>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- 八、申报意见 -->
        <div class="pdf-page" id="table-page7">
          <h2>八、申报意见</h2>
          <table class="pdf-print-table" style="text-align: center;">
            <tr>
              <td style="width: 36px;">申报意见</td>
              <td style="text-align: left;">
                <div>申报单位意见：</div>
                <pre style="height: 460pt;">{{form.declareOpinions}}</pre>
              </td>
            </tr>
            <tr>
              <td>声明</td>
              <td>
                <div style="text-align: left;text-indent: 2em;height: 100pt;">
                  我单位按照申报要求，对本申报书及其附件进行了审查，确认该项目符合申报条件，申报材料全部内容属实，所提供材料不存在任何违反《中华人民共和国保守国家秘密法》和《科学技术保密规定》等有关法律法规及侵犯他人知识产权的情形，并对其真实性负责。如有不符，我单位愿意承担相关后果。且确认上一栏目中所列对该项目的申报意见及申报等级。
                </div>
                <div style="text-align: right;padding-top: 20pt;">
                  <div>
                    <span>申报单位（公章）：</span>
                    <span style="display: inline-block;width: 100pt;"></span>
                  </div>
                  <div style="padding: 20pt 80pt 10pt 0;">{{getCnDate(form.statementDate)}}</div>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <!-- 九、附件 -->
        <div class="pdf-page" id="table-page8">
          <h2>九、附件</h2>
          <div style="height: 40pt;"></div>
          <h2 style="text-align: left;" v-if="form.prove1FilePaths">知识产权证明</h2>
          <!--          <div>{{getFileName(form.prove1FilePaths)}}</div>-->
          <h2 style="text-align: left;" v-if="form.prove2FilePaths">应用证明</h2>
          <!--          <div>{{getFileName(form.prove2FilePaths)}}</div>-->
          <h2 style="text-align: left;" v-if="form.prove3FilePaths">技术评价证明</h2>
          <!--          <div>{{getFileName(form.prove3FilePaths)}}</div>-->
          <h2 style="text-align: left;" v-if="form.prove4FilePaths">其他证明</h2>
          <!--          <div>{{getFileName(form.prove4FilePaths)}}</div>-->
        </div>
      </div>
    </div>

    <el-row :gutter="10" class="mb8">
      <div class="fr">
        <el-col :span="1.5">
          <el-button
            type="primary"

            @click="updateData('1')"
          >保存</el-button>
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
          >取消</el-button>
        </el-col>
      </div>
    </el-row>

    <el-form ref="form" :model="form" :rules="rules">
      <div class="wrapper">
        <el-radio-group v-model="tabIndex" style="margin-bottom: 20px;">
          <el-radio-button label="1">项目基本情况</el-radio-button>
          <el-radio-button label="2">项目详细内容</el-radio-button>
          <el-radio-button label="3">经济效益</el-radio-button>
          <el-radio-button label="4">本项目曾获科技奖励情况</el-radio-button>
          <el-radio-button label="5">主要知识产权证明目录</el-radio-button>
          <el-radio-button label="7">主要完成单位情况表</el-radio-button>
          <el-radio-button label="6">主要完成人情况表</el-radio-button>
          <el-radio-button label="8">申报意见</el-radio-button>
          <el-radio-button label="9">附件</el-radio-button>
        </el-radio-group>
      </div>
      <div class="declare-tab-content">
        <el-tabs v-model="tabIndex" @tab-click="handleTabClick">
          <el-tab-pane label="项目基本情况" name="1">
            <div>
              <basic-info v-model="form" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="项目详细内容" name="2">
            <div>
              <detail v-model="form" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="经济效益" name="3">
            <div>
              <economic-benefit @ecnomicform="getEcnomicForm" v-model="form" @change="economicChange" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="本项目曾获科技奖励情况" name="4">
            <div>
              <awards v-model="form" @change="awardChange" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="主要知识产权证明目录" name="5">
            <div>
              <science-prove @proveform="getProveForm" v-model="form" @change="proveChange" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="主要完成单位情况表" name="7">
            <div>
              <unit @unitform="getUnitform" v-model="form" @change="unitChange" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="主要完成人情况表" name="6">
            <div>
              <person @personform="getPersonform" v-model="form" @change="personChange" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="申报意见" name="8">
            <div>
              <opinion @opinionform="getOpinionform" v-model="form" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="附件" name="9">
            <div>
              <attachment v-model="form" />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-form>

<!--    <el-dialog title="PDF预览" :visible.sync="open" width="830px" append-to-body :close-on-click-modal="false">-->
<!--      <div ref="pdfContentPreview"></div>-->
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button @click="open = false">关 闭</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->
  </div>
</template>

<script>
import { updateSelDeclareInfo, submitDeclare, searchDeclareEndTime, pdfPreview } from "@/api/sel/selDeclareInfo";
import { getSelDeclareScienceByinfo, updateSelDeclareScience } from "@/api/sel/selDeclareScience";
import basicInfo from './science/basic-info.vue'  //项目基本信息
import detail from './science/detail.vue'   //项目详细内容
import economicBenefit from './science/economic-benefit.vue'  //经济效益
import awards from './science/awards.vue'  //本项目曾获科技奖励情况
import scienceProve from './science/science-prove.vue'  //主要知识产权证明目录
import person from './science/person.vue'  //主要完成人情况表
import unit from './science/unit.vue'  //主要完成单位情况表
import opinion from './science/opinion.vue'  //申报意见
import attachment from './science/attachment.vue'  //附件
import BScroll from '@/components/BScroll'

import { base64ToPDF, downloadPDF } from "@/api/common/utils";
import { addSelOperLog } from "@/api/sel/selOperLog";
import {publish} from "@/api/achie/achieDisplayInfo";

export default {
  name: "sel-selDeclareInfo-science",
  components: {
    basicInfo, detail, economicBenefit, awards, scienceProve, person, unit, opinion, attachment, BScroll
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
        projectNameCn: [
          { required: true, message: "项目名称(中文)不能为空", trigger: "blur" }
        ]
      },
      dateRange: [],
      tabIndex: '1',
      taskSourceOptions: [],
      economicList: [],  //经济效益页列表数据
      awardList: [],  //本项目曾获科技奖励情况列表数据
      proveList: [], //主要知识产权证明目录列表数据
      personList: [], //主要完成人情况表列表数据
      unitList: [],  //主要完成单位情况表列表数据
      infoId: undefined,
      isSubmit: false,
      path: null,
      ecnomicForm: {

      },
      proveForm: {

      },
      unitForm: {

      },
      personForm: {

      },
      opinionForm: {

      },
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
    this.getDicts("task_source").then(response => {
      this.taskSourceOptions = response.data;
    });
    if (this.$route.query.releaseFlag) {
      this.releaseFlag = this.$route.query.releaseFlag
    }
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
    init() {
      const id = this.$route.query.id;
      if(id) {
        this.infoId = id;
        getSelDeclareScienceByinfo(id).then(response => {
          this.form = response.data;
          this.ecnomicForm = response.data
          this.proveForm = response.data
          this.unitForm = response.data
          this.personForm = response.data
          this.opinionForm = response.data
        });
      }else{
        this.reset();
      }
    },
    handleTabClick() {

    },
    //获取经济效益填写字段
    getEcnomicForm(valueForm) {
      this.ecnomicForm = valueForm
      this.isSubmit = false
    },
    //获取知识产权证明目录
    getProveForm(valueForm) {
      this.proveForm = valueForm
      this.isSubmit = false
    },
    //获取单位字段
    getUnitform(valueForm) {
      this.unitForm = valueForm
      this.isSubmit = false
    },
    //获取人字段
    getPersonform(valueForm) {
      this.personForm = valueForm
      this.isSubmit = false
    },
    //获取意见
    getOpinionform(valueForm) {
      this.opinionForm = valueForm
      this.isSubmit = false
    },
    /** 保存操作 */
    updateData(showMsg) {
      //if (this.$route.query.kxbEdit == 1) {
      if (true) {
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
        updateSelDeclareScience(this.form).then(response => {
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
        let pdfContent = this.$refs.pdfContent.cloneNode(true);
        this.$refs.pdfContentPreview.innerHTML = '';
        this.$refs.pdfContentPreview.appendChild(pdfContent);
      }, 100)
    },
    // 取消按钮
    cancel() {
      this.closeView(this.$route.path, this.fromFullPath, 0);
    },
    getCnDate(date) {
      if(date) {
        let arr = date.split(' ')[0].split('-');
        return arr[0]+'年'+arr[1]+'月'+arr[2]+'日';
      }
    },
    getTotal(key) {
      let total = null;
      this.economicList.map(item => {
        if(item[key]) total += parseFloat(item[key]);
      })
      return total;
    },
    getFileName(date) {
      if(date && typeof date == 'string') {
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
        if(arr) {
          arr = JSON.parse(arr);
          paths = arr[0].fileName;
          resolve(paths);
        } else {
          resolve('');
        }
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      if (this.ecnomicForm.economicFilePaths && this.proveForm.signFilePaths && this.unitForm.unitsFilePaths && this.personForm.usersFilePaths && this.opinionForm.declareFilePaths) {
        if(this.isSubmit) return;
        this.isSubmit = true;
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.releaseFlag === '1') {
              this.submitAchievement(this.infoId)
            } else {
              searchDeclareEndTime({
                id: this.infoId
              }).then(resp => {
                if(resp.code == 200) {
                  pdfPreview({
                    id: this.infoId
                  }).then((response) => {
                    this.isSubmit = false;
                    if (response.code === 200) {
                      submitDeclare({
                        id: this.infoId
                      }).then(response => {
                        if (response.code === 200) {
                          this.msgSuccess("提交成功");
                          const log = {};
                          log.infoId = this.infoId;
                          log.operName = '提交申报';
                          addSelOperLog(log);
                          const id = this.$route.query.id;
                          if (id) {
                            this.cancel()
                          } else {
                            this.cancel()
                          }
                        }
                      });
                      updateSelDeclareInfo({ id: this.infoId, submitPdfFilePaths: response.msg })
                    }
                  }).catch(() => {
                    this.isSubmit = false;
                  })
                }
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
      if (to.path === '/sel/selDeclareInfo/science') {
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
