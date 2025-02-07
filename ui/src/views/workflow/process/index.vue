<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="任务名称" prop="prName">
        <el-input
          v-model="queryParams.prName"
          placeholder="请输入任务名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:post:edit']"
        >修改</el-button>
      </el-col> -->
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
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getProductionTask()"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" >
        <template slot-scope="scope">
          <!-- 在这里可以自定义动作序号列的内容 -->
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="任务名称" align="center" prop="prName" />
      <el-table-column label="产品编号" align="center" prop="prId" />
      <el-table-column label="状态" align="center" prop="ptStatus" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pr_status" :value="scope.row.ptStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="规定生产数目" align="center" prop="ptNum" />
      <el-table-column label="执行进度" align="center" prop="ptFinish" >
        <template slot-scope="scope">
          <el-progress :percentage="Math.round(scope.row.ptRate)"  ></el-progress>
        </template>
      </el-table-column>
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
            @click="showDetail(scope.row)"
            v-hasPermi="['system:post:edit']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            :disabled="scope.row.ptStatus != '0'"
            @click="startProduct(scope.row)"
            v-hasPermi="['system:post:edit']"
          >投产</el-button>
          <!-- :disabled="scope.row.ptStatus != '0'" -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            :disabled="scope.row.ptStatus != '3'"
            @click="recoverProduct(scope.row)"
            v-hasPermi="['system:post:remove']"
          >恢复</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getProductionTask"
    />

    <!-- 添加或修改动作对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
     <el-form ref="form" :model="form" label-width="80px">
       <el-form-item label="当前任务列表" prop="curTask">
         <el-input v-model="form.curTask" disabled />
       </el-form-item>
       <el-form-item label="已完成产品数量" prop="ptFinish">
        <el-input v-model="form.ptFinish" disabled />
       </el-form-item>
       <el-form-item label="故障任务列表" prop="faultyTask">
         <el-input v-model="form.faultyTask" type="textarea" disabled />
       </el-form-item>
       <el-form-item label="故障设备列表" prop="faultyDevice">
         <el-input v-model="form.faultyDevice" type="textarea" disabled />
       </el-form-item>
     </el-form>
     <div slot="footer" class="dialog-footer">
       <el-button type="primary" @click="submitForm">确 定</el-button>
       <el-button @click="cancel">取 消</el-button>
     </div>
      <!-- <el-timeline style="max-width: 600px">
        <el-timeline-item
          v-for="(activity, index) in eqTask"
          :key="index"
          timestamp="2024-03-12 20:06"
          :type="activity.etStatus === 1 ? 'primary' : ''"
          hollow="true"
        >
          {{ activity.opName }}
        </el-timeline-item>
      </el-timeline> -->
    </el-dialog>

  </div>
</template>

<script>
import { getProductionTask, listProductionTask, updateProductionTask } from "@/api/workflow/productionTask";
import { checkEquipmentTaskStatus } from "@/api/workflow/equipmentTask";
import { getPtFaulty, addPtFaulty, listPtFaulty, delPtFaulty, updatePtFaulty} from "@/api/workflow/ptFaulty";
import { parseTime } from "../../../utils/ruoyi";
import { listEquipmentTask } from "@/api/workflow/equipmentTask"
import { updateEquipment } from "@/api/system/eqdetails"
import { listProcessRouteDetails } from "@/api/workflow/processRouteDd";
import { submitTask, getProgress } from "@/api/workflow/taskCloud"
import axios from "axios";

