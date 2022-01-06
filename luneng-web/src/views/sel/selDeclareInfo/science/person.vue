<template>
  <el-row>
    <el-col :span="20" id="test">
      <template v-for="(item, index) in selDeclareSciencePersonList">
        <div style="line-height: 30px;padding: 10px 0;">
          <span>第{{index+1}}页</span>
          <el-button
            v-if="index !== 0"
            style="float: right"
            type="danger"
            icon="el-icon-delete"

            @click="handleDelete(item)"
          >删除</el-button>
        </div>
        <table class="pdf-show-table tc" style="margin-bottom: 20px">
          <tr>
            <td style="width: 200px;">
              第
              <el-form-item prop="personNo" style="display: inline-block;width: 60px;margin: 0 6px;">
                <a-input v-model="item.personNo" type="number" placeholder="" @blur="submitForm(item, index)" maxlength="3"/>
              </el-form-item>
              完成人
            </td>
            <td style="width: 60px;">姓名</td>
            <td>
              <el-form-item prop="personName">
                <el-input v-model="item.personName" type="text" placeholder="" @blur="submitForm(item, index)" maxlength="5" />
              </el-form-item>
            </td>
            <td style="width: 100px;">性别</td>
            <td>
              <el-form-item prop="personSex">
                <el-input v-model="item.personSex" type="text" placeholder="" @blur="submitForm(item, index)" maxlength="3" />
              </el-form-item>
            </td>
            <td style="width: 90px;">民族</td>
            <td>
              <el-form-item prop="personNation">
                <el-input v-model="item.personNation" type="text" placeholder="" @blur="submitForm(item, index)" maxlength="12" />
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>籍贯</td>
            <td colspan="4">
              <el-form-item prop="nativePlace">
                <el-input v-model="item.nativePlace" type="text" placeholder="" @blur="submitForm(item, index)" maxlength="20" />
              </el-form-item>
            </td>
            <td>出生日期</td>
            <td>
              <el-form-item prop="persionBirthday">
                <el-date-picker clearable  style="width: 200px"
                  v-model="item.persionBirthday"
                  type="month"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @blur="submitForm(item, index)"
                  placeholder="">
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>工作单位</td>
            <td colspan="4">
              <el-form-item prop="persionWorkUnit">
                <el-input v-model="item.persionWorkUnit" type="text" placeholder="" @blur="submitForm(item, index)" maxlength="30" />
              </el-form-item>
            </td>
            <td>联系电话</td>
            <td>
              <el-form-item prop="linkPhone">
                <a-input v-model="item.linkPhone" type="phone" placeholder="" @blur="submitForm(item, index)" maxlength="20" />
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>电子信箱</td>
            <td colspan="6">
              <el-form-item prop="email">
                <a-input v-model="item.email" type="email" placeholder="" @blur="submitForm(item, index)" maxlength="50" />
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>毕业学校</td>
            <td colspan="2">
              <el-form-item prop="graduateSchool">
                <el-input v-model="item.graduateSchool" type="text" placeholder="" @blur="submitForm(item, index)" maxlength="20" />
              </el-form-item>
            </td>
            <td>文化程度</td>
            <td>
              <el-form-item prop="education">
                <el-input v-model="item.education" type="text" placeholder="" @blur="submitForm(item, index)" maxlength="10" />
              </el-form-item>
            </td>
            <td>学位</td>
            <td>
              <el-form-item prop="academicDegree">
                <el-input v-model="item.academicDegree" type="text" placeholder="" @blur="submitForm(item, index)" maxlength="10" />
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>职务、职称</td>
            <td colspan="2">
              <el-form-item prop="personPost">
                <el-input v-model="item.personPost" type="text" placeholder="" @blur="submitForm(item, index)" maxlength="20" />
              </el-form-item>
            </td>
            <td>专业、专长</td>
            <td>
              <el-form-item prop="major">
                <el-input v-model="item.major" type="text" placeholder="" @blur="submitForm(item, index)" maxlength="20" />
              </el-form-item>
            </td>
            <td>毕业时间</td>
            <td>
              <el-form-item prop="graduationTime">
                <el-date-picker clearable  style="width: 200px"
                  v-model="item.graduationTime"
                  type="month"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @blur="submitForm(item, index)"
                  placeholder="">
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>曾获奖励及荣誉称号情况</td>
            <td colspan="6">
              <el-form-item prop="awardsIntro">
                <el-input v-model="item.awardsIntro" type="textarea" rows="4"  placeholder="请输入曾获奖励及荣誉称号情况" maxlength="400" show-word-limit @blur="submitForm(item, index)" />
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>参加本项目的起止时间</td>
            <td colspan="6" style="text-align: left;" class="gray-placeholder">
              <el-form-item>
                <el-date-picker clearable  style="width: 400px"
                                v-model="item.dateRange"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="选择开始时间"
                                end-placeholder="选择结束时间"
                                @blur="submitForm(item, index, $event)"
                                value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>对本项目的创造性贡献</td>
            <td colspan="6">
              <el-form-item prop="contributionDesc">
                <el-input v-model="item.contributionDesc" type="textarea" rows="4"  placeholder="应如实填写完成人投入项目技术研究工作量占本人工作量的百分比，非技术研究工作对应的工作量不应计入其中，要求前三位完成人工作量50%以上，前三位完成人必须填写对应“主要创新点”的序号，并与旁证材料一致，否则不能申报。其余完成人应结合“主要创新点”写明具体的创造性贡献，原则上也要提供旁证材料。科技论著的主要完成人应注明作者或编辑身份" maxlength="400" show-word-limit @blur="submitForm(item, index)" />
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>声明</td>
            <td colspan="6">
              <div style="text-align: left;text-indent: 2em;">
                <!-- statement -->
                本人按照申报要求，如实提供了本申报书及相关材料，所提供材料不存在任何违反《中华人民共和国保守国家秘密法》和《科学技术保密规定》等相关法律法规及侵犯他人知识产权的情形，并对其真实性负责。如有不符，本人愿意承担相关后果。且确认上一栏目中所列本人对该项目的技术创造性贡献。
              </div>
              <div style="text-align: right;" class="hint-text">
                <span class="red">* </span><span>本人签名</span>
                <el-input type="text"  placeholder="请打印签名后上传证明文件" disabled style="display: inline-block;width: 200px;" />
                <div>
                  <span>日期</span>
                  <el-form-item prop="regDate" style="display: inline-block;" class="gray-placeholder">
                    <el-date-picker clearable  style="width: 200px"
                      v-model="item.regDate"
                      type="date"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      @blur="submitForm(item, index)"
                      placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </template>
      <div>
        <el-button
          type="primary"
          icon="el-icon-plus"

          @click="submitForm({scienceId:  form.id})"
        >添加完成人情况表</el-button>
      </div>
      <preview-pdf :id="form.infoId" :page="7" />
      <div>
        <upload accept=".pdf" :size="50" v-model="form.usersFilePaths" @change="updateData" @remove="updateData" />
        <div class="el-upload__tip red-hint">仅支持PDF格式的文件，多页文件请合并为一份上传，分辨率为300dpi彩色，文件大小不超过50M</div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { listSelDeclareSciencePerson, delSelDeclareSciencePerson, addSelDeclareSciencePerson, updateSelDeclareSciencePerson } from "@/api/sel/selDeclareSciencePerson";
