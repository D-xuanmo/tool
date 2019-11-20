# Table组件

## 引入组件并注册

```js
// 引入组件
import MTable from 'path/index'
import MTableColumn from 'path/column'

// 全局注册
Vue.component(MTable.name, MTable)
Vue.component(MTableColumn.name, MTableColumn)
```

## 使用组件

```html
<m-table>
  <m-table-column></m-table-column>
</m-table>
```

## Table Attributes

字段名|描述|类型|默认值|可选值|是否必填
:-:|:-:|:-:|:-:|:-:|:-:
data|显示数据|Array|-|-|Y
align|对齐方式|String|center|left/center/right|N
border|是否显示边框|Boolean|false|-|N
border-style|边框类型|String|solid|dotted/dashed|N
stripe|显示斑马纹|Boolean|false|-|N
radius|显示圆角|Boolean|6px|-|N
show-summary|显示合计|Boolean|false|-|N
summary-text|合计文字，当`show-summary`为`true`时生效|String|合计|-|N
summary-method|合计行展示数据，当`show-summary`为`true`时生效，需返回一行数据，返回值为`Array`|Function|-|-|N
span-method|合并行或合并列，返回一个数组，数组第一个为行的合并数，第二个列合并数|Functin({row, col, rowIndex, colIndex})|-|-|N
show-header|是否显示表头|Boolean|true|-|N
header-class-name|自定义表头类名|String|-|-|N
header-style|自定义表头css|Object/Function|-|-|N
header-cell-class-name|自定义表头列类名|String/Function({row, col, rowIndex, colIndex})|-|-|N
row-class-name|自定义行类名，函数需返回`String`|String/Function({row, rowIndex})|-|-|N
row-style|自定义行css，函数需返回`Object`|Object/Function({row, rowIndex})|-|-|N
cell-render|自定义列渲染内容|Function({row, col, rowIndex, colIndex})|-|-|N
cell-style|自定义列css|Object/Function({row, col, rowIndex, colIndex})|-|-|N
cell-class-name|自定义列类名|String/Function({row, col, rowIndex, colIndex})|-|-|N

## Table Events

事件名|描述|参数
:-:|:-:|:-:
row-click|行的点击事件|row,rowIndex,$event
cell-click|单元格点击事件|row,col,$event
