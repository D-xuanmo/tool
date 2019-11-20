export default {
  name: 'MTableColumn',
  props: {
    label: {
      type: [String, Array],
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    type: String,
    width: {
      type: [String, Number],
      default: 1
    },
    isPercent: {
      type: Boolean,
      default: false
    },
    isThousandDigit: {
      type: Boolean,
      default: false
    }
  },
  render () {
    return <slot></slot>
  }
}
