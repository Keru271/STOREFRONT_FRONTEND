# Design reference

Source: https://funie-store-demo.myshopify.com/?pb=0
Page: Funie - Furniture Multipurpose Shopify Theme

Measured from 298 rendered elements at 1280 x 599px. This is a sample of the current document and state, not the original design source.

## Color palette

Only observed CSS colors are listed. Usage labels describe where a color was found. Hex is an sRGB preview; retain the original CSS value for its color space and transparency.

Usage | Original CSS value | sRGB hex | Observed root properties | Occurrences
--- | --- | --- | --- | ---
Text | rgba(0, 0, 0, 0.75) |  |  | 104
Text | rgb(0, 0, 238) |  |  | 94
Text | rgb(0, 0, 0) |  |  | 81
Text | color(srgb 0 0 0 / 0.75) |  |  | 10
Text | rgb(255, 255, 255) |  |  | 4
Text | rgb(102, 102, 102) |  |  | 2
Text | rgba(0, 0, 0, 0.5) |  |  | 2
Text | color(srgb 0 0 0) |  |  | 1
Surface | rgb(255, 255, 255) |  |  | 6
Surface | color(srgb 1 1 1) |  |  | 1
Surface | rgba(0, 0, 0, 0.05) |  |  | 1
Border | color(srgb 1 1 1) |  |  | 1

## Typography

Role | Family | Size | Weight | Line height | Tracking | Text transform
--- | --- | --- | --- | --- | --- | ---
Section heading | Jost, san-serif | 16px | 500 | 20.8px | 0.32px | none
Subheading | Jost, san-serif | 20px | 500 | 26px | normal | none
Body | Jost, san-serif | 16px | 500 | 28.8px | normal | none
Label | Jost, san-serif | 16px | 400 | 28.8px | normal | none
Button | Arial | 14px | 500 | normal | normal | none

## Spacing

Value | Occurrences
--- | ---
1px | 4
2px | 4
2.5px | 190
3px | 24
5px | 20
9px | 16
10px | 48
14px | 16
15px | 15
17px | 5
20px | 9
25px | 9
30px | 3
40px | 4
50px | 7

## Layout gaps

Value | Occurrences
--- | ---
30px | 2

## Corner radii

Value | Occurrences
--- | ---
8px | 6

## Shadows

Value | Occurrences
--- | ---
rgba(0, 0, 0, 0.05) 3px 4px 18px 0px | 5
color(srgb 0.0705882 0.0705882 0.0705882 / 0.05) 0px 3px 6px 0px | 1

## Motion durations

Value | Occurrences
--- | ---
0.3s | 113
0.5s | 2

## Motion easing

Value | Occurrences
--- | ---
ease | 110
ease-out | 5

### Accessible keyframe names

- xoNavigateSmooth
- xo-marquee
- xo-carousel-mask
- xo-carousel-filter-effect-next
- xo-carousel-filter-effect-prev
- xo-fade
- xo-fade-up
- xo-fade-down
- xo-fade-left
- xo-fade-right
- xo-zoom-in
- xo-zoom-out

## Component recipes

Computed styles for the captured state. Selectors identify sampled elements; text and placeholders come from the page. Form values are excluded. These style specimens do not reconstruct child markup or uncaptured interaction states.

### Button 1

```css
button {
  align-items: center;
  background-color: color(srgb 1 1 1);
  background-image: none;
  border-radius: 8px;
  border-top-color: color(srgb 1 1 1);
  border-top-style: solid;
  border-top-width: 2px;
  box-shadow: color(srgb 0.0705882 0.0705882 0.0705882 / 0.05) 0px 3px 6px 0px;
  color: color(srgb 0 0 0);
  display: flex;
  font-family: Jost, san-serif;
  font-size: 14px;
  font-weight: 500;
  gap: normal;
  justify-content: center;
  letter-spacing: normal;
  line-height: 25.2px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 0px;
  text-transform: none;
}
```

### Button 2

```css
button {
  align-items: center;
  background-color: color(srgb 0 0 0);
  background-image: none;
  border-radius: 0px;
  border-top-color: color(srgb 0 0 0);
  border-top-style: solid;
  border-top-width: 2px;
  box-shadow: color(srgb 0.0705882 0.0705882 0.0705882 / 0.05) 0px 3px 6px 0px;
  color: color(srgb 1 1 1);
  display: inline-flex;
  font-family: Jost, san-serif;
  font-size: 14px;
  font-weight: 500;
  gap: normal;
  justify-content: center;
  letter-spacing: normal;
  line-height: 25.2px;
  padding-bottom: 0px;
  padding-left: 14px;
  padding-right: 14px;
  padding-top: 0px;
  text-transform: none;
}
```

