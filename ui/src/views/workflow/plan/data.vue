<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="计划编号" prop="ptId">
        <el-select v-model="queryParams.ptId">
          <el-option
            v-for="item in prodctionTaskOptions"
            :key="item.ptId"
            :label="item.ptId"
            :value="item.ptId"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="字典标签" prop="dictLabel">
        <el-input
          v-model="queryParams.dictLabel"
          placeholder="请输入字典标签"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="数据状态" clearable>
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
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
          v-hasPermi="['system:dict:add']"
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
          v-hasPermi="['system:dict:edit']"
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
          v-hasPermi="['system:dict:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleSave"
          v-hasPermi="['system:dict:export']"
        >保存</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-close"
          size="mini"
          @click="handleClose"
        >关闭</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="任务编号" align="center" prop="dictCode" /> -->
      <el-table-column label="流程编号" align="center" prop="pdId" />
      <el-table-column label="设备类型" align="center" prop="eqType" />
      <!-- <el-table-column label="设备选择" align="center" >
        <template slot-scope="scope">
          <el-select v-model="scope.row[scope.column.select1]" @change="handleSelectChange(scope.row,scope.row[scope.column.select1])" placeholder="请选择" filterable >
            <el-option v-for="item in getdatalist(scope.row)" :key="item.eqId" :label="item.eqName" :value="item.eqId">
            </el-option>
          </el-select>
        </template>
      </el-table-column> -->
      <el-table-column label="起始位置" align="center" prop="pdStartpoint" />
      <el-table-column label="目标位置" align="center" prop="pdEndpoint" />
      <el-table-column label="目标物品" align="center" prop="maId" />
      <el-table-column label="重复次数" align="center" prop="pdNum" />
      <el-table-column label="任务优先级" align="center" prop="priority">
      </el-table-column>
      <!-- <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dict:edit']"
          >设备选择</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dict:remove']"
          >删除</el-button>
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="流程编号">
          <el-input v-model="form.pdId" :disabled="true" />
        </el-form-item>
        <el-form-item label="设备类型" prop="eqType">
          <el-input v-model="form.eqType" :disabled="true" />
        </el-form-item>
        <el-form-item label="设备选择" prop="device">
          <el-select v-model="inputParams.eqChoice">
            <el-option
              v-for="item in listClassOptions"
              :key="item.eqId"
              :label="item.eqName"
              :value="item.eqId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起始位置" prop="pdStartpoint">
          <!-- <el-input v-model="form.pdStartpoint" placeholder="请输入样式属性" /> -->
          <el-select v-model="form.pdStartpoint"  :disabled="true">
            <el-option
              v-for="item in areaList"
              :key="item.arId"
              :label="item.arName"
              :value="item.arId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标位置" prop="pdEndpoint">
          <el-select v-model="form.pdEndpoint"  :disabled="true">
            <el-option
              v-for="item in areaList"
              :key="item.arId"
              :label="item.arName"
              :value="item.arId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标物品" prop="maId">
          <el-input v-model="form.maId" :disabled="true" />
        </el-form-item>
        <el-form-item label="重复次数" prop="pdNum">
          <el-input v-model="form.pdNum" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-input v-model="form.priority" placeholder="请输入内容"></el-input>
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
import { listData, getData, delData, addData, updateData } from "@/api/system/dict/data";
import { listType } from "@/api/system/eqtype";
import { listMove } from "@/api/system/move"
import { listProcessRouteDetails, getProcessRouteDetails, delProcessRouteDetails, addProcessRouteDetails, updateProcessRouteDetails} from "../../../api/workflow/processRouteDd";
import {addProductionTask, listProductionTask, updateProductionTask,delProductionTask,getProductionTask} from "@/api/workflow/productionTask";
import { listEquipment, getEquipment, delEquipment, addEquipment, updateEquipment,  } from "@/api/system/eqdetails";
import { listMaterial, getMaterial } from "@/api/system/material";
import { listArea } from "@/api/system/area";
import { addEquipmentTaskbatch } from "@/api/workflow/equipmentTask"


