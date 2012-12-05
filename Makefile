
build: components index.js
	@component build
	@uglifyjs ./build/build.js -o ./build/build-min.js -c -m

build-dev: components index.js
	@component build --dev -n build-dev.js
	@uglifyjs ./build/build-dev.js -o ./build/build-dev-min.js -c -m

components: component.json
	@component install --dev

clean:
	rm -rf build components

.PHONY: clean



