<template>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
        <el-form-item label="生产任务编码" prop="ptId">
          <el-input
            v-model="queryParams.ptId"
            placeholder="请输入任务编码"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="设备名称" prop="eqId">
          <el-input
            v-model="queryParams.eqId"
            placeholder="请选择设备名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="etStatus">
          <el-select v-model="queryParams.etStatus" placeholder="任务状态" clearable>
            <el-option
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
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
            :disabled="true"
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
  <!--      <el-col :span="1.5">-->
  <!--        <el-button-->
  <!--          type="warning"-->
  <!--          plain-->
  <!--          icon="el-icon-download"-->
  <!--          size="mini"-->
  <!--          @click="handleExport"-->
  <!--          v-hasPermi="['system:post:export']"-->
  <!--        >导出</el-button>-->
  <!--      </el-col>-->
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
  
      <el-table v-loading="loading" :data="taskList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="任务编号" align="center" prop="etId" />
        <el-table-column label="设备名称" align="center" prop="eqId" >
          <template slot-scope="scope">
            {{getEqname(scope.row.eqId)}}
          </template>
        </el-table-column>
        <el-table-column label="所属任务" align="center" prop="ptId" />
        <el-table-column label="优先级" align="center" prop="etPriority" />
        <el-table-column label="状态" align="center" prop="etStatus">
  <!--        <el-tag size="large">-->
            <template slot-scope="scope">
              <el-tag>{{ getStatus(scope.row.etStatus) }}</el-tag>
            </template>
  <!--        </el-tag>-->
  
        </el-table-column>
        <el-table-column label="实际结束时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.Time) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最迟结束时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.etLatestEndtime) }}</span>
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
            <!-- <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:post:remove']"
            >删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
  
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
  
  
      <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
        <el-form ref="form" :model="form"  label-width="80px">
          <el-form-item label="设备名称" prop="eqId">
            <el-select v-model="form.eqId" placeholder="请选择设备类别">
              <el-option
                v-for="eqment in eqnames"
                :key="eqment.eqId"
                :label="eqment.eqName"
                :value="eqment.eqId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="订单交期" prop="etLatestEndtime">
            <el-date-picker
              v-model="form.etLatestEndtime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请输入订单交期"
              size="default"
            />
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
  import { listEquipmentTask, getEquipmentTask, delEquipmentTask, addEquipmentTask, updateEquipmentTask } from "@/api/workflow/equipmentTask";
  import {listEquipment} from "@/api/system/eqdetails";
  
  export default {
    name: "Post",
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
        taskList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          ptId: undefined,
          eqId: undefined,
          etStatus: undefined
        },
        eqnames:[],
        // 表单参数
        form: {},
        // 表单校验
  
      };
    },
    created() {
      this.getList();
      this.getEqList();
    },
    methods: {
      /** 查询岗位列表 */
      getList() {
        this.loading = true;
        listEquipmentTask(this.queryParams).then(response => {
          this.taskList = response.rows;
          this.taskList = this.taskList.sort(function(a,b){
            return -b.priority+a.priority
          })
          console.log(response.rows)
          this.total = response.total;
          this.loading = false;
        });
      },
      getEqList(){
        listEquipment().then(response => {
          this.eqnames = response.rows;
        })
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      getStatus(status) {
        console.log(status)
        if(status == '0'){
          return "未开始";
        }else if(status == '1'){
          return "进行中";
        }else{
          return "已完成";
        }
      },
      // 表单重置
      reset() {
        this.form = {
          etId: undefined,
          eqId: undefined,
          ptId: undefined,
          etPriority: 0,
          etStatus: "0",
          etLatestEndtime: undefined,
        };
        this.resetForm("form");
      },
      getEqname(eqid){
        const equipment = this.eqnames.find(item => item.eqId === eqid);
        return equipment ? equipment.eqName : '';
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.etId)
        this.single = selection.length!=1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加岗位";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const etId = row.etId || this.ids
        getEquipmentTask(etId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改任务";
        });
      },
      /** 提交按钮 */
      submitForm: function() {
  
        if (this.form.etId != undefined) {
            updateEquipmentTask(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          });
        } else {
            addEquipmentTask(this.form).then(response => {
            this.$modal.msgSuccess("新增成功");
            this.open = false;
            this.getList();
          });
        }
  
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const etIds = row.etId || this.ids;
        // console.log(this.ids)
        this.$modal.confirm('是否确认删除编号为"' + etIds + '"的数据项？').then(function() {
          return delEquipmentTask(etIds);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
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
  