### Button 3

```css
button {
  align-items: normal;
  background-color: rgba(0, 0, 0, 0);
  background-image: none;
  border-radius: 0px;
  border-top-color: rgba(0, 0, 0, 0.75);
  border-top-style: none;
  border-top-width: 0px;
  box-shadow: none;
  color: rgba(0, 0, 0, 0.75);
  display: flex;
  font-family: Jost, san-serif;
  font-size: 16px;
  font-weight: 400;
  gap: normal;
  justify-content: normal;
  letter-spacing: normal;
  line-height: 28.8px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 0px;
  text-transform: none;
}
```

### Input 1

```css
input {
  align-items: center;
  background-color: rgb(255, 255, 255);
  background-image: none;
  border-radius: 0px;
  border-top-color: rgb(0, 0, 0);
  border-top-style: none;
  border-top-width: 0px;
  box-shadow: none;
  color: rgb(0, 0, 0);
  display: flex;
  font-family: Arial;
  font-size: 13.3333px;
  font-weight: 400;
  gap: normal;
  justify-content: center;
  letter-spacing: normal;
  line-height: normal;
  padding-bottom: 1px;
  padding-left: 2px;
  padding-right: 2px;
  padding-top: 1px;
  text-transform: none;
}
```

### Input 2

```css
input {
  align-items: normal;
  background-color: rgba(0, 0, 0, 0.05);
  background-image: none;
  border-radius: 8px 0px 0px 8px;
  border-top-color: rgb(0, 0, 0);
  border-top-style: none;
  border-top-width: 0px;
  box-shadow: none;
  color: rgb(0, 0, 0);
  display: inline-block;
  font-family: Arial;
  font-size: 13.3333px;
  font-weight: 400;
  gap: normal;
  justify-content: normal;
  letter-spacing: normal;
  line-height: normal;
  padding-bottom: 15px;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 15px;
  text-transform: none;
}
```

### Card 1

```css
card {
  align-items: normal;
  background-color: rgba(0, 0, 0, 0);
  background-image: none;
  border-radius: 0px;
  border-top-color: rgba(0, 0, 0, 0.75);
  border-top-style: none;
  border-top-width: 0px;
  box-shadow: none;
  color: rgba(0, 0, 0, 0.75);
  display: grid;
  font-family: Jost, san-serif;
  font-size: 16px;
  font-weight: 400;
  gap: 30px;
  justify-content: normal;
  letter-spacing: normal;
  line-height: 28.8px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 0px;
  text-transform: none;
}
```

### Card 2

```css
card {
  align-items: normal;
  background-color: rgba(0, 0, 0, 0);
  background-image: none;
  border-radius: 0px;
  border-top-color: rgb(0, 0, 238);
  border-top-style: none;
  border-top-width: 0px;
  box-shadow: none;
  color: rgb(0, 0, 238);
  display: block;
  font-family: Jost, san-serif;
  font-size: 16px;
  font-weight: 400;
  gap: normal;
  justify-content: normal;
  letter-spacing: normal;
  line-height: 28.8px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 0px;
  text-transform: none;
}
```

### Card 3

```css
card {
  align-items: normal;
  background-color: rgba(0, 0, 0, 0);
  background-image: none;
  border-radius: 0px;
  border-top-color: rgb(0, 0, 0);
  border-top-style: none;
  border-top-width: 0px;
  box-shadow: none;
  color: rgb(0, 0, 0);
  display: block;
  font-family: Jost, san-serif;
  font-size: 15px;
  font-weight: 500;
  gap: normal;
  justify-content: normal;
  letter-spacing: normal;
  line-height: 21px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 0px;
  text-transform: none;
}
```

## Layout measurements

Element | Width | Display | Columns | Gap | Padding (T R B L)
--- | --- | --- | --- | --- | ---
header | 1265px | block | none | normal | 0px 0px 0px 0px
main | 1265px | block | none | normal | 0px 0px 0px 0px
section | 1265px | block | none | normal | 0px 0px 0px 0px
section | 1265px | block | none | normal | 0px 0px 0px 0px
section | 1265px | block | none | normal | 0px 0px 0px 0px
section | 1265px | block | none | normal | 50px 0px 50px 0px
section | 1265px | block | none | normal | 0px 0px 0px 0px
section | 1265px | block | none | normal | 0px 0px 0px 0px
section | 1265px | block | none | normal | 0px 0px 0px 0px
section | 1265px | block | none | normal | 0px 0px 0px 0px

