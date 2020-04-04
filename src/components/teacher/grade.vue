<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class='el-icon-arrow-right'>
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>选课管理</el-breadcrumb-item>
            <el-breadcrumb-item>评分</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card class="box-card">
            <!-- 检索区域 -->
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" @keyup.enter.native="getGradeList">
                        <el-button slot="append" icon="el-icon-search" @click="getGradeList"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 成绩列表区域 -->
            <el-table :data="gradelist" border stripe align="center">
                <el-table-column tpye="index" label="#" align="center"/>
                <el-table-column tpye="stuId" label="学号" align="center"/>
                <el-table-column tpye="stuMajor" label="专业" align="center"/>
                <el-table-column tpye="stuName" label="姓名" align="center"/>
                <el-table-column tpye="grade" label="成绩" align="center"/>
            </el-table>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取当前教师任教课程的成绩单
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 50
      },
      gradelist: [],
      total: 0
    }
  },
  created () {
    this.getGradeList()
  },
  methods: {
    async getGradeList () {
      const { data: res } = await this.$http.get('/dark/admin/grades', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.gradelist = res.data.objects
      this.total = res.data.total
    }
  }
}
</script>

<style lang="less" scoped>

</style>
