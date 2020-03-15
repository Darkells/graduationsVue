<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class='el-icon-arrow-right'>
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>课程管理</el-breadcrumb-item>
            <el-breadcrumb-item>课程列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card class="box-card">
            <!-- 搜索和添加区域 -->
            <el-row :gutter="30">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" @keyup.enter.native="getLessonList">
                        <el-button slot="append" icon="el-icon-search" @click="getLessonList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加课程</el-button>
                </el-col>
            </el-row>

            <!-- 课程列表区域 -->
            <el-table :data="lessonlist" border stripe align="center">
                <el-table-column type="index" label="#" align="center"></el-table-column>
                <el-table-column label="课程号" prop="lessonId" align="center"></el-table-column>
                <el-table-column label="课程名" prop="lessonName" align="center"></el-table-column>
                <el-table-column label="上课时间" prop="lessonTime" align="center"></el-table-column>
                <el-table-column label="上课地点" prop="lessonLocal" align="center"></el-table-column>
                <el-table-column label="课程余量" prop="lessonMargin" align="center"></el-table-column>
                <el-table-column label="任课教师" prop="teaId" align="center"></el-table-column>
                <el-table-column label="课程类型" prop="lessonType" align="center"></el-table-column>
                <el-table-column label="课程描述" prop="lessonDesc" align="center"></el-table-column>
                <el-table-column label="状态" prop="lessonState" align="center">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.lessonRid" @change="lessonstateChange(scope.row)"></el-switch>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <!-- 修改 -->
                    <el-button type="primary" icon="el-icon-edit" sizi="mini" @click="showEditDialog(scope.row)"></el-button>
                    <!-- 删除 -->
                    <el-button type="danger" icon="el-icon-delete" sizi="mini" @click="removeLesson(scope.row.teaId)"></el-button>
                  </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5,10,15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加课程模态框 -->
        <el-dialog title="添加课程" :visible.sync="addDialogVisible" width="25%" @close="addDialogClose">
          <!-- 内容主体区域 -->
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
            <el-form-item label="课程号" prop="LessonId">
              <el-input v-model="addForm.LessonId"></el-input>
            </el-form-item>
            <el-form-item label="课程名" prop="LessonName">
              <el-input v-model="addForm.LessonName"></el-input>
            </el-form-item>
            <el-form-item label="上课时间" prop="LessonTime">
              <el-input v-model="addForm.LessonTime"></el-input>
            </el-form-item>
            <el-form-item label="上课地点" prop="LessonLocal">
              <el-input v-model="addForm.LessonLocal"></el-input>
            </el-form-item>
            <el-form-item label="课程余量" prop="LessonMargin">
              <el-input v-model="addForm.LessonMargin"></el-input>
            </el-form-item>
            <el-form-item label="任课教师" prop="TeaId">
              <el-input v-model="addForm.TeaId"></el-input>
            </el-form-item>
            <el-form-item label="课程类型" prop="LessonType">
              <el-input v-model="addForm.LessonType"></el-input>
            </el-form-item>
            <el-form-item label="课程描述" prop="LessonDesc">
              <el-input v-model="addForm.LessonDesc"></el-input>
            </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="addLesson">确定</el-button>
          </span>
        </el-dialog>

        <!-- 修改教师信息模态框 -->
        <el-dialog title="修改课程信息" :visible.sync="editDialogVisible" width="20%">
          <el-form :model="editForm" ref="editFormRef" label-width="70px">
            <el-form-item label="课程号" prop="LessonId">
              <el-input v-model="editForm.lessonId" disabled></el-input>
            </el-form-item>
            <el-form-item label="课程名" prop="LessonName">
              <el-input v-model="editForm.lessonName"></el-input>
            </el-form-item>
            <el-form-item label="上课时间" prop="LessonTime">
              <el-input v-model="editForm.lessonTime"></el-input>
            </el-form-item>
            <el-form-item label="上课地点" prop="LessonLocal">
              <el-input v-model="editForm.lessonLocal"></el-input>
            </el-form-item>
            <el-form-item label="课程余量" prop="LessonMargin">
              <el-input v-model="editForm.lessonMargin"></el-input>
            </el-form-item>
            <el-form-item label="任课教师" prop="TeaId">
              <el-input v-model="editForm.teaId"></el-input>
            </el-form-item>
            <el-form-item label="课程类型" prop="LessonType">
              <el-input v-model="editForm.lessonType"></el-input>
            </el-form-item>
            <el-form-item label="课程描述" prop="LessonDesc">
              <el-input v-model="editForm.lessonDesc"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="editLesson">确认</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取课程列表
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      lessonlist: [],
      total: 0,
      // 控制添加课程模态框的显示与隐藏
      addDialogVisible: false,
      // 添加课程表单数据
      addForm: {
        LessonId: '',
        LessonName: '',
        LessonTime: '',
        LessonLocal: '',
        LessonMargin: '',
        TeaId: '',
        LessonType: '',
        LessonDesc: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
      },
      // 控制修改教师信息模态框的显示与隐藏
      editDialogVisible: false,
      // 修改教师表单数据
      editForm: {
      }
    }
  },
  created () {
    this.getLessonList()
  },
  methods: {
    async getLessonList () {
      const { data: res } = await this.$http.get('/dark/admin/lessons', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.lessonlist = res.data.objects
      this.total = res.data.total
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
    //   console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getLessonList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getLessonList()
    },
    // 监听添加课程模态框的关闭事件
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加课程框
    addLesson () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('添加参数有问题')
        const { data: res } = await this.$http.post('/dark/admin/lessons/add', this.qs.stringify(this.addForm))
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        // 隐藏添加课程模态框
        this.addDialogVisible = false
        // 刷新课程列表
        this.getLessonList()
      })
    },
    // 展示编辑课程信息的模态框
    showEditDialog (row) {
      this.editDialogVisible = true
      this.editForm = row
    },
    // 修改教师信息
    editLesson () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('修改参数有问题')
        const { data: res } = await this.$http.put('/dark/admin/lessons/update', this.qs.stringify(this.editForm))
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)

        // 隐藏修改课程信息模态框
        this.editDialogVisible = false
        // 刷新课程列表
        this.getLessonList()
      })
    },
    // 删除课程
    async removeLesson (lessonId) {
      const confirmResult = await this.$confirm('确认删除该课程？', '警告', {
        confirmButtomText: '确认',
        cancelButtomText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete('/dark/admin/lessons/delete/' + lessonId)

      if (res.meta.status !== 200) {
        return this.$message.error('删除失败!')
      }

      this.$message.success('删除成功!')
      this.getLessonList()
    },
    async lessonstateChange (lesson) {
      const { data: res } = await this.$http.put('/dark/admin/lessons/' + lesson.lessonId + '/state/' + lesson.lessonRid)
      console.log(res)
      if (res.meta.status !== 200) {
        lesson.lessonRid = !lesson.lessonRid
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功!')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
