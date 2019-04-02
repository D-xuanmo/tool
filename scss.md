### 兼容IE透明度
```scss
@mixin opacity($number: 0.5) {
  opacity: $number;
  filter: alpha(opacity=#{$number * 100});
}
```

### input placeholder颜色兼容
```scss
@mixin placeholderColor($color: #fff) {
  &::-webkit-input-placeholder {
    color: $color;
  }

  &::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: $color;
  }

  &:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: $color;
  }

  &:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: $color;
  }
}
```

### 多行文字显示省略号
```scss
@mixin ellipsisMultiline($number: 1) {
  display: -webkit-box;
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: $number;
}
```
