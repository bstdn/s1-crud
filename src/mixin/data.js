import _clonedeep from 'lodash.clonedeep'
import _get from 'lodash.get'
import _set from 'lodash.set'

export default {
  props: {
    /**
     * @description 表格数据
     */
    data: {
      type: Array,
      required: true
    }
  },
  watch: {
    data() {
      this.handleDataChange()
    }
  },
  mounted() {
    this.handleDataChange()
  },
  data() {
    return {
      /**
       * @description 表格内部数据
       */
      s1CrudData: []
    }
  },
  methods: {
    /**
     * @description lodash.get
     */
    _get,
    /**
     * @description lodash.set
     */
    _set,
    /**
     * @description 同步外部表格数据到s1CrudData内部
     */
    handleDataChange() {
      if (this.s1CrudData !== this.data) {
        this.s1CrudData = _clonedeep(this.data)
      }
    },
    /**
     * @description 排序时数据变化
     */
    handleSortDataChange() {
      this.$nextTick(() => {
        this.s1CrudData = this.$refs.elTable.store.states.data
      })
    },
    /**
     * @description 排序状态
     */
    handleSortChange({ column, prop, order }) {
      this.handleSortDataChange()
      this.$emit('sort-change', { column, prop, order })
    },
    /**
     * @description 更新行数据
     * @param {Number} index 表格数据索引
     * @param {Object} row 更新的表格行数据
     */
    handleUpdateRow(index, row) {
      this.$set(this.s1CrudData, index, row)
      if (this.defaultSort) {
        this.handleSortDataChange()
      }
    },
    /**
     * @description 新增行数据
     * @param {Object} row 新增的表格行数据
     */
    handleAddRow(row) {
      this.$set(this.s1CrudData, this.s1CrudData.length, row)
      if (this.defaultSort) {
        this.handleSortDataChange()
      }
    },
    /**
     * @description 删除行
     * @param {Object} index 被删除行索引
     */
    handleRemoveRow(index) {
      this.$delete(this.s1CrudData, index)
      if (this.defaultSort) {
        this.handleSortDataChange()
      }
    }
  }
}
