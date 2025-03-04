# @custom-elements-manifest/to-markdown

Custom-elements.json is a file format that describes custom elements. This format will allow tooling and IDEs to give rich information about the custom elements in a given project. It is, however, very experimental and things are subject to change. Follow the discussion [here](https://github.com/webcomponents/custom-elements-manifest).

This library takes a Custom Elements Manifest and renders it to markdown.

## Usage

Install:
```bash
npm i -S @custom-elements-manifest/to-markdown
```

Import and use in your code:
```js
import fs from 'fs';
import { customElementsManifestToMarkdown } from '@custom-elements-manifest/to-markdown';

const manifest = JSON.parse(fs.readFileSync('./custom-elements.json'));
const markdown = customElementsManifestToMarkdown(manifest);

fs.writeFileSync('./custom-elements.md', markdown);
```

## Demo

<details>
  <summary>
    Demo
  </summary>
  
# `./fixtures/-TEST/package/my-element.js`:

## class: `SuperClass` 
  
  ### Superclass
  
  | name | module | package |
  |------|--------|---------|
  |LitElement | |lit-element |


### Methods

| name | privacy | description | parameters | return | inheritedFrom |
|------|---------|-------------|------------|--------|---------------|
|superClassMethod |public | | | | | |


### Events

| name | type | description | inheritedFrom |
|------|------|-------------|---------------|
|custom-event |SuperCustomEvent |this is custom | | |


<hr></hr>

## class: `MyElement`, `my-element` 
  
  ### Superclass
  
  | name | module | package |
  |------|--------|---------|
  |SuperClass |./fixtures/-TEST/package/my-element.js | |


### Mixins

| name | module    | package |
|------|-----------|---------|
|LocalizeMixin | |lion |
|Mixin |./fixtures/-TEST/package/my-element.js | |


### Fields

| name | type | privacy | default | description | inheritedFrom |
|------|------|---------|---------|-------------|---------------|
|prop1 | |public | | | | |
|prop2 | |public | | | | |
|prop3 |boolean |public |true | | | |
|foo |string |private |'bar' |description goes here | | |
|mixinProp |number |protected |1 | |Mixin, `./fixtures/-TEST/package/my-element.js` |[object Object] |


### Methods

| name | privacy | description | parameters | return | inheritedFrom |
|------|---------|-------------|------------|--------|---------------|
|instanceMethod |public |Some description of the method here |e: Event, a: String | | | |
|superClassMethod |public | | | |SuperClass, `./fixtures/-TEST/package/my-element.js` |[object Object] |


### Events

| name | type | description | inheritedFrom |
|------|------|-------------|---------------|
|my-event |Event | | | |
|custom-event |SuperCustomEvent |this is custom |SuperClass, `./fixtures/-TEST/package/my-element.js` |[object Object] |


### Attributes

| name | fieldName | inheritedFrom |
|------|-----------|---------------|
|prop-1 |prop1 | | |
|prop2 |prop2 | | |


### CSS Properties

| name | description |
|------|-----------|
|--background-color |Controls the color of bar |


### Slots

| name | description |
|------|-----------|
|container |You can put some elements here |


<hr></hr>

## mixin: `MyMixin4` 
### Parameters

| name | type | default | description |
|------|------|---------|-------------|
|klass |* | |This is the description |
|foo |string | |Description goes here |


<hr></hr>

## mixin: `Mixin` 
### Parameters

| name | type | default | description |
|------|------|---------|-------------|
|klass |* | |This is the description |


### Fields

| name | type | privacy | default | description | inheritedFrom |
|------|------|---------|---------|-------------|---------------|
|mixinProp |number |protected |1 | | | |


<hr></hr>

## Variables
  
  | name | description | type |
  |------|-------------|------|
  |variableExport |this is a var export |boolean |
|stringVariableExport |this is a string var export |string |
<hr/>

## Functions
      
  | name | description | parameters | return |
  |------|-------------|------------|--------|
  |functionExport |This is a function export |a: string, b: boolean |boolean |
<hr/>
  
## Exports

| kind | name      | declaration | module | package |
|------|-----------|-------------|--------|---------|
|js |SuperClass |SuperClass | ./fixtures/-TEST/package/my-element.js |  |[object Object] | | |
|custom-element-definition |my-element |MyElement | ./fixtures/-TEST/package/my-element.js |  |[object Object] | | |
|js |variableExport |variableExport | ./fixtures/-TEST/package/my-element.js |  |[object Object] | | |
|js |stringVariableExport |stringVariableExport | ./fixtures/-TEST/package/my-element.js |  |[object Object] | | |
|js |functionExport |functionExport | ./fixtures/-TEST/package/my-element.js |  |[object Object] | | |


</details>