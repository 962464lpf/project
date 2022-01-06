<template>
  <div>
    <el-row>
      <el-col :span="20">
        <table class="pdf-show-table">
          <tbody>
            <tr>
              <td rowspan="2" style="width: 100px;">项目名称</td>
              <td style="width: 100px;">中文</td>
              <td>
                <el-form-item prop="projectNameCn">
                  <el-input v-model="form.projectNameCn" placeholder="项目名称(中文)不超过30个字(含字符)" @blur="submitForm" maxlength="30" show-word-limit />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>英文</td>
              <td>
                <el-form-item prop="projectNameEn">
                  <el-input v-model="form.projectNameEn" placeholder="项目名称（英文）系指中文名称的英译文，不超过 200 个字符" @blur="submitForm" maxlength="200" show-word-limit />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td colspan="2">主要完成单位</td>
              <td>
                <el-form-item prop="mainCompletionUnit">
                  <el-input v-model="form.mainCompletionUnit" type="textarea" rows="2"  placeholder="与下面完成人顺序对应" @blur="submitForm" maxlength="200" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td colspan="2">主要完成人</td>
              <td>
                <el-form-item prop="mainCompletionPerson">
                  <el-input v-model="form.mainCompletionPerson" type="textarea" rows="2"  placeholder="完成人应是全面参与项目研发、技术管理工作的成员，不得出现“报奖搭车”现象。
独立申报项目完成人上限不超过5 人，联合申报项目完成人上限不超过7 人，其中三分之二及以上应为一线人员，前三位完成人中，至少两位应为一线人员" @blur="submitForm" maxlength="50"/>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td colspan="2">申报单位</td>
              <td>
                <el-form-item prop="declareUnit">
                  <el-input v-model="form.declareUnit" type="text" placeholder="请从主要完成单位中选择一个填写" @blur="submitForm" maxlength="50" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td colspan="2">主题词</td>
              <td>
                <el-form-item prop="theme">
                  <el-input v-model="form.theme" type="textarea" rows="2" placeholder="填写2-5个与项目技术内容密切相关的主题词，每个词语间应加“；”号" @blur="submitForm" maxlength="100" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td colspan="2">任务来源</td>
              <td>
                <el-form-item prop="taskSource">
                  <el-select v-model="form.taskSource" clearable placeholder="请选择任务来源" style="width: 100%" @blur="submitForm">
                    <el-option
                      v-for="dict in taskSourceOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td colspan="2">项目起止时间</td>
              <td style="text-align: left;">
                <el-form-item prop="projectBeginTime">
                  <el-date-picker clearable  style="width: 400px"
                                  v-model="dateRange"
                                  type="daterange"
                                  range-separator="至"
                                  start-placeholder="请选择项目起始时间"
                                  end-placeholder="请选择项目完成时间"
                                  @change="submitForm"
                                  value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td colspan="2">项目简介</td>
              <td>
                <el-form-item prop="projectIntro">
                  <ueditor
                    v-model="form.projectIntro"
                    class-name="red-placeholder"
                    @change="submitForm"
                    placeholder="应是向国内外公开宣传、介绍项目的资料，要求按栏目内的提要，简单、扼要地介绍，同时不泄露项目的核心技术。"
                  />
<!--                  <el-input -->
<!--                    v-model="form.projectIntro" -->
<!--                    type="textarea" rows="11"  -->
<!--                    placeholder="应是向国内外公开宣传、介绍项目的资料，要求按栏目内的提要，简单、扼要地介绍，同时不泄露项目的核心技术。填写内容不得超过 800 字。" -->
<!--                    maxlength="800" show-word-limit @blur="submitForm" -->
<!--                  />-->
                </el-form-item>

              </td>
            </tr>
          </tbody>
        </table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { updateSelDeclareScience } from "@/api/sel/selDeclareScience";
import ueditor from "@/components/Ueditor"

export default {
  data() {
    return {
      // 表单参数
      form: {},
      dateRange: [],
      taskSourceOptions: [],
      pickerOptions: {}
    };
  },
  props: {
    value: {
      default: {}
    },
  },
  created() {
    this.form = this.value;
    if(!this.form.taskSource) this.form.taskSource = '1';
    this.getDicts("task_source").then(response => {
      this.taskSourceOptions = response.data;
    });
  },
  components: {
    ueditor
  },
  methods: {
    /** 提交按钮 */
    submitForm: function() {
      if (this.form.id != undefined) {
        updateSelDeclareScience(this.addDateRange(this.form, this.dateRange));
      }
    },
    // 添加日期范围
    addDateRange(params, dateRange) {
      var search = params;
      search.projectBeginTime = '';
      search.projectEndTime = '';
      if (null != dateRange && '' != dateRange) {
        search.projectBeginTime = dateRange[0];
        search.projectEndTime = dateRange[1];
      }
      return search;
    }
  },
  watch:{
    value (newVal, oldVal) {
      this.form = newVal;
      if(this.form.projectBeginTime && this.form.projectEndTime) {
        this.dateRange = [this.form.projectBeginTime, this.form.projectEndTime];
      }
    }
  }
};
</script>
