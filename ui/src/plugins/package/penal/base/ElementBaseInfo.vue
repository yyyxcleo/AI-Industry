<template>
  <div class="panel-tab__content">
    <el-form size="mini" label-width="90px" @submit.native.prevent>
      <el-form-item label="ID">
        <el-input
          v-model="elementBaseInfo.id"
          :disabled="idEditDisabled || elementBaseInfo.$type === 'bpmn:Process'"
          clearable
          @change="updateBaseInfo('id')"
        />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="elementBaseInfo.name" clearable @change="updateBaseInfo('name')" />
      </el-form-item>
      <!--流程的基础属性-->
      <template v-if="elementBaseInfo.$type === 'bpmn:Process'">
        <el-form-item label="版本标签">
          <el-input v-model="elementBaseInfo.versionTag" clearable @change="updateBaseInfo('versionTag')" />
        </el-form-item>
        <el-form-item label="可执行">
          <el-switch v-model="elementBaseInfo.isExecutable" active-text="是" inactive-text="否" @change="updateBaseInfo('isExecutable')" />
        </el-form-item>
        <el-form-item label="所选产品">
          <el-select v-model="elementBaseInfo.item" placeholder="请选择产品" clearable @change="updateBaseInfo('item')" >
            <el-option
              v-for="im in itemOptions"
              :key="im.prId"
              :label="im.prName"
              :value="im.prId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品数量">
          <el-input v-model="elementBaseInfo.itemNum" placeholder="请输入产品数量" clearable @change="updateBaseInfo('itemNum')" />
        </el-form-item>
      </template>
      <el-form-item label="起点" v-if="elementBaseInfo.$type === 'bpmn:StartEvent'">
        <el-input v-model="elementBaseInfo.area" clearable @change="updateBaseInfo('area')" />
      </el-form-item>
      <el-form-item label="起点" v-if="elementBaseInfo.$type === 'bpmn:ServiceTask' || elementBaseInfo.$type === 'bpmn:UserTask'">
        <el-select v-model="elementBaseInfo.start" placeholder="请选择起点区域" clearable @change="updateBaseInfo('start')" >
          <el-option
            v-for="area in areaOptions"
            :key="area.arId"
            :label="area.arName"
            :value="area.arId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="终点" v-if="elementBaseInfo.$type === 'bpmn:ServiceTask' || elementBaseInfo.$type === 'bpmn:UserTask'">
        <el-select v-model="elementBaseInfo.end" placeholder="请选择起点区域" clearable @change="updateBaseInfo('end')" >
          <el-option
            v-for="area in areaOptions"
            :key="area.arId"
            :label="area.arName"
            :value="area.arId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备操作" v-if="elementBaseInfo.$type === 'bpmn:ServiceTask'">
        <el-select v-model="elementBaseInfo.armop" placeholder="请选择设备操作" clearable @change="updateBaseInfo('armop')" >
          <el-option
            v-for="op in armOptions"
            :key="op.opId"
            :label="op.opName"
            :value="op.opId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备操作" v-if="elementBaseInfo.$type === 'bpmn:UserTask'">
        <el-select v-model="elementBaseInfo.carop" placeholder="请选择设备操作" clearable @change="updateBaseInfo('carop')" >
          <el-option
            v-for="op in carOptions"
            :key="op.opId"
            :label="op.opName"
            :value="op.opId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预计耗时" v-if="elementBaseInfo.$type === 'bpmn:ServiceTask' || elementBaseInfo.$type === 'bpmn:UserTask'">
        <el-input v-model="elementBaseInfo.time" placeholder="请输入时间" clearable @change="updateBaseInfo('time')" />
      </el-form-item>
      <el-form-item label="所需原料" v-if="elementBaseInfo.$type === 'bpmn:ServiceTask' || elementBaseInfo.$type === 'bpmn:UserTask'">
        <el-select v-model="elementBaseInfo.material" placeholder="请选择所需原料" clearable @change="updateBaseInfo('material')" >
          <el-option
            v-for="ma in materialOptions"
            :key="ma.maId"
            :label="ma.maName"
            :value="ma.maId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="原料数量" v-if="elementBaseInfo.$type === 'bpmn:ServiceTask' || elementBaseInfo.$type === 'bpmn:UserTask'">
        <el-input v-model="elementBaseInfo.materialNum" placeholder="请输入原料数量" clearable @change="updateBaseInfo('materialNum')" />
      </el-form-item>
<!--      <el-form-item label="测试" v-if="elementBaseInfo.$type === 'bpmn:StartEvent'">-->
<!--        <el-input v-model="elementBaseInfo.aaa" clearable @change="updateBaseInfo('aaa')" />-->
<!--      </el-form-item>-->
    </el-form>
  </div>
</template>
<script>
import {listArea} from "@/api/system/area";
import {listMove} from "@/api/system/move";
import {listMaterial} from "@/api/system/material";
import {listProduct} from "@/api/system/product";
// import {};
export default {
  name: "ElementBaseInfo",
  props: {
    businessObject: Object,
    type: String,
    idEditDisabled: {
      type: Boolean,
      default: true
    }
  },
  created() {
    this.getAreaList();
    this.getArmOptions();
    this.getCarOptions();
    this.getMaterialOptions();
    this.getProduct();
  },
  data() {
    return {
      elementBaseInfo: {},
      areaOptions: [],
      armOptions: [],
      carOptions: [],
      materialOptions: [],
      itemOptions: [],
      queryParams: {
        pageNum: undefined,
        pageSize: 10,
        eqType: undefined,
        opName: undefined,
      },
    };
  },
  watch: {
    businessObject: {
      immediate: false,
      handler: function(val) {
        if (val) {
          this.$nextTick(() => this.resetBaseInfo());
        }
      }
    }
  },
  methods: {
    resetBaseInfo() {
      this.bpmnElement = window?.bpmnInstances?.bpmnElement;
      this.elementBaseInfo = JSON.parse(JSON.stringify(this.bpmnElement.businessObject));
      console.log(window?.bpmnInstances)
    },
    getAreaList() {
      listArea().then(response => {
        this.areaOptions = response.rows;
      })
    },
    getArmOptions() {
      this.queryParams.eqType = '1749707747447111682';
      listMove(this.queryParams).then(response => {
        this.armOptions = response.rows;
        console.log(this.armOptions)
      })
    },
    getCarOptions() {
      this.queryParams.eqType = '1749707226585858049';
      listMove(this.queryParams).then(response => {
        this.carOptions = response.rows;
        console.log(response)
      })
    },
    getMaterialOptions(){
      listMaterial().then(response => {
        this.materialOptions = response.rows;
      })
    },
    getProduct(){
      listProduct().then(response => {
        this.itemOptions = response.rows;
      })
    },
    updateBaseInfo(key) {
      const attrObj = Object.create(null);

      attrObj[key] = this.elementBaseInfo[key];
      // console.log(attrObj[key])
      // console.log(attrObj[key])
      if (key === "id") {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
          id: this.elementBaseInfo[key],
          di: { id: `${this.elementBaseInfo[key]}_di` }
        });
        console.log(1)
      } else {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, attrObj);
        console.log(this.bpmnElement)
        // console.log(attrObj)
        // console.log(2)
      }
    }
  },
  beforeDestroy() {
    this.bpmnElement = null;
  }
};
</script>
