<template>
  <div class="plan-research-person">
    <table class="pdf-show-table tc">
      <tr>
        <td style="min-width: 105px"></td>
        <td style="min-width: 110px">姓名</td>
        <td style="min-width: 160px">出生年月</td>
        <td style="min-width: 110px">职称/学历</td>
        <td style="min-width: 130px">专业特长</td>
        <td style="min-width: 150px">本项目中分工</td>
        <td style="min-width: 80px">投入工作总月数</td>
        <td style="min-width: 170px">工作单位</td>
        <td style="min-width: 60px"></td>
      </tr>
      <tr v-for="(item1, index1) in projectPersons" :key="index1">
        <td>项目负责人</td>
        <td>
          <el-input v-model="item1.personName" placeholder="" @blur="submitPlanPersonsForm(item1)" maxlength="10" />
        </td>
        <td>
          <el-date-picker
            clearable
            v-model="item1.personBirthday"
            type="month"
            value-format="yyyy-MM"
            style="width: 160px"
            :default-value="new Date('1990-01')"
            @change="submitPlanPersonsForm(item1)"
            placeholder="请选择出生年月">
          </el-date-picker>
        </td>
        <td>
          <el-input type="textarea" :rows="2" v-model="item1.personTitle" placeholder="" @blur="submitPlanPersonsForm(item1)" maxlength="20" />
        </td>
        <td>
          <el-input type="textarea" :rows="2" v-model="item1.personMajor" placeholder="" @blur="submitPlanPersonsForm(item1)" maxlength="10" />
        </td>
        <td>
          <el-input type="textarea" :rows="2" v-model="item1.workContent" placeholder="" @blur="submitPlanPersonsForm(item1)" maxlength="20" />
        </td>
        <td>
          <m-input v-model="item1.monthCount" placeholder="" @blur="submitPlanPersonsForm(item1)" maxlength="3" inputType="number"/>
        </td>
        <td>
          <el-input type="textarea" :rows="2" v-model="item1.workUnit" placeholder="" @blur="submitPlanPersonsForm(item1)" maxlength="20" />
        </td>
        <td></td>
      </tr>
      <tr v-for="(item2, index2) in subjectPersons" :key="index2 + 1">
        <td :rowspan="subjectPersons.length" v-if="index2 === 0">各课题负责人</td>
        <td>
          <el-input v-model="item2.personName" placeholder="" @blur="submitPlanPersonsForm(item2)" maxlength="10" />
        </td>
        <td>
          <el-date-picker
            clearable
            v-model="item2.personBirthday"
            type="month"
            value-format="yyyy-MM"
            style="width: 160px"
            :default-value="new Date('1990-01')"
            @change="submitPlanPersonsForm(item2)"
            placeholder="请选择出生年月">
          </el-date-picker>
        </td>
        <td>
          <el-input type="textarea" :rows="2" v-model="item2.personTitle" placeholder="" @blur="submitPlanPersonsForm(item2)" maxlength="20" />
        </td>
        <td>
          <el-input type="textarea" :rows="2" v-model="item2.personMajor" placeholder="" @blur="submitPlanPersonsForm(item2)" maxlength="10" />
        </td>
        <td>
          <el-input type="textarea" :rows="2" v-model="item2.workContent" placeholder="" @blur="submitPlanPersonsForm(item2)" maxlength="20" />
        </td>
        <td>
          <m-input v-model="item2.monthCount" placeholder="" @blur="submitPlanPersonsForm(item2)" maxlength="3" inputType="number"/>
        </td>
        <td>
          <el-input type="textarea" :rows="2" v-model="item2.workUnit" placeholder="" @blur="submitPlanPersonsForm(item2)" maxlength="20" />
        </td>
        <td></td>
      </tr>
      <tr v-for="(item3, index3) in workPersons" :key="index3 + 6">
        <td :rowspan="workPersons.length" v-if="index3 === 0">主要工作人员</td>
        <td>
          <el-input v-model="item3.personName" placeholder="" @blur="submitPlanPersonsForm3(item3)" maxlength="10" />
        </td>
        <td>
          <el-date-picker
            clearable
            v-model="item3.personBirthday"
            type="month"
            value-format="yyyy-MM"
            style="width: 160px"
            :default-value="new Date('1990-01')"
            @change="submitPlanPersonsForm3(item3)"
            placeholder="请选择出生年月">
          </el-date-picker>
        </td>
        <td>
          <el-input type="textarea" :rows="2" v-model="item3.personTitle" placeholder="" @blur="submitPlanPersonsForm3(item3)" maxlength="20" />
        </td>
        <td>
          <el-input type="textarea" :rows="2" v-model="item3.personMajor" placeholder="" @blur="submitPlanPersonsForm3(item3)" maxlength="10" />
        </td>
        <td>
          <el-input type="textarea" :rows="2" v-model="item3.workContent" placeholder="" @blur="submitPlanPersonsForm3(item3)" maxlength="20" />
        </td>
        <td>
          <m-input v-model="item3.monthCount" placeholder="" @blur="submitPlanPersonsForm3(item3)" maxlength="3" inputType="number"/>
        </td>
        <td>
          <el-input type="textarea" :rows="2" v-model="item3.workUnit" placeholder="" @blur="submitPlanPersonsForm3(item3)" maxlength="20" />
        </td>
        <td>
          <el-row>
            <el-col>
              <el-button
                v-if="index3 > 0"
                type="danger"
                icon="el-icon-delete"
                v-hasPermi="['pro:proPlanPerson:remove']"
                @click="deleteWorkPerson(item3, index3)">删除
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-button
                v-if="index3 + 1 === workPersons.length"
                type="primary"
                icon="el-icon-plus"
                style="margin-top: 10px"
                @click="addWorkPerson">新增
              </el-button>
            </el-col>
          </el-row>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import {selectEstablishmentPlanById, updateEstablishmentPlan} from "@/api/pro/proApprovalInfo";