## Responsive conditions

- `(prefers-reduced-motion: reduce)`
- `(min-width: 576px)`
- `(min-width: 768px)`
- `(min-width: 992px)`
- `screen and (min-width: 750px)`
- `(max-width: 600px)`
- `(max-width: 767px)`
- `(max-width: 991px)`
- `(max-width: 1199px)`
- `(min-width: 1200px)`
- `(max-width: 575px)`
- `(min-width: 0px)`
- `(min-width: 1400px)`
- `(max-width: 1399px)`
- `(max-width: 992px)`
- `only screen and (min-width: 750px)`
- `screen and (max-width: 749px)`
- `only screen and (max-width: 749px)`
- `(forced-colors: active)`
- `only screen and (min-width: 768px)`

## CSS custom properties

Names and values read from the root element; no new token names or ramps were generated.

Property | Value
--- | ---
--inputs-shadow-opacity | 0.0
--xo-scrollbar-width | 10px
--buttons-shadow-horizontal-offset | 0px
--collection-card-shadow-opacity | 0.0
--xo-grid-col-gap | 30px
--drawer-shadow-opacity | 0.0
--text-boxes-shadow-visible | 0
--article-card-shadow-blur-radius | 1.6rem
--buttons-scale | 1.0
--drawer-shadow-blur-radius | 0px
--spring | cubic-bezier(.27,.79,.45,1.24)
--media-border-width | 0px
--modal-corner-radius | 8px
--variant-pills-border-width | px
--article-card-image-padding | 0.0rem
--collection-card-content-padding | 0.0rem
--buttons-border-opacity | 1.0
--collection-card-border-opacity | 0.1
--page-width-margin | 0rem
--color-dark-button-text | 255,255,255
--buttons-radius-outset | 10px
--spacing-sections-desktop | 0px
--jdgm-secondary-color | rgba(16,132,116,0.1)
--out-sine | cubic-bezier(0.39, 0.575, 0.565, 1)
--inputs-border-width | 1px
--color-dark-button | 0,0,0
--color-tertiary-button-text | 255,255,255
--variant-pills-shadow-vertical-offset | px
--article-card-shadow-horizontal-offset | 0.0rem
--color-badge-foreground | 0,0,0
--inputs-border-opacity | 0.55
--grid-mobile-vertical-spacing | 15px
--font-body-family | Jost , san-serif
--collection-card-shadow-visible | 0
--buttons-radius | 8px
--drawer-backdrop-opacity | 0.4
--buttons-shadow-opacity | 0.05
--inputs-shadow-background-opacity | 0.0
--xo-scrollbar-thumb-padding | 2px
--color-accent | 255,150,56
--drawer-border-width | 0px
--inputs-shadow-horizontal-offset | 0px
--buttons-border-offset | 0.3px
--article-card-text-alignment | left
--modal-border-width | 0px
--jdgm-paginate-color | #108474
--collection-card-shadow-horizontal-offset | 0.0rem
--variant-pills-shadow-blur-radius | px
--xo-scrollbar-track-color | transparent
--jdgm-reviewer-name-color | #108474
--product-card-image-padding | 0.0rem
--product-card-shadow-vertical-offset | 0.4rem
--out-soft | cubic-bezier(0, 0, 0.3, 1)
--color-background | 255,255,255
--color-badge-background | 255,255,255
--article-card-border-opacity | 0.1
--modal-shadow-horizontal-offset | 0px
--jdgm-primary-color | #108474
--page-width | 140rem
--article-card-shadow-visible | 0

## Capture coverage

- 5 stylesheet(s) could not be inspected. Computed styles are still measured.
- Sampling excludes hidden elements and Sitepeel tools. Offscreen rendered elements may be included. Counts refer to the sample, not the entire website.
- Colors are CSS values, not a screenshot pixel palette. Images, compositing and gradients can affect their visible appearance.
- Hover, focus, active states, other viewport sizes, iframe documents and shadow trees need separate captures.
- No inferred brand personality, invented colors, placeholder copy or unobserved code is presented as a page measurement.
