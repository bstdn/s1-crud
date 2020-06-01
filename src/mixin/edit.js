import _forEach from 'lodash.foreach'
import _clonedeep from 'lodash.clonedeep'

export default {
  data() {
    return {
      /**
       * @description 被编辑行的索引
       */
      editIndex: 0
    }
  },
  methods: {
    /**
     * @description 编辑行数据
     * @param {Number} index 行所在索引
     * @param {Object} row 行数据
     * @param template
     */
    handleEdit(index, row, template = null) {
      this.formMode = 'edit'
      this.editDataStorage = _clonedeep(row)
      this.isDialogShow = true
      this.$emit('dialog-open', {
        mode: 'edit',
        row
      })
      this.editIndex = index
      if (template) {
        this.formData = _clonedeep(template)
        this.editTemplateStorage = _clonedeep(template)
      } else {
        this.formData = this.editTemplate ? _clonedeep(this.editTemplate) : {}
        this.editTemplateStorage = this.editTemplate ? _clonedeep(this.editTemplate) : {}
      }
      _forEach(this.formData, (value, key) => {
        this.formData[key] = row.hasOwnProperty(key)
          ? row[key]
          : ((this.formData[key].prefix ? row[this.formData[key].prefix][key] : row[key]) || this.editTemplateStorage[key].value)
      })
    }
  }
}