import { updateSelDeclareScience } from "@/api/sel/selDeclareScience";
import { listSelDeclareScienceUnit } from "@/api/sel/selDeclareScienceUnit";
import { base64ToPDF, downloadPDF } from "@/api/common/utils";

export default {
  data() {
    return {
      // 表单参数
      form: {},
      // 主要完成人情况表格数据
      selDeclareSciencePersonList: [],
      dateRange: [],
      idList: []
    };
  },
  props: {
    value: {
      default: {}
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询主要完成人情况列表 */
    getList() {
      if (!this.form.id) return
      listSelDeclareSciencePerson({
        scienceId: this.form.id
      }).then(response => {
        this.selDeclareSciencePersonList = response.rows;
        if(this.selDeclareSciencePersonList.length == 0) {
          this.submitForm({ scienceId: this.form.id })
        }
        this.selDeclareSciencePersonList.map(item => {
          this.$set(item, 'dateRange', []);
          if(item.partBeginTime && item.partEndTime) {
            this.$set(item, 'dateRange', [item.partBeginTime, item.partEndTime]);
          }
        })
        this.$emit('change', this.selDeclareSciencePersonList);
      });
    },
    // 添加日期范围
    addDateRange(params, dateRange) {
      var search = params;
      search.partBeginTime = '';
      search.partEndTime = '';
      if (null != dateRange && '' != dateRange) {
        search.partBeginTime = dateRange[0];
        search.partEndTime = dateRange[1];
      }
      return search;
    },
    /** 提交按钮 */
    submitForm: function(item) {
      if (item.id != undefined) {
        updateSelDeclareSciencePerson(this.addDateRange(item, item.dateRange));
      } else {
        if (this.selDeclareSciencePersonList.length >= 5) {
          listSelDeclareScienceUnit({
            scienceId: this.form.id
          }).then(response => {
            if(response.rows.length <= 1) {
              this.msgError('最多只能添加5条！')

            } else {
              if (this.selDeclareSciencePersonList.length >= 7) {
                this.msgError('最多只能添加7条！')

              } else {
                addSelDeclareSciencePerson(item).then(response => {
                  this.getList();
                });
              }
            }
          });
        } else {
          addSelDeclareSciencePerson(item).then(response => {
            this.getList();
          });
        }
      }
    },
    /** 保存操作 */
    updateData() {
      updateSelDeclareScience(this.form);
      this.$emit('personform', this.form)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delSelDeclareSciencePerson(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function() {});
    },
  },
  watch:{
    value (newVal, oldVal) {
      this.form = newVal;
      this.getList();
    }
  }
};
</script>

<style scoped>
  .red, .red-hint {
    color: #EC808D;
  }

  .hint-text {
    font-size: 14px;
    line-height: 40px;
    color: #333333;
  }
</style>
