<template>
  <div class="app-container">
    <div class="main">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-row :gutter="40">
          <el-col :span="18">
            <el-form-item label="项目名称" prop="projectName">
              <el-input
                :disabled="!!form.projectName"
                v-model="form.projectName"
                placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="18">
            <el-form-item label="绿建星级" prop="level">
              <el-select
                v-model="form.level"
                :disabled="!!form.level"
                clearable
                style="width: 220px">
                <el-option
                  v-for="item in levelOptions"
                  :key="item.dictValue"
                  :value="item.dictValue"
                  :label="item.dictLabel"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="9">
            <el-form-item label="评价时间" prop="time">
              <el-date-picker
                clearable
                v-model="form.time"
                type="date"
                style="width: 100%"
                placeholder="请选择评价时间"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="地点" prop="address">
              <el-input
                v-model="form.address"
                placeholder="请填写地点"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="18">
            <el-form-item label="经办人" prop="operator">
              <el-input
                v-model="form.operator"
                placeholder="请填写经办人"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="18">
            <el-form-item label="评价标题" prop="title">
              <el-input
                v-model="form.title"
                placeholder="请填写评价标题"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="18">
            <el-form-item label="评价内容" prop="remark">
              <ueditor v-model="form.remark" placeholder="请填写评价内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>

import {buildProEditEvaluate} from "@/utils/el_validate";
import {getBuildInfo} from "@/api/build/buildInfo";
import ueditor from "@/components/Ueditor"
import {addBuildAppraise, getBuildAppraise, updateBuildAppraise} from "@/api/build/buildAppraise";

export default {
  name: "editEvaluate",
  data() {
    return {
      //表单验证
      rules: buildProEditEvaluate,
      //绿建等级字典
      levelOptions: [],
      eId: null,
      //跳转项目id
      id: null,
      proDetailFlag: null,
      tabActiveName: null,
      menuFlag: null,
      form: {
        id: null,
        infoId: null,
        projectName: '',
        level: null,
        time: '',
        address: '',
        operator: '',
        title: '',
        remark: ''
      },
      fromFullPath: ''
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fromFullPath = from.fullPath
    })
  },
  created() {
    //获取数据
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.init(this.id)
    }
    if (this.$route.query.eId) {
      this.eId = this.$route.query.eId * 1
      this.init2(this.eId)
    }
    if (this.$route.query.proDetailFlag) {
      this.proDetailFlag = this.$route.query.proDetailFlag
    }
    if (this.$route.query.tabActiveName) {
      this.tabActiveName = this.$route.query.tabActiveName
    }
    if (this.$route.query.menuFlag) {
      this.menuFlag = this.$route.query.menuFlag
    }
    //获取字典数据
    this.getDicts("national_standard_level").then(response => {
      this.levelOptions = response.data;
    });
  },
  computed: {
    userName() {
      return this.$store.state.user.name
    }
  },
  components: {
    ueditor
  },
  methods: {
    /* ************************ 数据获取及处理 *************************/
    //修改按钮进入查询信息
    init(id) {
      getBuildInfo(id).then(({data}) => {
        this.form.projectName = data.projectName
        this.form.level = data.level
      })
    },
    init2(id) {
      getBuildAppraise(id).then(({data}) => {
        this.form = data
      })
    },
    /* ************************ 交互操作 *************************/
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.infoId = this.id
          if (this.eId) {  //修改
            this.form.id = this.eId
            this.updateBuildProAppraise(this.form)
          } else {
            this.addBuildProAppraise(this.form)
          }
        }
      })
    },
    //更新
    updateBuildProAppraise(form) {
      updateBuildAppraise(form).then(({code}) => {
        if (code === 200) {
          this.cancel()
          this.msgSuccess("修改成功")
        }
      })
    },
    //新增
    addBuildProAppraise(form) {
      addBuildAppraise(form).then(({code}) => {
        if (code === 200) {
          this.cancel()
          this.msgSuccess("新增成功")
        }
      })
    },
    //返回页面
    cancel() {
      this.closeView(this.$route.path, this.fromFullPath, 0)
    }
  }
}

</script>
<style lang="scss" scoped>
.app-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 30px 50px 30px;
  .main {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .footer {
    width: 20%;
    margin-top: 40px;
    margin-right: 20%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
