<template>
  <div class="app-container">
    <div class="header">
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true">
        <el-form-item label="专家选取方式" prop="type">
          <el-select
            v-model="queryParams.type"
            placeholder="请选择选取方式"
            clearable
            style="width: 220px"

            @change="changeExpertType">
            <el-option
              v-for="dict in expertTypes"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"/>
          </el-select>
        </el-form-item>
        <el-form-item label="专业领域" prop="exportArea">
          <el-select
            v-model="queryParams.exportArea"
            placeholder="请选择专业领域"
            clearable
            style="width: 220px"
            >
            <el-option
              v-for="dict in expertAeras"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"/>
          </el-select>
        </el-form-item>
        <el-form-item label="工作单位" prop="workUnit">
          <el-input
            v-model="queryParams.workUnit"
            placeholder="请输入专家组名称"
            clearable
            style="width: 220px"

            @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="专家姓名" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入专家组名称"
            clearable
            style="width: 220px"

            @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item
          v-if="isShowExpertGroup"
          label="专家组"
          prop="inExpertGroupId">
          <el-select
            v-model="queryParams.inExpertGroupId"
            placeholder="请选择专家组别"
            clearable
            style="width: 220px"
            >
            <el-option
              v-for="item in allExpertGroups"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"

            @click="handleQuery">查询
          </el-button>
          <el-button
            icon="el-icon-refresh"

            @click="resetQuery">重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="main">
      <el-transfer
        style="text-align: left; display: inline-block; width: 700px"
        v-model="selectedExperts"
        :render-content="renderFunc"
        :titles="['可选专家', '已选专家']"
        :button-texts="['删除专家', '添加专家']"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}'
        }"
        :props="{
          key: 'id',
          label: 'name'
        }"
        @change="handleChange"
        :data="allOpt_SelExperts">
      </el-transfer>
    </div>
    <div class="footer">
      <el-button  type="primary" @click="submitForm">确 定</el-button>
      <el-button  @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
  import {
    queryAllExpertGroup,
    queryAllExperts,
    addCurrGoupMember
  } from '@/api/expert/expertGroup';

  export default {
    name: '',
    data() {
      return {
        //控制专家组下拉框显示
        isShowExpertGroup: false,
        //所有的专家组
        allExpertGroups: [],
        //专家选取方式字典
        expertTypes: [],
        //专家领域字典
        expertAeras: [],
        //查询参数
        queryParams: {
          expertGroupId: undefined,
          type: undefined,
          exportArea: undefined,
          workUnit: undefined,
          name: undefined,
          inExpertGroupId: undefined
        },
        //所有已选择的专家
        allGroupMember: {},
        //已选的专家
        selectedExperts: [],
        //可选和已选的所有的专家
        allOpt_SelExperts: [],
        //路由传入
        //专家组ID
        expertGroupId: undefined,
        //专家评审页面标记
        expertReviewFlag: undefined
      }
    },
    created() {
      if (this.$route.query.expertGroupId !== undefined) {
        this.expertGroupId = this.$route.query.expertGroupId
        this.queryParams.expertGroupId = this.$route.query.expertGroupId
      }
      if (this.$route.query.expertReviewFlag !== undefined) {
        this.expertReviewFlag = this.$route.query.expertReviewFlag
      }

      //查询所有专家组
      this._queryAllExpertGroup()
      //查询可选和已选的专家
      this._queryAllExperts()
      //查询专家分属类型
      this.getDicts("expert_big_types").then(response => {
        console.log(response.data);
        this.expertTypes = response.data
      });
      //查询专家领域
      this.getDicts("sys_expert_area").then(response => {
        console.log(response.data);
        this.expertAeras = response.data
      })
    },
    methods: {
      /************************** 获取及处理数据 **************************/
      //查询所有的专家组
      _queryAllExpertGroup() {
        queryAllExpertGroup(this.queryParams).then(res => {
          this.allExpertGroups = res.data
        })
      },
      //查询当前组可选的专家
      _queryAllExperts() {
        queryAllExperts(this.queryParams).then(res => {
          console.log(res.data);
          this.allOpt_SelExperts = res.data.notSelectExpert
          if (res.data.selectExpert.length > 0) {
            const dataTem = res.data.selectExpert
            dataTem.forEach(element => {
              this.allOpt_SelExperts.push(element)
            })
            this.selectedExperts = dataTem.map(item => item.id)
          }
        })
      },
      //重写穿梭框每行数据格式
      renderFunc(h, option) {
        return h('span', {
          domProps: {
            title: option.name
          }
        }, option.name)
      },

      /************************** 交互操作 **************************/
      // 专家类型改变时控制专家组显示
      changeExpertType(value) {
        if (value == '0') {
          this.isShowExpertGroup = false
          this.queryParams.inExpertGroupId = undefined
        } else {
          this.isShowExpertGroup = true
        }
      },
      //处理查询按钮
      handleQuery() {
        queryAllExperts(this.queryParams).then(res => {
          console.log(res.data);
          this.allOpt_SelExperts = res.data.notSelectExpert
          if (res.data.selectExpert.length > 0) {
            const dataTem = res.data.selectExpert
            dataTem.forEach(element => {
              this.allOpt_SelExperts.push(element)
            })
            this.selectedExperts = dataTem.map(item => item.id)
          }
        })
      },
      //重置查询
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      //处理穿梭框改变
      handleChange(value, direction, movedKeys) {
        this.allGroupMember = {
          expertGroupId: this.expertGroupId,
          expertIds: value
        }
      },
      //添加提交方法
      submitForm() {
        console.log();
        if (this.allGroupMember && this.allGroupMember.expertIds && this.allGroupMember.expertIds.length > 0) {
          addCurrGoupMember(this.allGroupMember).then(res => {
            if (res.code == 200) {
              this.msgSuccess("操作专家组成员成功")
              if (this.expertReviewFlag === '0') {
                this.closeView("/expert/expertGroup/manageMember/addMember", "/sel/expertReview", 400)
              } else if (this.expertReviewFlag === '1') {
                this.closeView("/expert/expertGroup/manageMember/addMember", "/proManagement/storage/review", 400)
              } else {
                this.closeView("/expert/expertGroup/manageMember/addMember", "/expert/expertGroup/manageMember?expertGroupId=" + this.expertGroupId, 400)
              }
            }
          })
        } else {
          this.$message.warning("请先确认需要操作的专家组成员")
        }
      },
      //取消返回
      cancel() {
        if (this.expertReviewFlag === '0') {
          this.closeView("/expert/expertGroup/manageMember/addMember", "/sel/expertReview", 0)
        } else {
          this.closeView("/expert/expertGroup/manageMember/addMember", "/expert/expertGroup/manageMember?expertGroupId=" + this.expertGroupId, 0)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-container {
    width: 100%;
    padding: 20px 30px 50px 30px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .header {
      width: 100%;
      margin-bottom: 20px;
    }

    .main {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 50px;
    }

    .footer {
      width: 25%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
