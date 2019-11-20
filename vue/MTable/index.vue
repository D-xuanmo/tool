<script>
import { numberToArray, isFunction, thousandDigit } from './utils'
export default {
  name: 'MTable',
  props: {
    data: {
      default: () => ([]),
      required: true,
      validator: value => Array.isArray(value) || value === null
    },
    align: {
      type: String,
      default: 'center'
    },
    border: Boolean,
    borderStyle: String,
    stripe: Boolean,
    radius: Boolean,
    summaryText: {
      type: String,
      default: '合计'
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    summaryMethod: Function,
    spanMethod: Function,

    showHeader: {
      type: Boolean,
      default: true
    },
    headerClassName: String,
    headerStyle: [Object, Function],
    headerCellClassName: [String, Function],

    rowClassName: [String, Function],
    rowStyle: [Object, Function],
    cellRender: Function,
    cellStyle: [Object, Function],
    cellClassName: [String, Function]
  },
  data () {
    return {
      isFirst: true,
      headerStruc: [],
      flatHeaderStruc: [],
      headerFloor: 1,
      columns: [],
      struc: [],
      tableData: []
    }
  },

  watch: {
    data: {
      deep: true,
      handler () {
        this.reset()
        this.init()
        this.isFirst = false
      }
    }
  },
  created () {
    this.init()
  },
  render () {
    return <table
      border="0"
      class={[
        'x-table',
        this.headerClassName && 'no-header-cell-bg',
        this.border && 'is-border',
        this.align && `align-${this.align}`,
        this.borderStyle && `border-${this.borderStyle}`,
        this.stripe && 'is-stripe',
        this.radius && 'is-radius'
      ]}
    >
      <colgroup>
        {
          this.columns.map(({ width }) => <col width={ width } />)
        }
      </colgroup>
      {
        this.showHeader &&
          <thead class={ ['x-table__header', this.headerClassName] } style={ isFunction(this.headerStyle) ? this.headerStyle() : this.headerStyle }>
            { this.generateHeader() }
          </thead>
      }
      <tbody class={ ['x-table__body', this.data && !this.data.length && 'is-empty'] }>
        {
          this.data && this.data.length
            ? this.generateBody()
            : !this.isFirst && <tr><td colspan={ this.columns.length }>暂无数据</td></tr>
        }
      </tbody>
    </table>
  },
  methods: {
    init () {
      const sum = arr => {
        let n = 0
        arr && arr.forEach(item => (n += item.childrenLength))
        return n
      }
      this.headerStruc = this.getHeaderStruc(this.$slots.default)

      // 生成打平后的结构
      this.getFlatHeaderStruc(this.headerStruc)

      // 获取最大层级
      this.headerFloor = this.getMaxFloor(this.headerStruc).length

      this.flatHeaderStruc.forEach(item => {
        item.colspan = sum(item.children) || 1
        item.rowspan = item.children ? 1 : this.headerFloor
        !item.children && this.columns.push(item)
      })

      // 生成表格显示结构
      try {
        this.tableData = this.showSummary ? [...this.data, ...this.summaryMethod()] : this.data
      } catch (error) {
        console.group()
        console.error(`[XTable Error]: 合计返回参数格式错误，返回格式应为Array!`)
        console.error(error)
        console.groupEnd()
      }
      this.data && this.tableData.map((row, rowIndex) => {
        this.struc.push([])
        this.columns.map(() => this.struc[rowIndex].push(true))
      })
    },

    // 获取表格头部结构
    getHeaderStruc (arr) {
      let result = []
      arr.forEach(item => {
        const current = item.componentOptions.propsData
        result.push({
          label: current.label,
          name: current.name,
          width: current.width || 1,
          type: current.type,
          isThousandDigit: current.isThousandDigit,
          isPercent: current.isPercent,
          children: Array.isArray(item.componentOptions.children) ? this.getHeaderStruc(item.componentOptions.children) : undefined
        })
      })
      return result
    },

    // 打平树形结构数据
    getFlatHeaderStruc (arr) {
      arr.forEach(item => {
        this.flatHeaderStruc.push(item)
        if (Array.isArray(item.children)) {
          item.childrenLength = item.children.length
          this.getFlatHeaderStruc(item.children)
        } else {
          item.childrenLength = 1
        }
      })
    },

    // 获取头部最大层级
    getMaxFloor (tree) {
      if (!Array.isArray(tree)) return []
      let max = 0
      let floor = 1
      let maxArr = []
      const deep = (arr, floor) => {
        arr.forEach(item => {
          item.floor = floor
          if (floor > max) max = floor
          if (Array.isArray(item.children)) {
            deep(item.children, floor + 1)
          }
        })
      }
      deep(tree, floor)
      for (let i = 0; i < max; i++) {
        maxArr.push(i)
      }
      return maxArr
    },

    // 获取合并行、列
    getSpan (row, col, rowIndex, colIndex) {
      if (!isFunction(this.spanMethod)) return [1, 1]
      let [rowspan, colspan] = this.spanMethod({ row, col, rowIndex, colIndex }) || [1, 1]
      rowspan = rowspan > this.tableData.length ? this.tableData.length - rowIndex : rowspan
      colspan = colspan > this.columns.length ? this.columns.length - colIndex : colspan
      return [rowspan, colspan]
    },

    generateHeader () {
      return this.getMaxFloor(this.headerStruc).map((row, rowIndex) => {
        return <tr>
          {
            this.flatHeaderStruc.map(({ rowspan, colspan, floor, label, type }, colIndex) => {
              if (floor === rowIndex + 1) {
                return <th
                  rowspan={ rowspan }
                  colspan={ colspan }
                  class={ isFunction(this.headerCellClassName) ? this.headerCellClassName({ row, rowIndex, col: label, colIndex }) : this.headerCellClassName }
                >
                  {
                    type === 'index' && colIndex === 0
                      ? label || '#'
                      : Array.isArray(label)
                        ? label.map(item => <p>{ item }</p>)
                        : label
                  }
                </th>
              }
            })
          }
        </tr>
      })
    },

    generateBody () {
      const _struc = this.struc
      return this.tableData.map((row, rowIndex) => {
        return <tr
          class={[
            'x-table__row',
            isFunction(this.rowClassName) ? this.rowClassName({ row, rowIndex }) : this.rowClassName,
            this.showSummary && rowIndex === this.tableData.length - 1 && 'x-table__summary'
          ]}
          style={ isFunction(this.rowStyle) ? this.rowStyle({ row, rowIndex }) : this.rowStyle }
          on-click={ $event => this.$emit('row-click', row, rowIndex, $event) }
        >
          {
            this.columns.map(({ name, isPercent, isThousandDigit, type }, colIndex) => {
              let col = row[name]

              // 获取需要合并的行和列
              let [rowspan, colspan] = this.getSpan(row, col, rowIndex, colIndex)

              // 判断当前列是否显示
              if (_struc[rowIndex][colIndex]) {
                try {
                  // 合并单行或者多行多列
                  if (rowspan > 1) {
                    colspan > 1
                      ? numberToArray(rowspan).map((item, i) => {
                        _struc[rowIndex + i + 1][colIndex] = false
                        numberToArray(colspan).map((item, j) => (_struc[rowIndex + i + 1][colIndex + j + 1] = false))
                      })
                      : numberToArray(rowspan).map((item, i) => (_struc[rowIndex + i + 1][colIndex] = false))
                  }

                  // 合并单列
                  colspan > 1 && numberToArray(colspan).map((item, i) => (_struc[rowIndex][colIndex + i + 1] = false))
                } catch (err) {
                  console.warn(`[XTable Error]: 合并行、列超出！`)
                }

                return <td
                  rowspan={ rowspan }
                  colspan={ colspan }
                  class={ isFunction(this.cellClassName) ? this.cellClassName({ row, col, rowIndex, colIndex }) : this.cellClassName }
                  style={ isFunction(this.cellStyle) ? this.cellStyle({ row, col, rowIndex, colIndex }) : this.cellStyle }
                  on-click={ $event => this.$emit('cell-click', row, col, $event) }
                >
                  {
                    // 针对生成单元格的数据进行处理
                    this.showSummary && rowIndex === this.tableData.length - 1 && colIndex === 0
                      ? this.summaryText
                      : type === 'index' && colIndex === 0
                        ? (this.cellRender && this.cellRender({ row, col: rowIndex + 1, rowIndex, colIndex })) || rowIndex + 1
                        : (this.cellRender && this.cellRender({ row, col, rowIndex, colIndex })) ||
                          (isPercent && isThousandDigit && col && `${thousandDigit(col)}%`) ||
                          (isPercent && col && `${col}%`) ||
                          (isThousandDigit && col && thousandDigit(col)) ||
                          col
                  }
                </td>
              }
            })
          }
        </tr>
      })
    },

    reset () {
      this.headerStruc = []
      this.flatHeaderStruc = []
      this.headerFloor = 1
      this.columns = []
      this.struc = []
      this.tableData = []
      this.isFirst = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./style";
</style>
