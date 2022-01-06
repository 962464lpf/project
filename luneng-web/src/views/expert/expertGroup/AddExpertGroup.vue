<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="140px">
      <el-form-item
        label="专家组名称"
        prop="name">
        <el-input
          style="width: 50%"
          v-model="form.name"
          placeholder="请输入专家组名称" />
      </el-form-item>
      <el-form-item
        label="状态"
        prop="status">
        <el-radio-group
          v-model="form.status"
          style="width: 50%">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue">{{dict.dictLabel}}
            </el-radio>
          </el-radio-group>
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请填写备注，字数不超过100"
          maxlength="100"
          style="width: 50%"
          show-word-limit
          v-model="form.remark">
        </el-input>
      </el-form-item>
      <div class="footer">
        <el-form-item>
          <div class="btns">
            <el-button  type="primary"
              @click="submitForm">确 定
            </el-button>
            <el-button  @click="cancel">取 消</el-button>
          </div>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getExpertGroup, addExpertGroup, updateExpertGroup } from "@/api/expert/expertGroup";
import {expertGroupRules} from '@/utils/el_validate'

  export default {
    name: '',
    data () {
      return {
        //专家组表单
        form: {
          id: undefined,
          name: undefined,
          status: '0',
          remark: undefined
        },
        rules: expertGroupRules,
        //专家组状态字典
        statusOptions: [],
        //专家评审跳转来的标记
        backExpertReviewFlag: undefined
      }
    },
    created() {
      if(this.$route.query.backExpertReviewFlag != undefined) {
        this.backExpertReviewFlag = this.$route.query.backExpertReviewFlag
      }
      //获取专家组信息
      if(this.$route.query.id != undefined){
        this.init(this.$route.query.id)
      }
      //专家组状态字典
      this.getDicts("expert_status").then(response => {
        this.statusOptions = response.data
      })
    },
    computed: {
      //路由传入的专家组id
      expertGoupId: function () {
        return this.$route.query.id
      }
    },
    methods: {
      /* ******************* 数据获取及处理 ********************/
      //修改进入查询专家组信息
      init(id) {
        getExpertGroup(id).then(response => {
          this.form = response.data
        })
      },

      /* ******************* 交互操作 ********************/
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.expertGoupId != undefined) {
              updateExpertGroup(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功")
                  this.closeView("/expert/expertGroup/updateExpertGroup", "/expert/expertGroup", 400)
                }
              })
            } else {
              addExpertGroup(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功")
                  if(this.backExpertReviewFlag == 0) {
                    this.closeView("/expert/expertGroup/addExpertGroup", "/sel/expertReview", 400)
                  } else if(this.backExpertReviewFlag == 1){
                    this.closeView("/expert/expertGroup/addExpertGroup", "/proManagement/storage/review", 400)
                  }else {
                    this.closeView("/expert/expertGroup/addExpertGroup", "/expert/expertGroup", 400)
                  }
                }
              })
            }
          }
        })
      },
      //取消返回
      cancel() {
        if(this.expertGoupId != undefined){
          this.closeView("/expert/expertGroup/updateExpertGroup", "/expert/expertGroup", 0)
        }else {
          if(this.backExpertReviewFlag == 0) {
            this.closeView("/expert/expertGroup/addExpertGroup", "/sel/expertReview", 0)
          }else {
            this.closeView("/expert/expertGroup/addExpertGroup", "/expert/expertGroup", 0)
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-container {
    width: 100%;
    padding: 20px 30px 50px 30px;
    .btns{
      width: 28%;
      display: flex;
      justify-content: space-between;
      padding-top: 30px;
    }
  }
</style>
