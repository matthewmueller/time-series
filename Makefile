
build: components index.js time-series.css template.js
	@component build

template.js: template.html
	@component convert $<

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

.PHONY: clean
