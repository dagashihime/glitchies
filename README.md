# example

js
```js
import * as Glitchies from 'glitchies'

Glitchies.configureDefaults({
    hover: 'parent',
    hoverInverse: true
})
Glitchies.listen()
```
html
```html
<div data-glitchies='{ "totalClones": 4 }'>very pretty text</div>
```

# options
```js
axis?: {
    x: boolean
    y: boolean
}
hover?: boolean | string
hoverInverse?: boolean
totalClones?: number
```