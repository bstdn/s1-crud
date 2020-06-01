export default {
  props: {
    /**
     * @description 分页配置
     */
    pagination: {
      type: Object,
      default: null
    },
    /**
     * @description 当前页数
     */
    page: {
      type: Number,
      default: 1
    },
    /**
     * @description 当前页码
     */
    limit: {
      type: Number,
      default: 10
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    /**
     * @description 每页条数改变
     * @param pageSize
     */
    handlePaginationSizeChange(pageSize) {
      this.$emit('pagination', pageSize)
    },
    /**
     * @description 当前页码改变
     * @param currentPage
     */
    handlePaginationCurrentChange(currentPage) {
      this.$emit('pagination', currentPage)
    }
  }
}
