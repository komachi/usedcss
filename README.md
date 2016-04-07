# usedcss

>PostCSS plugin which helps you extract only used styles. Unlike [uncss](https://github.com/giakki/uncss) and others does not render your pages to find used classes, but instead parse it statically, which can be beneficial in some cases. Also support simple Angular's ng-class parsing. And also, due to awesomeness of PostCSS, it works with LESS and SCSS via PostCSS syntaxes.

## Installation

```
npm i usedcss --save
```

## Options

### html

Type: `array` of [globs](https://github.com/isaacs/node-glob)
*Required option*

You must specify html files to check css selector usage against them.

### ignore

Type: `array` of `strings`

Saves ignored selectors even if they are not presented in DOM.

## ignoreRegexp

Type: `array` of `regexps`

Use it to save selectors based on regexp.

## ngclass

Type: `boolean`

Default: `false`

Parse or not to parse `ng-class` statements.

## ignoreNesting

Type: `boolean`

Default: `false`

Ignore nesting so `.class1 .class2` will be saved even if there is element with `class2`, but it's not nested with `class1`. Useful if you use templates.

## Usage

Check out [PostCSS documentation](https://github.com/postcss/postcss#usage) on how to use PostCSS plugins.