import {delProPlanPerson} from "@/api/pro/proPlanPerson";

let PlanResearchPerson = function (options) {
  this.infoId = options.infoId
  this.planId = options.planId
  this.pensonType = options.pensonType
  this.monthCount = options.monthCount
  this.personBirthday = options.personBirthday
  this.personMajor = options.personMajor
  this.personName = options.personName
  this.personTitle = options.personTitle
  this.workContent = options.workContent
  this.workUnit = options.workUnit
}
export default {
  name: "planResearchPerson",
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
      planPersonsForm: {
        updateType: 0
      },
      planPersons: [],
      projectPersons: [],
      subjectPersons: [],
      workPersons: [],
      options: {
        infoId: null,
        planId: null,
        pensonType: null,
        monthCount: null,
        personBirthday: null,
        personMajor: null,
        personName: null,
        personTitle: null,
        workContent: null,
        workUnit: null
      }
    }
  },
  computed: {
    userName() {
      return this.$store.state.user.name
    }
  },
  watch: {
    value (newVal) {
      this.projectPersons = []
      this.subjectPersons = []
      this.workPersons = []
      newVal.planPersons.forEach(item => {
        if (item.pensonType === 1) {
          this.projectPersons.push(item)
        } else if (item.pensonType === 2) {
          this.subjectPersons.push(item)
        } else if (item.pensonType === 3) {
          this.workPersons.push(item)
        }
      })
      const workPersonsLength = this.workPersons.length
      if (workPersonsLength < 3) {
        this.options.infoId = newVal.planPersons[0].infoId
        this.options.planId = newVal.planPersons[0].planId
        this.options.pensonType = 3
        for (let i = 0; i < (3 - workPersonsLength); i++) {
          const personItem = new PlanResearchPerson(this.options)
          let planPersonTem = []
          planPersonTem.push(personItem)
          this.planPersonsForm.planPersons = JSON.stringify(planPersonTem)
          updateEstablishmentPlan(this.planPersonsForm).then(() => {
            if (i === (2 - workPersonsLength)) {
              selectEstablishmentPlanById(newVal.planPersons[0].infoId).then(({data}) => {
                let arrTem = []
                data.planPersons.forEach(item => {
                  if (item.pensonType === 3) {
                    arrTem.push(item)
                  }
                })
                this.workPersons = arrTem
              })
            }
          })
        }
      }
    }
  },
  methods: {
    submitPlanPersonsForm(item) {
      let planPersonTem = []
      if (item.personBirthday == null) {
        item.personBirthday = ''
      }
      planPersonTem.push(item)
      this.planPersonsForm.planPersons = JSON.stringify(planPersonTem)
      updateEstablishmentPlan(this.planPersonsForm).then(()=>{

      })
    },
    submitPlanPersonsForm3(item) {
      let planPersonTem = []
      if (item.personBirthday == null) {
        item.personBirthday = ''
      }
      planPersonTem.push(item)
      this.planPersonsForm.planPersons = JSON.stringify(planPersonTem)
      updateEstablishmentPlan(this.planPersonsForm).then(()=>{

      })
    },
    addWorkPerson() {
      this.options.infoId = this.subjectPersons[0].infoId
      this.options.planId = this.subjectPersons[0].planId
      this.options.pensonType = 3
      const personItem = new PlanResearchPerson(this.options)
      let planPersonTem = []
      planPersonTem.push(personItem)
      this.planPersonsForm.planPersons = JSON.stringify(planPersonTem)
      updateEstablishmentPlan(this.planPersonsForm).then(() => {
        selectEstablishmentPlanById(this.subjectPersons[0].infoId).then(({data}) => {
          let arrTem = []
          data.planPersons.forEach(item => {
            if (item.pensonType === 3) {
              arrTem.push(item)
            }
          })
          this.workPersons = arrTem
        })
      })
    },
    deleteWorkPerson(item3, index3) {
      delProPlanPerson(item3.id).then(() => {

      })
      this.workPersons.splice(index3, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.plan-research-person {
  width: 100%;
}
</style>
