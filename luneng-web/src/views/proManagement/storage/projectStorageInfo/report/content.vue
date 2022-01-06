<template>
  <div>
    <h2>一、目的和意义</h2>
    <div>
      <ueditor v-model="form.targetPurpose" @change="submitForm" class-name="red-placeholder" placeholder="1.描述与项目研究内容紧密相关的实际生产力水平和今后的发展方向；<br/>2.阐述项目成果对该现状和技术发展的作用；<br/>3.分析成果应用和推广的途径；<br/>4.分析成果推广后的直接和间接效益。"/>
    </div>
    <h2>二、国内外研究水平综述</h2>
    <div>
      <ueditor v-model="form.researchLevel" @change="submitForm" class-name="red-placeholder" placeholder="1.与项目研究内容紧密相关的技术发展历史的简要回顾；<br/>2.国内外研究水平的现状和发展趋势；<br/>3.介绍国外研究机构或者公司对本项目的研究情况；<br/>4.介绍国内其他研究单位对本项目的研究情况。" />
    </div>
    <h2>三、项目的理论和实践依据</h2>
    <div>
      <ueditor v-model="form.basis" @change="submitForm" class-name="red-placeholder" placeholder="1.项目研究内容的原理简述；<br/>2.项目研究内容的理论或者实践依据；<br/>3.项目研究的关键和难点。" />
    </div>
    <h2>四、项目研究内容和实施方案</h2>
    <div>
      <ueditor v-model="form.implementationPlan" @change="submitForm" class-name="red-placeholder" placeholder="1.项目研究内容的详细说明（可分专题或按内容序号描述）。<br/>2.要描述具体的理论研究步骤，现场试验的地点和试验计划。需要建设试验手段的项目，要给出试验手段的结构和作用；<br/>3.理论研究和试验内容与项目总目标的因果关系；<br/>4.写明理论和试验研究的工作量；<br/>5.需要多家单位共同承担的项目，需要写明各家的分工、职责和提供的成果，如何组织和协调；项目的组织方式；合作方式、知识产权和成果分享的范围；<br/>6.需要与国外合作，要写明与外方的合作方式、知识产权和成果分享的范围，及以前的工作联系；<br/>7.注明本项目研究需要购买仪器、设备的型号、产地、性能及需要购买的原因；<br/>8.外委的工作内容和工作量；<br/>9.对于装置、设备开发的项目，要提出装置或设备的开发计划及设计方案。" />
    </div>
    <h2>五、预期目标和成果形式</h2>
    <div>
      <ueditor v-model="form.targetResults" @change="submitForm" class-name="red-placeholder" placeholder="1.阐明项目研究预期达到的目标；<br/>2.明确叙述提高研究成果的形式，理论研究报告、全套设计制造技术、实用装置或软件等；要求成果提供的形式能够被其他研究人员掌握，使成果的使用权具有可转移性。" />
    </div>
    <h2>六、合作单位或依托工程单位落实情况</h2>
    <div>
      <ueditor v-model="form.cooperationUnit" @change="submitForm" class-name="red-placeholder" placeholder="1.如需同其他单位进行合作，说明合作单位的落实情况，并出具合作单位承诺进行合作的证明文件；<br/>2.如需结合依托工程进行试点研究，说明依托工程及其与本项目结合的情况，出具依托工程单位承诺提供相关条件的证明文件。" />
    </div>
    <h2>七、项目承担单位的条件</h2>
    <div>
      <ueditor v-model="form.unitConditions" @change="submitForm" class-name="red-placeholder" placeholder="1.项目负责人的情况介绍；<br/>2.项目承担人员的专业、特长、工作量和在本项目中的应用；<br/>3.各承担单位具有的与本项目有关的工作业绩、实验室条件、理论研究环境。" />
    </div>
  </div>
</template>

<script>
import { updateProjectStorageFeasible } from "@/api/storage/projectStorageFeasible";
import ueditor from "@/components/Ueditor";

export default {
  components: {
    ueditor
  },
  data() {
    return {
      // 表单参数
      form: {},
      dateRange: [],
      taskSourceOptions: [],
      pickerOptions: {},
      node: '',

    };
  },
  props: {
    value: {
      default: {}
    },
  },
  created() {
    this.form = this.value;
  },
  methods: {
    /** 提交按钮 */
    submitForm: function() {
      if (this.form.id != undefined) {
        updateProjectStorageFeasible(this.form);
      }
    }
  },
  watch:{
    value (newVal, oldVal) {
      this.form = newVal;
    }
  }
};
</script>

<style lang="scss" scoped>
  h2 {
    margin: 0;
    padding: 20px 0;
    font-size: 18px;
    font-weight: normal;
  }
</style>
