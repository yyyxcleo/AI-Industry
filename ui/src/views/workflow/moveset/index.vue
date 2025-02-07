<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="动作名称" prop="opName">
        <el-input
          v-model="queryParams.opName"
          placeholder="请输入动作名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备分类" prop="eqType">
<!--      <el-input-->
<!--        v-model="queryParams.eqType"-->
<!--        placeholder="请输入设备分类"-->
<!--        clearable-->
<!--        @keyup.enter.native="handleQuery"-->
<!--      />-->
        <el-select v-model="queryParams.eqType" placeholder="请选择设备类别">
          <el-option
            v-for="eqType in eqtypes"
            :key="eqType.eqType"
            :label="eqType.eqtName"
            :value="eqType.eqType"
          />
        </el-select>
    </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:post:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:post:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:post:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:post:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getMove"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="动作序号" align="center" >
        <template slot-scope="scope">
          <!-- 在这里可以自定义动作序号列的内容 -->
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="设备分类" align="center" prop="eqType" >
        <template slot-scope="scope">
          {{ getEqtName(scope.row.eqType) }}
        </template>
      </el-table-column>
      <el-table-column label="动作名称" align="center" prop="opName" />
      <el-table-column label="预计耗时" align="center" prop="opTime"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:post:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:post:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getMove"
    />

    <!-- 添加或修改动作对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="动作名称" prop="opName">
          <el-input v-model="form.opName" placeholder="请输入动作名称" />
        </el-form-item>
        <el-form-item label="设备分类" prop="eqType">
<!--          <el-input v-model="form.eqType" placeholder="请选择设备类别" />-->
          <el-select v-model="form.eqType" placeholder="请选择设备类别">
            <el-option
              v-for="eqType in eqtypes"
              :key="eqType.eqType"
              :label="eqType.eqtName"
              :value="eqType.eqType"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="预计耗时" prop="opTime">
          <el-input v-model="form.opTime"  />
        </el-form-item>
        <el-form-item label="动作描述" prop="opDesp">
          <el-input v-model="form.opDesp" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMove, getMove, delMove, addMove, updateMove } from "@/api/system/move";
import { listType } from "@/api/system/eqtype";
import dict from "@/utils/dict";
import {parseTime} from "../../../utils/ruoyi";

export default {
  name: "Move",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 岗位表格数据
      postList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        eqType: undefined,
        opName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      // 设备类型
      eqtypes: []
    };
  },
  created() {
    this.getMove();
    this.geteqtyps();
  },
  // watch:{
  //   'form.eqType':{
  //
  //   }
  // },
  methods: {
    parseTime,
    dict,
    /** 查询岗位列表 */
    getMove() {
      this.loading = true;
      listMove(this.queryParams).then(response => {

        this.postList = response.rows;
        console.log(response)
        this.total = response.total;
        this.loading = false;
      });
      // console.log(1)
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        opId: undefined,
        opName: undefined,
        eqType: undefined,
        opDesp: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getMove();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.opId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    geteqtyps() {
      return new Promise((resolve, reject) => {
        listType().then(response => {
          this.eqtypes = response.rows;
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
    getEqtName(eqType) {
      // this.geteqtyps()
      const eqtype = this.eqtypes.find(item => item.eqType === eqType);
      return eqtype ? eqtype.eqtName : '';
    },
    /** 新增按钮操作 */
    handleAdd() {
      // await this.geteqtyps()
      this.reset();
      this.open = true;
      this.title = "添加设备动作";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // await this.geteqtyps()
      this.reset();
      const opIds = row.opId || this.ids
      console.log(opIds)
      getMove(opIds).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改岗位";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.opId != undefined) {
            updateMove(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getMove();
            });
          } else {
            addMove(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              console.log(this.form)
              this.getMove();
            });
          }
        }
      });
      console.log(1)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const opIds = row.opId || this.ids;
      console.log(opIds)
      this.$modal.confirm('是否确认删除岗位编号为"' + opIds + '"的数据项？').then(function() {
        return delMove(opIds);
      }).then(() => {
        this.getMove();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
      console.log(row)
      console.log(row.opId)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/post/export', {
        ...this.queryParams
      }, `post_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
