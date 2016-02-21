# animated-logo
library for creating animated, interactive, sonified logos from SVG spritesheets

# illustrator guidelines
- use artboards. Put both versions of the graphic in the same artboard, each in their own layer. Do not put them in sub-layers. Screenshot example [here](https://www.dropbox.com/s/0igs04qiy34u0yv/Screenshot%202016-02-20%2022.48.46.png?dl=0)
- export --> svg --> use artboard --> save as individual files in img/src folder
- svg options:
  - styling: inline style
  - object ids: layer names
- run `grunt` to create a single spritesheet with all files
