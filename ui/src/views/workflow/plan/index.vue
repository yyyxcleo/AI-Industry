<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单号" prop="odId">
        <el-input
          v-model="queryParams.odId"
          placeholder="请输入订单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品编号" prop="prId">
        <el-input
          v-model="queryParams.prId"
          placeholder="请输入产品编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划状态" prop="ptStatus">
        <el-select v-model="queryParams.ptStatus" placeholder="请选择" clearable style="width:100%">
            <el-option v-for="item in statusOptions" :key="item.statusId" :label="item.statusName" :value="item.statusKey" />
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
          @click="handleCreate(-1)"
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
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getProductionTaskList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="planList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" >
        <template slot-scope="scope">
          <!-- 在这里可以自定义动作序号列的内容 -->
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="计划编号" align="center" prop="ptId" />
      <el-table-column label="订单号" align="center" prop="ohId" >
        <template slot-scope="scope">
          <router-link :to="'/bookmenu/orderDetails?id=' + scope.row.ohId" class="link-type">
            <span>{{ scope.row.ohId }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" align="center" prop="prName" />
      <el-table-column label="产品数量" align="center" prop="ptNum" />
      <el-table-column label="完成量" align="center" prop="ptFinish" />
      <el-table-column label="工艺模型" align="center" prop="ptDesp" >
        <template slot-scope="scope">
            <el-button type="text" @click="handleProcessView(scope.row)">
              <span>{{ scope.row.ptDesp }}</span>
            </el-button>
          </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="ptStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pr_status" :value="scope.row.ptStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="实际结束时间" align="center" prop="ptRealEndtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.ptRealEndtime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最迟结束时间" align="center" prop="ptLatestEndtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.ptLatestEndtime) }}</span>
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
          >编辑</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            :disabled="scope.row.ptStatus != '0'"
            @click="arrangeTask(scope.row)"
            v-hasPermi="['system:post:edit']"
          >编排</el-button>
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
      @pagination="getProductionTaskList"
    />

    <!-- 添加或修改动作对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="planform" :model="planform" label-width="80px">
        <el-form-item label="订单号" prop="ohId">
          <el-input v-model="planform.ohId" clearable disabled />
        </el-form-item>
        <el-form-item label="产品名称" prop="prName">
          <el-input v-model="planform.prName" clearable disabled />
        </el-form-item>
        <el-form-item label="产品数量" prop="ptNum">
          <el-input v-model="planform.ptNum" clearable disabled />
        </el-form-item>
        <el-form-item label="工艺模型" prop="model">
          <el-select v-model="planform.ptDesp" placeholder="请选择" clearable style="width:100%">
            <el-option v-for="item in modelOptions" :key="item.modelId" :label="item.modelName" :value="item.modelKey" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="ptStatus">
          <el-radio-group v-model="planform.ptStatus">
            <el-radio
              v-for="dict in dict.type.pr_status"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editPlan">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
<!-- model -->
    <el-dialog :title="processView.title" :visible.sync="processView.open" width="70%" append-to-body>
      <process-viewer :key="`designer-${processView.index}`" :xml="processView.xmlData" :style="{height: '400px'}" />
    </el-dialog>

  </div>
</template>

<script>
import {getBpmnXml, listModel} from "@/api/workflow/model";
import {addProductionTask, listProductionTask, updateProductionTask,delProductionTask,getProductionTask} from "@/api/workflow/productionTask";
// import dict from "@/utils/dict";
import {parseTime} from "../../../utils/ruoyi";
import ProcessViewer from '@/components/ProcessViewer'

export default {
  name: "Order",
  components: {
    ProcessViewer,
  },
  dicts: ['pr_status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      id:-1,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: "生产计划修改",
      // 是否显示弹出层
      open: false,
      planList: [],
      modelOptions: [],
      statusOptions: [
        {
          statusId: 0,
          statusName: "待完成",
          statusKey: 0
        },
        {
          statusId: 1,
          statusName: "进行中",
          statusKey: 1
        },
        {
          statusId: 2,
          statusName: "已完成",
          statusKey: 2
        }
      ],
      processView: {
        title: '',
        open: false,
        index: undefined,
        xmlData:"",
      },
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        ptStatus: undefined,
        prId: undefined,
        ohId: undefined,
      },
      // itemQueryParams: {
      //   pageNum: 1,
      //   pageSize: 10,
      //   omId: undefined,
      // },
      // 表单参数
      planform: {},
      // 表单校验

    };
  },
  created() {
    this.getProductionTaskList();
    const modelQueryParams = {
          pageNum: 1,
          pageSize: 100,
          modelKey: null,
          modelName: null,
          category: null
        }
    listModel(modelQueryParams).then(response => {
          this.modelOptions = response.rows;
    })
  },
  methods: {
    parseTime,
    // dict,
    /** 查询生产计划列表 */
    getProductionTaskList() {
      this.loading = true;
      listProductionTask(this.queryParams).then(response => {
        this.planList = response.rows;
        console.log(response)
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.planform = {
        ptId: undefined,
        ptRealEndtime: undefined,
        ptLatestEndtime: undefined,
        ptNum: undefined,
        ptFinish: undefined,
        prId: undefined,
        prName: undefined,
        ptDesp: undefined,
        ohId: undefined,
        ptStatus: undefined,
      };
      this.resetForm("planform");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getProductionTaskList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.getProductionTaskList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.arId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    handleCreate(id){
      this.reset()

    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log("修改")
      // this.planform.ptId = row.ptId
      // this.planform.ptRealEndtime = row.ptRealEndtime
      // this.planform.ptLatestEndtime = row.ptLatestEndtime
      // this.planform.ptNum = row.prNum
      // this.planform.ptFinish = row.ptFinish
      // this.planform.prId = row.prId
      // this.planform.prName = row.prName
      // this.planform.ptDesp = row.ptDesp
      // this.planform.ohId = row.ohId
      // this.planform.ptStatus = row.ptStatus
      this.planform = row
      this.open = true
      
    },
    /** 提交按钮 */
    editPlan: function() {
      this.$refs["planform"].validate(valid => {
        if (valid) {
          if (this.planform.ptId != undefined) {
            updateProductionTask(this.planform).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getProductionTaskList();
            });
          } else {
            addProductionTask(this.planform).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              console.log(this.planform)
              this.getProductionTaskList();
            });
          }
        }
      });
      console.log(1)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ptIds = row.ptId || this.ids;
      console.log(ptIds)
      this.$modal.confirm('是否确认删除编号为"' + ptIds + '"的数据项？').then(function() {
        
        delProductionTask(ptIds).then(response => {
          
          

        })
        // return delOrder(arIds);
      }).then(() => {
        this.$modal.msgSuccess("删除成功");
        this.getProductionTaskList();
      }).catch(() => {});
      // console.log(row)
      // console.log(row.ptId)
    },
    /** 查看流程图 */
    handleProcessView(row) {
      let model = this.modelOptions.filter(function getModelId(element) {
        return element.modelId == row.ptDesp
      })
      console.log(model)
      this.processView.title = "流程图";
      this.processView.index = model[0].modelId;
      // 发送请求，获取xml
      getBpmnXml(this.processView.index).then(response => {
        this.processView.xmlData = response.data;
      })
      this.processView.open = true;
    },
    arrangeTask(row){
      console.log(row)
      this.$router.push({
        path:'/product/arrange/index/' + row.ptId
      })
    }
  }
};
</script>
