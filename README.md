# animated-logo
library for creating animated, interactive, sonified logos from SVG spritesheets

# illustrator guidelines
- use artboards. Put both versions of the graphic in the same artboard, each in their own layer. Do not put them in sub-layers. Screenshot example [here](https://www.dropbox.com/s/0igs04qiy34u0yv/Screenshot%202016-02-20%2022.48.46.png?dl=0)
- letters should not overlap with any other artboards
- Bottom layer of the artboard will be the first animation frame, top layer will be last.
- export --> svg --> use artboard --> save as individual files in img/src folder
- svg options:
  - styling: inline style
  - object ids: layer names
- put files in demo/img/src
- run `grunt` to merge all svg files in the demo/img/src directory to a single svg file called svg-defs.svg. Use this file as the first param when creating a new animated logo object (`new AL('path/to/svg-defs.svg')`)