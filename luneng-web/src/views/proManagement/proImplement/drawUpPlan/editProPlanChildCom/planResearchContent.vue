<template>
  <div class="plan-research-content">
    <div>
      <h2>1、项目研究内容及成果</h2>
      <div>
        <h3>1.1 研究内容</h3>
        <div>
          <ueditor v-model="planInfo.researchContents" class-name="red-placeholder" @change="submitPlanInfoForm" placeholder="系统性描述本项目包含的课题内容" />
        </div>
      </div>
      <div>
        <h3>1.2 预期目标</h3>
        <div>
          <ueditor v-model="planInfo.expectedTarget" class-name="red-placeholder" @change="submitPlanInfoForm" placeholder="描述本项目研究的总体技术目标以及预期达到的效果和效益" />
        </div>
      </div>
      <div>
        <h3>1.3 提交成果</h3>
        <div>
          <ueditor v-model="planInfo.submitResult" class-name="red-placeholder" @change="submitPlanInfoForm" placeholder="装置或系统、示范/应用及效果和效益、技术报告/技术方案/标准/规程、提交专利数" />
        </div>
      </div>
    </div>
    <div>
      <h2>2、课题研究内容及考核指标</h2>
      <div v-for="(item, index) in planTopics" :key="index" v-if="item.topicName">
        <h3>{{ '2.' + (index + 1) + '课题' + (index + 1) + ':' + item.topicName}}</h3>
        <div>
          <h4>2.{{index + 1}}.1 研究内容</h4>
          <div>
            <ueditor v-model="item.topicContent" class-name="red-placeholder" @change="submitPlanTopicsForm(item)" placeholder="按照审定的可研报告描述课题的研究内容，要求精炼、精确、重点突出" />
          </div>
        </div>
        <div>
          <h4>2.{{index + 1}}.2 预期目标</h4>
          <div>
            <ueditor v-model="item.topicTarget" class-name="red-placeholder" @change="submitPlanTopicsForm(item)" placeholder="简述课题研究预期解决的问题" />
          </div>
        </div>
        <div>
          <h4>2.{{index + 1}}.3 考核指标</h4>
          <div>
            <ueditor v-model="item.topicLevel" class-name="red-placeholder" @change="submitPlanTopicsForm(item)" placeholder="描述课题形成的成果及相关技术指标，建议采取以下形式:按照装置或系统及具体技术指标；示范/应用及效果和效益；技术方案/标准/规程规范；专利数" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ueditor from "@/components/Ueditor"
import { updateEstablishmentPlan } from "@/api/pro/proApprovalInfo";

export default {
  name: "planResearchContent",
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      planInfoForm: {
        updateType: 0
      },
      planInfo: {},
      planTopicsForm: {
        updateType: 0
      },
      planTopics: []
    }
  },
  computed: {
    userName() {
      return this.$store.state.user.name
    }
  },
  components: {
    ueditor
  },
  watch:{
    value (newVal) {
      this.planInfo = newVal.planInfo;
      this.planTopics = []
      newVal.planTopics.forEach(item => {
        const { id, infoId, planId, sort, topicName, topicContent, topicTarget, topicLevel} = item
        const objTem = {
          id: id,
          infoId: infoId,
          planId: planId,
          sort: sort,
          topicName: topicName,
          topicContent: topicContent,
          topicTarget: topicTarget,
          topicLevel: topicLevel
        }
        this.planTopics.push(objTem)
      })
    }
  },
  methods: {
    submitPlanInfoForm() {
      this.planInfoForm.planInfo = this.planInfo
      updateEstablishmentPlan(this.planInfoForm).then(()=>{

      })
    },
    submitPlanTopicsForm(item) {
      let planTopicsTem = []
      planTopicsTem.push(item)
      this.planTopicsForm.planTopics = JSON.stringify(planTopicsTem)
      updateEstablishmentPlan(this.planTopicsForm).then(()=>{

      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