export default {
  name: "Arrange",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      ptId: "",
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
      // 工艺卡表格数据
      dataList: [],
      dataListCopy: [],
      // 默认字典类型
      defaultPT: "",
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 数据标签回显样式
      listClassOptions: [],
      // 类型数据字典
      prodctionTaskOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 100,
        pmPid: undefined,
        // dictType: undefined,
        // status: undefined
      },
      inputParams:{
        eqChoice: undefined,
        priority: undefined
      },
      deviceList:[],
      materialList: [],
      areaList: [],
      typeList: [],
      moveList: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictLabel: [
          { required: true, message: "数据标签不能为空", trigger: "blur" }
        ],
        dictValue: [
          { required: true, message: "数据键值不能为空", trigger: "blur" }
        ],
        dictSort: [
          { required: true, message: "数据顺序不能为空", trigger: "blur" }
        ]
      },
      productionTask: {}
    };
  },
  created() {

    // 获取生产计划对应工艺卡中的设备、原料、工作台等具体信息
    this.getMultipleList();

    this.getProductionTaskList();

  },
  methods: {
    // handleSelectChange(row,deviceID){
    //   console.log("handleSelectChange")
    //   console.log(row)
    //   this.dataListCopy.forEach(element => {
    //     if (element.ptId == row.ptId){
    //       element.device = deviceID
    //     }
    //   })
    //   console.log(this.dataListCopy)
    // },
    getdatalist(row){
      console.log(row)
      const pdRoute = this.dataListCopy.filter(function getPdRoute(pd){
        return row.pdId == pd.pdId
      })
      // console.log('pd')
      // console.log(pdRoute)
      const type = pdRoute[0].eqType
      // console.log('type')
      // console.log(type)
      const devices =  this.deviceList.filter(function getDevs(dev) {
            return dev.eqType == type
          })
      // console.log('devices')
      // console.log(devices)
      return devices
    },
    getMultipleList(){
      this.ptId = this.$route.params && this.$route.params.ptId;
      listEquipment().then(response => {
        this.deviceList = response.rows
        listMaterial().then(response => {
          this.materialList = response.rows
          listArea().then(response => {
            this.areaList = response.rows
            listType().then( response => {
              this.typeList = response.rows
              listMove().then(response =>{
                this.moveList = response.rows
                // 获取生产计划的信息
                this.getPT(this.ptId );
              })
              
            })
          })
        })
      })


    },
    /** 查询对应生产计划的信息，获取其使用的model_key */
    getPT(ptId) {
      getProductionTask(ptId).then(response => {
        this.queryParams.pmPid = response.data.ptDesp;
        console.log("getPT")
        this.productionTask = response.data
        console.log(this.productionTask)
        this.defaultPRoute = response.data.ptDesp;
        this.getList()
      })

    },
    /** 查询所有的生产计划列表 */
    getProductionTaskList() {
      listProductionTask().then(response => {
        this.prodctionTaskOptions = response.rows;
      });
    },
    /** 查询使用model_key的工艺卡详细信息 */
    getList() {
      this.loading = true;
      listProcessRouteDetails(this.queryParams).then(response => {
        this.dataList = response.rows;
        console.log(1111)
        console.log(this.dataList)
        this.dataListCopy = JSON.parse(JSON.stringify(this.dataList))
        this.dataList.forEach(element => {
          const eqType = this.typeList.filter(function getTypes(type) {
            return type.eqType == element.eqType
          })
          if(eqType.length > 0){
            element.eqType = eqType[0].eqtName
          }
          const pdEndpoint = this.areaList.filter(function getAreas(area) {
            return area.arId == element.pdEndpoint
          })
          if(pdEndpoint.length > 0){
            element.pdEndpoint = pdEndpoint[0].arName
          }
          const pdStartpoint = this.areaList.filter(function getAreas(area) {
            return area.arId == element.pdStartpoint
          })
          if(pdStartpoint.length > 0){
            element.pdStartpoint = pdStartpoint[0].arName
          }

          const material = this.materialList.filter(function getMaterial(ma) {
            return ma.maId == element.maId
          })
          if(material.length > 0){
            element.maId = material[0].maName
          }
          const move = this.moveList.filter(function getMove(move) {
            return move.opId == element.opId
          })
          if(move.length > 0){
            element.etTime = move[0].opTime
            element.opName = move[0].opDesp
          }
          element.device = ''
          element.priority = ''
        });
        this.total = response.total;
        this.loading = false;
        this.dataListCopy.forEach(element => {
          element.device = null
          element.priority = ''
        });
        this.dataList = this.dataList.reverse()
        this.dataListCopy = this.dataListCopy.reverse()

        this.setPriority()
      });
    },
    setPriority(){
      const map1 = new Map()
      this.dataList.forEach(element => {
        map1.set(element.pdPid,0)
      })
      var list_temp = new Array()
      this.dataList.forEach(element => {
        if(element.pdPreProcess == null){
          map1.set(element.pdPid,1)
          element.pdPreProcess = "0"
          list_temp.push(element.pdPid)
        }
      })
      console.log(list_temp)
      while (list_temp.length != 0){
        console.log(1)
        console.log(list_temp)
        var del = []
        var add = []
        list_temp.forEach(ll => {
          this.dataList.forEach(d => {
            let pre = d.pdPreProcess.split(',')
            pre.forEach(ele => {
              if(ele == ll){
                var pri = Math.max(map1.get(d.pdPid),map1.get(ll) + 1)
                map1.set(d.pdPid, pri)
                add.push(d.pdPid)
                
              }
            })
          })
          del.push(ll)
        })
        add.forEach(a => {
          list_temp.push(a)
        })
        console.log("add")
        console.log(add)
        del.forEach(d => {
          list_temp = list_temp.filter(function(item){
            return item != d
          })
        })
        console.log("del")
        console.log(del)
      }
      console.log(map1)
      this.dataList.forEach(element => {
        element.priority = map1.get(element.pdPid)
      })
      this.dataListCopy.forEach(element => {
        element.priority = map1.get(element.pdPid)
      })
      this.dataList.sort(function(a,b){
        return -b.priority+a.priority
      })
      this.dataListCopy.sort(function(a,b){
        return -b.priority+a.priority
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        dictCode: undefined,
        dictLabel: undefined,
        dictValue: undefined,
        cssClass: undefined,
        listClass: 'default',
        dictSort: 0,
        status: "0",
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 返回按钮操作 */
    handleClose() {
      const obj = { path: "/product/plan" };
      this.$tab.closeOpenPage(obj);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.dictType = this.defaultDictType;
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加字典数据";
      this.form.dictType = this.queryParams.dictType;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dictCode)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.listClassOptions = this.getdatalist(row)
      this.form = row
      console.log("handleUpdate")
      console.log(this.form)
      this.open = true;
      this.title = "修改任务安排";
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.device = this.inputParams.eqChoice
          console.log("submitForm")
          console.log(this.form)
          const temp = this.form
          // console.log(this.dataListCopy)
          this.dataList.forEach(element => {
            if(element.pdId == temp.pdId){
              element = temp
            }
          })
          this.dataListCopy.forEach(element => {
            if(element.pdId == temp.pdId){
              element = temp
            }
          })
          console.log(this.dataList)
          this.open = false;
        }
        this.inputParams.eqChoice = undefined
      });

    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dictCodes = row.dictCode || this.ids;
      this.$modal.confirm('是否确认删除字典编码为"' + dictCodes + '"的数据项？').then(function() {
        return delData(dictCodes);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
        this.$store.dispatch('dict/removeDict', this.queryParams.dictType);
      }).catch(() => {});
    },
    /** 转化为设备任务表 */
    handleSave() {

      const eqTaskList = []
      console.log("handleSave")
      console.log(this.dataListCopy)
      for(var i = 0; i < this.dataListCopy.length; i++){
        const eqTask = {
          eqId : undefined,
          pdId: undefined,
          ptId: undefined,
          etPreTask: undefined,
          etPara: undefined,
          etNum: undefined,
          etPriority: undefined,
          etPdPid: undefined,
          etLatestEndtime: undefined,
          etTime: undefined,
          opName: undefined
        }
        eqTask.eqId = this.dataList[i].device
        eqTask.pdId = this.dataListCopy[i].pdId
        eqTask.ptId = this.ptId
        eqTask.etPreTask = this.dataListCopy[i].pdPreProcess
        eqTask.etPara = this.getPara(this.dataListCopy[i].opId)
        eqTask.etNum = this.dataListCopy[i].pdNum
        eqTask.etPriority = this.dataList[i].priority
        eqTask.etPdPid = this.dataList[i].pdPid
        eqTask.etTime = this.dataList[i].etTime
        eqTask.opName = this.dataList[i].opDesp
        eqTask.etLatestEndtime = this.productionTask.ptLatestEndtime
        eqTaskList.push(eqTask)
      }
      // console.log("handleSave")
      console.log(eqTaskList)
      addEquipmentTaskbatch(eqTaskList).then(response => {
        console.log(response)
        this.$modal.msgSuccess("编排成功");
        this.handleClose()
      })
    },
    getPara(id) {
        switch (id) {
          case "1749714849712406530" : return 1;
          case "1769629610439364609" : return 2;
          case "1769629676017307649" : return 3;
          case "1769629702386896897" : return 4;
          case "1769629731080130562" : return 5;
          case "1769629763137196034" : return 6;
          case "1769629794611253250" : return 7;
          case "1749715804952559617" : return 11;
          case "1769645513742766082" : return 12;
          case "1769645905012609025" : return 13;
          case "1769646185355694082" : return 14; 
        }
    }
  }
};
</script>
