import _forEach from 'lodash.foreach'
import _clonedeep from 'lodash.clonedeep'

export default {
  methods: {
    /**
     * @description 新增行数据
     * @param template
     */
    handleAdd(template = null) {
      this.formMode = 'add'
      this.$emit('dialog-open', {
        mode: 'add'
      })
      this.isDialogShow = true
      if (template) {
        this.formData = _clonedeep(template)
        this.addTemplateStorage = _clonedeep(template)
      } else {
        this.formData = this.addTemplate ? _clonedeep(this.addTemplate) : {}
        this.addTemplateStorage = this.addTemplate ? _clonedeep(this.addTemplate) : {}
      }
      _forEach(this.formData, (value, key) => {
        this.formData[key] = this.addTemplateStorage[key].value
      })
    }
  }
}
