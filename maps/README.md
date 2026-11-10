# Historical world maps

These maps come from [historical-basemaps](https://github.com/aourednik/historical-basemaps)
by Ourednik, licensed under the GNU General Public License v3.0 (see `LICENSE` in this folder).

Changes made for StudyEZ, on 2026-11-09: the 1900, 1914, 1920, 1930, 1938, 1945, 1960, 1994 and
2000 maps were simplified with mapshaper (`-filter-fields NAME,SUBJECTO,PARTOF,BORDERPRECISION
-simplify 8% keep-shapes -clean`, coordinates rounded to 0.01°) so each loads quickly, and any
area outlined counterclockwise was reversed to run clockwise, the direction d3 needs to draw it. These
simplified files are shared under the same license.
