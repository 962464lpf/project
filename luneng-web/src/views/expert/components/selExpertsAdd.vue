<template>
  <div class="sel-experts-add">
    <el-form :ref="'form' + curIndex" :model="form" :rules="rules" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="8" class="name-style">
          <span>{{form.name ? form.name : '专家姓名'}}</span>
        </el-col>
        <el-col :span="6">
          <el-button
            v-if="curIndex > 0 && (!form.id)"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete">删除
          </el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col class="part-text">
          <span>基本信息</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="专家姓名" prop="name">
            <el-input
              @change="backFillForm"
              v-model="form.name"
              placeholder="请输入专家姓名"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="性别" prop="gender">
            <el-select
              v-model="form.gender"
              @change="backFillForm"
              style="width: 238px"
              placeholder="请选择性别">
              <el-option
                v-for="dict in genderOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row >
      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="出生日期" prop="birthday">
            <el-date-picker
              clearable
              style="width: 218px"
              v-model="form.birthday"
              @change="backFillForm"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择出生日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="民族" prop="nationality">
            <el-select
              v-model="form.nationality"
              @change="backFillForm"
              style="width: 238px"
              placeholder="请选择民族">
              <el-option
                v-for="dict in nationalityOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="最高学位" prop="education">
            <el-input
              v-model="form.education"
              @change="backFillForm"
              placeholder="请输入最高学位"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="所学专业" prop="major">
            <el-input
              style="width: 238px"
              v-model="form.major"
              @change="backFillForm"
              placeholder="请输入所学专业"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <el-col class="part-text">
          <span>职称信息</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="工作单位" prop="workUnit">
            <el-input
              v-model="form.workUnit"
              @change="backFillForm"
              placeholder="请输入工作单位"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="现任职务" prop="job">
            <el-input
              v-model="form.job"
              @change="backFillForm"
              placeholder="请输入现任职务"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="技术职称" prop="jobLevel">
            <el-input
              v-model="form.jobLevel"
              @change="backFillForm"
              placeholder="请输入技术职称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="专业领域" prop="exportArea">
            <el-select
              v-model="exportArea"
              @change="backFillForm2"
              placeholder="请选择专业领域"
              style="width: 218px"
              multiple>
              <el-option
                v-for="dict in exportAreaOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="14">
          <el-form-item label="主要成就" prop="zycj">
            <el-input
              v-model="form.zycj"
              @change="backFillForm"
              :rows="5"
              type="textarea"
              placeholder="请填写主要成就，字数不超过500"
              maxlength="500"
              show-word-limit>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="14">
          <el-form-item label="评审经历" prop="reviewExperience">
            <el-input
              v-model="form.reviewExperience"
              @change="backFillForm"
              :rows="5"
              type="textarea"
              placeholder="请填写评审经历，字数不超过500"
              maxlength="500"
              show-word-limit
              >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <el-col class="part-text">
          <span>推荐单位意见</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="14">
          <el-form-item label="推荐单位意见" prop="unitIdea">
            <el-input
              v-model="form.unitIdea"
              @change="backFillForm"
              :rows="5"
              type="textarea"
              placeholder="请填写推荐单位意见，字数不超过500"
              maxlength="500"
              show-word-limit>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row :gutter="20">
        <el-col class="part-text">
          <span>照片</span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-form-item label="照片" prop="filePaths">
            <div class="uploadImg">
              <expert-avatar
                :imgFileUrl="form.filePaths"
                :title="recommendId ? '修改照片': '上传照片'"
                @uploadImgSucc="getAvatarUrl"/>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import ExpertAvatar from "../expert/components/expertAvatar";
import {reExpertRules} from "@/utils/el_validate"

export default {
  name: "selExpertsAdd",
  props: {
    //当前表单下标序号
    curIndex: {
      type: Number,
      default: null
    },
    recommendId: {
      type: Number,
      default: null
    },
    reExpertInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    genderOptions: {
      type: Array,
      default() {
        return []
      }
    },
    nationalityOptions: {
      type: Array,
      default() {
        return []
      }
    },
    exportAreaOptions: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      //表单验证
      rules: reExpertRules,
      exportArea: []
    };
  },
  created() {
    this.exportArea = JSON.parse(this.reExpertInfo.exportArea)
  },
  watch: {
    reExpertInfo(newVal) {
      this.exportArea = JSON.parse(newVal.exportArea)
    }
  },
  computed: {
    form() {
      return this.reExpertInfo
    }
  },
  components: {
    ExpertAvatar
  },
  methods: {
    /* ************************ 数据获取及处理 *************************/
    //回传填写的表单
    backFillForm() {
      this.$emit('back-fill-form', this.form)
    },
    backFillForm2() {
      this.form.exportArea = this.exportArea
      this.$emit('back-fill-form', this.form)
    },
    //上传头像后回填上传头像地址
    getAvatarUrl(imgUrl) {
      this.form.filePaths = imgUrl
      this.$emit('back-fill-form', this.form)
    },
    //删除该按钮
    handleDelete() {
      this.$confirm('是否确认删除?', "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$emit('delete-expert-info', this.curIndex)
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.sel-experts-add {
  width: 100%;
  .name-style {
    font-size: 22px;
    color: #000;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .part-text {
    font-size: 18px;
    color: #000;
    font-weight: bold;
    padding-bottom: 10px;
  }
}
</style>
