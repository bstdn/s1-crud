export default {
  methods: {
    /**
     * @description 删除行
     * @param index
     * @param row
     */
    handleRemove(index, row) {
      if ((!('confirm' in this.rowHandle.remove)) || this.rowHandle.remove.confirm === true) {
        this.$confirm(this.handleAttribute(this.rowHandle.remove.confirmText, '确定删除吗？'), this.handleAttribute(this.rowHandle.remove.confirmTitle, '删除'), {
          confirmButtonText: this.handleAttribute(this.rowHandle.remove.confirmButtonText, '确定'),
          cancelButtonText: this.handleAttribute(this.rowHandle.remove.cancelButtonText, '取消'),
          type: this.handleAttribute(this.rowHandle.remove.type, 'error')
        }).then(() => {
          this.$emit('row-remove', { index, row }, () => {
            this.handleRemoveDone(index)
          })
        }).catch(() => {})
      } else {
        this.$emit('row-remove', { index, row }, () => {
          this.handleRemoveDone(index)
        })
      }
    },
    /**
     * @description 删除完成
     * @param index
     */
    handleRemoveDone(index) {
      this.handleRemoveRow(index)
    }
  }
}
