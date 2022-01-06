<template>
  <el-row>
    <el-col :span="20">
      <table class="pdf-show-table">
        <tr>
          <td style="width: 200px;">立项背景</td>
          <td>
            <el-form-item prop="projectBackground">
              <ueditor
                v-model="form.projectBackground"
                class-name="red-placeholder"
                @change="updateData"
                placeholder="立项背景应引用国内外有关科学技术文献，简明扼要地概述立项时相关科学技术状况、主要技术经济指标、尚待解决的问题及立项目的。"
              />
<!--              <el-input-->
<!--                v-model="form.projectBackground"-->
<!--                type="textarea" rows="12"-->
<!--                placeholder="立项背景应引用国内外有关科学技术文献，简明扼要地概述立项时相关科学技术状况、主要技术经济指标、尚待解决的问题及立项目的。填写内容不得超过 800 字"-->
<!--                maxlength="800" show-word-limit @blur="updateData" -->
<!--              />-->
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td rowspan="2">详细科学技术内容</td>
          <td>
            <el-form-item prop="projectContent">
              <ueditor
                v-model="form.projectContent"
                class-name="red-placeholder"
                @change="updateData"
                placeholder="若超过1500字，请上传PDF文件，详细科学技术内容是考核、评价项目是否符合报奖条件的主要依据。因此，凡涉及项目技术实质内容的说明、论证及实验结果等，均应直接引入正文，一般不应采取见“××附件”的表达形式"
              />
<!--              <el-input-->
<!--                v-model="form.projectContent"-->
<!--                type="textarea" rows="12"-->
<!--                placeholder="若超过1500字或输入内容为富文本，若超过1500字或输入内容为富文本，请上传PDF文件，详细科学技术内容是考核、评价项目是否符合报奖条件的主要依据。因此，凡涉及项目技术实质内容的说明、论证及实验结果等，均应直接引入正文，一般不应采取见“××附件”的表达形式"-->
<!--                maxlength="1500" show-word-limit @blur="updateData" -->
<!--              />-->
            </el-form-item>
          </td>
        </tr>
        <tr>
<!--          <td>-->
<!--            <upload accept=".pdf" v-model="form.projectContentFilePaths" @change="updateData" @remove="updateData" />-->
<!--          </td>-->
        </tr>
        <tr>
          <td>主要科技创新点</td>
          <td>
            <el-form-item prop="mainInnovation">
              <ueditor
                v-model="form.mainInnovation"
                class-name="red-placeholder"
                @change="updateData"
                placeholder="主要科技创新点是项目和申报书的核心部分，也是审查项目、处理争议的关键依据，应以支持创新内容成立的旁证材料为依据（如：专利、论文、验收鉴定等），简明、准确、完整地阐述项目具有创造性的关键技术内容，可通过客观、详实地与国内外同类技术主要参数等方面的对比来补充说明，无须用抽象形容词。
每个主要创新点的提出须相对独立，填写时需按重要程度排序，并为每个创新点注明对应的“旁证材料”。在附件目录中，应包含与创新点对应的“旁证材料”证明文件。
若不能提供此类证明，应由主要完成人或完成单位出具相关说明材料并签字或盖章。
主要科技创新点不超过4项"
              />
<!--              <el-input-->
<!--                v-model="form.mainInnovation"-->
<!--                type="textarea" rows="12"-->
<!--                placeholder="主要科技创新点是项目和申报书的核心部分，也是审查项目、处理争议的关键依据，应以支持创新内容成立的旁证材料为依据（如：专利、论文、验收鉴定等），简明、准确、完整地阐述项目具有创造性的关键技术内容，可通过客观、详实地与国内外同类技术主要参数等方面的对比来补充说明，无须用抽象形容词。-->
<!--每个主要创新点的提出须相对独立，填写时需按重要程度排序，并为每个创新点注明对应的“旁证材料”。在附件目录中，应包含与创新点对应的“旁证材料”证明文件。-->
<!--若不能提供此类证明，应由主要完成人或完成单位出具相关说明材料并签字或盖章。-->
<!--主要科技创新点不超过4项，填写不得超过 1200 字"-->
<!--                maxlength="1200" show-word-limit @blur="updateData" />-->
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>与当前国内外同类研究、同类技术的综合比较</td>
          <td>
            <el-form-item prop="generalComparison">
              <ueditor
                v-model="form.generalComparison"
                class-name="red-placeholder"
                @change="updateData"
                placeholder="应就项目的总体科学技术水平、主要技术经济指标，用数据或图表方式，同当前国内外先进的同类研究、同类技术进行全面比较，综合叙述比较情况，指出存在的问题及改进措施。"
              />
<!--              <el-input-->
<!--                v-model="form.generalComparison"-->
<!--                type="textarea" rows="12"-->
<!--                placeholder="应就项目的总体科学技术水平、主要技术经济指标，用数据或图表方式，同当前国内外先进的同类研究、同类技术进行全面比较，综合叙述比较情况，指出存在的问题及改进措施。填写内容不得超过 1500 字"-->
<!--                maxlength="1500" show-word-limit @blur="updateData" />-->
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>应用情况</td>
          <td>
            <el-form-item prop="usageSituation">
              <ueditor
                v-model="form.usageSituation"
                class-name="red-placeholder"
                @change="updateData"
                placeholder="应就项目的应用、推广情况及预期应用前景进行阐述。若项目是科技论著，应阐述国内外公开发行书刊中对本项目科学结论的评价及引用情况。"
              />
<!--              <el-input-->
<!--                v-model="form.usageSituation"-->
<!--                type="textarea" rows="8"-->
<!--                placeholder="应就项目的应用、推广情况及预期应用前景进行阐述。若项目是科技论著，应阐述国内外公开发行书刊中对本项目科学结论的评价及引用情况。填写内容不得超过 800 字。"-->
<!--                maxlength="800" show-word-limit @blur="updateData" />-->
            </el-form-item>
          </td>
        </tr>
      </table>
    </el-col>
  </el-row>
</template>

<script>
import { updateSelDeclareScience } from "@/api/sel/selDeclareScience";
import ueditor from "@/components/Ueditor"
export default {
  data() {
    return {
      // 表单参数
      form: {},
      dateRange: []
    };
  },
  props: {
    value: {
      default: ''
    }
  },
  created() {
    this.form = this.value;
  },
  components: {
    ueditor
  },
  methods: {
    /** 保存操作 */
    updateData() {
      updateSelDeclareScience(this.form);
    }
  },
  watch:{
    value (newVal, oldVal) {
      this.form = newVal;
    }
  }
};
</script>