export default {
  name: "product",
  dicts: ['pr_status'],
  data() {
    return {
      eqTask: [],
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
        prName: undefined,
      },
      // 表单参数
      form: {
        curTask: "",
        ptFinish: 0,
        faultyTask: "",
        faultyDevice: ""
      },
      // 表单校验
      rate :[],
      timeObj:null,
      cancelTokenSource: null
    };
  },
  created() {
    this.getProductTask();
    this.cancelTokenSource = axios.CancelToken.source()

  },
  mounted(){

  },
  methods: {
    getProductionTask,
    parseTime,
    /** 查询岗位列表 */
    getProductTask() {
      this.loading = true;
      listProductionTask(this.queryParams).then(response => {
        console.log(response);
        this.postList = response.rows;
        console.log(response)
        this.total = response.total;
        this.loading = false;
        
        this.postList.forEach(element => {
          const rateData = {
            "completion_rate": 0,
            "pt_id": "",
            "current_task_id":"",
            "faulty_task_list": []
          }
          rateData["pt_id"] = element.ptId
          this.rate.push(rateData)
        });
        console.log("rate")
        console.log(this.rate)
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
        curTask: undefined,
        ptFinish: undefined,
        faultyTask: undefined,
        faultyDevice: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getProduct();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.arId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加产品";
    },
    /** 修改按钮操作 */
    showDetail(row) {
      // this.reset();
      this.open = true
      const queryParam1 = {
          ptId: row.ptId,
          pfStatus: "0"
      }
      
      listEquipmentTask(queryParam1).then(response => {
        console.log(response);
        this.eqTask = response.rows;
        var cur_rateInfo = this.rate.filter(function(item){
          return item["pt_id"] == row.ptId
        })
      
        if(row.ptStatus == "3"){
          listPtFaulty(row.ptId).then(response => {
            console.log("getPtFaulty")
            console.log(response)
            this.form.curTask = response.rows[0].pfCurEqTask
            this.form.faultyTask = response.rows[0].pfFaultyTask
            this.form.faultyDevice = response.rows[0].pfFaultyEq
            this.form.ptFinish = response.rows[0].pfFinish
          })
        }else {
          this.form.curTask = cur_rateInfo[0]["current_task_id"]
          this.form.faultyTask = cur_rateInfo[0]["faulty_task_list"]["task_id"]
          this.form.faultyDevice = cur_rateInfo[0]["faulty_task_list"]["robot_id"]
          this.form.ptFinish = row.ptFinish || Math.round(row.ptNum * cur_rateInfo[0]["completion_rate"] / this.eqTask.length)
        }
     
      })
      
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.prId != undefined) {
            updateProduct(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getProduct();
            });
          } else {
            addProduct(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              console.log(this.form)
              this.getProduct();
            });
          }
        }
      });
      console.log(1)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const prIds = row.prId || this.ids;
      console.log(prIds)
      this.$modal.confirm('是否确认删除编号为"' + prIds + '"的数据项？').then(function() {
        delProduct(prIds);
      }).then(() => {
        this.getProduct();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    cancelPreviousRequset() {
      this.cancelTokenSource.cancel('Previous request canceled')
      this.cancelTokenSource = axios.CancelToken.source();
    },
    progress(id,rt){
      // console.log(id)
      let that = this
      let pt = that.rate.filter(function(item){
        console.log(item["pt_id"])
        return item["pt_id"] == id
      })
      console.log("rt:"+rt)
      that.postList.forEach( e => {
        if(e.ptId == id){
          e.ptRate = that.getRate(id)
        }
        
      })
      // console.log(that.timeObj)
      // if(that.timeObj){
      //   clearTimeout(that.timeObj)
      // }
      // console.log(that.timeObj)
      console.log("completion_rate:" + pt[0]["completion_rate"] )
      console.log("rt.length:" + rt.length )
      console.log("pt.length:" + pt.length )
      pt = pt[0]
      if(rt != that.rate){
        console.log(true)
        console.log(rt)
        console.log("pt:"+Object.prototype.toString.call(rt))
        pt = JSON.parse(rt)
      }
      
      if(pt["completion_rate"] < 1.0){

        //出错
        if(pt["faulty_task_list"].length > 0){
          console.log("faulty_task_list")
          clearTimeout(that.timeObj)
          //当前生产任务
          var cur_pt_task = that.postList.filter(function(item){
            return item.ptId == pt["pt_id"]
          })
          console.log("cur_pt_task:")
          console.log(cur_pt_task[0])
          //获取当前生产任务对应的设备任务列表
          const queryParam1 = {
            ptId: cur_pt_task[0].ptId,
          }
          listEquipmentTask(queryParam1).then(response => {
            console.log(response);
            this.eqTask = response.rows;
            console.log("eqTask:")
            console.log(this.eqTask.length)
            var total_num = cur_pt_task[0].ptNum * this.eqTask.length
            console.log("total_num:")
            console.log(total_num)
            var cur_eq_task = total_num * pt["completion_rate"]
            console.log("cur_eq_task")
            console.log(cur_eq_task)
            var finied_num = Math.round(cur_eq_task / this.eqTask.length)
            console.log("have finished:")
            console.log(finied_num)
            cur_pt_task[0].ptFinish = finied_num
            cur_pt_task[0].ptStatus = "3"
            cur_pt_task[0].ptRate = pt["completion_rate"]
            updateProductionTask(cur_pt_task[0]).then(response => {
              console.log("更新生产任务"+response)
            })
            //更新设备状态
            const eq = {
              eqId: pt["faulty_task_list"][0]["robot_id"],
              eqStatus : 4
            }
            updateEquipment(eq).then(response => {
              console.log(response)
            })
            const ptFaulty = {
              ptId: cur_pt_task[0].ptId,
              pfCurEqTask: pt["current_task_id"],
              pfFaultyTask: pt["faulty_task_list"][0]["task_id"],
              pfFaultyEq: pt["faulty_task_list"][0]["robot_id"],
              pfStatus:'0',
              pfFinish: finied_num
            }
            addPtFaulty(ptFaulty).then(response => {
              console.log(response)
            })
          })
          
          
          return 
        }

        //未出错
        let _that = that
        getProgress(id,that.cancelTokenSource.token).then(response => {
          pt = response.msg
          for(var i =0; i < _that.rate.length; i++){
            if(_that.rate[i]["pt_id"] == id){
              _that.rate[i] =  JSON.parse(pt)
              console.log("r:"+_that.rate[i])
            }
          }

          console.log("rate:"+ JSON.stringify(_that.rate))
          that.timeObj = setTimeout(() => {
            that.progress(id,pt)
            
          }, 5000);
          // setTimeout(this.cancelPreviousRequset,10000)
        })
      }else if(pt["completion_rate"] == 1.0){
        console.log("completion_rate")
        clearTimeout(that.timeObj)
        var finished_pt_task = that.postList.filter(function(item){
            return item.ptId == pt["pt_id"]
          })
        finished_pt_task[0].ptStatus = '2'
        finished_pt_task[0].ptFinish = finished_pt_task[0].ptNum
        updateProductionTask(finished_pt_task[0]).then(response => {
          console.log(response)
        })
        // that.rate.forEach(r => {
        //   if(r["pt_id"] == id){
        //     r["completion_rate"] = 0
        //   }
        // })
      }

      
    },
    startProduct(row){
      checkEquipmentTaskStatus(row.ptId).then(response => {
        console.log("checkEquipmentTaskStatus")
        console.log(response)
        if(response.data == false){
          this.$modal.msgWarning('设备未就绪,请等待')
        }else{
          this.$modal.msgSuccess('开始执行')
          this.submit(row)
        }
      })
    },
    submit(row) {
      const productionTask = row
      productionTask.ptStatus = "1"
      updateProductionTask(productionTask).then(response => {
          const submitData = {
            pro_task_id: productionTask.ptId,
            pt_num: productionTask.ptNum - productionTask.ptFinish
          }
          submitTask(submitData).then(res => {
            console.log("submitData")
            console.log(res)
            
          })
          var timeObj = null;
          this.progress(submitData.pro_task_id,this.rate)
          // getProgress (submitData.pro_task_id).then(ret => {
          //     console.log(ret)
          // })
        })
    },
    getRate(id){
      var r = this.rate.filter(function(item){
        return item["pt_id"] == id
      })
      console.log("get")
      console.log(r[0]["completion_rate"])
      return Math.round(r[0]["completion_rate"] * 100)
    },
    recoverProduct(row){
      const queryParam1 = {
        ptId: row.ptId,
        pfStatus: "0"
      }
      listPtFaulty(queryParam1).then(response => {
        var pf_faulty = response.rows[0]
        pf_faulty.pfStatus = "1"
        updatePtFaulty(pf_faulty).then(response => {
          console.log("recoverProduct")
          row.ptStatus = "0"
          updateProductionTask(row).then(response => {
            console.log("updateProductionTask")
          })
        })
      })
    }
  }
};
</script>
