<script>
export default {
  name: 'RenderCustomComponent',
  props: {
    /**
     * @description v-model双向绑定的值
     */
    value: {
      type: [String, Number],
      required: true
    },
    /**
     * @description 传入的组件名
     */
    componentName: {
      type: Object,
      required: true
    },
    /**
     * @description 传入的自定义参数
     */
    props: {
      type: Object,
      default: null
    },
    /**
     * @description 传入的行数据
     */
    scope: {
      type: Object,
      default: null
    }
  },
  render(h) {
    const self = this
    return h(self.componentName, {
      props: {
        value: self.value,
        scope: self.scope,
        ...self.props
      },
      on: {
        input: function(event) {
          self.$emit('input', event)
        }
      }
    })
  }
}
</script>
