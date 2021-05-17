```scss
// 文字对齐
$align: left, center, right, justify;
@each $str in $align {
  .align-#{$str} {
    text-align: $str;
  }
}
```

```scss
$margin: (
  top: 5 10 15 20,
  right: 5 10 15 20,
  bottom: 5 10 15 20,
  left: 5 10 15 20
);
$marginDirection: margin, padding;
@each $direction, $value in $margin {
  @each $num in $value {
    @each $d in $marginDirection {
      .#{str-slice($d, 1, 1)}-#{str-slice($direction, 1, 1)}-#{$num}px {
        #{$d}-#{$direction}: #{$num}px;
      }
    }
  }
}
```

```scss
// 兼容 IE 透明度
@mixin opacity($number: 0.5) {
  opacity: $number;
  filter: alpha(opacity=#{$number * 100});
}
```

```scss
// Input placeholder 颜色兼容
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

```scss
// 多行文字显示省略号
@mixin ellipsisMultiline($number: 1) {
  display: -webkit-box;
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: $number;
}
```
