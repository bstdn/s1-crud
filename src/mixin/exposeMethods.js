export default {
  methods: {
    /**
     * @description 外部暴露的更新单元格数据方法
     */
    updateCell(index, key, value) {
      this.$set(this.s1CrudData, index, {
        ...this.s1CrudData[index],
        [key]: value
      })
    },
    /**
     * @description 外部暴露的新增行方法
     */
    addRow(row) {
      this.handleAddRow(row)
    },
    /**
     * @description 外部暴露的编辑行方法
     */
    updateRow(index, row) {
      this.handleUpdateRow(index, row)
    },
    /**
     * @description 外部暴露的删除行方法
     */
    removeRow(index) {
      this.handleRemoveRow(index)
    },
    /**
     * @description 外部暴露的打开模态框方法
     */
    showDialog({ mode, index = 0, template = null }) {
      if (mode === 'edit') {
        this.handleEdit(index, this.s1CrudData[index], template)
      } else if (mode === 'add') {
        this.handleAdd(template)
      }
    },
    /**
     * @description 外部暴露的关闭模态框方法
     */
    closeDialog() {
      this.handleCloseDialog()
    }
  }
}
