<template>
  <div class="panel-tab__content">
    <div class="element-property input-property">
      <div class="element-property__label">流程描述：</div>
      <div class="element-property__value">
        <el-input
          type="textarea"
          v-model="document"
          size="mini"
          resize="vertical"
          :autosize="{ minRows: 2, maxRows: 4 }"
          @input="updateDocument"
          @blur="updateDocument"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ElementOtherConfig2",
  props: {
    id: String
  },
  data() {
    return {
      document: ""
    };
  },
  watch: {
    id: {
      immediate: true,
      handler: function(id) {
        if (id && id.length) {
          this.$nextTick(() => {
            const documents = window.bpmnInstances.bpmnElement.businessObject?.document;
            this.document= documents && document.length ? documents[0].text : "";
          });
        } else {
          this.document = "";
        }
      }
    }
  },
  methods: {
    updateDocument() {
      (this.bpmnElement && this.bpmnElement.id === this.id) || (this.bpmnElement = window.bpmnInstances.elementRegistry.get(this.id));
      const document = window.bpmnInstances.bpmnFactory.create("bpmn:Document", { text: this.document });
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
        document: [document]
      });
    }
  },
  beforeDestroy() {
    this.bpmnElement = null;
  }
};
</script>
