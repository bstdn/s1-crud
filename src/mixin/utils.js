export default {
  methods: {
    /**
     * @description 组件属性默认值
     * @param attribute
     * @param defaultValue
     */
    handleAttribute(attribute, defaultValue) {
      if (attribute === false || attribute === 0 || attribute === '') {
        return attribute
      }
      return attribute || defaultValue
    },
    /**
     * @description 根据dialog模式渲染不同表单
     * @param key
     */
    handleFormTemplateMode(key) {
      if (this.formMode === 'edit') {
        return this.editTemplateStorage[key]
      } else if (this.formMode === 'add') {
        return this.addTemplateStorage[key]
      }
    },
    /**
     * @description 根据dialog模式渲染不同表单校验规则
     */
    handleFormRulesMode() {
      if (this.formMode === 'edit') {
        return this.editRules
      } else if (this.formMode === 'add') {
        return this.addRules
      }
    },
    handleSaveButtonDisabled() {
      if (this.formMode === 'edit') {
        return this.formOptions ? this.handleAttribute(this.formOptions.editSaveDisabled, false) : false
      } else if (this.formMode === 'add') {
        return this.formOptions ? this.handleAttribute(this.formOptions.addSaveDisabled, false) : false
      }
    },
    /**
     * @description 操作按钮 show 的方法
     * @param show
     * @param index
     * @param row
     */
    handleButtonShow(show = true, index, row) {
      if (typeof show === 'boolean') {
        return show
      } else if (typeof show === 'function') {
        return show(index, row)
      }
      return Boolean(show)
    },
    /**
     * @description 操作按钮 disabled 的方法
     * @param disabled
     * @param index
     * @param row
     */
    handleButtonDisabled(disabled = false, index, row) {
      if (typeof disabled === 'boolean') {
        return disabled
      } else if (typeof disabled === 'function') {
        return disabled(index, row)
      }
      return Boolean(disabled)
    }
  }
}
